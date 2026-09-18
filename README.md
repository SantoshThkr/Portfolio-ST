# Santosh Thakur — portfolio

Personal site for a full-stack AI engineer. Next.js 16 (App Router), React 19,
TypeScript, plain CSS modules, and one three.js scene. Every route is
statically generated.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + production build
npm test           # Playwright: desktop + mobile (builds and starts the site itself)
```

First Playwright run on a new machine: `npx playwright install chromium`.
Tests use full Chromium so the 3D scene runs on a real GPU; on machines without
hardware WebGL the scene tests skip and the fallback tests still run.

## The idea

The whole site is built around one object: **the stack** — five translucent
layers (Interface, API, Data & retrieval, Model, Infrastructure). A request
pulse travels down through them and tokens stream back up. The page re-poses
that one object as you move through it:

| Region | What the stack does |
| --- | --- |
| Hero | Assembles, then idles with a request loop. |
| Anatomy | Explodes; scrolling drives the request through each layer, step by step. |
| Work | Lights only the layers each project touched, with its real components as callouts. |
| Experience, About | Steps back (fades out) so the reading chapters stay quiet. |
| Skills | Hovering a skill row lights its layer, and hovering a layer lights its row. |
| Contact | Reassembles into one compact block. |
| Case studies | Poses as that project; the "next case study" link re-poses it as the next one. |

The canvas lives in the root layout, so it survives client-side navigation —
opening a case study re-poses the scene rather than reloading it.

## Where things live

| Path | What it is |
| --- | --- |
| `lib/site.ts` | Name, domain, email, social links, résumé and portrait paths. |
| `lib/content.ts` | All copy, plus the layer model: projects (with `components` per layer), the anatomy steps, experience, skills per layer. |
| `components/scene/engine.ts` | The three.js scene: shaders, state, damping, callout labels. Loaded lazily. |
| `components/scene/scene-root.tsx` | Mounts the canvas, boots the engine, and maps scroll position to scene cues. |
| `components/home/*` | One file per home-page chapter. |
| `app/work/[slug]/` | Case-study pages, generated for every project that has a `caseStudy`. |
| `components/flow-diagram.tsx` | Architecture diagrams as accessible ordered lists. |
| `app/globals.css` | Tokens, type, buttons, reveal-on-scroll, reduced-motion rules. |

## Editing content

- **Add a project:** add an entry to `projects` in `lib/content.ts`. Its
  `components` map decides what lights up in 3D — leave a layer out and it stays
  dark. Give it a `caseStudy` and it gets a page, sitemap entry and OG image.
- **Pages drive the scene with data attributes**, never by calling the engine:
  `data-scene="hero|anatomy|work|skills|contact|case|quiet"`, plus
  `data-project` and `data-layer`. Content stays plain server-rendered HTML.
- **Rule for copy:** every claim must trace to the résumé, a repository, or an
  earlier version of this site.

## Design and performance notes

- Graphite and warm off-white with one amber signal colour; dark by design.
  Archivo (its width axis gives both the expanded display cut and the text
  cut, from one file) and Martian Mono for labels. Self-hosted; no third-party
  requests. Every text colour clears WCAG AA.
- three.js is a separate chunk that the HTML never references; it loads after
  the page is idle. The scene only boots on hardware-accelerated WebGL2 (not
  software rendering) and not when the visitor has Save-Data on; otherwise a
  static drawing of the stack is shown. Shaders compile asynchronously, the
  render loop sleeps when nothing moves, and pixel ratio is capped.
- `prefers-reduced-motion`: no autonomous motion anywhere — the scene still
  renders, but snaps between states instead of animating.
- Without JavaScript, every section is fully visible; reveal-on-scroll only
  arms itself once scripts are running.
