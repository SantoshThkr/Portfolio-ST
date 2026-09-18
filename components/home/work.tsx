import Link from "next/link";
import { alsoShipped, layers, projects } from "@/lib/content";
import { ExternalLink } from "../external-link";
import styles from "./work.module.css";

export function Work() {
  return (
    <section id="work" className={styles.work} aria-labelledby="work-title">
      <div className="container">
        <header className={styles.head} data-reveal="">
          <p className="eyebrow">
            <b>02</b> Work
          </p>
          <h2 id="work-title" className="section-title">
            Selected work
          </h2>
          <p className="lede">
            One system in production, two in the open. As each one comes into view, the stack lights up the layers it
            actually touches — and nothing it doesn&apos;t.
          </p>
        </header>

        {projects.map((project, index) => {
          const caseStudyHref = project.caseStudy ? `/work/${project.slug}` : undefined;
          const headingId = `project-${project.slug}`;
          return (
            <article
              key={project.slug}
              className={styles.project}
              data-scene="work"
              data-project={project.slug}
              aria-labelledby={headingId}
            >
              <div className={styles.text}>
                <p className={styles.meta} data-reveal="">
                  <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.status}>{project.status}</span>
                </p>
                <h3
                  id={headingId}
                  className={`display ${styles.name}`}
                  data-reveal=""
                  style={{ "--i": 1, "--chars": project.name.length } as React.CSSProperties}
                >
                  {caseStudyHref ? <Link href={caseStudyHref}>{project.name}</Link> : project.name}
                </h3>
                <p className={styles.tagline} data-reveal="" style={{ "--i": 2 } as React.CSSProperties}>
                  {project.tagline}
                </p>

                <dl className={styles.facts} data-reveal="" style={{ "--i": 3 } as React.CSSProperties}>
                  {project.facts.map(fact => (
                    <div key={fact.label}>
                      <dt>{fact.value}</dt>
                      <dd>{fact.label}</dd>
                    </div>
                  ))}
                </dl>

                <div className={styles.detail} data-reveal="">
                  <p className={styles.summary}>{project.summary}</p>
                  <ul className={styles.highlights}>
                    {project.highlights.map(point => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.layerMap} data-reveal="">
                  <p className="label">Layers touched</p>
                  <dl>
                    {layers.map(layer => {
                      const parts = project.components[layer.id];
                      return (
                        <div key={layer.id} data-empty={parts ? undefined : ""}>
                          <dt>{layer.name}</dt>
                          <dd>{parts ? parts.join(", ") : "—"}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>

                <ul role="list" className="tags" aria-label={`${project.name} stack`}>
                  {project.stack.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className={styles.links}>
                  {caseStudyHref ? (
                    <Link href={caseStudyHref} className="button button-primary">
                      Read the case study<span className="visually-hidden"> for {project.name}</span>
                    </Link>
                  ) : (
                    <p className={styles.private}>Internal system — no public source or demo.</p>
                  )}
                  {project.repo && (
                    <ExternalLink href={project.repo} className="button" arrow={false}>
                      Source<span className="visually-hidden"> for {project.name}</span>
                    </ExternalLink>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        <div className={styles.also} data-scene="quiet" data-reveal="">
          <h3 className={styles.alsoTitle}>Also shipped</h3>
          <dl className={styles.alsoList}>
            {alsoShipped.map(item => (
              <div key={item.name}>
                <dt>{item.name}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
