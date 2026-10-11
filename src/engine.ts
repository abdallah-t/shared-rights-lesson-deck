import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
const FPS = 60;

export interface Film {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Must be a pure function of t: same t, same picture. */
  update(t: number): void;
  width: number;
  height: number;
  duration: number;
  /** [time, name] markers the preview can jump between */
  sections?: [number, string][];
  /** corner darkening, 1 = none (default 0.6) */
  vignette?: number;
  /** glow strength (default 0.12) */
  bloom?: number;
  /**
   * Live footage to draw the film over: the frame for time t, or null to show
   * the scene's own background. Such films get no glow, grain or vignette, so
   * the footage is not altered.
   */
  footage?: (t: number) => Promise<THREE.Texture | null>;
  /** shown where footage returns null */
  cover?: THREE.Color;
  /** with footage: output the graphics alone on a transparent background */
  alpha?: boolean;
  /** with footage: overall opacity of the graphics at time t, to follow fades in the source */
  gain?: (t: number) => number;
}

const FSQ_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const ACCUM_FRAG = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform float weight;
  varying vec2 vUv;
  void main() { gl_FragColor = texture2D(tDiffuse, vUv) * weight; }
`;

// Vignette and film grain, in linear light.
const FINISH = {
  uniforms: { tDiffuse: { value: null }, uSeed: { value: 0 }, uVig: { value: 0.6 } },
  vertexShader: FSQ_VERT,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uSeed;
    uniform float uVig;
    varying vec2 vUv;
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 q = (vUv - 0.5) * vec2(1.0, 0.8);
      c.rgb *= mix(uVig, 1.0, smoothstep(0.78, 0.25, length(q)));
      float g = hash(gl_FragCoord.xy + uSeed * 17.0) - 0.5;
      c.rgb = max(c.rgb + g * (0.003 + 0.055 * c.rgb), 0.0);
      gl_FragColor = c;
    }
  `,
};

// Lays the graphics (premultiplied, with coverage in alpha) over the footage.
const OVER = {
  uniforms: { tGfx: { value: null }, tFootage: { value: null }, uHas: { value: 0 }, uCover: { value: new THREE.Color(0) }, uAlpha: { value: 0 }, uGain: { value: 1 } },
  vertexShader: FSQ_VERT,
  fragmentShader: /* glsl */ `
    uniform sampler2D tGfx;
    uniform sampler2D tFootage;
    uniform float uHas;
    uniform vec3 uCover;
    uniform float uAlpha;
    uniform float uGain;
    varying vec2 vUv;
    void main() {
      vec4 g = texture2D(tGfx, vUv) * uGain;
      // Transparent output: straight (un-premultiplied) colour plus coverage.
      if (uAlpha > 0.5) { gl_FragColor = vec4(g.a > 0.0 ? g.rgb / g.a : vec3(0.0), clamp(g.a, 0.0, 1.0)); return; }
      vec3 base = uHas > 0.5 ? texture2D(tFootage, vUv).rgb : uCover;
      gl_FragColor = vec4(base * (1.0 - g.a) + g.rgb, 1.0);
    }
  `,
};

/**
 * Draws one frame of a film. Motion blur is real: the scene is rendered at
 * several instants inside the shutter and averaged in a float buffer.
 */
export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  private sceneRT: THREE.WebGLRenderTarget;
  private accumRT: THREE.WebGLRenderTarget;
  private accumMat: THREE.ShaderMaterial;
  private fsq = new THREE.Scene();
  private fsqCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private composer: EffectComposer;
  private finish: ShaderPass;
  private over: ShaderPass | null = null;
  shutter = 0.5;

  constructor(canvas: HTMLCanvasElement, private film: Film, scale = 1) {
    const w = Math.round(film.width * scale);
    const h = Math.round(film.height * scale);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      preserveDrawingBuffer: true,
      ...(film.alpha ? { alpha: true, premultipliedAlpha: false } : {}),
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(w, h, false);

    this.sceneRT = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4 });
    this.accumRT = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, depthBuffer: false });
    this.accumMat = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: this.sceneRT.texture }, weight: { value: 1 } },
      vertexShader: FSQ_VERT,
      fragmentShader: ACCUM_FRAG,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneFactor,
      depthTest: false,
      depthWrite: false,
    });
    this.fsq.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.accumMat));

    this.composer = new EffectComposer(this.renderer);
    this.finish = new ShaderPass(FINISH);
    if (film.footage) {
      this.over = new ShaderPass(OVER);
      this.over.uniforms.tGfx.value = this.accumRT.texture;
      if (film.cover) this.over.uniforms.uCover.value.copy(film.cover);
      this.over.uniforms.uAlpha.value = film.alpha ? 1 : 0;
      this.composer.addPass(this.over);
      this.composer.addPass(new OutputPass());
      return;
    }
    this.composer.addPass(new TexturePass(this.accumRT.texture));
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), film.bloom ?? 0.12, 0.15, 0.2));
    this.finish.uniforms.uVig.value = film.vignette ?? 0.6;
    this.composer.addPass(this.finish);
    this.composer.addPass(new OutputPass());
  }

  /** Like frame(), but first fetches the footage frame for films that have one. */
  async frameAsync(t: number, samples = 1) {
    if (this.over && this.film.footage) {
      const tex = await this.film.footage(t);
      this.over.uniforms.tFootage.value = tex;
      this.over.uniforms.uHas.value = tex ? 1 : 0;
      this.over.uniforms.uGain.value = this.film.gain ? this.film.gain(t) : 1;
    }
    this.frame(t, samples);
  }

  frame(t: number, samples = 1) {
    const r = this.renderer;
    const n = Math.max(1, Math.round(samples));
    this.accumMat.uniforms.weight.value = 1 / n;
    for (let k = 0; k < n; k++) {
      this.film.update(t + ((k / n) * this.shutter) / FPS);
      r.setRenderTarget(this.sceneRT);
      if (this.over) r.setClearColor(0x000000, 0); // graphics on a transparent ground
      r.render(this.film.scene, this.film.camera);

      r.setRenderTarget(this.accumRT);
      if (k === 0) {
        r.setClearColor(0x000000, 0);
        r.clear();
      }
      r.autoClear = false;
      r.render(this.fsq, this.fsqCam);
      r.autoClear = true;
    }
    r.setRenderTarget(null);
    this.finish.uniforms.uSeed.value = Math.round(t * FPS) % 997;
    this.composer.render();
  }
}
