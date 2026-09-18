import { site } from "@/lib/site";
import { LocalTime } from "../local-time";
import { StackFallback } from "./stack-fallback";
import styles from "./hero.module.css";

const proof = [
  { value: "6+ yrs", label: "of production web engineering" },
  { value: "5 wks", label: "to take a RAG platform from an empty repo to production" },
  { value: "2", label: "open-source AI systems, documented down to their limits" },
];

export function Hero() {
  return (
    <section className={styles.hero} data-scene="hero" aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" />
            <span>
              Based in {site.location.city}, {site.location.country}
              <LocalTime timeZone={site.location.timeZone} prefix=" — " />
            </span>
          </p>

          <h1 id="hero-title" className={`display ${styles.title}`}>
            <span className={styles.line}>
              <span>AI products,</span>
            </span>
            <span className={styles.line}>
              <span>built through</span>
            </span>
            <span className={styles.line}>
              <span>
                every <span className={styles.accent}>layer.</span>
              </span>
            </span>
          </h1>

          <p className={styles.lead}>
            I build the interface, the API, the retrieval pipeline and the model calls between them — and hold all of it
            to the standard of the rest of production: authenticated, streamed, cited and tested.
          </p>

          <div className={styles.actions}>
            <a href="#work" className="button button-primary">
              See the work
            </a>
            <a href="#approach" className="button">
              Follow a request
            </a>
          </div>
        </div>

        <StackFallback className={styles.fallback} />
      </div>

      <div className={`container ${styles.footRow}`}>
        <dl className={styles.proof}>
          {proof.map(item => (
            <div key={item.value}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.scrollCue} aria-hidden="true">
          <span className={styles.cueLine} />
          Scroll
        </p>
      </div>
    </section>
  );
}
