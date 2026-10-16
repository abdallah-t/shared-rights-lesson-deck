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
import '@fontsource/readex-pro/arabic-300.css';
import '@fontsource/readex-pro/arabic-400.css';
import '@fontsource/readex-pro/arabic-600.css';
import '@fontsource/readex-pro/latin-300.css';
import '@fontsource/readex-pro/latin-400.css';
import '@fontsource/readex-pro/latin-600.css';
import '@fontsource/aref-ruqaa/arabic-400.css';
import '@fontsource/aref-ruqaa/arabic-700.css';
import '@fontsource/changa/arabic-500.css';
import '@fontsource/changa/arabic-800.css';
import '@fontsource/changa/latin-500.css';
import '@fontsource/changa/latin-800.css';
import '@fontsource/kufam/arabic-500.css';
import '@fontsource/kufam/arabic-800.css';
import '@fontsource/kufam/latin-500.css';
import '@fontsource/kufam/latin-800.css';
import '@fontsource/noto-naskh-arabic/arabic-400.css';
import '@fontsource/noto-naskh-arabic/arabic-700.css';
import '@fontsource/alexandria/arabic-200.css';
import '@fontsource/alexandria/arabic-300.css';
import '@fontsource/alexandria/latin-200.css';
import '@fontsource/alexandria/latin-300.css';
import '@fontsource/el-messiri/arabic-400.css';
import '@fontsource/el-messiri/arabic-700.css';
import '@fontsource/marhey/arabic-500.css';
import '@fontsource/marhey/arabic-700.css';
import '@fontsource/marhey/latin-700.css';
import '@fontsource/rakkas/arabic-400.css';
import '@fontsource/rakkas/latin-400.css';
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
  { id: 's6', name: 'ريزو', en: 'Riso Print', bg: '#efe8dc' },
  { id: 's7', name: 'مخطّط', en: 'Blueprint', bg: '#173a7a' },
  { id: 's8', name: 'سبّورة', en: 'Chalkboard', bg: '#22332e' },
  { id: 's9', name: 'حديقة الليل', en: 'Night Garden', bg: '#0f2620' },
  { id: 's10', name: 'كوفي مربّع', en: 'Square Kufic', bg: '#1b1a18' },
  { id: 's11', name: 'مسرح الورق', en: 'Paper Theatre', bg: '#1b3a43' },
  { id: 's12', name: 'نور المشربية', en: 'Mashrabiya Light', bg: '#160f0a' },
  { id: 's13', name: 'كثبان', en: 'Dunes', bg: '#120c14' },
  { id: 's14', name: 'ملف القضية', en: 'Case File Noir', bg: '#0d0e11' },
  { id: 's15', name: 'أرشيف 16مم', en: 'Archive 16mm', bg: '#221a13' },
];

// A repeatable pseudo-random number in [0, 1), so every render draws the same scenery.
const rnd = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** A city skyline of domes, minarets and flat roofs standing on the line y = H. */
function skyline(seed: number, H: number, top: number) {
  let d = `M0 ${H}V${H - top * 0.16}H1920V${H}Z`, x = -20, k = seed;
  while (x < 1940) {
    const r = rnd(k++), a = rnd(k++), b = rnd(k++);
    if (r < 0.22) {
      const w = 20 + a * 10, h = top * (0.72 + b * 0.28);
      d += `M${x} ${H}V${H - h}L${x + w / 2} ${H - h - w * 1.7}L${x + w} ${H - h}V${H}ZM${x - 7} ${H - h * 0.7}h${w + 14}v9h${-w - 14}Z`;
      x += w + 20 + a * 30;
    } else if (r < 0.62) {
      const w = 90 + a * 110, h = top * (0.24 + b * 0.24), q = w * 0.36;
      d += `M${x} ${H}V${H - h}H${x + w}V${H}ZM${x + w / 2 - q} ${H - h + 2}A${q} ${q * 1.15} 0 0 1 ${x + w / 2 + q} ${H - h + 2}ZM${x + w / 2 - 2} ${H - h - q * 1.15 - 16}h4v20h-4Z`;
      x += w + b * 20;
    } else {
      const w = 60 + a * 90;
      d += `M${x} ${H}V${H - top * (0.14 + b * 0.2)}H${x + w}V${H}Z`;
      x += w;
    }
  }
  return d;
}

