import * as THREE from 'three';
import { Engine, type Film } from '../engine';
import { easeInOutCubic, easeOutBack, easeOutCubic, lerp, prog, sat } from '../util';

// The living background behind every slide: a plum night with a khatam
// (eight-point star) lattice that draws itself, twinkling stars, swaying
// lanterns, and a star that blooms across the frame between slides.

const W = 19.2; // one unit is 100 px on a 1920 x 1080 slide
const H = 10.8;
const D = H / (2 * Math.tan((15 * Math.PI) / 180));
const BLOOM = 0.7; // seconds for the star transition
export const HALF = BLOOM / 2;
const GOLD = 0xe3b866;

const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** How lit the scene is: full for openers, calm for reading, dark when the slide brings its own light. */
export type Mood = 'full' | 'calm' | 'dark';
const LEVEL: Record<Mood, number> = { full: 1, calm: 0.55, dark: 0.22 };

function lantern(color: number, size: number, chain: number) {
  const pivot = new THREE.Group();
  const flat = (shape: THREE.Shape, c: number | THREE.Color, z: number) => {
    const m = new THREE.Mesh(new THREE.ShapeGeometry(shape, 16), new THREE.MeshBasicMaterial({ color: c, transparent: true }));
    m.position.z = z;
    pivot.add(m);
    return m;
  };
  const rect = (x: number, y: number, w: number, h: number) => new THREE.Shape([new THREE.Vector2(x, y), new THREE.Vector2(x + w, y), new THREE.Vector2(x + w, y + h), new THREE.Vector2(x, y + h)]);
  flat(rect(-0.012, -chain, 0.024, chain), color, 0);
  const y0 = -chain;
  flat(rect(-0.1 * size, y0 - 0.14 * size, 0.2 * size, 0.14 * size), color, 0.01);
  // Body: a tall pointed dome on a tapering base.
  const body = new THREE.Shape();
  const w = 0.46 * size;
  const top = y0 - 0.14 * size;
  body.moveTo(0, top);
  body.bezierCurveTo(w * 0.9, top - 0.35 * size, w, top - 0.7 * size, w, top - 1.0 * size);
  body.lineTo(w, top - 1.75 * size);
  body.lineTo(w * 0.55, top - 2.15 * size);
  body.lineTo(-w * 0.55, top - 2.15 * size);
  body.lineTo(-w, top - 1.75 * size);
  body.lineTo(-w, top - 1.0 * size);
  body.bezierCurveTo(-w, top - 0.7 * size, -w * 0.9, top - 0.35 * size, 0, top);
  flat(body, color, 0.02);
  const inner = new THREE.Shape();
  const iw = w * 0.82;
  inner.moveTo(0, top - 0.16 * size);
  inner.bezierCurveTo(iw * 0.9, top - 0.45 * size, iw, top - 0.75 * size, iw, top - 1.02 * size);
  inner.lineTo(iw, top - 1.7 * size);
  inner.lineTo(iw * 0.55, top - 2.02 * size);
  inner.lineTo(-iw * 0.55, top - 2.02 * size);
  inner.lineTo(-iw, top - 1.7 * size);
  inner.lineTo(-iw, top - 1.02 * size);
  inner.bezierCurveTo(-iw, top - 0.75 * size, -iw * 0.9, top - 0.45 * size, 0, top - 0.16 * size);
  flat(inner, 0x2a2048, 0.03);
  // The window: brighter than white, so the engine's glow picks it up.
  const win = new THREE.Shape();
  const ww = w * 0.42;
  win.moveTo(0, top - 0.62 * size);
  win.bezierCurveTo(ww, top - 0.8 * size, ww, top - 1.0 * size, ww, top - 1.1 * size);
  win.lineTo(ww, top - 1.72 * size);
  win.lineTo(-ww, top - 1.72 * size);
  win.lineTo(-ww, top - 1.1 * size);
  win.bezierCurveTo(-ww, top - 1.0 * size, -ww, top - 0.8 * size, 0, top - 0.62 * size);
  const light = flat(win, new THREE.Color(1.5, 1.15, 0.62), 0.04);
  flat(rect(-0.3 * size, top - 2.34 * size, 0.6 * size, 0.19 * size), color, 0.02);
  const halo = new THREE.Mesh(
    new THREE.CircleGeometry(1.9 * size, 48),
    new THREE.ShaderMaterial({
      uniforms: { uA: { value: 1 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec2 v; void main(){ v = uv - 0.5; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform float uA; varying vec2 v; void main(){ float d = length(v) * 2.0; gl_FragColor = vec4(vec3(0.95, 0.72, 0.38) * pow(max(1.0 - d, 0.0), 2.2) * 0.34 * uA, 1.0); }',
    }),
  );
  halo.position.set(0, top - 1.2 * size, -0.01);
  pivot.add(halo);
  return { pivot, light: light.material as THREE.MeshBasicMaterial, halo: halo.material as THREE.ShaderMaterial };
}

export function createBackground(canvas: HTMLCanvasElement, scale = 1) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1530);
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 200);
  camera.position.set(0, 0, D);
  scene.add(camera);

  // Night sky and lattice in one shader.
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 1.3, H * 1.3),
    new THREE.ShaderMaterial({
      uniforms: { uT: { value: 0 }, uReveal: { value: 0 }, uOrigin: { value: new THREE.Vector2(4, 2) }, uLevel: { value: 1 } },
      vertexShader: 'varying vec2 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xy; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: /* glsl */ `
        uniform float uT; uniform float uReveal; uniform vec2 uOrigin; uniform float uLevel;
        varying vec2 vW;
        float seg(float d, float w) { return 1.0 - smoothstep(w * 0.5, w, d); }
        void main() {
          vec3 night = vec3(0.102, 0.082, 0.188);
          vec3 lift = vec3(0.170, 0.130, 0.315);
          float g = 1.0 - smoothstep(0.0, 15.0, distance(vW, vec2(6.5, 6.0)));
          vec3 col = mix(night, lift, g * g * (0.45 + 0.55 * uLevel));
          // Khatam lattice: a square and the same square turned 45 degrees in every cell, joined by short ties.
          vec2 q = fract(vW / 1.2) - 0.5;
          vec2 r = vec2(q.x + q.y, q.x - q.y) * 0.70710678;
          float w = 0.013;
          float d1 = abs(max(abs(q.x), abs(q.y)) - 0.25);
          float d2 = abs(max(abs(r.x), abs(r.y)) - 0.25);
          float far = step(0.3536, max(abs(q.x), abs(q.y)));
          float d3 = mix(1.0, min(abs(q.x), abs(q.y)), far);
          float line = max(max(seg(d1, w), seg(d2, w)), seg(d3, w));
          // It draws outward from the slide's focus, and a slow shimmer runs through it.
          float dist = distance(vW, uOrigin);
          float drawn = 1.0 - smoothstep(uReveal - 2.5, uReveal, dist);
          float shimmer = 0.75 + 0.25 * sin(dist * 0.9 - uT * 0.8);
          float edge = smoothstep(uReveal - 3.0, uReveal - 0.4, dist) * drawn;
          col += vec3(0.89, 0.72, 0.40) * line * drawn * (0.12 * shimmer + 0.3 * edge) * (0.5 + 0.5 * uLevel);
          // The colours above are written as sRGB; the output pass expects linear light.
          gl_FragColor = vec4(pow(col, vec3(2.2)), 1.0);
        }
      `,
    }),
  );
  sky.position.z = -1;
  scene.add(sky);
  const skyU = (sky.material as THREE.ShaderMaterial).uniforms;

  // Stars.
  const N = 150;
  const stars = new THREE.InstancedMesh(new THREE.CircleGeometry(0.5, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }), N);
  stars.frustumCulled = false;
  scene.add(stars);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const col = new THREE.Color();

  // Lanterns hang from the top edge: two on the left (clear of the right-aligned titles), one small on the right.
  const lamps = [
    { x: -9.0, color: GOLD, size: 0.44, chain: 0.45, period: 7.1 },
    { x: -8.3, color: 0xd9a093, size: 0.3, chain: 0.2, period: 5.3 },
    { x: 9.1, color: 0x6ec5c0, size: 0.3, chain: 0.3, period: 6.1 },
  ].map((l, i) => {
    const built = lantern(l.color, l.size, l.chain);
    built.pivot.position.set(l.x, H / 2 + 0.05, 0);
    scene.add(built.pivot);
    return { ...l, ...built, i };
  });

  // The star that blooms between slides rides on the camera so it always fills the frame.
  const starShape = (r: number) => {
    const s = new THREE.Shape();
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2;
      const rr = k % 2 ? r * 0.765 : r;
      if (k) s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      else s.moveTo(rr, 0);
    }
    return s;
  };
  const mk = (r: number, c: number, order: number) => {
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(starShape(r)), new THREE.MeshBasicMaterial({ color: c, transparent: true, depthTest: false }));
    mesh.renderOrder = order;
    mesh.position.z = -5;
    camera.add(mesh);
    return mesh;
  };
  const rim = mk(1.06, GOLD, 998);
  const fill = mk(1, 0x2b2150, 999);

  let level = 1;
  let target = 1;
  let changed = -10; // when the current slide change began
  let revealAt = 0;
  let first = true;
  const clock = () => performance.now() / 1000;

  const film: Film = {
    width: 1920,
    height: 1080,
    duration: Infinity,
    vignette: 0.7,
    bloom: 0.3,
    scene,
    camera,
    update(now) {
      level = lerp(level, target, 0.06);
      skyU.uT.value = now;
      skyU.uLevel.value = level;
      skyU.uReveal.value = easeOutCubic(prog(now, revealAt, 2.2)) * 30;
      for (let i = 0; i < N; i++) {
        const tw = 0.55 + 0.45 * Math.sin(now * (0.6 + rand(i + 9) * 1.6) + i);
        const s = (0.035 + 0.06 * rand(i + 3)) * tw * (0.5 + 0.5 * level);
        m.compose(new THREE.Vector3((rand(i) - 0.5) * W * 1.05, (rand(i + 1) - 0.5) * H * 1.05, -0.5), q, new THREE.Vector3(s, s, 1));
        stars.setMatrixAt(i, m);
        stars.setColorAt(i, col.setRGB(1, 0.93, 0.78).multiplyScalar(0.55 + 0.45 * tw));
      }
      stars.instanceMatrix.needsUpdate = true;
      stars.instanceColor!.needsUpdate = true;
      for (const l of lamps) {
        // They drop in on their chains at the start, then sway like slow pendulums.
        const drop = easeOutBack(prog(now, 0.2 + l.i * 0.25, 1.1), 1.2);
        l.pivot.position.y = H / 2 + 0.05 + (1 - drop) * 5;
        l.pivot.scale.setScalar(1 + 0.75 * sat((level - 0.6) / 0.4));
        l.pivot.rotation.z = Math.sin((now * Math.PI * 2) / l.period + l.i * 1.7) * 0.055;
        const flicker = 0.9 + 0.1 * Math.sin(now * 5.3 + l.i * 2.1) * Math.sin(now * 2.1 + l.i);
        l.light.color.setRGB(1.5, 1.15, 0.62).multiplyScalar((0.35 + 0.65 * level) * flicker);
        l.halo.uniforms.uA.value = (0.25 + 0.75 * level) * flicker;
      }
      // Star bloom: grows and turns until it covers the frame, then fades off the new slide.
      const u = prog(now, changed, BLOOM);
      const on = u > 0 && u < 1;
      rim.visible = fill.visible = on;
      if (on) {
        const grow = easeInOutCubic(sat(u / 0.5));
        const s = 0.05 + 4.6 * grow + 1.2 * sat((u - 0.5) / 0.5);
        const a = 1 - easeInOutCubic(sat((u - 0.5) / 0.5));
        for (const [mesh, k] of [[rim, 1], [fill, 1]] as const) {
          mesh.scale.setScalar(s * k);
          mesh.rotation.z = u * Math.PI * 0.5;
          (mesh.material as THREE.MeshBasicMaterial).opacity = a;
        }
      }
    },
  };
  const engine = new Engine(canvas, film, scale);

  return {
    half: HALF,
    /** A new slide is showing: bloom across, relight, and redraw the lattice from its focus. */
    goto(mood: Mood, focusX: number, focusY: number) {
      const now = clock();
      target = LEVEL[mood];
      if (first) {
        first = false;
        level = target;
        revealAt = now + 0.2;
      } else {
        changed = now;
        revealAt = now + HALF;
      }
      skyU.uOrigin.value.set(focusX, focusY);
    },
    start() {
      const tick = () => {
        engine.frame(clock(), 1);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
  };
}
