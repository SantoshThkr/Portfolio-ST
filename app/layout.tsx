import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
import { RevealObserver } from "@/components/reveal-observer";
import { SceneRoot } from "@/components/scene/scene-root";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { education, sceneConfig, skills } from "@/lib/content";
import { site } from "@/lib/site";
import { mono, sans } from "./fonts";
import "./globals.css";

// Runs before first paint. `js` says scripts are running; `motion-ok` arms
// the reveal-on-scroll starting states, and only when the visitor hasn't
// asked for reduced motion. Without either class, everything is visible.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-ok')}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: site.name,
  url: site.url,
  image: `${site.url}${site.portrait.src}`,
  email: `mailto:${site.email}`,
  jobTitle: "Full-Stack AI Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.city,
    addressRegion: site.location.region,
    addressCountry: "IN",
  },
  alumniOf: education.map(item => ({ "@type": "CollegeOrUniversity", name: item.school })),
  knowsAbout: skills.flatMap(group => group.items).slice(0, 24),
  sameAs: [site.github, site.linkedin],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${sans.variable} ${mono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="scroll-progress" aria-hidden="true" />
        <SceneRoot config={sceneConfig} />
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
        <JsonLd data={person} />
      </body>
    </html>
  );
}
