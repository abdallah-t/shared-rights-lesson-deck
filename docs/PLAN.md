> **Note:** this is the original design plan, kept for reference. The deck has since been built (28 slides, all seven rights). Where this plan and the deck differ, the deck is current. Paths here refer to the folder the plan was written in.

# خطة العرض: الحقوق المشتركة بين الزوجين
**Rebuild plan: reveal.js + live motion graphics** · دين 201 · ثاني ثانوي · Unit 3

Status: plan, style and assets are ready for review. No slides are built yet.

---

## 1. What I read

| Source | What it gave me |
|---|---|
| `الخطبة copy.pptx` (24 slides) | The lesson flow, both objectives, two activities, two assessments, homework, closing |
| `conversation_scene.md` | The full "leaked chat" between Sara and Noura, the four detective questions and their options, the teaching notes |
| `المشتركة١–٣.png` | Textbook pp. 69–74: definitions, the six shared rights, the verses and hadith with their references |

### Things in the original deck that need your mother's decision
1. **Leftovers from the previous lesson (الخطبة).** The file is a copy of the engagement lesson. Slides 16–19 and 22 still carry its content: the ring news story, "لو كنتِ مستشارة" about a fiancé, the objective line "أحكام الخطبة", and the finger questions (عرفي الخطبة، ما حكم الخطبة…). I plan to **rewrite these for this lesson** (section 5 shows how) unless she wants them kept.
2. **Two slides are placeholders.** Slide 4 (the hook) and slide 5 (divorce statistics) only contain notes to self. The statistics slide needs **real numbers with a source**; I will not invent them. Either she supplies them or I research official figures and show the source on the slide.
3. **Typos to fix:** "المفقوةة", "االزوجية", "الهدف الاول", a line of stray characters on slide 10, "المسئولية/المسؤولية" used both ways.
4. **Four rights or six?** The deck and the chat use four (الإمساك بالمعروف، حفظ الأسرار، المشاركة الوجدانية، الإحصان). The book lists six (adds حسن معاملة أبوَي الآخر، المشاركة في رعاية الأبناء). Plan: the activity stays on four; the summary slide shows all six with the other two dimmed as "أيضًا في الكتاب".
5. **The two videos are countdown timers** (1:00 and 4:00). I will replace them with built-in animated timers, which start on a key press and never need a file.
6. **Case file 2026/405 (slide 13)** is long and mixes several disputes. I keep her wording but break it into four "exhibits" that appear one at a time.

---

## 2. Style: «ليلة الفانوس» (Lantern Night)

See `style/style-board.png`. Calm and warm, never bright: a plum night sky lit by brass lanterns.

