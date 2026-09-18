import { site } from "@/lib/site";
import { CopyEmail } from "../copy-email";
import { ExternalLink } from "../external-link";
import styles from "./contact.module.css";

export function Contact() {
  return (
    <section id="contact" className={styles.contact} data-scene="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className={styles.inner}>
          <p className="eyebrow" data-reveal="">
            <b>06</b> Contact
          </p>
          <h2 id="contact-title" className={`display ${styles.title}`} data-reveal="">
            Have a system that needs every layer?
          </h2>
          <p className={styles.lead} data-reveal="">
            I&apos;m open to conversations about full-stack and AI engineering work. Email is the quickest way to reach
            me.
          </p>
          <div className={styles.emailRow} data-reveal="">
            <a href={`mailto:${site.email}`} className={styles.email}>
              {site.email}
            </a>
            <CopyEmail email={site.email} />
          </div>
          <ul role="list" className={styles.links} data-reveal="">
            <li>
              <ExternalLink href={site.linkedin} className="button" arrow={false}>
                LinkedIn
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={site.github} className="button" arrow={false}>
                GitHub
              </ExternalLink>
            </li>
            <li>
              <a href={site.resume} className="button">
                Résumé (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
