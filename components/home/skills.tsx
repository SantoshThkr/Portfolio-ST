import { skills } from "@/lib/content";
import styles from "./skills.module.css";

export function Skills() {
  return (
    <section id="skills" className={styles.skills} data-scene="skills" aria-labelledby="skills-title">
      <div className="container">
        <header className={styles.head} data-reveal="">
          <p className="eyebrow">
            <b>04</b> Skills
          </p>
          <h2 id="skills-title" className="section-title">
            Skills, layer by layer
          </h2>
          <p className="lede">
            The same stack, read as a toolkit — each layer with the tools I use there and where I&apos;ve used them.
            Quality isn&apos;t a layer; it wraps all of them.
          </p>
        </header>

        <ul role="list" className={styles.rows}>
          {skills.map((group, index) => (
            <li key={group.name} className={styles.row} data-layer={group.layer} data-reveal="" style={{ "--i": index } as React.CSSProperties}>
              <p className={styles.index}>{group.layer === "quality" ? "∞" : String(index + 1).padStart(2, "0")}</p>
              <div>
                <h3 className={styles.name}>{group.name}</h3>
                <p className={styles.items}>{group.items.join(" · ")}</p>
                <p className={styles.evidence}>{group.evidence}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
