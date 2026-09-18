/**
 * The stack — the site's one 3D object.
 *
 * Five translucent layers (Interface, API, Data & retrieval, Model,
 * Infrastructure) that the page reconfigures as you move through it:
 * assembled in the hero, exploded for the anatomy walkthrough, lit per
 * project, mapped to skills, reassembled at the end. A request pulse travels
 * down the layers and tokens stream back up — the actual shape of the
 * systems this portfolio is about.
 *
 * Plain three.js (no React renderer) so the bundle stays small, loaded
 * lazily after first paint. It renders only while something is moving and
 * the canvas is visible, and snaps between states without autonomous motion
 * when the visitor prefers reduced motion.
 */
import {
  AddEquation,
  CustomBlending,
  OneFactor,
  SrcAlphaFactor,
  ZeroFactor,
  BoxGeometry,
  BufferGeometry,
  Color,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import type { LayerId, SceneConfig } from "@/lib/content";

export type Cue =
  | { mode: "hero" }
  | { mode: "anatomy"; progress: number }
  | { mode: "work"; project: string }
  | { mode: "skills"; focus: LayerId | "quality" | null }
  | { mode: "contact" }
  | { mode: "case"; project: string }
  | { mode: "quiet" };

type EngineOptions = {
  canvas: HTMLCanvasElement;
  labels: HTMLElement;
  config: SceneConfig;
  reducedMotion: boolean;
  classes: { layer: string; component: string; active: string; index: string };
  onHoverLayer?: (id: LayerId | null) => void;
};

/* ------------------------------------------------------------------ */
/* Palette (kept in step with the CSS tokens in globals.css)          */
/* ------------------------------------------------------------------ */
const INK = new Color("#ede9e3");
const SLAB = new Color("#15171b");
const SIGNAL = new Color("#ff8a3d");

const SIZE = 3.2; // slab width/depth
const THICK = 0.07;
const TOKEN_COUNT = 22;
const TRAIL_STEP = 0.018;

/* ------------------------------------------------------------------ */
/* Shaders                                                            */
/* ------------------------------------------------------------------ */
const GRID_GLSL = /* glsl */ `
  float gridAA(vec2 p, float step, float w) {
    vec2 g = (fract(p / step + 0.5) - 0.5) * step;
    vec2 fw = fwidth(p);
    vec2 l = 1.0 - smoothstep(vec2(w), vec2(w) + fw * 1.5, abs(g));
    return max(l.x, l.y);
  }
  float lineAA(float d, float w) {
    float fw = fwidth(d);
    return 1.0 - smoothstep(w, w + fw * 1.5, abs(d));
  }
`;

const slabVertex = /* glsl */ `
  varying vec3 vLocal;
  varying vec3 vNormalL;
  void main() {
    vLocal = position;
    vNormalL = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const slabFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uInk;
  uniform vec3 uSignal;
  uniform float uSize;
  uniform float uActive;
  uniform float uDim;
  uniform float uAlpha;
  uniform float uHitAge;
  uniform float uSheen;
  uniform vec2 uHit;
  varying vec3 vLocal;
  varying vec3 vNormalL;
  ${GRID_GLSL}
  void main() {
    float hs = uSize * 0.5;
    vec3 col;
    float a;
    if (vNormalL.y > 0.5) {
      vec2 p = vLocal.xz;
      float edge = hs - max(abs(p.x), abs(p.y));
      float minor = gridAA(p, 0.2, 0.003) * 0.028;
      float major = gridAA(p, 0.8, 0.0045) * 0.07;
      float inset = lineAA(edge - 0.14, 0.004);
      float light = 0.9 + 0.2 * dot(normalize(vec2(-1.0, -1.0)), p / uSize);
      col = uBase * light;
      float lines = minor + major;
      col = mix(col, uInk, lines * (1.0 + uActive * 1.6));
      col = mix(col, mix(uInk * 0.55, uSignal, uActive), inset * (0.22 + 0.62 * uActive));
      float centre = 1.0 - smoothstep(0.0, hs * 1.25, length(p));
      col += uSignal * uActive * 0.07 * centre;
      float sheen = exp(-pow((p.x + p.y) * 0.32 - uSheen, 2.0) * 2.5);
      col += uInk * sheen * 0.03;
      if (uHitAge < 2.0) {
        float r = uHitAge * 2.2;
        float d = length(p - uHit) - r;
        float ring = exp(-d * d * 160.0) * (1.0 - smoothstep(0.0, 1.2, uHitAge));
        col += uSignal * ring * 0.5;
        col += uSignal * (1.0 - smoothstep(0.0, 0.4, uHitAge)) * 0.3 * inset;
      }
      a = uAlpha * (0.8 + lines * 0.15);
    } else {
      col = uBase * 0.6;
      a = uAlpha * 0.96;
    }
    col *= 1.0 - 0.6 * uDim;
    a *= 1.0 - 0.7 * uDim;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

const floorVertex = /* glsl */ `
  varying vec2 vP;
  void main() {
    vP = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const floorFragment = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uSignal;
  uniform float uAlpha;
  uniform float uGlow;
  varying vec2 vP;
  ${GRID_GLSL}
  void main() {
    float r = length(vP);
    float g = gridAA(vP, 0.5, 0.003);
    float fade = 1.0 - smoothstep(0.8, 5.2, r);
    float pool = 1.0 - smoothstep(0.0, 3.2, r);
    vec3 col = uInk * g * fade * fade * 0.05 + uSignal * pool * pool * uGlow * 0.06;
    gl_FragColor = vec4(col * uAlpha, 1.0);
    #include <colorspace_fragment>
  }
`;

const trailVertex = /* glsl */ `
  attribute float aArc;
  uniform float uHead;
  uniform float uTrail;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vA;
  void main() {
    float d = uHead - aArc;
    float a = (d >= 0.0 && d <= uTrail) ? pow(1.0 - d / uTrail, 1.8) : 0.0;
    vA = a;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio * (0.35 + 0.65 * a) * (12.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const dotVertex = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  uniform float uPixelRatio;
  varying float vA;
  void main() {
    vA = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (12.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float m = smoothstep(0.5, 0.0, r);
    float a = m * m * vA * uAlpha;
    if (a < 0.002) discard;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const damp = (current: number, target: number, lambda: number, dt: number) =>
  lambda === Infinity ? target : current + (target - current) * (1 - Math.exp(-lambda * dt));

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const deg = (d: number) => (d * Math.PI) / 180;

/**
 * Additive light for a transparent canvas: adds colour, leaves alpha alone.
 * Plain AdditiveBlending also accumulates alpha, which turns the canvas
 * opaque (black) wherever light is drawn and hides the page behind it.
 */
const lightBlending = (srcFactor: typeof OneFactor | typeof SrcAlphaFactor) => ({
  blending: CustomBlending,
  blendEquation: AddEquation,
  blendSrc: srcFactor,
  blendDst: OneFactor,
  blendSrcAlpha: ZeroFactor,
  blendDstAlpha: OneFactor,
});

/** Bounds-checked indexing: the arrays here are fixed at construction. */
function at<T>(list: readonly T[], index: number): T {
  const value = list[index];
  if (value === undefined) throw new RangeError(`index ${index} out of range`);
  return value;
}

type U<T> = { value: T };
type SlabUniforms = {
  uBase: U<Color>;
  uInk: U<Color>;
  uSignal: U<Color>;
  uSize: U<number>;
  uActive: U<number>;
  uDim: U<number>;
  uAlpha: U<number>;
  uHitAge: U<number>;
  uSheen: U<number>;
  uHit: U<Vector2>;
};
type TrailUniforms = {
  uHead: U<number>;
  uTrail: U<number>;
  uSize: U<number>;
  uPixelRatio: U<number>;
  uColor: U<Color>;
  uAlpha: U<number>;
};
type DotUniforms = { uPixelRatio: U<number>; uColor: U<Color>; uAlpha: U<number> };
type FloorUniforms = { uInk: U<Color>; uSignal: U<Color>; uAlpha: U<number>; uGlow: U<number> };

function trailUniforms(): TrailUniforms {
  return {
    uHead: { value: 0 },
    uTrail: { value: 1.3 },
    uSize: { value: 7 },
    uPixelRatio: { value: 1 },
    uColor: { value: SIGNAL.clone() },
    uAlpha: { value: 0 },
  };
}

function slabUniforms(base: Color, size: number, active: number): SlabUniforms {
  return {
    uBase: { value: base },
    uInk: { value: INK.clone() },
    uSignal: { value: SIGNAL.clone() },
    uSize: { value: size },
    uActive: { value: active },
    uDim: { value: 0 },
    uAlpha: { value: 0 },
    uHitAge: { value: 10 },
    uSheen: { value: 0 },
    uHit: { value: new Vector2() },
  };
}

type Layer = {
  id: LayerId;
  group: Group;
  slab: Mesh<BoxGeometry, ShaderMaterial>;
  u: SlabUniforms;
  edges: LineSegments<EdgesGeometry, LineBasicMaterial>;
  label: HTMLDivElement;
  active: number;
  activeTarget: number;
  dim: number;
  dimTarget: number;
  labelAlpha: number;
  /** Measured once (and after resizes) so labels can be kept on screen. */
  labelWidth: number;
  intro: number;
  hitAge: number;
};

type Node = {
  project: string;
  layerIndex: number;
  mesh: Mesh<BoxGeometry, ShaderMaterial>;
  u: SlabUniforms;
  edges: LineSegments<EdgesGeometry, LineBasicMaterial>;
  label: HTMLDivElement;
  local: Vector3;
  /** Alternate callouts sit a little higher so neighbours don't collide. */
  lift: number;
  alpha: number;
};

type Path = {
  key: string;
  points: Vector3[];
  /** Arc length at which the path meets each layer it touches. */
  hits: { layer: number; arc: number; local: Vector2 }[];
  length: number;
  trail: Points<BufferGeometry, ShaderMaterial>;
  ghost: Points<BufferGeometry, ShaderMaterial>;
  trailU: TrailUniforms;
  ghostU: TrailUniforms;
};

type Targets = {
  spacing: number;
  opacity: number;
  azimuth: number;
  polar: number;
  fit: number;
  shiftX: number;
  shiftY: number;
  cage: number;
  glow: number;
  labels: "layers" | "components" | "none";
  pulse: "loop" | "scrub" | "off";
  tilt: boolean;
  spin: boolean;
  project: string | null;
};

/* ------------------------------------------------------------------ */
/* Engine                                                             */
/* ------------------------------------------------------------------ */
export class StackEngine {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(28, 1, 0.1, 100);
  private root = new Group();
  private stack = new Group();
  private layers: Layer[] = [];
  private nodes: Node[] = [];
  private paths = new Map<string, Path>();
  private tokens: Points<BufferGeometry, ShaderMaterial>;
  private head: Points<BufferGeometry, ShaderMaterial>;
  private cage: LineSegments<EdgesGeometry, LineBasicMaterial>;
  private floor: Mesh<PlaneGeometry, ShaderMaterial>;
  private floorU!: FloorUniforms;
  private tokensU!: DotUniforms;
  private headU!: DotUniforms;
  private raycaster = new Raycaster();

  private opts: EngineOptions;
  private reduced: boolean;
  private narrow = false;
  private width = 1;
  private height = 1;
  private pixelRatio = 1;

  private cue: Cue = { mode: "hero" };
  private targets: Targets;
  private state = {
    spacing: 0.18,
    opacity: 0,
    azimuth: deg(38),
    polar: deg(62),
    fit: 0.6,
    shiftX: 0.2,
    shiftY: 0,
    cage: 0,
    glow: 0,
    tiltX: 0,
    tiltY: 0,
    spin: 0,
    headArc: 0,
    headAlpha: 0,
    tokenAlpha: 0,
    distance: 16,
  };

  private pointer = new Vector2(0, 0);
  private pointerNdc = new Vector2(-10, -10);
  private finePointer: boolean;
  private hovered: LayerId | null = null;

  private path: Path;
  private prevHeadArc = 0;
  private loopClock = 0;
  private tokenPhases: number[] = [];
  private introStarted = false;
  private introClock = 0;

  private raf = 0;
  private last = 0;
  private running = false;
  private settledFrames = 0;
  private disposed = false;
  private compiled = false;

  constructor(opts: EngineOptions) {
    this.opts = opts;
    this.reduced = opts.reducedMotion;
    this.finePointer = window.matchMedia("(pointer: fine)").matches;

    this.renderer = new WebGLRenderer({
      canvas: opts.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: true,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);

    this.scene.add(this.root);
    this.root.add(this.stack);

    this.floor = this.buildFloor();
    this.root.add(this.floor);

    opts.config.layers.forEach((layer, index) => this.layers.push(this.buildLayer(layer.id, layer.name, index)));
    opts.config.projects.forEach(project => {
      (Object.keys(project.components) as LayerId[]).forEach(layerId => {
        const index = this.layers.findIndex(layer => layer.id === layerId);
        const names = project.components[layerId] ?? [];
        names.forEach((name, i) => this.nodes.push(this.buildNode(project.slug, index, name, i, names.length)));
      });
    });

    this.cage = new LineSegments(
      new EdgesGeometry(new BoxGeometry(1, 1, 1)),
      new LineBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0, depthWrite: false }),
    );
    this.cage.renderOrder = 60;
    this.stack.add(this.cage);

    // A default straight path plus one routed through each project's components.
    this.path = this.buildPath("default");
    opts.config.projects.forEach(project => this.buildPath(project.slug));

    [this.tokens, this.tokensU] = this.buildDots(TOKEN_COUNT);
    [this.head, this.headU] = this.buildDots(1);
    this.stack.add(this.tokens, this.head);
    for (let i = 0; i < TOKEN_COUNT; i++) this.tokenPhases.push(i / TOKEN_COUNT + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.03);

    this.targets = this.targetsFor(this.cue);
    this.resize();

    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);

    // Compile every shader up front without blocking the main thread
    // (KHR_parallel_shader_compile where available), then start drawing.
    this.updateCamera();
    void this.renderer
      .compileAsync(this.scene, this.camera)
      .catch(() => undefined)
      .then(() => {
        this.compiled = true;
        this.start();
      });
  }

  /* ---------------------------------------------------------------- */
  /* Public API                                                       */
  /* ---------------------------------------------------------------- */

  setCue(cue: Cue) {
    const changed = JSON.stringify(cue) !== JSON.stringify(this.cue);
    if (!changed) return;
    this.cue = cue;
    this.targets = this.targetsFor(cue);
    this.start();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.width = w;
    this.height = h;
    this.narrow = w < 900;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, this.narrow ? 1.5 : 2);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    for (const u of this.pointUniforms()) u.uPixelRatio.value = this.pixelRatio;
    this.layers.forEach(layer => (layer.labelWidth = 0));
    this.targets = this.targetsFor(this.cue);
    this.start();
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.scene.traverse(object => {
      const mesh = object as Mesh;
      mesh.geometry?.dispose?.();
      const material = mesh.material as { dispose?: () => void } | undefined;
      material?.dispose?.();
    });
    this.renderer.dispose();
    this.opts.labels.replaceChildren();
  }

  /* ---------------------------------------------------------------- */
  /* Cue → targets                                                    */
  /* ---------------------------------------------------------------- */

  private targetsFor(cue: Cue): Targets {
    const narrow = this.narrow;
    // Laptop widths: push the stack further right and make it smaller, so it
    // never sits under the text column.
    const medium = !narrow && this.width < 1200;
    const base: Targets = {
      spacing: 0.62,
      opacity: 1,
      azimuth: deg(38),
      polar: deg(62),
      fit: narrow ? 0.64 : medium ? 0.56 : 0.68,
      shiftX: narrow ? 0 : medium ? 0.25 : 0.18,
      shiftY: narrow ? 0.2 : 0.01,
      cage: 0.08,
      glow: 0.6,
      labels: narrow ? "none" : "layers",
      pulse: "loop",
      tilt: true,
      spin: false,
      project: null,
    };

    switch (cue.mode) {
      case "hero":
        return base;
      case "anatomy": {
        const step = Math.min(5, Math.floor(cue.progress * 6));
        return {
          ...base,
          spacing: 1.0,
          fit: narrow ? 0.66 : medium ? 0.6 : 0.74,
          shiftY: narrow ? 0.22 : 0.0,
          azimuth: deg(30 + cue.progress * 16),
          polar: deg(63 - cue.progress * 4),
          cage: step === 5 ? 0.75 : 0.08,
          glow: 0.4 + (step >= 4 ? 0.6 : 0),
          pulse: "scrub",
          tilt: false,
        };
      }
      case "work":
      case "case":
        return {
          ...base,
          spacing: 0.86,
          fit: narrow ? 0.62 : medium ? 0.56 : cue.mode === "case" ? 0.66 : 0.72,
          shiftX: narrow ? 0 : medium ? 0.27 : 0.22,
          shiftY: narrow ? 0.2 : 0.0,
          azimuth: deg(36),
          polar: deg(60),
          labels: narrow ? "none" : "components",
          project: cue.project,
          opacity: narrow && cue.mode === "work" ? 0 : 1,
          tilt: true,
        };
      case "skills":
        return {
          ...base,
          spacing: 0.84,
          fit: medium ? 0.58 : 0.7,
          shiftX: medium ? 0.26 : 0.2,
          azimuth: deg(42),
          polar: deg(61),
          cage: cue.focus === "quality" ? 0.85 : 0.14,
          pulse: "off",
          opacity: narrow ? 0 : 1,
        };
      case "contact":
        return {
          ...base,
          spacing: 0.16,
          fit: narrow ? 0.46 : medium ? 0.36 : 0.42,
          shiftX: narrow ? 0 : medium ? 0.26 : 0.22,
          shiftY: narrow ? 0.26 : 0.02,
          polar: deg(56),
          labels: "none",
          spin: true,
          glow: 1,
        };
      case "quiet":
        return { ...base, opacity: 0, labels: "none", pulse: "off" };
    }
  }

  /* ---------------------------------------------------------------- */
  /* Loop                                                             */
  /* ---------------------------------------------------------------- */

  private start() {
    this.settledFrames = 0;
    if (!this.compiled || this.running || this.disposed || document.visibilityState === "hidden") return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    if (this.disposed) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const moving = this.update(dt);
    const visible = this.state.opacity > 0.002;
    if (visible) this.renderer.render(this.scene, this.camera);
    this.opts.canvas.style.opacity = this.state.opacity.toFixed(3);
    this.opts.canvas.style.visibility = visible ? "visible" : "hidden";

    // Keep going while anything is moving; when settled and nothing loops, sleep.
    this.settledFrames = moving ? 0 : this.settledFrames + 1;
    const loops = !this.reduced && visible && (this.targets.pulse !== "off" || this.targets.spin);
    if (loops || this.settledFrames < 3) {
      this.raf = requestAnimationFrame(this.frame);
    } else {
      this.running = false;
    }
  };

  /** Advances every animated value. Returns true while anything is still easing. */
  private update(dt: number): boolean {
    const t = this.targets;
    const s = this.state;
    const k = this.reduced ? Infinity : 3.2;
    const kFast = this.reduced ? Infinity : 6;
    let moving = false;
    const ease = (key: keyof typeof s, target: number, lambda = k) => {
      const before = s[key];
      // Reduced motion snaps every value, whatever rate the call asked for.
      s[key] = damp(before, target, this.reduced ? Infinity : lambda, dt);
      if (Math.abs(s[key] - target) > 0.0005) moving = true;
    };

    // Intro: layers drop in from above, bottom first.
    if (!this.introStarted) {
      this.introStarted = true;
      if (this.reduced) this.layers.forEach(layer => (layer.intro = 1));
    }
    if (!this.reduced && this.introClock < 2.2) {
      this.introClock += dt;
      this.layers.forEach((layer, i) => {
        const delay = (this.layers.length - 1 - i) * 0.11;
        layer.intro = smooth(0, 1, (this.introClock - 0.1 - delay) / 0.9);
      });
      moving = true;
    }

    ease("opacity", t.opacity, 2.6);
    ease("spacing", t.spacing, this.reduced ? Infinity : 2.4);
    ease("azimuth", t.azimuth);
    ease("polar", t.polar);
    ease("fit", t.fit);
    ease("shiftX", t.shiftX);
    ease("shiftY", t.shiftY);
    ease("cage", t.cage, kFast);
    ease("glow", t.glow);

    const tiltOn = t.tilt && this.finePointer && !this.reduced;
    ease("tiltY", tiltOn ? this.pointer.x * 0.16 : 0, 2.5);
    ease("tiltX", tiltOn ? this.pointer.y * 0.05 : 0, 2.5);
    if (t.spin && !this.reduced) s.spin += dt * 0.12;
    else ease("spin", Math.round(s.spin / (Math.PI * 2)) * Math.PI * 2, 1.5);

    // Layers: position, highlight, dim.
    const focus = this.focusFor();
    const project = t.project;
    const touched = project ? this.projectLayers(project) : null;
    const n = this.layers.length;
    this.layers.forEach((layer, i) => {
      const bob = this.reduced ? 0 : Math.sin(performance.now() / 1600 + i * 1.3) * 0.012;
      const y = ((n - 1) / 2 - i) * s.spacing + bob + (1 - layer.intro) * (3.5 + i * 0.4);
      layer.group.position.y = y;

      layer.activeTarget = focus.has(layer.id) ? 1 : 0;
      layer.dimTarget = touched ? (touched.has(i) ? 0 : 1) : focus.size && this.cue.mode === "skills" && !focus.has(layer.id) ? 0.55 : 0;
      layer.active = damp(layer.active, layer.activeTarget, kFast, dt);
      layer.dim = damp(layer.dim, layer.dimTarget, k, dt);
      if (Math.abs(layer.active - layer.activeTarget) > 0.001 || Math.abs(layer.dim - layer.dimTarget) > 0.001) moving = true;

      layer.hitAge += dt;
      const u = layer.u;
      u.uActive.value = layer.active;
      u.uDim.value = layer.dim;
      u.uAlpha.value = layer.intro;
      u.uHitAge.value = this.reduced ? 10 : layer.hitAge;
      u.uSheen.value = this.state.tiltY * 3 + 0.2;
      layer.edges.material.opacity = (0.28 + 0.5 * layer.active) * (1 - 0.72 * layer.dim) * layer.intro;
      layer.edges.material.color.copy(INK).lerp(SIGNAL, layer.active);
    });

    // Component nodes for the active project.
    this.nodes.forEach(node => {
      const target = node.project === project ? 1 : 0;
      node.alpha = damp(node.alpha, target, kFast, dt);
      if (Math.abs(node.alpha - target) > 0.001) moving = true;
      const visible = node.alpha > 0.01;
      node.mesh.visible = node.edges.visible = visible;
      if (visible) {
        const layer = at(this.layers, node.layerIndex);
        node.mesh.position.set(node.local.x, layer.group.position.y + THICK / 2 + 0.06, node.local.z);
        node.edges.position.copy(node.mesh.position);
        node.u.uAlpha.value = node.alpha * layer.intro;
        node.edges.material.opacity = node.alpha * 0.9 * layer.intro;
      }
    });

    // Quality cage wraps the whole stack.
    const height = s.spacing * (n - 1) + THICK + 0.7;
    this.cage.scale.set(SIZE + 0.6, height, SIZE + 0.6);
    this.cage.material.opacity = s.cage * Math.min(1, at(this.layers, 0).intro);

    // Floor sits just below the lowest layer.
    this.floor.position.y = -((n - 1) / 2) * s.spacing - 0.75;
    this.floorU.uGlow.value = s.glow;

    moving = this.updatePulse(dt, touched) || moving;
    this.updateCamera();
    this.updateLabels(dt);
    this.updateHover();
    return moving;
  }

  private focusFor(): Set<LayerId> {
    const cue = this.cue;
    if (cue.mode === "anatomy") {
      const step = Math.min(5, Math.floor(cue.progress * 6));
      const order: (LayerId | "all")[] = ["interface", "api", "data", "model", "interface", "all"];
      const id = order[step];
      return new Set(id === "all" ? this.layers.map(layer => layer.id) : [id as LayerId]);
    }
    if (cue.mode === "skills") {
      const focus = this.hovered ?? cue.focus;
      if (!focus) return new Set();
      if (focus === "quality") return new Set(this.layers.map(layer => layer.id));
      return new Set([focus]);
    }
    return new Set();
  }

  private projectLayers(slug: string) {
    const set = new Set<number>();
    this.nodes.forEach(node => node.project === slug && set.add(node.layerIndex));
    return set;
  }

  /* ---------------------------------------------------------------- */
  /* Pulse: request down, tokens up                                   */
  /* ---------------------------------------------------------------- */

  private updatePulse(dt: number, touched: Set<number> | null): boolean {
    const t = this.targets;
    const s = this.state;
    let moving = false;

    const wanted = this.paths.get(t.project ?? "default") ?? this.path;
    if (wanted !== this.path) {
      this.path.trail.visible = this.path.ghost.visible = false;
      this.path = wanted;
      this.loopClock = 0;
      this.prevHeadArc = 0;
    }
    const path = this.path;
    this.refreshPath(path);
    const modelHit = path.hits[path.hits.length - 1];
    const end = modelHit?.arc ?? path.length;

    let headTarget = 0;
    let headAlpha = 0;
    let tokenAlpha = 0;
    let tokenClock = 0;

    if (t.pulse === "loop" && !this.reduced && at(this.layers, 0).intro > 0.95) {
      const cycle = 5.6;
      this.loopClock = (this.loopClock + dt) % cycle;
      const c = this.loopClock;
      headTarget = smooth(0.2, 1.9, c) * end;
      headAlpha = smooth(0.1, 0.3, c) * (1 - smooth(1.9, 2.4, c));
      tokenAlpha = smooth(1.8, 2.1, c) * (1 - smooth(4.4, 4.9, c));
      tokenClock = (c - 1.8) / 2.6;
      s.headArc = headTarget;
    } else if (t.pulse === "scrub" && this.cue.mode === "anatomy") {
      // Scroll drives the request: step k carries the head from layer k-1 to layer k.
      const x = clamp01(this.cue.progress) * 6;
      const k = Math.min(3, Math.floor(x));
      const from = k === 0 ? 0 : at(path.hits, k - 1).arc;
      const to = at(path.hits, k).arc;
      headTarget = x >= 4 ? end : from + (to - from) * smooth(0.1, 0.7, x - k);
      headAlpha = x < 4 ? 1 : 0.35;
      tokenAlpha = x >= 4 ? 1 : 0;
      if (!this.reduced) this.loopClock += dt;
      tokenClock = this.reduced ? 0.45 : (this.loopClock * 0.42) % 1;
      const before = s.headArc;
      s.headArc = damp(s.headArc, headTarget, this.reduced ? Infinity : 5, dt);
      if (Math.abs(s.headArc - headTarget) > 0.002 || Math.abs(before - s.headArc) > 0.0001) moving = true;
    } else {
      s.headArc = damp(s.headArc, 0, this.reduced ? Infinity : 3, dt);
    }

    s.headAlpha = damp(s.headAlpha, headAlpha, this.reduced ? Infinity : 8, dt);
    s.tokenAlpha = damp(s.tokenAlpha, tokenAlpha, this.reduced ? Infinity : 6, dt);

    // Ripples where the head crosses a layer, in either direction.
    if (!this.reduced) {
      const lo = Math.min(this.prevHeadArc, s.headArc);
      const hi = Math.max(this.prevHeadArc, s.headArc);
      if (hi - lo > 1e-4) {
        for (const hit of path.hits) {
          if (hit.arc > lo && hit.arc <= hi && s.headAlpha > 0.2) {
            const layer = at(this.layers, hit.layer);
            if (!touched || touched.has(hit.layer)) {
              layer.hitAge = 0;
              layer.u.uHit.value.copy(hit.local);
            }
          }
        }
      }
    }
    this.prevHeadArc = s.headArc;

    // Trail.
    const visible = s.opacity > 0.002;
    path.trailU.uHead.value = s.headArc;
    path.trailU.uAlpha.value = s.headAlpha;
    path.ghostU.uHead.value = s.headArc;
    path.ghostU.uAlpha.value = s.headAlpha * 0.3;
    path.trail.visible = path.ghost.visible = visible && s.headAlpha > 0.01;

    // Head.
    const headPos = this.pointAt(path, s.headArc);
    const hp = this.head.geometry.getAttribute("position");
    hp.setXYZ(0, headPos.x, headPos.y, headPos.z);
    hp.needsUpdate = true;
    const ha = this.head.geometry.getAttribute("aAlpha");
    ha.setX(0, s.headAlpha);
    ha.needsUpdate = true;
    this.head.visible = visible && s.headAlpha > 0.01;

    // Tokens stream up from the model layer along the same route.
    const pos = this.tokens.geometry.getAttribute("position");
    const alpha = this.tokens.geometry.getAttribute("aAlpha");
    for (let i = 0; i < TOKEN_COUNT; i++) {
      const phase = at(this.tokenPhases, i);
      const local = (tokenClock * 1.35 - phase * 0.9 + 2) % 1;
      const f = t.pulse === "loop" ? tokenClock * 1.35 - phase * 0.9 : local;
      const on = f >= 0 && f <= 1 ? Math.sin(Math.PI * clamp01(f)) : 0;
      const arc = end * (1 - clamp01(f)) - 0.02;
      const p = this.pointAt(path, Math.max(0, arc));
      const jitter = ((i * 7919) % 13) / 13 - 0.5;
      pos.setXYZ(i, p.x + jitter * 0.05, p.y, p.z - jitter * 0.05);
      alpha.setX(i, on * s.tokenAlpha * (0.55 + ((i * 31) % 7) / 14));
    }
    pos.needsUpdate = true;
    alpha.needsUpdate = true;
    this.tokens.visible = visible && s.tokenAlpha > 0.01;

    if (s.headAlpha > 0.01 || s.tokenAlpha > 0.01) moving = moving || !this.reduced;
    return moving;
  }

  /** Paths move with the layers, so their points are recomputed per frame from layer positions. */
  private refreshPath(path: Path) {
    const project = path.key === "default" ? null : path.key;
    const topY = at(this.layers, 0).group.position.y;
    const pts: Vector3[] = [new Vector3(0, topY + 1.7, 0)];
    const hits: Path["hits"] = [];
    for (let i = 0; i < 4; i++) {
      const layer = at(this.layers, i);
      const node = project ? this.nodes.find(n => n.project === project && n.layerIndex === i) : undefined;
      const x = node ? node.local.x : 0;
      const z = node ? node.local.z : 0;
      const y = layer.group.position.y + THICK / 2;
      pts.push(new Vector3(x, y, z));
      hits.push({ layer: i, arc: 0, local: new Vector2(x, z) });
    }
    let length = 0;
    for (let i = 1; i < pts.length; i++) {
      length += at(pts, i).distanceTo(at(pts, i - 1));
      at(hits, i - 1).arc = length;
    }
    path.points = pts;
    path.hits = hits;
    path.length = length;

    // Re-sample the trail geometry along the updated route.
    for (const cloud of [path.trail, path.ghost]) {
      const attr = cloud.geometry.getAttribute("position");
      const arcAttr = cloud.geometry.getAttribute("aArc");
      const count = attr.count;
      for (let j = 0; j < count; j++) {
        const arc = (j / (count - 1)) * length;
        const p = this.pointAt(path, arc);
        attr.setXYZ(j, p.x, p.y, p.z);
        arcAttr.setX(j, arc);
      }
      attr.needsUpdate = true;
      arcAttr.needsUpdate = true;
    }
  }

  private pointAt(path: Path, arc: number) {
    const pts = path.points;
    let remaining = Math.max(0, arc);
    for (let i = 1; i < pts.length; i++) {
      const a = at(pts, i - 1);
      const b = at(pts, i);
      const seg = b.distanceTo(a);
      if (remaining <= seg || i === pts.length - 1) {
        return a.clone().lerp(b, seg === 0 ? 0 : Math.min(1, remaining / seg));
      }
      remaining -= seg;
    }
    return at(pts, pts.length - 1).clone();
  }

  /* ---------------------------------------------------------------- */
  /* Camera                                                           */
  /* ---------------------------------------------------------------- */

  private updateCamera() {
    const s = this.state;
    const n = this.layers.length;
    // Fit the stack's bounding sphere into the requested fraction of the view.
    const halfHeight = ((n - 1) * s.spacing) / 2 + 0.6;
    const halfWidth = (SIZE * Math.SQRT2) / 2;
    const radius = Math.sqrt(halfHeight * halfHeight + halfWidth * halfWidth);
    const vFov = deg(this.camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);
    const fov = Math.min(vFov, hFov * 1.15);
    const distance = radius / Math.sin(fov / 2) / Math.max(0.2, s.fit);
    s.distance = distance;

    const az = s.azimuth + s.tiltY + s.spin;
    const polar = s.polar - s.tiltX;
    this.camera.position.set(
      distance * Math.sin(polar) * Math.sin(az),
      distance * Math.cos(polar),
      distance * Math.sin(polar) * Math.cos(az),
    );
    this.camera.lookAt(0, 0, 0);
    // Lens shift rather than moving the camera: keeps the verticals straight,
    // like an architectural photograph.
    this.camera.setViewOffset(
      this.width,
      this.height,
      -s.shiftX * this.width,
      s.shiftY * this.height,
      this.width,
      this.height,
    );
  }

  /* ---------------------------------------------------------------- */
  /* HTML callouts                                                    */
  /* ---------------------------------------------------------------- */

  private project(v: Vector3) {
    const p = v.clone().project(this.camera);
    return { x: (p.x * 0.5 + 0.5) * this.width, y: (-p.y * 0.5 + 0.5) * this.height, z: p.z };
  }

  private updateLabels(dt: number) {
    const s = this.state;
    const mode = this.targets.labels;
    const { active } = this.opts.classes;
    this.stack.updateMatrixWorld();
    this.opts.labels.style.opacity = s.opacity.toFixed(3);

    this.layers.forEach(layer => {
      const wantLayer = mode === "layers" || mode === "components" ? 1 : 0;
      const target = wantLayer * layer.intro * (mode === "components" ? 1 - 0.75 * layer.dim : 1 - 0.5 * layer.dim);
      layer.labelAlpha = damp(layer.labelAlpha, target, this.reduced ? Infinity : 8, dt);
      const el = layer.label;
      if (layer.labelAlpha < 0.01 || s.opacity < 0.01) {
        el.style.visibility = "hidden";
        return;
      }
      // Anchor to whichever top corner projects furthest right.
      const h = SIZE / 2;
      let best = { x: -Infinity, y: 0 };
      for (const [cx, cz] of [
        [h, h],
        [h, -h],
        [-h, h],
        [-h, -h],
      ]) {
        const world = new Vector3(cx, THICK / 2, cz).applyMatrix4(layer.group.matrixWorld);
        const p = this.project(world);
        if (p.x > best.x) best = p;
      }
      el.style.visibility = "visible";
      if (!layer.labelWidth) layer.labelWidth = el.offsetWidth;
      // Slide inward rather than clip when the viewport is tight.
      const x = Math.min(best.x, this.width - layer.labelWidth - 12);
      el.style.opacity = layer.labelAlpha.toFixed(3);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${best.y.toFixed(1)}px, 0)`;
      el.classList.toggle(active, layer.active > 0.5);
    });

    this.nodes.forEach(node => {
      const el = node.label;
      const alpha = mode === "components" ? node.alpha * at(this.layers, node.layerIndex).intro : 0;
      if (alpha < 0.01 || s.opacity < 0.01) {
        el.style.visibility = "hidden";
        return;
      }
      const world = node.mesh.position.clone().add(new Vector3(0, 0.1, 0)).applyMatrix4(this.stack.matrixWorld);
      const p = this.project(world);
      el.style.visibility = "visible";
      el.style.opacity = alpha.toFixed(3);
      el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${(p.y - node.lift).toFixed(1)}px, 0)`;
    });
  }

  /* ---------------------------------------------------------------- */
  /* Hover (skills)                                                   */
  /* ---------------------------------------------------------------- */

  private updateHover() {
    if (this.cue.mode !== "skills" || !this.finePointer || this.state.opacity < 0.5) {
      if (this.hovered) {
        this.hovered = null;
        this.opts.onHoverLayer?.(null);
      }
      return;
    }
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    const hits = this.raycaster.intersectObjects(
      this.layers.map(layer => layer.slab),
      false,
    );
    const first = hits[0];
    const hit = first ? (this.layers.find(layer => layer.slab === first.object)?.id ?? null) : null;
    if (hit !== this.hovered) {
      this.hovered = hit;
      this.opts.onHoverLayer?.(hit);
    }
  }

  private onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    this.pointer.set((event.clientX / this.width) * 2 - 1, (event.clientY / this.height) * 2 - 1);
    // The lens shift lives in the projection matrix, so plain canvas NDC is right here.
    this.pointerNdc.set((event.clientX / this.width) * 2 - 1, -((event.clientY / this.height) * 2 - 1));
    if (!this.reduced) this.start();
  };

  private onVisibility = () => {
    if (document.visibilityState === "visible") this.start();
  };

  /* ---------------------------------------------------------------- */
  /* Builders                                                         */
  /* ---------------------------------------------------------------- */

  private buildLayer(id: LayerId, name: string, index: number): Layer {
    const group = new Group();
    const geometry = new BoxGeometry(SIZE, THICK, SIZE);
    const u = slabUniforms(SLAB.clone(), SIZE, 0);
    const slab = new Mesh(
      geometry,
      new ShaderMaterial({ vertexShader: slabVertex, fragmentShader: slabFragment, transparent: true, uniforms: u }),
    );
    const edges = new LineSegments(
      new EdgesGeometry(geometry),
      new LineBasicMaterial({ color: INK.clone(), transparent: true, opacity: 0 }),
    );
    // Lower layers render first so upper layers composite over them like stacked glass.
    slab.renderOrder = 10 + (10 - index) * 2;
    edges.renderOrder = slab.renderOrder + 1;
    group.add(slab, edges);
    this.stack.add(group);

    const label = document.createElement("div");
    label.className = this.opts.classes.layer;
    const idx = document.createElement("span");
    idx.className = this.opts.classes.index;
    idx.textContent = String(index + 1).padStart(2, "0");
    label.append(idx, document.createTextNode(name));
    label.style.visibility = "hidden";
    this.opts.labels.append(label);

    return {
      id,
      group,
      slab,
      u,
      edges,
      label,
      active: 0,
      activeTarget: 0,
      dim: 0,
      dimTarget: 0,
      labelAlpha: 0,
      labelWidth: 0,
      intro: 0,
      hitAge: 10,
    };
  }

  private buildNode(project: string, layerIndex: number, name: string, i: number, count: number): Node {
    const geometry = new BoxGeometry(0.44, 0.1, 0.44);
    const u = slabUniforms(new Color("#241a12"), 0.44, 1);
    const mesh = new Mesh(
      geometry,
      new ShaderMaterial({ vertexShader: slabVertex, fragmentShader: slabFragment, transparent: true, uniforms: u }),
    );
    const edges = new LineSegments(
      new EdgesGeometry(geometry),
      new LineBasicMaterial({ color: SIGNAL.clone(), transparent: true, opacity: 0 }),
    );
    const base = 10 + (10 - layerIndex) * 2;
    mesh.renderOrder = base + 1;
    edges.renderOrder = base + 1;
    mesh.visible = edges.visible = false;
    this.stack.add(mesh, edges);

    // Spread components along the axis that reads left-to-right on screen.
    const spread = count === 1 ? [0] : count === 2 ? [-0.82, 0.82] : [-1.1, 0, 1.1];
    const t = spread[i] ?? 0;
    const dir = new Vector3(Math.cos(deg(36)), 0, -Math.sin(deg(36)));
    const local = dir.multiplyScalar(t * 1.05);
    local.add(new Vector3(0.25, 0, 0.25));

    const label = document.createElement("div");
    label.className = this.opts.classes.component;
    label.textContent = name;
    label.style.visibility = "hidden";
    this.opts.labels.append(label);

    return { project, layerIndex, mesh, u, edges, label, local, lift: i % 2 === 1 ? 16 : 0, alpha: 0 };
  }

  private buildPath(key: string): Path {
    const samples = Math.ceil(9 / TRAIL_STEP);
    const make = (ghost: boolean, uniforms: TrailUniforms) => {
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new Float32BufferAttribute(new Float32Array(samples * 3), 3));
      geometry.setAttribute("aArc", new Float32BufferAttribute(new Float32Array(samples), 1));
      const material = new ShaderMaterial({
        vertexShader: trailVertex,
        fragmentShader: glowFragment,
        transparent: true,
        depthWrite: false,
        depthTest: !ghost,
        ...lightBlending(SrcAlphaFactor),
        uniforms,
      });
      const cloud = new Points(geometry, material);
      cloud.frustumCulled = false;
      cloud.renderOrder = ghost ? 70 : 50;
      cloud.visible = false;
      this.stack.add(cloud);
      return cloud;
    };
    const trailU = trailUniforms();
    const ghostU = trailUniforms();
    const path: Path = {
      key,
      points: [],
      hits: [],
      length: 1,
      trail: make(false, trailU),
      ghost: make(true, ghostU),
      trailU,
      ghostU,
    };
    this.paths.set(key, path);
    return path;
  }

  private buildDots(count: number): [Points<BufferGeometry, ShaderMaterial>, DotUniforms] {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute("aAlpha", new Float32BufferAttribute(new Float32Array(count), 1));
    const sizes = new Float32Array(count).map((_, i) => (count === 1 ? 26 : 6 + ((i * 17) % 5)));
    const uniforms: DotUniforms = { uPixelRatio: { value: 1 }, uColor: { value: SIGNAL.clone() }, uAlpha: { value: 1 } };
    geometry.setAttribute("aSize", new Float32BufferAttribute(sizes, 1));
    const material = new ShaderMaterial({
      vertexShader: dotVertex,
      fragmentShader: glowFragment,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      ...lightBlending(SrcAlphaFactor),
      uniforms,
    });
    const cloud = new Points(geometry, material);
    cloud.frustumCulled = false;
    cloud.renderOrder = 80;
    return [cloud, uniforms];
  }

  private buildFloor() {
    this.floorU = {
      uInk: { value: INK.clone() },
      uSignal: { value: SIGNAL.clone() },
      uAlpha: { value: 1 },
      uGlow: { value: 0.5 },
    };
    const floor = new Mesh(
      new PlaneGeometry(30, 30),
      new ShaderMaterial({
        vertexShader: floorVertex,
        fragmentShader: floorFragment,
        transparent: true,
        depthWrite: false,
        ...lightBlending(OneFactor),
        uniforms: this.floorU,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.renderOrder = 0;
    return floor;
  }

  private pointUniforms() {
    const list: { uPixelRatio: U<number> }[] = [this.tokensU, this.headU];
    this.paths.forEach(path => list.push(path.trailU, path.ghostU));
    return list;
  }
}
