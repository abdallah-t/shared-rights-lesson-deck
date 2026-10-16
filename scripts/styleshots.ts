// Screenshots every slide of every style in the style demo.   bun scripts/styleshots.ts <out-dir>
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] ?? resolve(app, 'test-output/styles'));
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const problems: string[] = [];
p.on('pageerror', (e) => problems.push(String(e)));
p.on('console', (m) => m.type() === 'error' && problems.push(m.text()));
await p.goto(pathToFileURL(resolve(app, 'styles-demo/styles.html')).href);
await p.waitForFunction(() => (window as any).__deck?.ready);
const overflow: string[] = [];
const count = await p.evaluate(() => document.querySelectorAll('.reveal .slides > section').length);
const from = +(process.argv[3] ?? 0);
for (let h = from; h < count; h++)
  for (let v = 0; v < 5; v++) {
    await p.evaluate(([a, c]) => (window as any).__deck.reveal.slide(a, c), [h, v]);
    await p.waitForTimeout(2300);
    await p.evaluate(() => (document.querySelector('#hud') as HTMLElement).style.display = 'none');
    await p.screenshot({ path: resolve(out, `s${h + 1}-${v + 1}.png`) });
    const bad = await p.evaluate(() => { const w = document.querySelector('section.present section.present .w') as HTMLElement; return w.scrollHeight > 1082 || w.scrollWidth > 1922 ? `${w.scrollWidth}x${w.scrollHeight}` : ''; });
    if (bad) overflow.push(`s${h + 1}-${v + 1}: ${bad}`);
  }
console.log(JSON.stringify({ shots: (count - from) * 5, overflow, problems }));
await b.close();
process.exit(0);
