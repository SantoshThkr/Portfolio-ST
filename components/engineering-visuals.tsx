"use client";

import { m, useReducedMotion } from "framer-motion";
import { useState } from "react";

const systemLayers = [
  ["Interface", "What people use", "React / Next.js", "InterviewPilot"],
  ["Application", "Behavior and state", "TypeScript / services", "InterviewPilot"],
  ["APIs", "Systems working together", "FastAPI / NestJS", "OpsAI + InterviewPilot"],
  ["Data", "Information the product needs", "PostgreSQL / pgvector", "OpsAI"],
  ["Infrastructure", "How it runs and ships", "Redis / Docker / CI", "OpsAI"],
  ["AI", "Useful automation", "LLM workflows", "OpsAI + InterviewPilot"]
] as const;

const projectPipelines = {
  InterviewPilot: ["Resume", "Interview engine", "Context", "LLM", "Streaming", "Follow-up", "Evaluation"],
  OpsAI: ["Upload", "Processing", "Chunking", "Embeddings", "pgvector", "Retrieval"]
} as const;

export function WorkflowVisual() {
  const reducedMotion = useReducedMotion() ?? false;
  const stages = ["Diagnose", "Measure", "Decide", "Build", "Validate"];

  return <div className="workflow-visual" aria-label="Engineering workflow">
    <div className="workflow-line" aria-hidden="true" />
    {stages.map((stage, index) => <m.div key={stage} className="workflow-stage" initial={reducedMotion ? false : { opacity: 0, y: 10 }} whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: index * 0.08 }}>
      <span className="workflow-number">0{index + 1}</span>
      <strong>{stage}</strong>
      <span>{["Find the failure", "Measure the slow part", "Make the trade-off", "Ship the change", "Check it in practice"][index]}</span>
    </m.div>)}
  </div>;
}

export function ProjectPipeline({ project }: { project: "InterviewPilot" | "OpsAI" }) {
  const reducedMotion = useReducedMotion() ?? false;
  const stages = projectPipelines[project];
  return <div className="project-pipeline" aria-label={`${project} system flow`}>
    {stages.map((stage, index) => <m.div key={stage} className="pipeline-node" initial={reducedMotion ? false : { opacity: 0, x: -10 }} whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: index * 0.06 }}>
      <span>{stage}</span>
      {index < stages.length - 1 && <i aria-hidden="true">→</i>}
    </m.div>)}
  </div>;
}

export function ActionPipeline() {
  return <div className="action-pipeline" aria-label="OpsAI approval workflow">
    {["Pending", "Approved", "Executed", "Audited"].map((stage, index) => <div key={stage}><span className={`action-dot action-dot-${index}`} /><strong>{stage}</strong>{index < 3 && <i aria-hidden="true">→</i>}</div>)}
  </div>;
}

export function SystemMap() {
  const [active, setActive] = useState(0);
  const current = systemLayers[active];
  const reducedMotion = useReducedMotion() ?? false;

  return <div className="system-map">
    <div className="system-map-rail" aria-hidden="true" />
    <div className="system-map-nodes">
      {systemLayers.map(([label, description], index) => <m.button key={label} type="button" className={`system-map-node ${active === index ? "is-active" : ""}`} onClick={() => setActive(index)} onFocus={() => setActive(index)} whileHover={reducedMotion ? undefined : { y: -3 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }}>
        <span>{label}</span><small>{description}</small>
      </m.button>)}
    </div>
    <div className="system-map-detail" aria-live="polite">
      <div><span className="eyebrow">Selected layer</span><strong>{current[0]}</strong></div>
      <p>{current[1]} through {current[2]}.</p>
      <span className="system-map-project">Seen in {current[3]}</span>
    </div>
  </div>;
}
