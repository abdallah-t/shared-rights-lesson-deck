// Captures every step of the built deck as a full-slide image, for the picture PPTX.
//   bun scripts/capture-steps.ts <out-dir>      (run `bun run build` first)
// Writes NNN-SS.F[-x].jpg (2880 x 1620) and steps.json. The deck itself is not changed.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] ?? resolve(app, 'test-output/steps'));
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1.5 });
const problems: string[] = [];
page.on('pageerror', (e) => problems.push(String(e)));
await page.goto(pathToFileURL(resolve(app, 'deck/index.html')).href);
await page.waitForFunction(() => (window as any).__deck?.ready === true, null, { timeout: 30000 });
// The navigation arrows are browser controls, not part of the slide.
await page.addStyleTag({ content: '.reveal .controls { display: none !important; }' });

const where = () => page.evaluate(() => { const i = (window as any).__deck.reveal.getIndices(); return { h: i.h as number, f: ((i.f ?? -1) + 1) as number, id: document.querySelector('.reveal .slides > section.present')!.id }; });
const steps: { file: string; slide: number; step: number }[] = [];
let n = 0;
const shot = async (w: { h: number; f: number }, tag = '') => {
  const file = `${String(n++).padStart(3, '0')}-${String(w.h + 1).padStart(2, '0')}.${w.f}${tag}.jpg`;
  await page.screenshot({ path: resolve(out, file), type: 'jpeg', quality: 93 });
  steps.push({ file, slide: w.h + 1, step: w.f });
};
let last = '';
await page.waitForTimeout(3500);
for (let k = 0; k < 400; k++) {
  const w = await where();
  const key = `${w.h}.${w.f}`;
  if (key === last) break;
  last = key;
  if (w.id === 'hook') {
    if (w.f === 0) {
      // The centuries count back on their own: one image as the count reaches the first century, one once the house has arrived.
      await page.waitForFunction(() => document.querySelector('#century')!.textContent === '1', null, { timeout: 20000 });
      await shot(w, '-a');
      await page.waitForTimeout(3600);
    }
    else await page.waitForTimeout(w.f === 7 ? 3500 : 2600); // let each scene play to a good moment
  } else if (w.id === 'stat') await page.waitForTimeout(2600);
  else if (w.id === 'chatslide') await page.waitForTimeout(1200);
  await shot(w);
  if (w.id === 'quizslide' && w.f > 0) { // then the same question with its answer
    await page.keyboard.press(String(w.f));
    await page.waitForTimeout(1200);
    await shot(w, '-answer');
  }
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(2600);
}
writeFileSync(resolve(out, 'steps.json'), JSON.stringify(steps, null, 1));
console.log(JSON.stringify({ images: n, slides: steps[steps.length - 1].slide, problems }));
await browser.close();
process.exit(0);
