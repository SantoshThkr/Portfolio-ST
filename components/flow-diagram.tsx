import type { CSSProperties } from "react";
import type { FlowPath } from "@/lib/content";
import styles from "./flow-diagram.module.css";

type FlowDiagramProps = {
  paths: FlowPath[];
  title: string;
  note: string;
  /** Compact mode collapses step details behind hover/focus; used on the home page. */
  compact?: boolean;
  /** Hides the per-path name label — for a single unnamed path, like the hero's. */
  hidePathNames?: boolean;
  gateLabel?: string;
};

export function FlowDiagram({
  paths,
  title,
  note,
  compact = false,
  hidePathNames = false,
  gateLabel = "Control points: auth, thresholds, approvals.",
}: FlowDiagramProps) {
  const hasGates = paths.some(path => path.steps.some(step => step.gate));
  // Every row shares one column grid so steps line up like a drawing.
  const columns = Math.max(...paths.map(path => path.steps.length));

  return (
    <figure className={styles.figure} data-compact={compact} style={{ "--columns": columns } as CSSProperties}>
      <div className={styles.paths}>
        {paths.map(path => (
          <div key={path.name} className={styles.path}>
            {!hidePathNames && (
              <p className={styles.pathName} id={pathId(title, path.name)}>
                {path.name}
              </p>
            )}
            <ol
              className={styles.steps}
              role="list"
              aria-label={hidePathNames ? title : undefined}
              aria-labelledby={hidePathNames ? undefined : pathId(title, path.name)}
            >
              {path.steps.map(step => (
                <li
                  key={step.label}
                  className={styles.step}
                  data-gate={step.gate ? "true" : undefined}
                  tabIndex={compact && step.detail ? 0 : undefined}
                >
                  <span className={styles.label}>{step.code ? <code>{step.label}</code> : step.label}</span>
                  {step.detail && (
                    <span className={compact ? styles.detailCompact : styles.detail}>{step.detail}</span>
                  )}
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
            <span className={styles.swatch} aria-hidden="true" /> {gateLabel}
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
