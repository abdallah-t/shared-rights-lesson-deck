// Steps through every slide and fragment of the lesson deck in headless Chrome.
//   bun run test [out-dir] [WxH] [query]     (run `bun run build` first)
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] ?? resolve(app, 'test-output'));
const [vw, vh] = (process.argv[3] ?? '1920x1080').split('x').map(Number);
const query = process.argv[4] ?? '';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
const problems: string[] = [];
page.on('pageerror', (e) => problems.push(`pageerror: ${e}`));
page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
page.on('requestfailed', (r) => r.failure()?.errorText !== 'net::ERR_ABORTED' && problems.push(`request failed: ${r.url()}`));
await page.goto(pathToFileURL(resolve(app, 'deck/index.html')).href + (query ? `?${query}` : ''));
await page.waitForFunction(() => (window as any).__deck?.ready === true, null, { timeout: 30000 });
const where = () => page.evaluate(() => { const i = (window as any).__deck.reveal.getIndices(); return `${String(i.h + 1).padStart(2, '0')}.${(i.f ?? -1) + 1}`; });
let n = 0;
let last = '';
await page.waitForTimeout(2600);
for (let k = 0; k < 200; k++) {
  const at = await where();
  if (at === last) break;
  last = at;
  // The hook slide travels on its own for a few seconds before it settles.
  if (at === '04.0') await page.waitForTimeout(6500);
  // Answer each quiz question: first a wrong option, then the right one.
  if (at.startsWith('10.') && at !== '10.0') {
    const q = +at.split('.')[1] - 1;
    await page.keyboard.press(String(((q + 1) % 4) + 1));
    await page.waitForTimeout(300);
    await page.keyboard.press(String(q + 1));
    await page.waitForTimeout(700);
  }
  await page.screenshot({ path: resolve(out, `${String(n++).padStart(3, '0')}-${at}.png`) });
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1500);
}
// A timer: start it and make sure it counts.
await page.evaluate(() => (window as any).__deck.reveal.slide(14));
await page.waitForTimeout(1500);
await page.keyboard.press('t');
await page.waitForTimeout(3300);
const timer = await page.evaluate(() => document.querySelector('section.present .timer b')?.textContent);
const fps = await page.evaluate(() => new Promise<number>((done) => { let f = 0; const t0 = performance.now(); const tick = () => (++f, performance.now() - t0 < 2000 ? requestAnimationFrame(tick) : done(f / 2)); requestAnimationFrame(tick); }));
// Anything spilling outside its slide?
const overflow = await page.evaluate(() => {
  const r = (window as any).__deck.reveal; const bad: string[] = [];
  document.querySelectorAll<HTMLElement>('.reveal .slides > section').forEach((s, i) => { if (s.scrollHeight > 1082 || s.scrollWidth > 1922) bad.push(`${i + 1}: ${s.scrollWidth}x${s.scrollHeight}`); });
  return bad;
});
console.log(JSON.stringify({ states: n, last, timer, fps, overflow, problems }));
await browser.close();
process.exit(problems.length || overflow.length ? 1 : 0);
