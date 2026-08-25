export const stories = [
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

export const toolbox = [
  ["Interfaces & products", "React · Next.js · TypeScript · JavaScript · Angular · HTML · CSS"],
  ["Architecture & design", "Component systems · State management · Modular architecture · Performance"],
  ["Systems & integration", "REST APIs · GraphQL · WebSockets · Node.js · Python · Flask"],
  ["AI & modern apps", "LLM APIs · Streaming · Structured outputs · Function calling"],
  ["Quality & delivery", "Playwright · Selenium · Accessibility · CI/CD · Docker · AWS"]
];
