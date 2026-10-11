import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
const [deck, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs: string[] = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.goto(pathToFileURL(deck).href + '#/3'); await p.waitForFunction(() => (window as any).__deck?.ready);
await p.waitForTimeout(8000); let n = 0;
const shot = async (name: string) => p.screenshot({ path: `${out}/${String(n++).padStart(2, '0')}-${name}.png` });
await shot('arrived');
// per scene: how long to wait before each screenshot
const plan: [string, number[]][] = [['names', [1500]], ['enter', [900, 2600]], ['coop', [3000, 600]], ['ithar', [3200, 1900, 1800]], ['comfort', [3400, 1500, 1500, 1500]], ['secret', [2400, 2400, 2400]], ['dawn', [2500, 3500]], ['ask', [1400, 2500]]];
for (const [name, waits] of plan) { await p.keyboard.press('ArrowRight'); for (const w of waits) { await p.waitForTimeout(w); await shot(name); } }
for (let i = 0; i < 3; i++) { await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(700); } await p.waitForTimeout(2500); await shot('back-to-comfort');
console.log(JSON.stringify({ shots: n, errs })); await b.close(); process.exit(0);
