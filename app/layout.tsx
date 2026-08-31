import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

const siteUrl = "https://santosht.dev";
const title = "Santosh Thakur — Software Engineer";
const description =
  "Software engineer building scalable digital products, application services and practical AI-powered applications.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Santosh Thakur Portfolio",
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    siteName: "Santosh Thakur",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Santosh Thakur — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Santosh Thakur",
  url: siteUrl,
  jobTitle: "Software Engineer",
  sameAs: [
    "https://github.com/SantoshThkr",
    "https://www.linkedin.com/in/ithakurr/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${space.variable}`}>{children}</body>
    </html>
  );
}
