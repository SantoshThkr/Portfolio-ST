export type NavigationItem = {
  label: string;
  id: string;
};

export type StoryType = "performance" | "architecture" | "realtime" | "migration";

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

export type Exploration = {
  number: string;
  title: string;
  description: string;
};

export const navigation: NavigationItem[] = [
  { label: "Work", id: "work" },
  { label: "Thinking", id: "thinking" },
  { label: "Journey", id: "journey" },
  { label: "Toolbox", id: "toolbox" },
  { label: "Now", id: "now" },
  { label: "Contact", id: "contact" }
];

export const systemSteps = ["Complex problem", "Engineering thinking", "Simple outcome"];

export const mindsetPrinciples: Principle[] = [
  { number: "01", label: "Understand before changing" },
  { number: "02", label: "Find the real bottleneck" },
  { number: "03", label: "Simplify complexity" },
  { number: "04", label: "Design for change" },
  { number: "05", label: "Validate the outcome" }
];

export const engineeringPrinciples = [
  "Performance is part of the product.",
  "Measure before optimizing.",
  "Good abstractions reduce complexity.",
  "AI can accelerate development, but judgment still matters."
];

export const explorations: Exploration[] = [
  {
    number: "01",
    title: "Backend systems",
    description: "Going deeper into APIs, data, server-side architecture and how complete systems work."
  },
  {
    number: "02",
    title: "AI-powered applications",
    description: "Exploring LLM APIs, streaming, structured outputs and useful AI workflows."
  },
  {
    number: "03",
    title: "Modern engineering",
    description: "Learning how architecture and development practices evolve as applications become more intelligent."
  }
];

export const stories: EngineeringStory[] = [
  {
    number: "01",
    tag: "Scale / performance",
    title: "When every millisecond is part of the product.",
    summary: "Making content-heavy, high-traffic experiences feel immediate without trading away capability.",
    challenge: "Large audiences, rich pages, mobile networks and third-party dependencies created a fragile path from intent to interaction.",
    approach: "I treat performance as a product constraint: map the user journey, measure the slowest moments, then remove work from the critical path.",
    decisions: ["Render less, earlier", "Load capability on demand", "Measure real-user outcomes"],
    outcome: "A faster, calmer experience that holds up under real traffic—not just a fast local demo.",
    type: "performance"
  },
  {
    number: "02",
    tag: "Architecture / teams",
    title: "Systems that scale with the people changing them.",
    summary: "Turning a growing application into clear domains without mistaking a pattern for a solution.",
    challenge: "As product surface area and teams grew, coupling made even small changes risky and slowed delivery.",
    approach: "Find the boundaries first. Modular architecture is useful when it follows ownership, release needs and domain language—not because it sounds modern.",
    decisions: ["Boundaries before abstractions", "Shared primitives, local decisions", "Independent change where it matters"],
    outcome: "A codebase that communicates intent and gives teams room to move safely.",
    type: "architecture"
  },
  {
    number: "03",
    tag: "Real-time / state",
    title: "Keeping a moving system understandable.",
    summary: "Designing responsive interfaces when the underlying truth changes continuously.",
    challenge: "Live data creates a different class of UI problem: connection health, ordering, stale state and update volume all matter at once.",
    approach: "Make the event path explicit—from source to service to state to screen—then design for reconnects and graceful degradation.",
    decisions: ["Events with a clear owner", "State that can recover", "Updates that respect attention"],
    outcome: "Interfaces that feel live while remaining predictable, readable and resilient.",
    type: "realtime"
  },
  {
    number: "04",
    tag: "Modernization / risk",
    title: "Improving what already works.",
    summary: "Modernizing complex applications without breaking the trust built into them.",
    challenge: "Legacy systems rarely offer a clean starting line. Dependencies, hidden behavior and backward compatibility make a rewrite a risky shortcut.",
    approach: "Understand the seams, establish confidence with tests, then move incrementally—keeping the product working at every step.",
    decisions: ["Map dependencies", "Migrate in thin slices", "Validate before expanding"],
    outcome: "Less accumulated friction and a safer path to the next change.",
    type: "migration"
  }
];

export const toolbox: ToolboxGroup[] = [
  { name: "Interfaces & products", tools: "React · Next.js · TypeScript · JavaScript · Angular · HTML · CSS" },
  { name: "Architecture & design", tools: "Component systems · State management · Modular architecture · Performance" },
  { name: "Systems & integration", tools: "REST APIs · GraphQL · WebSockets · Node.js · Python · Flask" },
  { name: "AI & modern apps", tools: "LLM APIs · Streaming · Structured outputs · Function calling" },
  { name: "Quality & delivery", tools: "Playwright · Selenium · Accessibility · CI/CD · Docker · AWS" }
];
