export type NavigationItem = {
  label: string;
  id: string;
};

export type StoryType = "performance" | "architecture" | "realtime" | "migration" | "ai";

export type EngineeringStory = {
  number: string;
  tag: string;
  title: string;
  summary: string;
  challenge: string;
  approach: string;
  decisions: string[];
  outcome: string;
  type: StoryType;
};

export type Principle = {
  number: string;
  label: string;
};

export type ToolboxGroup = {
  name: string;
  tools: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  stage: string;
  summary: string;
  scope: string;
  systems: string[];
  areas: string[];
};

export type ProjectStatus = "built" | "building" | "live" | "experiment";

export type Project = {
  title: string;
  category: string;
  description: string;
  problem: string;
  build: string;
  engineeringProblem: string;
  decision: string;
  result: string;
  whyBuilt?: string;
  architecture?: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  status: ProjectStatus;
  featured?: boolean;
};

export type EngineeringNote = {
  title: string;
  date: string;
  category: string;
  summary: string;
  readingTime: string;
  articleUrl?: string;
  status: "planned" | "published";
};

export type NowCategory = "building" | "working-on" | "interested-in" | "recently";

export type NowItem = {
  category: NowCategory;
  title: string;
  description: string;
};

export type SystemLayer = {
  label: string;
  description: string;
};

export type Capability = {
  title: string;
  description: string;
};

export const navigation: NavigationItem[] = [
  { label: "Capabilities", id: "capabilities" },
  { label: "Work", id: "work" },
  { label: "Builds", id: "builds" },
  { label: "Thinking", id: "thinking" },
  { label: "Journey", id: "journey" },
  { label: "Toolbox", id: "toolbox" },
  { label: "Now", id: "now" },
  { label: "Contact", id: "contact" }
];

export const systemSteps = ["Hard problem", "Useful trade-off", "Working outcome"];
export const githubUrl = "https://github.com/SantoshThkr";
export const resumeUrl = "/SantoshThakurResume.pdf";
export const hasResume = true;
export const linkedinUrl = "https://www.linkedin.com/in/ithakurr/";
export const emailAddress = "santoshthakurxd@gmail.com";

export const currentFocus = ["Scalable web products", "Application services", "AI-powered applications"];

export const capabilities: Capability[] = [
  { title: "Scalable applications", description: "Interfaces and products that need to stay fast as content, traffic and product surface area grow." },
  { title: "Product platforms", description: "Shared foundations that help several teams ship features without duplicating every decision." },
  { title: "Real-time experiences", description: "Products where state changes continuously and the UI still needs to feel predictable." },
  { title: "APIs and integrations", description: "Application work that connects user flows to services, data and external systems." },
  { title: "Performance", description: "Finding the work users are waiting for and moving everything else out of their way." },
  { title: "AI product experiences", description: "Applications around LLM APIs, streaming responses and structured output." }
];

export const systemLayers: SystemLayer[] = [
  { label: "Product", description: "What needs solving" },
  { label: "Interface", description: "What people use" },
  { label: "Application logic", description: "Behavior and state" },
  { label: "APIs / systems", description: "Services working together" },
  { label: "Data", description: "Information the product needs" },
  { label: "Infrastructure", description: "How it runs and ships" },
  { label: "Intelligent features", description: "Useful automation" }
];

export const mindsetPrinciples: Principle[] = [
  { number: "01", label: "Understand the failure first" },
  { number: "02", label: "Measure the slow part" },
  { number: "03", label: "Keep boundaries clear" },
  { number: "04", label: "Make the next change easier" },
  { number: "05", label: "Check the result in practice" }
];

export const engineeringPrinciples = [
  "Fast software is easier to use and easier to trust.",
  "I measure before I optimize.",
  "A good boundary is often better than another abstraction.",
  "The right solution is the one the team can keep changing."
];

export const experience: Experience[] = [
  {
    company: "Infosys Ltd.",
    role: "Senior Associate Consultant – Frontend Developer",
    period: "November 2025 – April 2026",
    stage: "Enterprise delivery",
    summary: "Worked on enterprise applications where the UI, APIs, testing and delivery pipeline all had to hold up together.",
    scope: "The work crossed application behavior, service integration, accessibility and release confidence.",
    systems: ["Enterprise applications", "REST APIs", "Automated testing", "CI/CD"],
    areas: ["React", "TypeScript", "Redux Toolkit", "Python / Flask", "Playwright", "CI/CD"]
  },
  {
    company: "BagConvergence",
    role: "Software Developer – Frontend Developer",
    period: "March 2021 – November 2025",
    stage: "Scale and complexity",
    summary: "Worked on large React and Next.js products serving millions of daily users. The problems ranged from reusable foundations to micro frontends, real-time updates and Core Web Vitals.",
    scope: "The work grew from shipping features to making decisions about architecture, performance and how teams changed the product.",
    systems: ["Large-scale products", "Micro Frontends", "Real-time systems", "Core Web Vitals"],
    areas: ["React", "Next.js", "Micro Frontends", "GraphQL", "WebSockets", "Performance"]
  },
  {
    company: "ModernVastu Research & Remedy Pvt. Ltd.",
    role: "Front-End Developer",
    period: "April 2019 – March 2020",
    stage: "Product foundations",
    summary: "Built responsive web applications from designs and API contracts, learning what it takes to make a product feel consistent across screens.",
    scope: "This was where the fundamentals of product interfaces, API integration and reusable UI work came together.",
    systems: ["Responsive web applications", "REST APIs", "UI systems"],
    areas: ["React", "JavaScript", "REST APIs", "Responsive UI", "Tailwind CSS", "Material UI"]
  }
];

