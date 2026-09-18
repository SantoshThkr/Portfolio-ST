import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { education, skills } from "@/lib/content";
import { site } from "@/lib/site";
import { mono, sans, sansItalic } from "./fonts";
import "./globals.css";

// Arms scroll-reveal before first paint — but only when JS actually runs
// and the OS has not asked for reduced motion. See the `.reveal` rules in
// globals.css: without this class, every `.reveal` element is fully
// visible, so nothing can ever depend on this script to be seen.
const armRevealScript = `if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('reveal-armed')}`;

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1522" },
  ],
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: site.name,
  url: site.url,
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
    <html lang="en-IN" className={`${sans.variable} ${sansItalic.variable} ${mono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: armRevealScript }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="scroll-progress" aria-hidden="true" />
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={person} />
      </body>
    </html>
  );
}