/** An eight-point star (two squares, one turned 45°) as a closed path. */
function star8(cx: number, cy: number, R: number) {
  const r = (R * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8);
  let d = '';
  for (let k = 0; k < 16; k++) {
    const a = (k * Math.PI) / 8 - Math.PI / 2, q = k % 2 ? r : R;
    d += `${k ? 'L' : 'M'}${(cx + q * Math.cos(a)).toFixed(1)} ${(cy + q * Math.sin(a)).toFixed(1)}`;
  }
  return d + 'Z';
}
const diamond = (cx: number, cy: number, r: number) => `M${cx} ${cy - r}L${cx + r} ${cy}L${cx} ${cy + r}L${cx - r} ${cy}Z`;
// The openings of one mashrabiya tile: an eight-point star with a diamond at each corner.
const HOLES = star8(40, 40, 30) + [0, 80].flatMap((x) => [0, 80].map((y) => diamond(x, y, 11))).join('');
// Sunlight that has come through the lattice: the same openings, filled with light.
const LIGHT = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><path fill="#f2c27b" d="${HOLES}"/></svg>`)}`;

/** A pointed arch standing on y = bottom, centred on cx. */
function arch(cx: number, bottom: number, w: number, h: number) {
  const s = h - w * 0.75, r = w * 0.8;
  return `M${cx - w / 2} ${bottom}V${bottom - s}A${r} ${r} 0 0 1 ${cx} ${bottom - h}A${r} ${r} 0 0 1 ${cx + w / 2} ${bottom - s}V${bottom}Z`;
}

