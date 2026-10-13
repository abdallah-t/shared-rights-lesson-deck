// Records every step of the built deck as a short video clip, for the animated PPTX (v2).
//   bun scripts/capture-clips.ts <out-dir> [--only N]     (run `bun run build` first)
// Time is stepped by hand, one frame at a time, so every clip is smooth and exact:
// JavaScript timers run on a fake clock and CSS animations are advanced to match.
// Writes NNN.mp4 (1920 x 1080, 30 fps), NNN.jpg (first frame) and clips.json. The deck is not changed.
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const FPS = 30;
const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] ?? resolve(app, 'test-output/clips'));
const only = process.argv.includes('--only') ? +process.argv[process.argv.indexOf('--only') + 1] : Infinity;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const problems: string[] = [];
page.on('pageerror', (e) => problems.push(String(e)));
await page.goto(pathToFileURL(resolve(app, 'deck/index.html')).href);
await page.waitForFunction(() => (window as any).__deck?.ready === true, null, { timeout: 30000 });
await page.addStyleTag({ content: '.reveal .controls { display: none !important; } .reveal .chat { scroll-behavior: auto !important; }' });
await page.waitForTimeout(3000);
await page.clock.install();
await page.clock.pauseAt(Date.now() + 1000);

let vt = 0; // virtual milliseconds since recording began
/** Advance one frame: run JS timers, then move every CSS animation and transition to the same instant. */
async function tick() {
  await page.clock.runFor(1000 / FPS);
  vt += 1000 / FPS;
  await page.evaluate((v) => {
    const seen: WeakMap<Animation, number> = ((window as any).__seen ||= new WeakMap());
    void document.body.offsetWidth; // flush styles so new transitions exist
    for (const a of document.getAnimations()) {
      if (!seen.has(a)) { seen.set(a, v); a.pause(); }
      try { a.currentTime = v - seen.get(a)!; } catch {}
    }
  }, vt);
}
const frame = () => page.screenshot({ type: 'jpeg', quality: 96 });
const where = () => page.evaluate(() => { const i = (window as any).__deck.reveal.getIndices(); return { h: i.h as number, f: ((i.f ?? -1) + 1) as number, id: document.querySelector('.reveal .slides > section.present')!.id }; });

type At = { h: number; f: number; id: string };
const clips: { file: string; slide: number; step: number; seconds: number }[] = [];
/**
 * Record one clip: the picture as it stands, then `act` (which says where it led
 * and for how long things move), then that many seconds of motion.
 */
async function clip(act: () => Promise<{ at: At; seconds: number }>, firstFrame = true) {
  const name = String(clips.length).padStart(3, '0');
  // prettier-ignore
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-profile:v', 'high',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-movflags', '+faststart', resolve(out, `${name}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = once(ff, 'close');
  const put = async (b: Buffer) => { if (!ff.stdin.write(b)) await once(ff.stdin, 'drain'); };
  if (firstFrame) await put(await frame());
  const { at, seconds } = await act();
  const n = Math.round(seconds * FPS);
  for (let i = 0; i < n; i++) { await tick(); await put(await frame()); }
  ff.stdin.end();
  await done;
  const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', resolve(out, `${name}.mp4`), '-frames:v', '1', '-q:v', '2', resolve(out, `${name}.jpg`)]);
  await once(p, 'close');
  clips.push({ file: `${name}.mp4`, slide: at.h + 1, step: at.f, seconds: (n + (firstFrame ? 1 : 0)) / FPS });
  return at;
}
/** How long the motion started by arriving at this state lasts. */
function secondsFor(w: At) {
  if (w.id === 'hook') return [9.6, 1.8, 4.2, 5.0, 8.2, 8.6, 8.0, 6.2, 3.2][w.f] ?? 2;
  if (w.id === 'stat') return w.f === 0 ? 2.8 : w.f === 1 ? 3.8 : 2.0;
  if (w.id === 'chatslide') return w.f === 0 ? 2.8 : w.f === 11 ? 4.2 : 1.0;
  if (w.f === 0) return 2.9;
  return 1.5;
}

// The opening: slide 1 builds itself on blank paper.
await page.evaluate(() => { (document.querySelector('#wipe') as HTMLElement).style.visibility = 'hidden'; (window as any).__deck.reveal.slide(1); });
for (let i = 0; i < 45; i++) await tick();
await clip(async () => {
  await page.evaluate(() => (window as any).__deck.reveal.slide(0));
  for (let i = 0; i < 3; i++) await tick(); // skip to the blank page before the build
  return { at: await where(), seconds: 3.4 };
}, false);
await page.evaluate(() => ((document.querySelector('#wipe') as HTMLElement).style.visibility = ''));

while (clips.length < only) {
  const before = await where();
  const at = await clip(async () => {
    await page.keyboard.press('ArrowRight');
    const w = await where();
    return { at: w, seconds: secondsFor(w) };
  });
  if (at.h === before.h && at.f === before.f) { clips.pop(); break; } // the last slide: nothing moved
  if (at.id === 'quizslide' && at.f > 0)
    await clip(async () => { await page.keyboard.press(String(at.f)); return { at, seconds: 1.1 }; }); // the answer
  if (clips.length % 10 === 0) console.log(`${clips.length} clips, slide ${at.h + 1}`);
}
writeFileSync(resolve(out, 'clips.json'), JSON.stringify(clips, null, 1));
console.log(JSON.stringify({ clips: clips.length, seconds: Math.round(clips.reduce((a, c) => a + c.seconds, 0)), problems }));
await browser.close();
process.exit(0);
