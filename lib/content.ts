/**
 * Portfolio content.
 *
 * Every claim here comes from one of three sources: the résumé in /public,
 * the previous version of this site, or the public GitHub repositories.
 * Keep it that way — if something can't be traced to a source, leave it out.
 */

export type FlowStep = {
  label: string;
  /** Short technical detail shown under the label. */
  detail?: string;
  /** Marks a control point (auth, approval, threshold) so it reads differently. */
  gate?: boolean;
  /** The label is a literal identifier from the code. */
  code?: boolean;
};

export type FlowPath = {
  name: string;
  steps: FlowStep[];
};

export type Decision = {
  title: string;
  body: string;
};

export type CaseStudy = {
  role: string;
  why: string;
  problem: string;
  built: Decision[];
  decisions: Decision[];
  quality?: string[];
  limits: string[];
  table?: { caption: string; columns: [string, string, string]; rows: [string, string, string][] };
};

export type Project = {
  slug: string;
  name: string;
  context: string;
  tagline: string;
  summary: string;
  highlights: string[];
  stack: string[];
  repo?: string;
  flow: FlowPath[];
  flowNote: string;
  caseStudy?: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "contracts-ai",
    name: "Internal Contracts AI",
    context: "Professional work, internal platform",
    tagline: "Question answering over contract documents, with answers that cite the pages they came from.",
    summary:
      "A retrieval-augmented Q&A platform for contracts that I took from an empty repository to production in five weeks. It is internal, so there is no public source or demo — the details below are the ones I can share.",
    highlights: [
      "Answers stream to the browser over server-sent events and carry citations back to specific pages, including answers that draw on several pages.",
      "Documents are indexed asynchronously and deduplicated, so uploads don't block requests and repeated files don't pollute retrieval.",
      "Intent-based routing decides how each question is handled, behind a JWT-secured FastAPI service.",
    ],
    stack: ["Python", "FastAPI", "LangChain", "AWS Bedrock", "Qdrant", "PostgreSQL", "SSE", "JWT"],
    flow: [
      {
        name: "Indexing",
        steps: [
          { label: "Contract upload" },
          { label: "Async indexing job" },
          { label: "Deduplication", gate: true },
          { label: "Chunks + embeddings" },
          { label: "Qdrant" },
        ],
      },
      {
        name: "Answering",
        steps: [
          { label: "Question", detail: "JWT-authenticated", gate: true },
          { label: "Intent routing" },
          { label: "Retrieval", detail: "Qdrant" },
          { label: "Generation", detail: "LangChain + Bedrock" },
          { label: "Streamed answer", detail: "SSE, page citations" },
        ],
      },
    ],
    flowNote: "Simplified. Component names are real; internal details are omitted.",
  },
  {
    slug: "opsai",
    name: "OpsAI",
    context: "Independent project, open source",
    tagline:
      "An operations assistant that answers from your documents and metrics, and can propose actions but never take one without an admin's approval.",
    summary:
      "OpsAI grounds answers in uploaded documents and recorded service metrics, and lets its agent propose incidents through a controlled approval workflow. It runs entirely on local, deterministic providers, so development and CI need no paid model API.",
    highlights: [
      "Owner-scoped RAG over PDF, TXT and Markdown, with a similarity threshold that has to pass before any citation is shown.",
      "The agent can call only four typed, allowlisted tools. A change becomes a proposal; an admin approves it; execution is idempotent and written to an audit log.",
      "Viewer, analyst and admin roles are enforced in the API, never the frontend — including through an authenticated MCP-style JSON-RPC adapter that reuses the same services.",
    ],
    stack: ["Next.js", "TypeScript", "FastAPI", "SQLAlchemy", "PostgreSQL", "pgvector", "Redis", "Docker", "GitHub Actions"],
    repo: "https://github.com/SantoshThkr/ops-ai",
    flow: [
      {
        name: "Ingest",
        steps: [
          { label: "Upload", detail: "PDF, TXT, Markdown" },
          { label: "API validates + stores", detail: "generated storage keys" },
          { label: "Redis job" },
          { label: "Worker", detail: "extract, chunk, embed" },
          { label: "PostgreSQL + pgvector" },
        ],
      },
      {
        name: "Ask",
        steps: [
          { label: "Next.js chat", detail: "SSE" },
          { label: "Auth + rate limit", detail: "JWT cookie, Redis", gate: true },
          { label: "Deterministic agent", detail: "typed intent routing" },
          { label: "Allowlisted tool" },
          { label: "Grounded answer", detail: "thresholded citations", gate: true },
        ],
      },
      {
        name: "Act",
        steps: [
          { label: "create_incident", detail: "proposal only", code: true },
          { label: "Admin approval", detail: "must be unexpired", gate: true },
          { label: "Idempotent execution", detail: "DB locking" },
          { label: "Audit log" },
        ],
      },
    ],
    flowNote: "Matches the architecture documented in the repository.",
    caseStudy: {
      role: "Independent build across the web app, API, worker, data layer and Docker setup.",
      why: "I wanted to follow the document-to-retrieval path end to end — including the background worker, the approval-gated action layer and the data boundaries around them — rather than stop at a chat box on top of an embedding call.",
      problem:
        "Operations teams need answers grounded in internal documents and recorded service data. But the moment an assistant can change something, it needs the same controls as any other operational tool: permissions, approval, auditability and safe retries.",
      built: [
        {
          title: "Web app",
          body: "Next.js, React and TypeScript, with an SSE chat UI that renders streamed answers, citations and approval-required activity.",
        },
        {
          title: "API and worker",
          body: "FastAPI with SQLAlchemy and Alembic migrations. The API owns authentication, validation, authorization, orchestration and persistence. A Redis-backed worker extracts, chunks and embeds documents outside the request cycle.",
        },
        {
          title: "Shared contracts",
          body: "A deliberately small TypeScript package for the types the web app and API agree on.",
        },
        {
          title: "Infrastructure",
          body: "Docker Compose for PostgreSQL with pgvector, Redis, the API, the worker and the web app, plus /health and /ready endpoints for liveness and dependency-aware readiness.",
        },
      ],
      decisions: [
        {
          title: "Deterministic providers by default",
          body: "Local embedding and chat providers are the default, so tests, evaluation and CI are reproducible and don't need an API key. An external embedding provider can be switched on through configuration.",
        },
        {
          title: "One database for relational data and vectors",
          body: "PostgreSQL with pgvector is the system of record for documents, chunks, conversations, metrics, incidents, approvals and audit events. One store means one backup story and one transaction boundary.",
        },
        {
          title: "Typed allowlists instead of open-ended tools",
          body: "Tool names and arguments are validated against an allowlist, which rules out arbitrary tool or SQL routing by construction.",
        },
        {
          title: "Proposal and execution are separate steps",
          body: "Analysts can propose an incident; only an admin can approve and execute it, and only while the approval is unexpired. Database locking and idempotency keys make repeated execution safe.",
        },
        {
          title: "Logs that help an investigation without leaking",
          body: "Structured logs carry request IDs, operation, user, status and durations, and never credentials, tokens, cookies, API keys or document contents.",
        },
        {
          title: "Evaluate behaviour, not invented scores",
          body: "An offline evaluator checks knowledge gating, metrics, the incident lifecycle, idempotency, RBAC and MCP requests, and reports expected versus actual behaviour. It is regression testing, not LLM quality scoring.",
        },
      ],
      quality: [
        "Backend: pytest, Ruff lint and format checks, mypy.",
        "Frontend: Vitest, ESLint, TypeScript and a production Next.js build.",
        "All of it runs in GitHub Actions on every push and pull request, with no paid AI service involved.",
      ],
      limits: [
        "The local provider is deterministic and intentionally limited — it is not a general-purpose LLM.",
        "Incident execution is a persisted local boundary; it doesn't integrate with external ticketing or cloud operations systems.",
        "Deployment, secret management, TLS, backups, scaling and production monitoring are left to the hosting environment.",
        "The JSON-RPC endpoint is an MCP-style adapter, not a standards-certified MCP server.",
      ],
      table: {
        caption: "The four tools the agent can call",
        columns: ["Tool", "Purpose", "Changes state?"],
        rows: [
          ["search_knowledge", "Owner-scoped document retrieval", "No"],
          ["get_metric", "Read an allowlisted recorded metric", "No"],
          ["get_incident", "Read an incident the user is authorized to see", "No"],
          ["create_incident", "Create a proposal that needs approval", "Proposal only"],
        ],
      },
    },
  },
  {
    slug: "interviewpilot",
    name: "InterviewPilot",
    context: "Independent project, open source",
    tagline: "Mock interviews built from your own résumé, streamed in real time, with a coding round and a scored report.",
    summary:
      "Upload a résumé, choose a role, difficulty and interviewer style, and InterviewPilot runs a streaming interview that follows up on your answers. It ends with a report, and the weak areas it finds feed into your next session.",
    highlights: [
      "A NestJS and Prisma API separate from the Next.js app; interviewer replies stream back over server-sent events.",
      "Résumé analysis and reports use JSON-mode structured output, stored in PostgreSQL alongside transcripts and per-user weak areas.",
      "A Monaco coding round runs JavaScript and TypeScript against test cases in a node:vm context with a 250 ms timeout and a blocklist for unsafe APIs.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Clerk", "NestJS", "Prisma", "PostgreSQL", "OpenAI API"],
    repo: "https://github.com/SantoshThkr/InterviewPilot",
    flow: [
      {
        name: "Setup",
        steps: [
          { label: "Résumé upload", detail: "PDF, DOCX, TXT" },
          { label: "Text extraction" },
          { label: "Résumé analysis", detail: "JSON output" },
          { label: "Interview config", detail: "role, type, difficulty, style" },
        ],
      },
      {
        name: "Interview",
        steps: [
          { label: "Answer", detail: "typed or spoken" },
          { label: "NestJS API", detail: "Clerk auth guard", gate: true },
          { label: "Prompt", detail: "history + résumé context" },
          { label: "OpenAI stream" },
          { label: "SSE to browser", detail: "follow-up question" },
        ],
      },
      {
        name: "Report",
        steps: [
          { label: "Complete interview" },
          { label: "Structured evaluation", detail: "JSON output" },
          { label: "Report + weak areas", detail: "PostgreSQL" },
          { label: "Next session's topics" },
        ],
      },
    ],
    flowNote: "Matches the NestJS modules and endpoints in the repository.",
    caseStudy: {
      role: "Independent build across the Next.js app, NestJS API and PostgreSQL schema.",
      why: "I wanted interview practice built around a candidate's actual background instead of a fixed question list.",
      problem:
        "Generic interview prep doesn't adapt to a candidate's résumé, target role or weak areas. Practice is most useful when the questions come from what you've actually done, and when the next session knows where the last one went badly.",
      built: [
        {
          title: "Interview flow",
          body: "Five interview types (technical, HR, behavioural, managerial and mixed), eight interviewer personalities, and streamed follow-up questions that use the conversation history and résumé context.",
        },
        {
          title: "Voice mode",
          body: "Speech-to-text and text-to-speech through the browser's speech APIs, so an interview can be spoken rather than typed.",
        },
        {
          title: "Coding round",
          body: "A Monaco editor with problems and test cases, executed server-side for JavaScript and TypeScript.",
        },
        {
          title: "Integrity signals",
          body: "Focus loss and copy/paste events are detected during the interview and surfaced as warnings.",
        },
        {
          title: "Reports and progress",
          body: "Scored reports with a learning roadmap, interview history, and a dashboard with scores, streaks and a practice plan.",
        },
      ],
      decisions: [
        {
          title: "A separate backend",
          body: "The Next.js frontend and the NestJS/Prisma backend are separate services, so interview state, résumé analysis and reporting can evolve independently of the UI.",
        },
        {
          title: "Streaming over SSE",
          body: "The answer endpoint responds as an event stream and writes each token delta as it arrives. The interviewer starts replying immediately, and the full text is persisted once the stream ends.",
        },
        {
          title: "Structured output where the app needs data",
          body: "Résumé analysis and reports request JSON output, because the app stores and renders them as fields — scores, strengths, weaknesses — not as prose.",
        },
        {
          title: "Weak areas carry forward",
          body: "Weaknesses from each report are stored per user and merged into the topics of the next interview, which is what makes the practice adaptive rather than random.",
        },
      ],
      limits: [
        "Code execution uses node:vm with pattern checks and a short timeout. That is reasonable for a practice tool running JavaScript and TypeScript, but it is not a hardened sandbox — Judge0 or Piston integration for other languages is on the roadmap.",
        "Also on the roadmap: fullscreen exam mode, WebRTC video, company-specific question banks and peer mock interviews.",
      ],
    },
  },
];