/** Layers that run on every slide of a style. The cinematic styles (11 to 15) live in these. */
function amb(id: string) {
  if (id === 's11') return `<div class="amb moon11"><i></i></div><svg class="amb sky11" viewBox="0 0 1920 220"><path class="k1" d="${skyline(1, 220, 210)}"/><path class="k2" d="${skyline(40, 220, 150)}"/><path class="k3" d="${skyline(90, 220, 86)}"/></svg>`;
  if (id === 's12') {
    const motes = Array.from({ length: 18 }, (_, k) => `<i style="left:${(rnd(k) * 75 + 3).toFixed(1)}%;top:${(rnd(k + 50) * 80 + 10).toFixed(1)}%;--s:${(2 + rnd(k + 9) * 4).toFixed(1)}px;--d:${(9 + rnd(k + 3) * 10).toFixed(1)}s;--o:${(-rnd(k + 7) * 12).toFixed(1)}s"></i>`).join('');
    return `<div class="amb mz"><b class="beam"></b><b class="pat" style="background-image:url('${LIGHT}')"></b><div class="motes">${motes}</div></div><b class="amb fade"></b>`;
  }
  if (id === 's13') {
    const dune = (base: number, amp: number, f: number, ph: number) => {
      let d = `M0 1080V${base}`;
      for (let x = 0; x <= 2200; x += 20) d += `L${x} ${(base - amp * (0.62 * Math.sin(x * f + ph) + 0.38 * Math.sin(x * f * 2.3 + ph * 1.7))).toFixed(1)}`;
      return d + 'V1080Z';
    };
    const sand = Array.from({ length: 24 }, (_, k) => `<i style="top:${(48 + rnd(k + 20) * 46).toFixed(1)}%;width:${(30 + rnd(k + 2) * 70).toFixed(0)}px;--d:${(2.4 + rnd(k) * 3).toFixed(2)}s;--o:${(-rnd(k + 5) * 5).toFixed(2)}s"></i>`).join('');
    return `<div class="amb dn"><svg viewBox="0 0 2200 1080" preserveAspectRatio="xMidYMax slice"><circle class="sun" cx="660" cy="690" r="170"/><path class="d1" d="${dune(720, 60, 0.0031, 1)}"/><path class="d2" d="${dune(800, 70, 0.0024, 2.4)}"/><path class="d3" d="${dune(890, 80, 0.0019, 4.1)}"/><path class="d4" d="${dune(1000, 90, 0.0015, 0.6)}"/></svg><div class="sand">${sand}</div></div><b class="amb bar top"></b><b class="amb bar bot"></b>`;
  }
  if (id === 's14') return '<b class="amb blinds"></b><b class="amb torch"></b>';
  if (id === 's15') return '<b class="amb spr l"></b><b class="amb spr r"></b><b class="amb leak"></b><b class="amb scr"></b><b class="amb flick"></b><span class="amb tc"></span><b class="amb flash"></b>';
  return '';
}

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
  if (id === 's6') return '<div class="riso"><b class="r1"></b><b class="r2"></b><b class="r3"></b></div>';
  if (id === 's7') {
    // A construction drawing of an eight-point star, as a draughtsman would set it out.
    const sq = (r: number, a: number) => `<rect x="${-r}" y="${-r}" width="${2 * r}" height="${2 * r}" transform="rotate(${a})"/>`;
    return `<svg class="bp" viewBox="-460 -460 920 920"><g fill="none" stroke="currentColor"><g stroke-width="1" opacity=".45"><circle r="420"/><circle r="300"/><path d="M-460 0H460M0-460V460M-330-330L330 330M330-330L-330 330"/></g><g stroke-width="2.5">${sq(212, 0)}${sq(212, 45)}</g><g stroke-width="1.2" stroke-dasharray="8 8">${sq(150, 22.5)}${sq(150, 67.5)}</g><path stroke-width="1.5" d="M-420 440H420M-420 430v20M420 430v20"/></g><text x="0" y="476" fill="currentColor" font-size="22" text-anchor="middle" font-family="JetBrains Mono">Ø 840 · KHATAM 8/2</text></svg>`;
  }
  if (id === 's8') return '<svg class="chalkdoodle" viewBox="0 0 600 600"><defs><filter id="chalk"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter></defs><g filter="url(#chalk)" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="#f1d97a" stroke-width="9" d="M300 70l55 120 132 16-97 92 25 131-115-64-115 64 25-131-97-92 132-16z"/><path stroke="#f2a7b5" stroke-width="7" d="M110 520c90-30 290-34 390 4"/><path stroke="#9ccbe8" stroke-width="6" d="M470 90c40 20 70 60 76 110M500 70c50 30 84 84 88 140"/></g></svg>';
  if (id === 's9') {
    // An olive branch, drawn as a single line.
    let leaves = '';
    for (let k = 0; k < 9; k++) {
      const y = 120 + k * 78, side = k % 2 ? 1 : -1, x = 300 + Math.sin(k * 0.7) * 30;
      leaves += `<path d="M${x} ${y} q${side * 70} -30 ${side * 130} 6 q${-side * 62} 40 ${-side * 130} -6z"/>`;
      if (k % 3 === 1) leaves += `<ellipse cx="${x + side * 40}" cy="${y + 34}" rx="15" ry="21" class="fruit"/>`;
    }
    return `<svg class="olive" viewBox="0 0 600 900"><path class="stem" d="M300 840 C270 680 340 520 300 360 S290 140 330 60"/><g class="leaves">${leaves}</g></svg><div class="archwin"></div>`;
  }
  if (id === 's10') {
    // Square-Kufic style blocks: a maze-like tile built from a fixed pattern.
    const rows = ['1111111111', '1000000001', '1011111101', '1010000101', '1010110101', '1010010101', '1011110101', '1000000101', '1111111101', '0000000001'];
    const cells = rows.map((r, y) => [...r].map((c, x) => (c === '1' ? `<rect x="${x * 10}" y="${y * 10}" width="10" height="10" class="k${(x * 3 + y * 7) % 11 === 0 ? 'a' : (x + y) % 13 === 0 ? 'b' : ''}"/>` : '')).join('')).join('');
    return `<svg class="kufic" viewBox="-2 -2 104 104">${cells}</svg>`;
  }
  if (id === 's11') {
    // A toy theatre: four paper frames, each cut with a smaller arch, in front of a night sky.
    const frame = (w: number, h: number, extra = '') => `M0 0H700V900H0Z${arch(350, 900, w, h)}${extra}`;
    const cuts = star8(90, 90, 34) + star8(610, 90, 34);
    return `<svg class="stage" viewBox="0 0 700 900"><g class="l0"><rect width="700" height="900" fill="#12262d"/><circle cx="350" cy="330" r="96" fill="#efe0bf"/><circle cx="388" cy="306" r="84" fill="#12262d"/><path fill="#efe0bf" d="${star8(230, 220, 10)}${star8(480, 170, 7)}${star8(470, 420, 9)}${star8(260, 470, 6)}"/><path fill="#0b1a1f" transform="translate(0 680) scale(.3646 1)" d="${skyline(7, 220, 200)}"/></g><path class="pl l4" fill="#2f6b6b" fill-rule="evenodd" d="${frame(330, 600)}"/><path class="pl l3" fill="#bd5d3e" fill-rule="evenodd" d="${frame(390, 660)}"/><path class="pl l2" fill="#d6a04e" fill-rule="evenodd" d="${frame(450, 730)}"/><path class="pl l1" fill="#efe0bf" fill-rule="evenodd" d="${frame(520, 800, cuts)}"/></svg>`;
  }
  if (id === 's12') return `<svg class="mwin" viewBox="0 0 640 900"><defs><pattern id="mzp" width="80" height="80" patternUnits="userSpaceOnUse" x="-20" y="10"><path fill="#24160d" fill-rule="evenodd" d="M0 0H80V80H0Z${HOLES}"/></pattern></defs><path class="glow" fill="#f2c27b" d="${arch(320, 880, 520, 840)}"/><path fill="url(#mzp)" d="${arch(320, 880, 520, 840)}"/><path fill="none" stroke="#4a2f1a" stroke-width="22" d="${arch(320, 880, 520, 840)}"/><path fill="none" stroke="#e3a857" stroke-opacity=".5" stroke-width="2" d="${arch(320, 896, 560, 880)}"/></svg><b class="spill"></b>`;
  if (id === 's13') return '';
  if (id === 's14') return '<div class="case"><div class="folder"><span class="tab">CASE № 201 · FAMILY RIGHTS</span><div class="sheet"><b class="ph">؟</b><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="stamp">سرّي</span></div></div>';
  if (id === 's15') return '<div class="leader"><b class="sweep"></b><svg viewBox="-300 -300 600 600"><circle r="280"/><circle r="236"/><path d="M-300 0H300M0-300V300"/></svg><span class="nums"><i>3</i><i>2</i><i>1</i></span></div>';
  if (id === 's2') return '<div class="shapes"><b class="g1"></b><b class="g2"></b><b class="g3"></b><b class="g4"></b></div>';
  if (id === 's5') return '<div class="grid5"><span>201</span></div>';
  return '<div class="disc"></div>';
}

