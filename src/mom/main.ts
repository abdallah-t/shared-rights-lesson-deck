import '@fontsource/amiri/arabic-400.css';
import '@fontsource/amiri/arabic-700.css';
import '@fontsource/el-messiri/arabic-700.css';
import '@fontsource/el-messiri/latin-700.css';
import '@fontsource/reem-kufi/arabic-700.css';
import '@fontsource/reem-kufi/latin-700.css';
import '@fontsource/tajawal/arabic-500.css';
import '@fontsource/tajawal/arabic-700.css';
import '@fontsource/tajawal/latin-500.css';
import '@fontsource/tajawal/latin-700.css';
import Reveal from 'reveal.js';
import 'reveal.js/reveal.css';
import { createBackground, type Mood } from './bg';
import './mom.css';

// الحقوق المشتركة بين الزوجين: reveal.js slides over a live background.
//   bun run dev     live preview
//   bun run build   one file + assets in deck/
// Keys: → next, ← back, T starts or pauses the timer on a slide, 1–4 answer a quiz question, F full screen.
// Option: ?scale=0.5 draws the background at half size on slow machines.

const $ = <T extends HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

for (const el of $$('i[data-e]')) {
  const img = document.createElement('img');
  img.className = 'e';
  img.alt = '';
  img.src = `assets/emoji/${el.dataset.e}.png`;
  el.replaceWith(img);
}

// ---------------------------------------------------------------- the quiz
const RIGHTS = ['حفظ الأسرار الزوجية', 'الإمساك بالمعروف والتسريح بإحسان', 'المشاركة الوجدانية', 'الإحصان'];
const QUESTIONS = [
  { q: 'ما الحق الذي فرّط فيه الزوج عندما نشر تفاصيل حياتهما الخاصة؟', clue: 'يحكي لأصدقائه تفاصيل خلافاتنا الخاصة', a: 0 },
  { q: 'ما الحق الذي غاب عندما هدّد زوجته بالتعليق والإضرار بها بدل الإصلاح أو الفراق بإحسان؟', clue: '«بخليك معلّقة، لا مرتاحة ولا منفصلة»', a: 1 },
  { q: 'ما الحق الذي افتقدته الزوجة عندما لم تجد منه مواساةً في حزنها؟', clue: '«دبّري نفسك، أنا مو فاضي»', a: 2 },
  { q: 'ما الحق الذي ظهر الخلل فيه من خلال إهمال العلاقة الخاصة ورفض الحوار حولها؟', clue: 'يبتعد عني بلا حوار ولا اهتمام', a: 3 },
];
const quiz = $('#quiz');
QUESTIONS.forEach((item, n) => {
  const el = document.createElement('div');
  el.className = 'q fragment';
  el.innerHTML =
    `<div class="clue" style="opacity:1;transform:rotate(-0.6deg);width:fit-content;transition:none"><span class="pin"><img class="e" alt="" src="assets/emoji/round_pushpin.png"></span><span><small>القرينة</small>${item.clue}</span></div>` +
    `<h3 style="font-size:50px">${n + 1}. ${item.q}</h3><div class="opts">` +
    RIGHTS.map((r, k) => `<button data-k="${k}"><i>${k + 1}</i>${r}</button>`).join('') +
    `</div><span class="stamp">حقٌّ مفقود ✓</span>`;
  quiz.append(el);
  for (const b of $$<HTMLButtonElement>('button', el))
    b.addEventListener('click', () => {
      if (el.classList.contains('solved')) return;
      if (+b.dataset.k! === item.a) {
        b.classList.add('right');
        el.classList.add('solved');
        refresh();
      } else b.classList.add('wrong');
    });
});
$('#retry').addEventListener('click', () => {
  for (const el of $$('.q', quiz)) el.classList.remove('solved');
  for (const b of $$('button', quiz)) b.classList.remove('right', 'wrong');
  refresh();
});
window.addEventListener('keydown', (e) => {
  const cur = $$('.q.current-fragment', quiz)[0];
  if (cur && cur.closest('section')!.classList.contains('present') && /^[1-4]$/.test(e.key)) $$<HTMLButtonElement>('button', cur)[+e.key - 1].click();
});