export const projects: Project[] = [
  {
    title: "InterviewForge",
    category: "AI mock interview platform · InterviewPilot repository",
    description: "An interview platform that uses a candidate's resume and target role to run adaptive mock interviews.",
    problem: "Generic interview prep doesn't adapt to a candidate's actual resume, target role, or weak areas.",
    build: "Resume analysis, role and difficulty selection, five interview modes, eight interviewer personalities, streaming conversations with follow-ups, voice interaction, a Monaco coding round with test execution, anti-cheating detection (focus-loss and copy-paste tracking), interview history and adaptive performance reports.",
    engineeringProblem: "Keeping a multi-turn interview coherent while streaming responses and generating context-aware follow-up questions in real time — and running anti-cheat checks (focus loss, copy-paste detection) alongside that without interrupting the flow.",
    decision: "Split the system into a Next.js frontend and a separate NestJS/Prisma backend so interview state, resume analysis and reporting could evolve independently of the UI. PostgreSQL persists sessions, transcripts and adaptive performance data; OpenAI handles question generation, follow-ups and evaluation.",
    result: "Built. The public repository is available for review.",
    whyBuilt: "I wanted to build interview practice around a candidate's actual background instead of a fixed question list.",
    architecture: ["Resume analysis", "Streaming interview flow", "Coding round", "Reporting and history"],
    technologies: ["Next.js", "TypeScript", "NestJS", "Prisma", "PostgreSQL", "OpenAI", "Clerk"],
    githubUrl: "https://github.com/SantoshThkr/InterviewPilot",
    status: "built",
    featured: true
  },
  {
    title: "OpsAI",
    category: "Independent build · Build",
    description: "A document-to-retrieval system for uploading files, processing them in the background and searching them with RAG.",
    problem: "Teams accumulate documents faster than anyone can search or reason over them; keyword search doesn't understand content.",
    build: "A Next.js web app, FastAPI service and shared TypeScript contracts around document upload, PDF/TXT/Markdown processing, chunking, embeddings and owner-scoped retrieval. JWT authentication with viewer/analyst/admin RBAC gates access, and an authenticated MCP-style JSON-RPC adapter exposes typed, allowlisted tools behind approval gates, idempotent execution and audit logging — built to run locally against deterministic providers, so it doesn't require an OpenAI key to try.",
    engineeringProblem: "Processing uploaded documents into chunked, embedded, owner-scoped retrieval without blocking the request, and building the approval-gated action layer around it — state-changing actions go through an approval gate and get written to an audit log before they run.",
    decision: "PostgreSQL with pgvector keeps retrieval and relational data in one store instead of standing up a separate vector database. Redis backs the background worker queue and rate limiting. Actions are exposed through an MCP-style JSON-RPC adapter with idempotent execution, since an operations tool should be auditable and safe to retry, not just functional.",
    result: "build. Docker Compose, health endpoints and the document processing path are documented in the repository.",
    whyBuilt: "I wanted to follow the document-to-retrieval path end to end, including the worker, the approval-gated action layer and the data boundaries around it.",
    architecture: ["Web / API boundary", "Document processing worker", "Chunking and embeddings", "pgvector retrieval", "RBAC", "MCP-style tool adapter", "Approval gates & audit log"],
    technologies: ["Next.js", "FastAPI", "PostgreSQL", "pgvector", "Redis", "SQLAlchemy", "Docker"],
    githubUrl: "https://github.com/SantoshThkr/ops-ai",
    status: "built",
    featured: true
  },
  {
    title: "MitraAI",
    category: "Experiment · Earlier build",
    description: "An earlier React and Vite experiment around an AI chat interface, themes, chat management and dashboard-style result views.",
    problem: "Exploring how an AI chat product could organize conversations and present results in a usable interface.",
    build: "A React/Vite interface with theme switching, chat management, dashboard and results components, and local-storage-related behavior.",
    engineeringProblem: "A smaller, earlier build than InterviewPilot or OpsAI — working through chat state, theming and result display in a plain React/Vite app before taking on a full-stack build with its own backend.",
    decision: "Kept deliberately simple: a React/Vite frontend calling the OpenAI API directly, with no separate backend. That scope matched what this project was exploring.",
    result: "Earlier build. The repository is available for reference.",
    whyBuilt: "I used this as an earlier experiment to explore the interaction patterns around AI chat.",
    technologies: ["React", "Vite", "JavaScript"],
    githubUrl: "https://github.com/SantoshThkr/MitraAI",
    status: "experiment"
  }
];

