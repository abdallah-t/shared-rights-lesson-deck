// Line icons, drawn on a 48-unit grid and stroked in the current text colour.
// The slide markup asks for one with <i data-e="name"></i>.
const star = '<path d="M24 5l5.6 12 13 1.6-9.6 9 2.5 13L24 34.5 12.5 40.6 15 27.6l-9.6-9 13-1.6z"/>';
const heart = '<path d="M24 40S8 30 8 18a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 12-16 22-16 22z"/>';
const page = '<path d="M12 6h18l8 8v28H12z"/><path d="M30 6v8h8M18 22h14M18 29h14M18 36h9"/>';
export const ICONS: Record<string, string> = {
  glowing_star: star,
  sparkles: '<path d="M19 8l3.4 9.6L32 21l-9.6 3.4L19 34l-3.4-9.6L6 21l9.6-3.4z"/><path d="M36 26l1.8 5.2L43 33l-5.2 1.8L36 40l-1.8-5.2L29 33l5.2-1.8z"/>',
  hourglass_not_done: '<path d="M12 6h24M12 42h24M15 6c0 11 9 12 9 18s-9 7-9 18M33 6c0 11-9 12-9 18s9 7 9 18"/>',
  clipboard: '<rect x="10" y="9" width="28" height="33" rx="2"/><path d="M18 9V6h12v3M17 20h14M17 27h14M17 34h9"/>',
  '1st_place_medal': '<circle cx="24" cy="30" r="11"/><path d="M17 5l7 14 7-14M22 27l2.5-2v10"/>',
  palm_tree: '<path d="M24 44c0-12 2-18 5-24M29 20c-8-8-16-4-18 1M29 20c0-10 8-12 13-9M29 20c8-2 12 4 12 9M29 20c-4-10-12-10-17-7"/>',
  house_with_garden: '<path d="M7 22L24 8l17 14M12 19v21h24V19M20 40V28h8v12"/>',
  thinking_face: '<circle cx="24" cy="24" r="18"/><path d="M19 19a5 5 0 1 1 7.5 4.3c-1.8 1-2.5 2-2.5 4.2M24 33.5v.5"/>',
  bar_chart: '<path d="M7 41h34M14 41V27M24 41V13M34 41V21"/>',
  trophy: '<path d="M16 7h16v11a8 8 0 0 1-16 0zM16 11H9c0 6 3 9 7 9M32 11h7c0 6-3 9-7 9M24 26v8M18 34h12v7H18z"/>',
  magnifying_glass_tilted_left: '<circle cx="21" cy="21" r="12"/><path d="M30 30l11 11"/>',
  puzzle_piece: '<path d="M9 18h9a4 4 0 1 1 8 0h9v8a4 4 0 1 0 0 8v7H9z"/>',
  speech_balloon: '<path d="M7 9h34v23H23l-9 8v-8H7z"/>',
  file_folder: '<path d="M6 11h14l4 5h18v23H6z"/>',
  round_pushpin: '<circle cx="24" cy="16" r="9"/><path d="M24 25v18"/>',
  ring: '<circle cx="18" cy="26" r="11"/><circle cx="30" cy="26" r="11"/>',
  locked_with_key: '<rect x="10" y="22" width="28" height="20" rx="3"/><path d="M16 22v-6a8 8 0 0 1 16 0v6M24 30v5"/>',
  mending_heart: heart,
  sparkling_heart: heart,
  shield: '<path d="M24 6l14 5v11c0 10-6 17-14 20-8-3-14-10-14-20V11z"/><path d="M18 24l4 4 8-9"/>',
  smiling_face_with_hearts: '<path d="M7 23L24 9l17 14v18H7z"/><path d="M24 35s-7-4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5-7 9-7 9z"/>',
  seedling: '<path d="M24 43V23M24 27c-8 0-12-5-12-12 8 0 12 5 12 12zM24 23c0-6 4-10 12-10 0 6-4 10-12 10z"/>',
  scroll: page,
  memo: page,
  briefcase: '<rect x="6" y="16" width="36" height="24" rx="2"/><path d="M18 16v-6h12v6M6 27h36"/>',
  books: '<path d="M9 8h8v33H9zM17 8h8v33h-8zM27 12l8-2 6 30-8 2z"/>',
  classical_building: '<path d="M6 18L24 6l18 12zM11 22v16M20 22v16M28 22v16M37 22v16M6 42h36"/>',
  balance_scale: '<path d="M24 7v34M15 41h18M10 14h28M10 14L5 27a5.4 5.4 0 0 0 10 0zM38 14l-5 13a5.4 5.4 0 0 0 10 0z"/>',
  mobile_phone: '<rect x="14" y="5" width="20" height="38" rx="3"/><path d="M21 37h6"/>',
  robot: '<rect x="10" y="16" width="28" height="23" rx="4"/><path d="M24 16V8M24 6v.5M18 26v2M30 26v2M19 33h10M6 24v8M42 24v8"/>',
  cross_mark: '<path d="M11 11l26 26M37 11L11 37"/>',
  check_mark_button: '<path d="M8 25l10 10 22-23"/>',
  pencil: '<path d="M8 40l3-11L32 8l8 8-21 21zM28 12l8 8"/>',
  honeybee: '<ellipse cx="24" cy="29" rx="11" ry="9"/><path d="M20 21v16M28 21v16M19 20c-7-8-1-13 5-2M29 20c7-8 1-13-5-2"/>',
  crescent_moon: '<path d="M31 7a17 17 0 1 0 10 27A14.5 14.5 0 0 1 31 7z"/>',
};

/** Swap every <i data-e> placeholder for its inline SVG. */
export function drawIcons(root: ParentNode = document) {
  for (const el of root.querySelectorAll<HTMLElement>('i[data-e]')) {
    const d = ICONS[el.dataset.e!];
    if (!d) continue; // an unknown name stays as an empty tag
    el.outerHTML = `<svg class="e" viewBox="0 0 48 48" aria-hidden="true">${d}</svg>`;
  }
}
