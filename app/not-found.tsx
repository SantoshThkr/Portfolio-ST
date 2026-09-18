import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

// Next.js adds `noindex` to 404 responses itself.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className={styles.notFound} data-scene="contact" aria-labelledby="nf-title">
      <div className="container">
        <p className="eyebrow">
          <b>404</b> Missing layer
        </p>
        <h1 id="nf-title" className={`display ${styles.title}`}>
          This page doesn&apos;t exist.
        </h1>
        <p className={styles.lead}>
          The link may be out of date. The work, experience and contact details are all on the home page.
        </p>
        <p className={styles.actions}>
          <Link href="/" className="button button-primary">
            Go to the home page
          </Link>
        </p>
      </div>
    </section>
  );
}