### Colour
| Token | Hex | Use |
|---|---|---|
| ليل بنفسجي | `#1A1530` | background (radial lift to `#2B2150` top right) |
| برقوقي | `#3A2C5E` / `#5B4474` | cards, panels, chat bubbles (the textbook's purple) |
| ذهبي عتيق | `#E3B866` / `#F3D9A0` | titles' key word, borders, verses, the "clue" highlight |
| وردي ترابي | `#D9A093` | second accent (the textbook's header rose) |
| أخضر مريمي | `#A9C58B` | third accent, "correct" |
| فيروزي هادئ | `#6EC5C0` | fourth accent, labels, links |
| كريمي | `#F6EEDD` | body text (never pure white) |
| مرجاني | `#E27D6F` | "missing right" stamps, wrong answers, timers ending |

Each of the four rights owns one accent for the whole deck: **gold** الإمساك بالمعروف · **rose** حفظ الأسرار · **sage** المشاركة الوجدانية · **teal** الإحصان.
Contrast: cream on night is 14:1; gold on night 9:1; every accent is used as text only at 26 px or larger.

### Type
| Role | Font | Notes |
|---|---|---|
| Titles | El Messiri 700 | 84–120 px, one key word in gold |
| Body | Tajawal 500/700 | 30–38 px, line height 1.7 |
| Labels, numbers, timers | Reem Kufi 700 | 22–30 px, objective tags, activity numbers |
| Qur'an and hadith | Amiri 700 | 44–56 px, gold, always with سورة/رقم الحديث under it |

Verses are typeset as text between ﴿ ﴾, copied from the textbook pages, never retyped from memory, and **each one needs her proofread** before class.

### Motifs
- **Khatam (eight-point star) lattice**, very faint, drawn in code so it can animate.
- **Hanging lanterns (فوانيس)** in the top corners, swaying slowly, with a soft glow.
- **Mihrab arch** as the card shape for the four rights and for section openers.
- **Rub el Hizb ۞** as the bullet, slide-number badge and transition mark (the book uses it for page numbers).
- **Detective layer** for Activity 1 (case folder, magnifier, pins and string) and **court layer** for Activity 2 (scales, bench, exhibits).
- **Emoji:** Microsoft Fluent 3D set, used as stickers at 64–160 px.

### Rules that keep it respectful
- No drawn people or faces anywhere. Sara and Noura are initials in coloured circles.
- Ali and Fatimah رضي الله عنهما are never depicted: names in calligraphy and symbolic objects only.
- No decoration over or behind a verse; verses sit on a plain panel.
- Girls' school: all address forms stay feminine as in the original.

### Motion language
| Move | Where | Feel |
|---|---|---|
| Lantern sway | every slide | 6–8 s pendulum, 3° |
| Lattice line-draw | slide entrances | lines draw outward from the title, 1.2 s |
| Star bloom | transitions | a ۞ grows, turns 45° and wipes to the next slide, 0.6 s |
| Gold shimmer | titles | one sweep after the title lands |
| Arch doors | reveals | two leaves swing open to show the answer |
| Typing | chat | dots for 0.6 s, then the bubble pops |
| Stamp | answers | "حق مفقود" drops with a small shake |
| Ink underline | clues | a gold hand-drawn line under the clue phrase |

Everything is live (reveal.js + the motion engine), right-to-left, 1920×1080, and steps on →.

---

## 3. Assets

### Fetched (in `assets/`)
- `emoji/` — **81 Fluent 3D emoji** (MIT licence, file included): magnifier, phone, speech balloons, lock and key, scales, scroll, books, bulb, trophy, stars, crescent, mosque, hearts, house, hourglass, check and cross, courthouse, charts, robot, bee, TV, camera, folder, pins, shield, dove, medals, lamp, palm, camel, desert, night sky, and more. Four I asked for were not found (direct hit, question mark, exclamation mark, ear).
- `web/` — **6 public-domain / CC0 files from Wikimedia Commons**: three Rub el Hizb SVGs, an Islamic star construction, a girih panel, a carved screen photo. Licences and source pages are in `web/SOURCES.json`. The search returned little that was usable, so the main ornament is drawn in code instead.
- `from-pptx/` — kept from her deck: Ministry of Education logo, SDG logos, the robot, the AI-answer card, the QR code, the news screenshot.
- Fonts — El Messiri, Amiri, Reem Kufi, Baloo Bhaijaan 2, Tajawal (all SIL Open Font Licence), installed in the app.

### To generate with the ChatGPT image API (not done: no API key on this Mac)
`tools/gen_ai_assets.py` is written and holds all 14 prompts with one shared style (soft 3D clay, lantern light, the palette above, no people, no text). It runs as soon as a key is available.

| File | Size | Used on |
|---|---|---|
| hook-house | 1536×1024 | Hook: the humble house |
| hook-timeline | 1536×1024 | Hook: the path back through time |
| detective-desk | 1536×1024 | Activity 1 opener |
| phone-frame (transparent) | 1024×1536 | Leaked chat |
| case-file (transparent) | 1024×1024 | Activity 1 and 2 |
| right-keeping-good / right-secrets / right-empathy / right-chastity (transparent) | 1024×1024 | The four rights |
| courtroom | 1536×1024 | Activity 2 |
| scales (transparent) | 1024×1024 | Verdict slide |
| ai-helper (transparent) | 1024×1024 | AI needs your help |
| summary-tree | 1536×1024 | Summary |
| thanks | 1536×1024 | Closing |

Every slide has a code-drawn fallback, so the deck does not depend on these.

---

## 4. Slide-by-slide plan (26 slides, about 45 minutes)

★ = long motion-graphic slide.

| # | Slide | Was | On screen | Motion | Steps |
|---|---|---|---|---|---|
| 1 | **العنوان** | 1 | Title, course table as five gold chips (المادة، الرمز، الوحدة، الفصل، المستوى), Ministry and SDG logos | Lattice draws, lanterns drop in on their chains, title rises, shimmer | 0 |
| 2 | **اتفاقيتنا لليوم** | 2 | Two agreements as cards: "احرصي على ما ينفعك" · "وقتك هو كنزك"; attendance badge "مسؤولة الغياب والحضور" | Cards flip in; hourglass emoji turns | 2 |
| 3 | **محطة التحفيز: طالبتي السرّية** | 3 | A gift box under a lantern, "من هي؟" | Spotlight sweeps, box shakes, opens to a medal and stars on → | 1 |
| 4 | ★ **رحلة عبر التاريخ** | 4 | A night desert; years count back; a humble house; names in calligraphy; then the question "ما سرّ نجاح هذه الأسرة؟" | Section 6A | 4 |
| 5 | ★ **إحصائية** | 5 | Animated line chart of divorce cases over two decades, source line | Section 6B | 3 |
| 6 | **سؤال الدرس** | new | Bridge from the book: "فما المقصود بالحقوق المشتركة؟ وما أهم هذه الحقوق؟" | The house from slide 4 and the chart from slide 5 shrink to two icons, question types in between | 0 |
| 7 | **أهداف الدرس** | 6 | A staircase of two steps up to a trophy; each step is an objective | Steps build, a small star climbs them, trophy glows | 2 |
| 8 | **النشاط الأول: المحققة العبقرية** | 7, 8 | "ملف الحقوق المفقودة" case folder, magnifier, mission text | Folder slides in and opens, stamp "سرّي", mission types | 1 |
| 9 | ★ **المحادثة المسرّبة** | new (md) | A phone with the Sara–Noura chat, a clue board beside it | Section 6C | 9 |
| 10 | ★ **مهمة المحقِّقة** | new (md) | Four questions, four options each, live feedback, "إعادة المحاولة" | Section 6D | 4 |
| 11 | ★ **الحقوق الأربعة** | 9 | Four mihrab arches | Section 6E | 4 |
| 12 | **الدليل الشرعي** | new (book) | One verse or hadith per right, from pp. 70–72, with reference | Each fades up on a plain panel in its right's colour | 4 |
| 13 | **تقييم الهدف الأول** | 10 | Assessment strip (ذاتي · دقيقتان · 4 درجات · الأمانة وتحمّل المسؤولية), two MCQs, "عللي: النهي عن إفشاء الأسرار", exam tip | Built-in 2:00 ring timer; answers reveal with a check | 4 |
| 14 | **حققنا هدفنا الأول** | 11 | Step 1 of the staircase lit, star hops to step 2 | Short celebration, stars burst | 0 |
| 15 | **النشاط الثاني: المستشارة القانونية الشرعية** | 12 | Scales, title, objective 2 | Scales swing and settle level | 0 |
| 16 | ★ **جلسة في محكمة: ملف القضية 2026/405** | 13 | Courtroom, the case text as four exhibits | Section 6F | 5 |
| 17 | **أدوار المحكمة** | 14 | Four role cards: محامي الزوجة · محامي الزوج · الخبراء الشرعيون · هيئة المحكمة; chips "مهارة حل المشكلات" "من واقع الحياة" | Cards deal out like a hand; 4:00 timer | 1 |
| 18 | **النطق بالحكم** | new | Blank verdict panel for the class's ruling, scales | Gavel drops on →, panel unrolls like a scroll | 1 |
| 19 | **لو كنتِ مستشارة** | 16, 17 | A real-life family situation for **this** lesson + three questions (ما أساس المشكلة؟ · اقترحي الحل · ما خطأ الذكاء الاصطناعي هنا؟) | Situation card, then questions one by one | 3 |
| 20 | **الذكاء الاصطناعي يحتاج مساعدتكن** | 18 | Robot, its suggested answer (from her image), then the message "يقترح… لكن الإنسان هو من يفكّر ويختار" and the motto "تعلّمٌ أذكى… وأثرٌ يبقى" | Robot bobs; its answer gets circled errors; motto shimmers | 3 |
| 21 | **تقييم الهدف الثاني** | 19 | Assessment strip (أقران · دقيقتان · 5 درجات), "من امتحان سابق" tag, question area | 2:00 ring timer | 1 |
| 22 | **الواجب والإنتاج الإلكتروني** | 20 | "ابحثي عن أهمية وجود الولي في عقد النكاح", three stars (الذكاء الاصطناعي · تصميم صور · إبداع النور), QR code | Stars pop; QR card flips in | 1 |
| 23 | **في صفّي متميّزة** | 21 | Honeycomb with bees, "شكرًا لمبادرتكنّ الجميلة" | Bees fly a slow loop; hexagons fill gold | 0 |
| 24 | **النشاط الختامي: أسئلة الأصابع** | 22 | A hand outline drawn in gold line; five questions on five fingers, rewritten for this lesson; then "لخّصي الدرس بخريطة مفاهيمية"; 5:00 timer | Hand draws itself; each finger lights on → | 6 |
| 25 | ★ **ملخّص ما تعلّمناه** | 23 | Six rights as lanterns on a tree; the four studied are lit | Section 6G | 2 |
| 26 | **شكرًا لحسن الاستماع** | 24 | "وفّقكنّ الله جميعًا", row of lanterns, crescent | Lanterns light one by one, lattice fades to stars | 0 |

---

## 5. Rewrites for the leftover slides (need her approval)

**Slide 19, لو كنتِ مستشارة.** Replace the ring story with a situation on a shared right. Draft:
> «زوجان اختلفا، فنشرت الزوجة تفاصيل الخلاف في حالتها على وسائل التواصل، وردّ الزوج بمنشور يسخر فيه منها.»
> ما أساس المشكلة؟ · أيّ حقّ ضاع؟ · اقترحي الحل كونكِ مستشارة.

**Slide 20, خطأ الذكاء الاصطناعي.** Her own image already shows an AI answer for a family dispute ("بما أن أخوكِ رفض…"), so it stays; the students find what is wrong with it.

**Slide 24, أسئلة الأصابع.** Draft for this lesson:
1. عرّفي الحق لغةً واصطلاحًا. 2. ما المقصود بالحقوق المشتركة؟ 3. عدّدي أربعة من الحقوق المشتركة. 4. استدلّي على حق حفظ الأسرار. 5. علّلي: الإحصان من أهم مقاصد الزواج.

---

## 6. The long motion-graphic slides

### 6A. رحلة عبر التاريخ (about 35 s, 4 steps)
1. **0–8 s, automatic.** Plum night, stars appear. A gold year counter spins backward from 2026 while a path of star-stones scrolls toward the viewer. Lanterns streak past as light trails.
2. **8–16 s.** The path ends at a small mud-brick house with one warm window (AI image or code-drawn silhouette). A lamp, a hand mill, a mat. Caption fades up: "بيتٌ صغير… أثاثه قليل".
3. **→ step 1.** Calligraphy writes itself: "عليّ وفاطمة الزهراء رضي الله عنهما". Three words rise from the window as light: مودّة · رحمة · تعاون.
4. **→ step 2.** Everything dims except the window. Big question lands: "ما سرّ نجاح هذه الأسرة؟".
5. **→ step 3.** Thought-balloon chips for the class's guesses (empty, the teacher fills them by voice).
6. **→ step 4.** The window light grows into a ۞ that carries over to slide 5.

### 6B. إحصائية (about 25 s, 3 steps)
1. Axes draw; years tick along the bottom.
2. **→ 1.** One line per country draws left to right with a glowing head; the number at the head counts up. (Real data required.)
3. **→ 2.** The last point pulses; a coral label states the change over the period.
4. **→ 3.** The chart tilts back and the question appears: "ما الذي يحمي الأسرة من هذا المصير؟" with the source line at the bottom.

### 6C. المحادثة المسرّبة (about 90 s, 9 steps)
Layout: phone on the right (RTL), clue board on the left, empty at first.
- **Step 0.** Phone slides up, screen wakes with a "تم تسريب محادثة" notification, header "سارة ↔ نورة", note "محادثة وهمية لأغراض تعليمية".
- **Steps 1–8.** One step per exchange (Sara then Noura). Typing dots, bubble pops with a soft bounce, time stamp, the chat scrolls. Sara's bubbles are plum, Noura's teal.
- On each of Sara's four complaints, after the bubble lands, a **magnifier sweeps the text** and the clue phrase gets a gold underline ("أنا مو فاضي" · "بخليك معلّقة" · "يحكي لأصدقائه تفاصيل خلافاتنا" · "يبتعد عني بلا حوار"). A numbered pin "قرينة 1…4" flies to the board with the phrase.
- **Step 9.** The phone shrinks; the four clue cards arrange in a row with red string between pins, each ending in a "؟". The names of the rights are **not** shown here, as her notes ask.
- Throughout: lanterns dim slightly so the phone is the light source.

### 6D. مهمة المحقِّقة (interactive, 4 steps)
One question per step from her file. The clue card for that question sits at the top. Four option buttons; she clicks (or presses 1–4). Wrong: the button shakes and dims. Right: it turns sage, a "حق مفقود ✓" stamp drops on the clue card, and the string from that pin turns the right's colour. "إعادة المحاولة" resets. A score of four magnifiers fills along the top.

### 6E. الحقوق الأربعة (4 steps)
Four closed mihrab doors with ۞ knockers. Each → swings one pair open (3D hinge), light spills out in that right's colour, and behind it: the emoji or AI object, the name, and a one-line meaning taken from the book. After the fourth, a gold thread links all four and the heading "الحقوق المشتركة: حقٌّ لهما وحقٌّ عليهما" appears.

### 6F. جلسة في محكمة (about 60 s, 5 steps)
1. Courtroom fades in (AI image or code-drawn bench and arches). A gavel knocks once; "محكمة الأسرة · ملف القضية رقم 2026/405" stamps on.
2. **→ 1–4.** Four exhibit cards slide out of the folder one at a time, each a part of her text: دعوى الزوجة (انفصال، حضانة، نفقة) · دفع الزوج (رعاية أمه المريضة) · النزاع على ميثاق الشراكة الأسرية · أطراف عائلية والتركة. Each card gets an icon and a tilt, and pins to a board.
3. **→ 5.** The scales appear in the centre, tipping one way then the other, and stop uneven: "ما الحكم الشرعي؟".

### 6G. ملخّص ما تعلّمناه (2 steps)
An olive tree grows from a seed (line-draw trunk, leaves pop). Six lanterns hang from it. **→ 1:** the four studied rights light in their colours with their names. **→ 2:** the other two from the book light dimly; the verse ﴿وَلَهُنَّ مِثْلُ الَّذِي عَلَيْهِنَّ بِالْمَعْرُوفِ﴾ (البقرة 228) fades in on a plain panel beneath.

---

## 7. Build and test plan
1. Arabic RTL deck shell: fonts, tokens, lattice and lantern background in the motion engine, star-bloom transition.
2. Reusable pieces: arch card, chat phone, ring timer, quiz, stamp, exhibit card.
3. Slides 1–8, then the long ones (9–11, 16), then the rest.
4. Test the same way as the last deck: headless Chrome through every slide and step, screenshots of each, at three window sizes, checking for errors and frame rate; then proofread every Arabic line against her deck and the book.
5. Deliver one HTML file plus a `media` folder in `mom_presentation/deck/`.

## 8. What I need from you
1. **OpenAI API key** for the illustrations (put `OPENAI_API_KEY=...` in `mom_presentation/.env`; do not paste it in chat).
2. **Style approval** from the board, or what to change.
3. **Her decisions** on the six points in section 1 and the rewrites in section 5.
4. **Divorce statistics** and their source, or permission for me to research them.
