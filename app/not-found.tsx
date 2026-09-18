import type { Metadata } from "next";
import Link from "next/link";

// Next.js adds `noindex` to 404 responses itself.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="container" style={{ paddingBlock: "clamp(4rem, 12vw, 8rem)" }} aria-labelledby="nf-title">
      <h1 id="nf-title" style={{ fontSize: "var(--step-4)", letterSpacing: "-0.035em" }}>
        This page doesn&apos;t exist.
      </h1>
      <p className="muted" style={{ marginTop: "1rem", maxWidth: "48ch", fontSize: "var(--step-1)" }}>
        The link may be out of date. The work, experience and contact details are all on the home page.
      </p>
      <p style={{ marginTop: "2rem" }}>
        <Link href="/" className="button button-primary">
          Go to the home page
        </Link>
      </p>
    </section>
  );
}
