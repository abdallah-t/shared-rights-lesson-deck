import '@fontsource/alexandria/arabic-400.css';
import '@fontsource/alexandria/arabic-600.css';
import '@fontsource/alexandria/arabic-800.css';
import '@fontsource/alexandria/latin-400.css';
import '@fontsource/alexandria/latin-600.css';
import '@fontsource/alexandria/latin-800.css';
import '@fontsource/ibm-plex-sans-arabic/latin-700.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-700.css';
import '@fontsource/amiri/arabic-400.css';
import '@fontsource/amiri/arabic-700.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-400.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-600.css';
import '@fontsource/ibm-plex-sans-arabic/latin-400.css';
import '@fontsource/ibm-plex-sans-arabic/latin-600.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/lalezar/arabic-400.css';
import '@fontsource/lalezar/latin-400.css';
import '@fontsource/noto-kufi-arabic/arabic-400.css';
import '@fontsource/noto-kufi-arabic/arabic-700.css';
import '@fontsource/noto-kufi-arabic/arabic-900.css';
import '@fontsource/readex-pro/arabic-400.css';
import '@fontsource/readex-pro/arabic-600.css';
import '@fontsource/readex-pro/latin-400.css';
import '@fontsource/readex-pro/latin-600.css';
import '@fontsource/reem-kufi/arabic-700.css';
import Reveal from 'reveal.js';
import 'reveal.js/reveal.css';
import './styles.css';

// Five candidate looks for the lesson deck, five sample slides each.
// → / ← move between styles, ↓ / ↑ through a style's slides, Esc shows all 25.

const STYLES = [
  { id: 's1', name: 'ورق وحبر', en: 'Paper & Ink', bg: '#ece5d8' },
  { id: 's2', name: 'ملصق', en: 'Poster', bg: '#12343b' },
  { id: 's3', name: 'زمرّد ونحاس', en: 'Emerald & Brass', bg: '#0b1d18' },
  { id: 's4', name: 'زلّيج', en: 'Zellige', bg: '#efe3cc' },
  { id: 's5', name: 'ليل رقمي', en: 'Night UI', bg: '#0d0e11' },
];

