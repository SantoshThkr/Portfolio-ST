import Link from "next/link";
import type { Project } from "@/lib/content";
import { ExternalLink } from "./external-link";
import { FlowDiagram } from "./flow-diagram";
import styles from "./project-entry.module.css";

export function ProjectEntry({ project }: { project: Project }) {
  const caseStudyHref = project.caseStudy ? `/work/${project.slug}` : undefined;
  const headingId = `project-${project.slug}`;

  return (
    <article className={styles.entry} aria-labelledby={headingId}>
      <header className={styles.header}>
        <p className={styles.context}>{project.context}</p>
        <h3 id={headingId} className={styles.name}>
          {caseStudyHref ? <Link href={caseStudyHref}>{project.name}</Link> : project.name}
        </h3>
        <p className={styles.tagline}>{project.tagline}</p>
      </header>

      <div className={styles.body}>
        <p className={styles.summary}>{project.summary}</p>
        <ul className={styles.highlights}>
          {project.highlights.map(point => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>

      <FlowDiagram paths={project.flow} title={`${project.name} architecture`} note={project.flowNote} compact />

      <footer className={styles.footer}>
        <ul role="list" className="tags" aria-label={`${project.name} stack`}>
          {project.stack.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {(caseStudyHref || project.repo) && (
          <div className={styles.links}>
            {caseStudyHref && (
              <Link href={caseStudyHref} className="button button-primary">
                Read the {project.name} case study
              </Link>
            )}
            {project.repo && (
              <ExternalLink href={project.repo} className="button button-secondary">
                Source on GitHub
              </ExternalLink>
            )}
          </div>
        )}
      </footer>
    </article>
  );
}
