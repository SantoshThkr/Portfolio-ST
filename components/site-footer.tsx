import { site } from "@/lib/site";
import { ExternalLink } from "./external-link";
import { NodeMark } from "./node-mark";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.identity}>
          <NodeMark className={styles.mark} />
          {site.name}, {site.location.city}, {site.location.country}
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
            <a href="#main" className={styles.top}>
              Back to top
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