export const otherWork = [
  {
    name: "AI chat platform",
    body: "Chat interfaces on OpenAI APIs with streamed responses, reusable React components, secure REST integration and prompt work to improve answer quality.",
  },
  {
    name: "Headless CMS entertainment platform",
    body: "A Next.js front end on WordPress VIP, with automated content workflows, optimized image delivery and SEO.",
  },
];

export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  /** ISO dates for <time> elements. */
  startIso: string;
  endIso: string;
  summary: string;
  points: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "Infosys",
    title: "Senior Associate Consultant",
    start: "Nov 2025",
    end: "Apr 2026",
    startIso: "2025-11",
    endIso: "2026-04",
    summary: "Enterprise applications across React, Python and AI-enabled workflows.",
    points: [
      "Built enterprise applications with React, TypeScript, Python and FastAPI, and integrated them with REST APIs and backend services.",
      "Worked with RAG, document processing and vector search patterns for enterprise use cases.",
      "Added automated testing with Playwright and Selenium, and improved performance, accessibility and reliability.",
    ],
    stack: ["React", "Next.js", "TypeScript", "FastAPI", "OpenAI", "RAG", "Playwright"],
  },
  {
    company: "BagConvergence",
    title: "Software Developer",
    start: "Mar 2021",
    end: "Nov 2025",
    startIso: "2021-03",
    endIso: "2025-11",
    summary: "High-traffic React and Next.js products, from shared foundations to real-time systems.",
    points: [
      "Built and maintained React and Next.js applications serving 5M+ daily users across multiple products.",
      "Built reusable component libraries and micro frontends so business modules could be developed and deployed independently.",
      "Built WebSocket-based real-time dashboards supporting 200K+ concurrent users.",
      "Improved application performance by over 50% with code splitting, lazy loading, memoization, caching and image optimization, and reached mobile performance scores above 90.",
      "Integrated GraphQL and REST APIs, and contributed to Python backend integrations, Docker-based services, AWS deployments and CI/CD pipelines.",
    ],
    stack: ["React", "Next.js", "TypeScript", "GraphQL", "WebSockets", "Micro frontends", "AWS"],
  },
  {
    company: "ModernVastu Research & Remedy",
    title: "Front-End Developer",
    start: "Apr 2019",
    end: "Mar 2020",
    startIso: "2019-04",
    endIso: "2020-03",
    summary: "Where the product fundamentals came together.",
    points: ["Built responsive React applications with Tailwind CSS and Material UI, integrated with REST APIs."],
    stack: ["React", "JavaScript", "Tailwind CSS", "Material UI"],
  },
];

