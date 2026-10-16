# Instructions for Claude

This repo is one lesson presentation: **الحقوق المشتركة بين الزوجين** (Shared rights between spouses), Islamic studies course دين 201, second-year secondary, for a girls' school in Bahrain. It is a reveal.js deck in Arabic (right to left) in the «ورق وحبر» (Paper & Ink) style: warm paper, black ink and one red, with editorial type and line icons. The person asking you for help may be the teacher or a family member, and may not be technical.

## To run the presentation

The built deck is committed, so nothing needs installing:

```bash
open deck/index.html          # macOS
xdg-open deck/index.html      # Linux
start deck/index.html         # Windows
```

It must open in Chrome, Edge or another Chromium browser. `deck/assets/` has to stay next to `deck/index.html`.

If the user asks you to "run", "open", "start" or "show" the presentation, do exactly that and then tell them the keys:

| Key | Does |
|---|---|
| → / ← | next / previous step |
| F | full screen |
| T | start or pause the countdown on the current slide (or click the ring) |
| 1–4 | answer the current quiz question (or click an option) |
| Esc | slide overview |


## To change the presentation

Requirements: [bun](https://bun.sh) and Google Chrome.

```bash
bun install
bun run dev        # live preview at localhost:5173, reloads on save
bun run build      # rebuilds deck/ (commit the result)
bun run typecheck
bun run test       # steps through every slide in headless Chrome; needs a fresh build
```

**Always run `bun run build` and commit `deck/` after any change**, because the teacher opens the built file, not the source.

### Where things are

| Path | What |
|---|---|
| `index.html` | All slide text and structure. One `<section>` per slide, in order. |
| `src/mom/mom.css` | The look: colours, type, every component and animation. |
| `src/mom/icons.ts` | The line icons, as SVG paths on a 48-unit grid. |
| `src/mom/main.ts` | Behaviour: quiz, chart data, timers, chat scroll, counters, reveal.js setup. |
| `public/assets/` | Images copied into the deck as is (logos, QR code). |
| `deck/` | Build output. Never edit by hand. |
| `docs/PLAN.md` | The original design plan and style guide. |
| `tools/gen_ai_assets.py` | Optional: generates illustrations with the OpenAI image API. Not used by the deck yet. |

### How slides work

- Elements with class `in` animate in when the slide appears; `style="--i: 3"` sets their order.
- Elements with class `fragment` appear one per press of →. An empty `<span class="fragment step">` advances an animation without showing anything itself.
- `<i data-e="trophy"></i>` becomes the line icon named `trophy` in `src/mom/icons.ts`. To use a new one, add its paths there.
- A `<section class="inv">` is an inverted slide (paper on ink); four are used as section breaks. `data-mood` and `data-focus` are left over from the previous style and do nothing.
- The markup still uses the old colour class names (`gold`, `teal`, `rose`…). In `mom.css` they map onto the two inks: `gold` and `coral` are the red, the rest are ink. Don't add new colours.
- A red sheet wipes across between slides (`#wipe`).
- `main.ts` recomputes every slide's state from which fragments are visible (`refresh()`), so going backwards works. Follow that pattern; don't store state in variables.
- Quiz questions and answers are the `QUESTIONS` array in `main.ts`. Chart numbers are the `CASES` array.

### Slide 4, the journey into the house

The hook slide is a motion graphic: the centuries count back, the camera pushes through the lit window, and six scenes inside the home play one per press of → (stillness, working together, putting the other first, comfort, keeping secrets, dawn prayer). The room is one inline SVG in `index.html` (`.roomwrap`), animated by CSS in the last section of `mom.css`; `main.ts` sets `data-sc` on the slide to the number of visible fragments and the CSS keys every scene off that. **No people are shown, ever: the objects tell the story.** Check any new shape does not read as a figure. `bun scripts/hookshots.ts "$PWD/deck/index.html" <out-dir>` screenshots each scene at several moments.

### Rules for this content. Please keep them.

1. **Qur'an verses and hadith are never to be written from memory or "corrected".** They were typed from the school textbook (pp. 69–74) with their references. If one needs changing, ask the user for the exact text and source, and remind them it must be proofread.
2. **No drawn or generated people or faces.** Sara and Noura in the chat are initials in circles. Ali and Fatimah (رضي الله عنهما) are named, never depicted.
3. **Three colours only:** paper `#ECE5D8`, ink `#16130F`, red `#D8432A` (plus greys of the ink). No gradients, glows, shadows or emoji.
4. **Address forms stay feminine** (احرصي، اختاري، وفّقكنّ) as in the teacher's original.
5. **Statistics need a real source shown on the slide.** The current figures are from data.gov.bh (see README). Do not invent numbers.
6. Fonts: Noto Kufi Arabic (900/700) for headlines, IBM Plex Sans Arabic for body, labels and numerals, Amiri for verses and hadith.

### Before you say a change is done

Run `bun run build` then `bun run test`. The test prints one JSON line; `problems` and `overflow` must be empty. Screenshots of every step land in `test-output/`: look at the slides you changed, since the test cannot judge layout or Arabic text for you.

## Style candidates

`styles-demo/styles.html` shows fifteen candidate looks for a redesign, five sample slides each (source: `styles.html`, `src/styles/`; rebuild with `bun run styles:build`; screenshot every slide with `bun scripts/styleshots.ts <out-dir> [first-style-index]`). Styles 1–5 were the first round; 6–10 (Riso, Blueprint, Chalkboard, Night Garden, Square Kufic) the second. 11–15 (Paper Theatre, Mashrabiya Light, Dunes, Case File Noir, Archive 16mm) are cinematic: each slide is a scene whose moving layers come from `amb()` in `src/styles/main.ts`, with up to 3 s of opening motion (the screenshot script waits 3.6 s per slide). Kufam drops the dots of a final ي, so style 10 uses it only for headlines without one. ← → move between styles, ↑ ↓ through a style's slides. Paper & Ink was chosen and applied. The previous Lantern Night version is the git tag `lantern-night`.

## Things that are not finished

- No AI illustrations were generated (the API key supplied at the time was invalid). `tools/gen_ai_assets.py` holds the prompts; it needs `OPENAI_API_KEY` in the environment or in a git-ignored `.env`. **Never commit a key.**
- Text written by the assistant, not the teacher, and still awaiting her review: the scene captions inside the house on slide 4 (تعاون، إيثار، مواساة، سِتر، عون على الطاعة), the scenario on slide 23, the flawed AI answer on slide 24, the five finger questions on slide 30, the one-line task under each court role (slides 17–20), and the one-line meaning under each right on slide 11.
