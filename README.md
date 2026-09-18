# Santosh Thakur — portfolio

Personal site for a full-stack AI engineer. Next.js 16 (App Router), React 19,
TypeScript, plain CSS modules. Every route is statically generated.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + production build
npm test           # Playwright: desktop + mobile (builds and starts the site itself)
```

First Playwright run on a new machine: `npx playwright install chromium`.

## Where things live

| Path | What it is |
| --- | --- |
| `lib/site.ts` | Name, domain, email, social links, résumé path. Change the domain here and canonicals, sitemap, robots and JSON-LD follow. |
| `lib/content.ts` | All copy: projects, architecture flows, case studies, experience, skills, education. |
| `app/page.tsx` | Home page. |
| `app/work/[slug]/` | Case-study pages, generated for every project that has a `caseStudy`. |
| `components/flow-diagram.tsx` | The architecture diagrams (accessible ordered lists, laid out with container queries). |
| `app/globals.css` | Design tokens (light + dark), base styles, layout primitives. |
| `lib/og-card.tsx` | Shared Open Graph image template. |

## Editing content

- **Add a project:** add an entry to `projects` in `lib/content.ts`. Give it a
  `caseStudy` and it gets its own page, sitemap entry and OG image automatically.
- **Diagrams:** each `flow` path is a row. Mark auth/approval/threshold steps with
  `gate: true`; mark literal code identifiers with `code: true`.
- **Rule for copy:** every claim should trace to the résumé, a repository or
  something you can explain in an interview.

## Design notes

Cool paper background, navy ink, one ultramarine accent. Schibsted Grotesk for
text, JetBrains Mono only for literal code. Fonts are self-hosted from
`@fontsource-variable` packages — no third-party requests. The only automatic
motion is the hero's first-load settle, disabled under `prefers-reduced-motion`.
