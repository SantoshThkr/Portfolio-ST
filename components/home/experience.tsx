import { experience, metrics } from "@/lib/content";
import styles from "./experience.module.css";

export function Experience() {
  return (
    <section id="experience" className={styles.experience} data-scene="quiet" aria-labelledby="experience-title">
      <div className="container">
        <header className={styles.head} data-reveal="">
          <p className="eyebrow">
            <b>03</b> Experience
          </p>
          <h2 id="experience-title" className="section-title">
            Six years in production
          </h2>
          <p className="lede">
            From high-traffic React products to enterprise AI work. The numbers first, then where they came from.
          </p>
        </header>

        <dl className={styles.metrics}>
          {metrics.map((metric, index) => (
            <div key={metric.label} data-reveal="" style={{ "--i": index } as React.CSSProperties}>
              <dt>{metric.value}</dt>
              <dd>
                <span className={styles.metricLabel}>{metric.label}</span>
                <span className={styles.metricContext}>{metric.context}</span>
              </dd>
            </div>
          ))}
        </dl>

        <ol role="list" className={styles.roles}>
          {experience.map(role => (
            <li key={role.company} className={styles.role} data-reveal="">
              <p className={styles.period}>
                <time dateTime={role.startIso}>{role.start}</time>
                <span aria-hidden="true"> — </span>
                <span className="visually-hidden"> to </span>
                <time dateTime={role.endIso}>{role.end}</time>
              </p>
              <div className={styles.body}>
                <h3 className={styles.company}>{role.company}</h3>
                <p className={styles.title}>{role.title}</p>
                <p className={styles.summary}>{role.summary}</p>
                <ul className={styles.points}>
                  {role.points.map(point => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ul role="list" className="tags" aria-label={`${role.company} stack`}>
                  {role.stack.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