// --------------------------------------------------------------- the chart
// Divorce cases registered in Bahrain, all nationalities. Source: data.gov.bh, dataset "divorce-cases"
// (Ministry of Justice, Islamic Affairs and Waqf), Bahraini + non-Bahraini.
const CASES: [number, number][] = [
  [2001, 801], [2002, 838], [2003, 923], [2004, 1030], [2005, 1051], [2006, 1141], [2007, 1198], [2008, 1323], [2009, 1459], [2010, 1569], [2011, 1408],
  [2012, 1649], [2013, 1824], [2014, 1795], [2015, 1745], [2016, 1749], [2017, 1890], [2018, 1929], [2019, 2023], [2020, 1724], [2021, 1986],
];
{
  const [w, h, l, r, t, b] = [1240, 620, 90, 40, 30, 60];
  const X = (y: number) => l + ((y - 2001) / 20) * (w - l - r);
  const Y = (v: number) => h - b - (v / 2200) * (h - t - b);
  const pts = CASES.map(([y, v]) => `${X(y).toFixed(1)},${Y(v).toFixed(1)}`);
  const grid = [0, 500, 1000, 1500, 2000].map((v) => `<line class="grid" x1="${l}" x2="${w - r}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${l - 14}" y="${Y(v) + 7}" text-anchor="end">${v}</text>`).join('');
  const years = [2001, 2006, 2011, 2016, 2021].map((y) => `<text x="${X(y)}" y="${h - b + 36}" text-anchor="middle">${y}</text>`).join('');
  const marks = [0, 18, 20].map((i) => {
    const [y, v] = CASES[i];
    const d = 0.3 + (i / 20) * 2.6;
    return `<circle class="dot" style="--d:${d}" cx="${X(y)}" cy="${Y(v)}" r="11"/><text class="cap" style="--d:${d}" x="${X(y)}" y="${Y(v) - 24}" text-anchor="middle">${v.toLocaleString('en')}</text>`;
  }).join('');
  $('#chart').innerHTML =
    `<svg viewBox="0 0 ${w} ${h}"><defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3b866" stop-opacity="0.32"/><stop offset="1" stop-color="#e3b866" stop-opacity="0"/></linearGradient></defs>` +
    `${grid}<line class="axis" x1="${l}" x2="${w - r}" y1="${h - b}" y2="${h - b}"/>${years}` +
    `<path class="area" d="M${pts[0]} L${pts.join(' L')} L${X(2021)},${h - b} L${X(2001)},${h - b} Z"/><path class="line" pathLength="1" d="M${pts.join(' L')}"/>${marks}</svg>`;
  $('#drawchart').dataset.fragmentIndex = '0';
}

// ------------------------------------------------------------------ timers
interface Timer { el: HTMLElement; total: number; left: number; id: number }
const timers: Timer[] = $$('.timer').map((el) => {
  const total = +el.dataset.seconds!;
  const c = 2 * Math.PI * 104;
  el.innerHTML = `<svg viewBox="0 0 240 240"><circle class="bg" cx="120" cy="120" r="104"/><circle class="fg" cx="120" cy="120" r="104" stroke-dasharray="${c}" stroke-dashoffset="0"/></svg><b></b><small>اضغطي للبدء</small>`;
  const tm: Timer = { el, total, left: total, id: 0 };
  el.addEventListener('click', () => toggle(tm));
  draw(tm);
  return tm;
});
function draw(tm: Timer) {
  const c = 2 * Math.PI * 104;
  $('b', tm.el).textContent = `${String(Math.floor(tm.left / 60)).padStart(2, '0')}:${String(tm.left % 60).padStart(2, '0')}`;
  $<HTMLElement>('.fg', tm.el).style.strokeDashoffset = String(c * (1 - tm.left / tm.total));
  tm.el.classList.toggle('low', tm.left <= 10 && tm.left > 0);
  tm.el.classList.toggle('done', tm.left === 0);
  $('small', tm.el).textContent = tm.left === 0 ? 'انتهى الوقت' : tm.id ? 'إيقاف مؤقت' : tm.left === tm.total ? 'اضغطي للبدء' : 'متابعة';
}
function stop(tm: Timer, reset = false) {
  clearInterval(tm.id);
  tm.id = 0;
  if (reset) tm.left = tm.total;
  draw(tm);
}
function toggle(tm: Timer) {
  if (tm.id) return stop(tm);
  if (tm.left === 0) tm.left = tm.total;
  tm.id = window.setInterval(() => {
    tm.left = Math.max(0, tm.left - 1);
    if (tm.left === 0) stop(tm);
    else draw(tm);
  }, 1000);
  draw(tm);
}

