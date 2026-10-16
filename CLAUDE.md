# Instructions for Claude

This repo is one lesson presentation: **الحقوق المشتركة بين الزوجين** (Shared rights between spouses), Islamic studies course دين 201, second-year secondary, for a girls' school in Bahrain. It is a reveal.js deck in Arabic (right to left) with a live three.js background. The style is «Lantern Night» (git tag `lantern-night` is the first version; `paper-ink` is the later Paper & Ink restyle). The person asking you for help may be the teacher or a family member, and may not be technical.

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

Add `?scale=0.5` to the address if the animation stutters on a slow computer.

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
| `src/mom/main.ts` | Behaviour: quiz, chart data, timers, chat scroll, counters, reveal.js setup. |
| `src/mom/bg.ts` | The live background: night sky, star lattice, lanterns, star transition. |
| `src/engine.ts`, `src/util.ts` | Rendering engine and easing helpers. Rarely need changes. |
| `public/assets/` | Images copied into the deck as is (emoji, logos, QR code). |
| `deck/` | Build output. Never edit by hand. |
| `docs/PLAN.md` | The original design plan and style guide. |
| `tools/gen_ai_assets.py` | Optional: generates illustrations with the OpenAI image API. Not used by the deck yet. |

### How slides work

- Elements with class `in` animate in when the slide appears; `style="--i: 3"` sets their order.
- Elements with class `fragment` appear one per press of →. An empty `<span class="fragment step">` advances an animation without showing anything itself.
- `<i data-e="trophy"></i>` becomes the emoji image `public/assets/emoji/trophy.png`. Only the emoji in that folder exist; add more PNGs there to use them.
- Each `<section>` has `data-mood` (`full`, `calm` or `dark`: how bright the background is) and `data-focus="x,y"` (where the lattice draws out from, in units of 100 px from the centre).
- `main.ts` recomputes every slide's state from which fragments are visible (`refresh()`), so going backwards works. Follow that pattern; don't store state in variables.
- Quiz questions and answers are the `QUESTIONS` array in `main.ts`. Chart numbers are the `CASES` array.

### Slide 4, the journey into the house

The hook slide is a motion graphic: the centuries count back, the camera pushes through the lit window, and six scenes inside the home play one per press of → (stillness, working together, putting the other first, comfort, keeping secrets, dawn prayer). The room is one inline SVG in `index.html` (`.roomwrap`), animated by CSS in the last section of `mom.css`; `main.ts` sets `data-sc` on the slide to the number of visible fragments and the CSS keys every scene off that. **No people are shown, ever: the objects tell the story.** Check any new shape does not read as a figure. `bun scripts/hookshots.ts "$PWD/deck/index.html" <out-dir>` screenshots each scene at several moments.

### Rules for this content. Please keep them.

1. **Qur'an verses and hadith are never to be written from memory or "corrected".** They were typed from the school textbook (pp. 69–74) with their references. If one needs changing, ask the user for the exact text and source, and remind them it must be proofread.
2. **No drawn or generated people or faces.** Sara and Noura in the chat are initials in circles. Ali and Fatimah (رضي الله عنهما) are named, never depicted.
3. **Keep it calm, not bright.** Palette: night `#1A1530`, plum `#3A2C5E` / `#5B4474`, gold `#E3B866`, rose `#D9A093`, sage `#A9C58B`, teal `#6EC5C0`, cream text `#F6EEDD`, coral `#E27D6F` for warnings only.
4. **Address forms stay feminine** (احرصي، اختاري، وفّقكنّ) as in the teacher's original.
5. **Statistics need a real source shown on the slide.** The current figures are from data.gov.bh (see README). Do not invent numbers.
6. Fonts: El Messiri for titles, Tajawal for body, Reem Kufi for labels and numbers, Amiri for verses and hadith.

### Before you say a change is done

Run `bun run build` then `bun run test`. The test prints one JSON line; `problems` and `overflow` must be empty. Screenshots of every step land in `test-output/`: look at the slides you changed, since the test cannot judge layout or Arabic text for you.

## Style candidates

`styles-demo/styles.html` shows fifteen candidate looks for a redesign, five sample slides each (source: `styles.html`, `src/styles/`; rebuild with `bun run styles:build`; screenshot every slide with `bun scripts/styleshots.ts <out-dir> [first-style-index]`). Styles 1–5 were the first round; 6–10 (Riso, Blueprint, Chalkboard, Night Garden, Square Kufic) the second. 11–15 (Paper Theatre, Mashrabiya Light, Dunes, Case File Noir, Archive 16mm) are cinematic: each slide is a scene whose moving layers come from `amb()` in `src/styles/main.ts`, with up to 3 s of opening motion (the screenshot script waits 3.6 s per slide). Kufam drops the dots of a final ي, so style 10 uses it only for headlines without one. ← → move between styles, ↑ ↓ through a style's slides. Paper & Ink was applied for a while (git tag `paper-ink`); the deck is back in Lantern Night.

## Things that are not finished

- No AI illustrations were generated (the API key supplied at the time was invalid). `tools/gen_ai_assets.py` holds the prompts; it needs `OPENAI_API_KEY` in the environment or in a git-ignored `.env`. **Never commit a key.**
- Text written by the assistant, not the teacher, and still awaiting her review: the scene captions inside the house on slide 4 (تعاون، إيثار، مواساة، سِتر، عون على الطاعة), the one-line meaning under each right on slide 12, the real-life case on slide 15 (the scenario, the four comment bubbles and «ما يُنشر لا يُمحى»), the one-line task under each court role (slides 22–25), the scene captions of the court story on slide 29 (her text, lightly corrected for grammar) and the five finger questions on slide 35. The definitions and the verse on slide 7 were typed from the textbook (p. 70) and need proofreading like every other verse.
