import type { CSSProperties } from "react";
import type { FlowPath } from "@/lib/content";
import styles from "./flow-diagram.module.css";

type FlowDiagramProps = {
  paths: FlowPath[];
  title: string;
  note: string;
  /** Compact mode hides step details; used on the home page. */
  compact?: boolean;
};

export function FlowDiagram({ paths, title, note, compact = false }: FlowDiagramProps) {
  const hasGates = paths.some(path => path.steps.some(step => step.gate));
  // Every row shares one column grid so steps line up like a drawing.
  const columns = Math.max(...paths.map(path => path.steps.length));

  return (
    <figure className={styles.figure} data-compact={compact} style={{ "--columns": columns } as CSSProperties}>
      <div className={styles.paths}>
        {paths.map(path => (
          <div key={path.name} className={styles.path}>
            <p className={styles.pathName} id={pathId(title, path.name)}>
              {path.name}
            </p>
            <ol className={styles.steps} role="list" aria-labelledby={pathId(title, path.name)}>
              {path.steps.map(step => (
                <li key={step.label} className={styles.step} data-gate={step.gate ? "true" : undefined}>
                  <span className={styles.label}>{step.code ? <code>{step.label}</code> : step.label}</span>
                  {step.detail && !compact && <span className={styles.detail}>{step.detail}</span>}
                  {step.gate && <span className="visually-hidden"> (control point)</span>}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <figcaption className={styles.caption}>
        <span className="visually-hidden">{title}. </span>
        {hasGates && (
          <span className={styles.legend}>
            <span className={styles.swatch} aria-hidden="true" /> Control points: auth, thresholds, approvals.
          </span>
        )}{" "}
        <span>{note}</span>
      </figcaption>
    </figure>
  );
}

function pathId(title: string, name: string) {
  return `flow-${title}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