// ------------------------------------------------------- state from the DOM
// After every step, each slide's look is recomputed from which fragments are showing.
const shown = (sel: string, root: ParentNode = document) => $$(sel, root).filter((e) => e.classList.contains('visible')).length;
let counted = new WeakSet<HTMLElement>();
function refresh() {
  // The hook: fragment 1 names the family, 2–7 are scenes inside the house, 8 steps back out.
  const hook = $('#hook');
  const sc = shown('.fragment', hook);
  hook.dataset.sc = String(sc);
  hook.classList.toggle('inside', sc >= 2 && sc <= 7);
  if (sc > 0 && !hook.classList.contains('arrived')) arriveNow(); // skipped ahead: end the journey now
  $('#stairs').className = `stairs at${shown('.stepbox', $('#stairs'))}`;
  $$('.stepbox').forEach((s) => s.classList.toggle('lit', s.classList.contains('current-fragment')));
  $('#chart').classList.toggle('drawn', $('#drawchart').classList.contains('visible'));
  const chatSlide = $('#chatslide');
  chatSlide.classList.toggle('clues-on', $('#cluestep').classList.contains('visible'));
  const chat = $('#chat');
  chat.scrollTo({ top: chat.scrollHeight });
  for (const m of $$('.mcq')) m.classList.toggle('solved', shown('[data-solve]', m.closest('section')!) > 0);
  const lit = Math.max(0, ...$$('[data-lamps].visible').map((e) => +e.dataset.lamps!));
  const order = [0, 1, 2, 5, 3, 4, 6]; // the four studied in the activity light first
  $$('#lamps .lamp').forEach((l, i) => {
    l.classList.toggle('on', order.indexOf(i) < lit);
    l.style.transitionDelay = `${order.indexOf(i) * 0.12}s`;
  });
  $$('#score span').forEach((s, i) => s.classList.toggle('on', i < $$('.q.solved', quiz).length));
  for (const el of $$('[data-count]')) {
    const on = !!el.closest('.fragment.visible');
    if (on && !counted.has(el)) {
      counted.add(el);
      const to = +el.dataset.count!;
      const t0 = performance.now();
      const tick = () => {
        const u = Math.min(1, (performance.now() - t0) / 1400);
        el.textContent = Math.round(to * (1 - Math.pow(1 - u, 3))).toLocaleString('en');
        if (u < 1) requestAnimationFrame(tick);
      };
      tick();
    } else if (!on) {
      counted.delete(el);
      el.textContent = '0';
    }
  }
}

// «مع أم ضد؟»: the class votes by clicking a side; right-click takes a vote back. Counts last until the deck reloads.
const votes = { pro: 0, con: 0 };
function drawVotes() {
  const total = votes.pro + votes.con;
  for (const side of ['pro', 'con'] as const) {
    $(`#debate .vote .${side} b`).textContent = String(votes[side]);
    $(`#debate .split .${side === 'pro' ? 'p' : 'c'}`).style.flexGrow = String(total ? votes[side] : 1);
  }
}
for (const btn of $$<HTMLButtonElement>('#debate .vote button')) {
  const side = btn.dataset.side as 'pro' | 'con';
  btn.addEventListener('click', () => { votes[side]++; drawVotes(); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); });
  btn.addEventListener('contextmenu', (e) => { e.preventDefault(); votes[side] = Math.max(0, votes[side] - 1); drawVotes(); });
}
drawVotes();

// The hook slide travels back through the centuries on its own, then arrives.
// Every timer is kept so that leaving the slide, or pressing → before the journey ends, stops it at once.
let journey = 0;
let waits: number[] = [];
function stopJourney() {
  clearInterval(journey);
  waits.forEach(clearTimeout);
  waits = [];
}
function arriveNow() {
  stopJourney();
  $('#century').textContent = '1';
  $('#hook').classList.add('arrived');
}
function travel(on: boolean) {
  const hook = $('#hook');
  stopJourney();
  hook.classList.remove('arrived');
  const label = $('#century');
  label.textContent = '15';
  if (!on) return;
  let c = 15;
  waits.push(window.setTimeout(() => {
    journey = window.setInterval(() => {
      c -= 1;
      label.textContent = String(c);
      if (c <= 1) {
        clearInterval(journey);
        waits.push(window.setTimeout(() => hook.classList.add('arrived'), 700));
      }
    }, 330);
  }, 1300));
}

// ------------------------------------------------------------------ deck
await Promise.all(['700 64px "El Messiri"', '500 32px Tajawal', '700 32px Tajawal', '700 32px Amiri', '700 32px "Reem Kufi"'].map((f) => document.fonts.load(f, 'الحقوق 201')));
const params = new URLSearchParams(location.search);
const bg = createBackground($<HTMLCanvasElement>('#stage'), parseFloat(params.get('scale') ?? '1'));
const sections = $$('.reveal .slides > section');

const reveal = new Reveal({
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.05,
  maxScale: 4,
  center: false,
  display: 'flex',
  hash: true,
  controls: true,
  progress: true,
  transition: 'none',
  backgroundTransition: 'none',
  // → always means "next" here, whatever the text direction, so clickers behave.
  rtl: false,
  keyboard: { 84: () => { const tm = timers.find((x) => x.el.closest('section')!.classList.contains('present')); if (tm) toggle(tm); } },
});
let hideText = 0;
function arrive(wipe: boolean) {
  const s = sections[reveal.getIndices().h];
  const [fx, fy] = (s.dataset.focus ?? '0,0').split(',').map(Number);
  bg.goto((s.dataset.mood ?? 'calm') as Mood, fx, fy);
  if (wipe) {
    document.body.classList.add('wiping');
    clearTimeout(hideText);
    hideText = window.setTimeout(() => document.body.classList.remove('wiping'), bg.half * 1000);
  }
  for (const tm of timers) if (!tm.el.closest('section')!.classList.contains('present')) stop(tm, true);
  travel(s.id === 'hook');
  refresh();
}
reveal.on('slidechanged', () => arrive(true));
reveal.on('fragmentshown', refresh);
reveal.on('fragmenthidden', refresh);
await reveal.initialize();
arrive(false);
bg.start();
(window as unknown as { __deck: unknown }).__deck = { ready: true, reveal };