export const education = [
  { degree: "Master of Computer Applications", school: "Maharaja Agrasen Himalayan Garhwal University", years: "2020–2022" },
  { degree: "Bachelor of Computer Applications", school: "IEC University", years: "2015–2018" },
];

export type SkillGroup = {
  name: string;
  items: string[];
  evidence: string;
};

export const skills: SkillGroup[] = [
  {
    name: "AI and LLM applications",
    items: ["OpenAI API", "AWS Bedrock", "Azure OpenAI", "LangChain", "RAG", "Embeddings", "Structured outputs", "Function calling", "Streaming (SSE)"],
    evidence: "Contracts AI in production; OpsAI and InterviewPilot in the open.",
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Redux Toolkit", "GraphQL / Apollo", "Micro frontends", "Storybook", "Tailwind CSS", "Angular"],
    evidence: "Nearly five years of high-traffic React and Next.js at BagConvergence.",
  },
  {
    name: "Backend and APIs",
    items: ["Python", "FastAPI", "Flask", "Node.js", "NestJS", "REST", "GraphQL", "WebSockets", "JWT"],
    evidence: "FastAPI for OpsAI and Contracts AI; NestJS for InterviewPilot.",
  },
  {
    name: "Data and retrieval",
    items: ["PostgreSQL", "pgvector", "Qdrant", "Azure AI Search", "Redis", "MongoDB", "SQLAlchemy", "Prisma"],
    evidence: "Qdrant in Contracts AI; pgvector in OpsAI.",
  },
  {
    name: "Cloud and delivery",
    items: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "GitHub Actions"],
    evidence: "Docker, AWS deployments and CI/CD pipelines across roles.",
  },
  {
    name: "Quality",
    items: ["Playwright", "Jest", "React Testing Library", "Vitest", "pytest", "Selenium", "Accessibility", "Core Web Vitals"],
    evidence: "Mobile performance scores above 90 on high-traffic products.",
  },
];

