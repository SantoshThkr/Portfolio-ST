import { anatomy, layers } from "@/lib/content";
import styles from "./anatomy.module.css";

const layerName = (id: string) => (id === "quality" ? "Quality, around everything" : layers.find(l => l.id === id)?.name ?? id);

/**
 * Scroll drives a request through the stack. The steps are an ordinary
 * ordered list — readable top to bottom without the 3D — and the scene
 * follows along as each one reaches the middle of the screen.
 */
export function Anatomy() {
  return (
    <section id="approach" className={styles.anatomy} data-scene="anatomy" aria-labelledby="anatomy-title">
      <div className="container">
        <header className={styles.head} data-reveal="">
          <p className="eyebrow">
            <b>01</b> Anatomy
          </p>
          <h2 id="anatomy-title" className="section-title">
            Anatomy of an AI request
          </h2>
          <p className="lede">
            Most of the work in an AI feature isn&apos;t the model call. Scroll to follow one question through the layers
            I build — each step names the project where I built it.
          </p>
        </header>

        <ol className={styles.steps} data-steps="">
          {anatomy.map((step, index) => (
            <li key={step.title} className={styles.step} data-step={index}>
              <div className={styles.card}>
                <p className={styles.meta}>
                  <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
                  <span>{layerName(step.layer)}</span>
                </p>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
                <p className={styles.seen}>
                  <span className="label">Built in</span> {step.seenIn.join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
