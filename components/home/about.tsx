import { about, education, principles } from "@/lib/content";
import { site } from "@/lib/site";
import { LocalTime } from "../local-time";
import { DepthPortrait } from "./depth-portrait";
import styles from "./about.module.css";

export function About() {
  return (
    <section id="about" className={styles.about} data-scene="quiet" aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <figure className={styles.portrait} data-reveal="">
          <DepthPortrait />
          <figcaption className={styles.caption}>
            <span>{site.name}</span>
            <span>
              {site.location.city}, IN · 28.54° N, 77.39° E
              <LocalTime timeZone={site.location.timeZone} prefix=" · " />
            </span>
          </figcaption>
        </figure>

        <div className={styles.text}>
          <header className={styles.head} data-reveal="">
            <p className="eyebrow">
              <b>05</b> About
            </p>
            <h2 id="about-title" className="section-title">
              Front end first. Then all the way down.
            </h2>
          </header>

          <div className={styles.story} data-reveal="">
            {about.map(paragraph => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.block}>
            <h3 className="label">How I work</h3>
            <ol role="list" className={styles.principles}>
              {principles.map((item, index) => (
                <li key={item.title} data-reveal="" style={{ "--i": index } as React.CSSProperties}>
                  <span className={styles.pIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <h4 className={styles.pTitle}>{item.title}</h4>
                  <p className={styles.pBody}>{item.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.block} data-reveal="">
            <h3 className="label">Education</h3>
            <ul role="list" className={styles.education}>
              {education.map(item => (
                <li key={item.degree}>
                  <span className={styles.degree}>{item.degree}</span>
                  <span className={styles.school}>
                    {item.school}, {item.years}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