/**
 * The hero's metrics ledger. Each number is stated elsewhere in this file
 * (experience points, the Contracts AI summary) — this just gives the
 * three strongest ones a typographic moment of their own.
 */
export const metrics = [
  {
    value: "5M+",
    unit: "daily users",
    detail: "React and Next.js applications built and maintained in production.",
  },
  {
    value: "200K+",
    unit: "concurrent users",
    detail: "WebSocket-based real-time dashboards, built to run at that scale.",
  },
  {
    value: "5",
    unit: "weeks",
    detail: "From an empty repository to production for a RAG platform on contracts.",
  },
] as const;

/**
 * One signature diagram for the hero, built from the same six groups as
 * `skills` below — read as a pipeline instead of a list. Quality closes it
 * as a gate, the same way auth and approvals gate the project diagrams:
 * nothing here ships without it.
 */
export const capabilityFlow: FlowPath[] = [
  {
    name: "",
    steps: [
      { label: "Interface", detail: "React, Next.js" },
      { label: "APIs", detail: "FastAPI, NestJS" },
      { label: "Retrieval", detail: "pgvector, Qdrant" },
      { label: "Intelligence", detail: "Bedrock, RAG" },
      { label: "Infrastructure", detail: "AWS, Docker" },
      { label: "Quality", detail: "Playwright, pytest", gate: true },
    ],
  },
];

export const principles = [
  {
    title: "Measure before optimizing.",
    body: "On performance work I trace the user journey, measure the slow points and move everything non-essential out of the critical path.",
  },
  {
    title: "Keep the model away from permissions.",
    body: "In OpsAI the API decides who can do what. The agent can only propose; people approve.",
  },
  {
    title: "Make AI behaviour testable.",
    body: "Deterministic providers mean the same input gives the same output, so CI can check behaviour on every push.",
  },
  {
    title: "Build what the team can keep changing.",
    body: "A clear boundary is usually worth more than another abstraction — micro frontends and separate services, where they earn their keep.",
  },
];

export function getProject(slug: string) {
  return projects.find(project => project.slug === slug);
}

export const caseStudies = projects.filter(
  (project): project is Project & { caseStudy: CaseStudy } => project.caseStudy !== undefined,
);