const icon = (d: string) => `<svg class="ic" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const RIGHTS = [
  { t: 'الإمساك بالمعروف أو التسريح بإحسان', p: 'المعاشرة بالحسنى، وإن تعذّر الاستمرار فالمفارقة بالمعروف.', i: icon('<circle cx="18" cy="26" r="11"/><circle cx="30" cy="26" r="11"/>') },
  { t: 'حفظ أسرار الزوجية', p: 'حفظ كل ما لا يجوز شرعًا إفشاؤه، صونًا لكيان الأسرة.', i: icon('<rect x="10" y="22" width="28" height="20" rx="4"/><path d="M16 22v-6a8 8 0 0 1 16 0v6"/><path d="M24 30v5"/>') },
  { t: 'المشاركة الوجدانية', p: 'مشاركة الزوجين بعضهما بعضًا الأفراحَ والأحزان.', i: icon('<path d="M24 40S8 30 8 18a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 12-16 22-16 22z"/>') },
  { t: 'الإحصان', p: 'سعي الزوجين إلى تحصين بعضهما بعضًا؛ من أهم مقاصد الزواج.', i: icon('<path d="M24 6l14 5v11c0 10-6 17-14 20-8-3-14-10-14-20V11z"/><path d="M18 24l4 4 8-9"/>') },
];

/** Decoration for the title slide; each style gets its own. */
function deco(id: string) {
  if (id === 's3') {
    // A girih rosette: squares turned in steps, drawn as hairlines.
    let g = '';
    for (let k = 0; k < 8; k++) g += `<rect x="-300" y="-300" width="600" height="600" transform="rotate(${k * 11.25})"/>`;
    for (let k = 0; k < 4; k++) g += `<rect x="-190" y="-190" width="380" height="380" transform="rotate(${k * 22.5})"/>`;
    return `<svg class="rose" viewBox="-440 -440 880 880"><g fill="none" stroke="currentColor" stroke-width="1.4">${g}<circle r="425"/><circle r="120"/></g></svg>`;
  }
  if (id === 's4') {
    const colors = ['#1f3a8a', '#c4552d', '#1e7a5a', '#e2a72e', '#efe3cc'];
    let tiles = '';
    for (let k = 0; k < 40; k++) {
      const c = colors[(k * 7 + Math.floor(k / 5) * 3) % 4];
      const d = colors[(k * 3 + 1) % 5 === (k * 7 + Math.floor(k / 5) * 3) % 4 ? 4 : (k * 3 + 1) % 5];
      tiles += `<i style="--k:${k};background:${c}"><svg viewBox="-50 -50 100 100"><path fill="${d}" d="M0-42 12-29 29-29 29-12 42 0 29 12 29 29 12 29 0 42-12 29-29 29-29 12-42 0-29-12-29-29-12-29z"/></svg></i>`;
    }
    return `<div class="tiles">${tiles}</div>`;
  }
  if (id === 's2') return '<div class="shapes"><b class="g1"></b><b class="g2"></b><b class="g3"></b><b class="g4"></b></div>';
  if (id === 's5') return '<div class="grid5"><span>201</span></div>';
  return '<div class="disc"></div>';
}

function slides(st: (typeof STYLES)[number], n: number) {
  const foot = (k: number) => `<footer class="ft"><span>${st.name}</span><span class="en">${st.en} · 0${n + 1}</span><span class="pg">0${k} / 05</span></footer>`;
  const an = (i: number) => `class="an" style="--i:${i}"`;
  return `
  <section class="${st.id} t" data-bg="${st.bg}">
    ${deco(st.id)}
    <div class="meta an" style="--i:0"><span>دين 201</span><span>الوحدة الثالثة · الدرس الأول</span><span>ثاني ثانوي</span></div>
    <h1><span ${an(1)}>الحقوق</span><span ${an(2)}>المشتركة</span><em ${an(3)}>بين الزوجين</em></h1>
    <p class="sub an" style="--i:5">أحكام الأسرة والزواج في الإسلام</p>
    ${foot(1)}
  </section>
  <section class="${st.id} c" data-bg="${st.bg}">
    <header class="hd"><span class="k an" style="--i:0">النشاط الأول · ملف الحقوق المفقودة</span><h2 ${an(1)}>المحادثة <em>المسرّبة</em></h2></header>
    <div class="chat">
      <div class="m a an" style="--i:2"><small>سارة · 9:15 م</small>كنت محتاجة منه يسمعني ويواسيني، لكنه قال لي: <mark>«دبّري نفسك، أنا مو فاضي»</mark>.</div>
      <div class="m b an" style="--i:4"><small>نورة · 9:16 م</small>أحيانًا الإنسان ما يحتاج حلولًا، يحتاج قلبًا يشعر به.</div>
      <div class="m a an" style="--i:6"><small>سارة · 9:21 م</small>والأكثر إحراجًا أنه صار <mark>يحكي لأصدقائه تفاصيل خلافاتنا الخاصة</mark>.</div>
    </div>
    <aside class="clues"><h3 ${an(3)}>لوحة القرائن</h3><ol><li ${an(5)}><b>1</b>«دبّري نفسك، أنا مو فاضي»</li><li ${an(7)}><b>2</b>يحكي لأصدقائه تفاصيل خلافاتنا</li><li class="open an" style="--i:8"><b>3</b>؟</li></ol></aside>
    ${foot(2)}
  </section>
  <section class="${st.id} r" data-bg="${st.bg}">
    <header class="hd"><span class="k an" style="--i:0">حُلَّ اللغز</span><h2 ${an(1)}>الحقوق <em>الأربعة</em> المفقودة</h2></header>
    <div class="cards">${RIGHTS.map((r, i) => `<article class="an c${i + 1}" style="--i:${2 + i * 1.4}"><span class="n">0${i + 1}</span>${r.i}<h3>${r.t}</h3><p>${r.p}</p></article>`).join('')}</div>
    ${foot(3)}
  </section>
  <section class="${st.id} q" data-bg="${st.bg}">
    <header class="hd"><span class="k an" style="--i:0">مهمة المحقِّقة · 2 / 4</span><h2 ${an(1)}>ما الحق الذي غاب عندما هدّد زوجته بالتعليق بدل الإصلاح أو الفراق بإحسان؟</h2></header>
    <p class="clue an" style="--i:2"><b>القرينة</b>«بخليك معلّقة، لا مرتاحة ولا منفصلة»</p>
    <div class="opts"><div class="o an" style="--i:3"><i>1</i>حفظ الأسرار الزوجية</div><div class="o ok an" style="--i:4"><i>2</i>الإمساك بالمعروف والتسريح بإحسان</div><div class="o an" style="--i:5"><i>3</i>المشاركة الوجدانية</div><div class="o an" style="--i:6"><i>4</i>الإحصان</div></div>
    ${foot(4)}
  </section>
  <section class="${st.id} e" data-bg="${st.bg}">
    <header class="hd"><span class="k an" style="--i:0">أستدلّ</span><h2 ${an(1)}>لكلّ حقٍّ <em>دليله</em></h2></header>
    <blockquote class="an" style="--i:2">﴿ وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ ﴾<cite>سورة النساء، الآية 19</cite></blockquote>
    <div class="stat an" style="--i:4"><small>حالات الطلاق المسجّلة في البحرين</small><b>1,986</b><span>عام 2021 · كانت <u>801</u> عام 2001</span></div>
    ${foot(5)}
  </section>`
    // Each slide lays itself out inside one wrapper, so reveal.js can show and hide the section freely.
    .replace(/(<section class="s\d [a-z]"[^>]*>)/g, '$1<div class="w">')
    .replace(/<\/section>/g, '</div></section>');
}

document.querySelector('#slides')!.innerHTML = STYLES.map((s, n) => `<section>${slides(s, n)}</section>`).join('');
await document.fonts.ready;

const reveal = new Reveal({
  width: 1920, height: 1080, margin: 0, minScale: 0.05, maxScale: 4, center: false, display: 'block',
  hash: true, controls: true, progress: false, transition: 'none', rtl: false, navigationMode: 'grid',
});
const hud = document.querySelector<HTMLElement>('#hud')!;
function arrive() {
  const { h, v } = reveal.getIndices();
  const st = STYLES[h];
  document.body.style.background = st.bg;
  document.body.dataset.style = st.id;
  hud.innerHTML = STYLES.map((s, i) => `<b class="${i === h ? 'on' : ''}">${i + 1} · ${s.name}</b>`).join('') + `<span>${(v ?? 0) + 1} / 5 &nbsp; ↓↑ الشرائح &nbsp; ←→ الأنماط</span>`;
}
reveal.on('slidechanged', arrive);
await reveal.initialize();
arrive();
(window as unknown as { __deck: unknown }).__deck = { ready: true, reveal };
