import { site } from "@/lib/site";
import { ExternalLink } from "./external-link";
import { LocalTime } from "./local-time";
import { StackMark } from "./stack-mark";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.identity}>
          <StackMark className={styles.mark} />
          <span>
            {site.name} · {site.location.city}, {site.location.country}
            <span className={styles.time}>
              <LocalTime timeZone={site.location.timeZone} prefix=" · " />
            </span>
          </span>
        </p>
        <ul role="list" className={styles.links}>
          <li>
            <a href={`mailto:${site.email}`}>Email</a>
          </li>
          <li>
            <ExternalLink href={site.github}>GitHub</ExternalLink>
          </li>
          <li>
            <ExternalLink href={site.linkedin}>LinkedIn</ExternalLink>
          </li>
          <li>
            <a href={site.resume}>Résumé (PDF)</a>
          </li>
          <li>
            <a href="#main">Back to top</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