function slides(st: (typeof STYLES)[number], n: number) {
  const foot = (k: number) => `<footer class="ft"><span>${st.name}</span><span class="en">${st.en} · ${String(n + 1).padStart(2, '0')}</span><span class="pg">0${k} / 05</span></footer>`;
  const an = (i: number) => `class="an" style="--i:${i}"`;
  return `
  <section class="${st.id} t" data-bg="${st.bg}">
    ${amb(st.id)}${deco(st.id)}
    <div class="meta an" style="--i:0"><span>دين 201</span><span>الوحدة الثالثة · الدرس الأول</span><span>ثاني ثانوي</span></div>
    <h1><span ${an(1)}>الحقوق</span><span ${an(2)}>المشتركة</span><em ${an(3)}>بين الزوجين</em></h1>
    <p class="sub an" style="--i:5">أحكام الأسرة والزواج في الإسلام</p>
    ${foot(1)}
  </section>
  <section class="${st.id} c" data-bg="${st.bg}">
    ${amb(st.id)}
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
    ${amb(st.id)}
    <header class="hd"><span class="k an" style="--i:0">حُلَّ اللغز</span><h2 ${an(1)}>الحقوق <em>الأربعة</em> المفقودة</h2></header>
    <div class="cards">${RIGHTS.map((r, i) => `<article class="an c${i + 1}" style="--i:${2 + i * 1.4}"><span class="n">0${i + 1}</span>${r.i}<h3>${r.t}</h3><p>${r.p}</p></article>`).join('')}</div>
    ${foot(3)}
  </section>
  <section class="${st.id} q" data-bg="${st.bg}">
    ${amb(st.id)}
    <header class="hd"><span class="k an" style="--i:0">مهمة المحقِّقة · 2 / 4</span><h2 ${an(1)}>ما الحق الذي غاب عندما هدّد زوجته بالتعليق بدل الإصلاح أو الفراق بإحسان؟</h2></header>
    <p class="clue an" style="--i:2"><b>القرينة</b>«بخليك معلّقة، لا مرتاحة ولا منفصلة»</p>
    <div class="opts"><div class="o an" style="--i:3"><i>1</i>حفظ الأسرار الزوجية</div><div class="o ok an" style="--i:4"><i>2</i>الإمساك بالمعروف والتسريح بإحسان</div><div class="o an" style="--i:5"><i>3</i>المشاركة الوجدانية</div><div class="o an" style="--i:6"><i>4</i>الإحصان</div></div>
    ${foot(4)}
  </section>
  <section class="${st.id} e" data-bg="${st.bg}">
    ${amb(st.id)}
    <header class="hd"><span class="k an" style="--i:0">أستدلّ</span><h2 ${an(1)}>لكلّ حقٍّ <em>دليله</em></h2></header>
    <blockquote class="an" style="--i:2">﴿ وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ ﴾<cite>سورة النساء، الآية 19</cite></blockquote>
    <div class="stat an" style="--i:4"><small>حالات الطلاق المسجّلة في البحرين</small><b>1,986</b><span>عام 2021 · كانت <u>801</u> عام 2001</span></div>
    ${foot(5)}
  </section>`
    // Each slide lays itself out inside one wrapper, so reveal.js can show and hide the section freely.
    .replace(/(<section class="s\d+ [a-z]"[^>]*>)/g, '$1<div class="w">')
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
  hud.innerHTML = STYLES.map((s, i) => (i === h ? `<b class="on">${i + 1} · ${s.name}</b>` : `<b>${i + 1}</b>`)).join('') + `<span>${(v ?? 0) + 1} / 5 &nbsp; ↓↑ الشرائح &nbsp; ←→ الأنماط</span>`;
}
reveal.on('slidechanged', arrive);
await reveal.initialize();
arrive();
(window as unknown as { __deck: unknown }).__deck = { ready: true, reveal };