export const engineeringNotes: EngineeringNote[] = [
  {
    title: "Tracking down performance problems in a high-traffic app",
    date: "Planned",
    category: "Performance",
    summary: "Draft notes on finding the slow path, protecting the critical path and making performance improvements that users can feel.",
    readingTime: "5 min read",
    status: "planned"
  },
  {
    title: "Where real-time UI gets difficult",
    date: "Planned",
    category: "Real-time systems",
    summary: "Draft notes on ownership, ordering, reconnects and the state decisions behind continuously changing interfaces.",
    readingTime: "6 min read",
    status: "planned"
  },
  {
    title: "When Micro Frontends actually help",
    date: "Planned",
    category: "Architecture",
    summary: "Draft notes on team boundaries, independent delivery and the costs that come with splitting an application.",
    readingTime: "7 min read",
    status: "planned"
  }
];

export const nowItems: NowItem[] = [
  { category: "building", title: "Independent engineering builds", description: "Turning ideas like OpsAI into small, testable product experiments." },
  { category: "working-on", title: "Application services", description: "Working across APIs, data and service boundaries as part of building complete products." },
  { category: "interested-in", title: "AI product experiences", description: "Building applications around LLM APIs, streaming responses, structured outputs and useful workflows." },
  { category: "recently", title: "Performance and architecture", description: "Looking closely at the trade-offs that keep large applications fast and changeable." }
];

export const stories: EngineeringStory[] = [
  {
    number: "01",
    tag: "Scale / performance",
    title: "Finding the work that slows the product down.",
    summary: "On content-heavy products, a fast local build does not tell you much about the real user experience.",
    challenge: "Large pages, mobile networks and third-party dependencies put too much work between a user’s intent and the first useful interaction.",
    approach: "I traced the user journey, measured the slow points and moved non-essential work out of the critical path. The important part was choosing what not to load yet.",
    decisions: ["Render the useful part first", "Load capability on demand", "Use real-user signals"],
    outcome: "A faster experience that holds up beyond the developer laptop and local network.",
    type: "performance"
  },
  {
    number: "02",
    tag: "Architecture / teams",
    title: "Making a growing application easier to change.",
    summary: "As the product grew, small changes started touching too many parts of the application.",
    challenge: "More product surface area and more teams meant that coupling made releases risky and slowed down otherwise simple work.",
    approach: "We looked for boundaries based on ownership and release needs, then kept shared primitives small enough that teams could still make local decisions.",
    decisions: ["Start with ownership", "Share primitives, not everything", "Separate change where it matters"],
    outcome: "Teams had clearer places to work, with less accidental coupling between product areas.",
    type: "architecture"
  },
  {
    number: "03",
    tag: "Real-time / state",
    title: "When live data makes the UI harder to trust.",
    summary: "Real-time features are not only about receiving events; the interface has to make changing state understandable.",
    challenge: "Connection drops, out-of-order updates, stale data and too many events can make a live screen feel unreliable.",
    approach: "I made the path from event to service to state to screen explicit, then designed for reconnects and graceful degradation instead of assuming the connection was perfect.",
    decisions: ["Give events an owner", "Let state recover", "Respect the user’s attention"],
    outcome: "A live interface that stays predictable when the underlying system is not.",
    type: "realtime"
  },
  {
    number: "04",
    tag: "Modernization / risk",
    title: "Modernizing a product without stopping it.",
    summary: "Replacing old parts of a working application is mostly a risk-management problem.",
    challenge: "Hidden dependencies, undocumented behavior and backward compatibility made a rewrite much riskier than it first appeared.",
    approach: "We mapped the seams, added confidence with tests and migrated in thin slices so the product stayed usable while the foundation changed.",
    decisions: ["Map dependencies first", "Migrate in thin slices", "Validate before expanding"],
    outcome: "A safer path to reduce accumulated friction without taking an unnecessary rewrite bet.",
    type: "migration"
  }
];

export const toolbox: ToolboxGroup[] = [
  { name: "Product engineering", tools: "React · Next.js · TypeScript · JavaScript · Angular" },
  { name: "Application architecture", tools: "State management · Component systems · Micro Frontends · Performance" },
  { name: "Systems & integration", tools: "REST APIs · GraphQL · WebSockets · Node.js · Python · Flask" },
  { name: "AI applications", tools: "LLM APIs · Streaming · Structured Outputs · Function Calling" },
  { name: "Quality & delivery", tools: "Testing · Accessibility · CI/CD · Docker · AWS" }
];
