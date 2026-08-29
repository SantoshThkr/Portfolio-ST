import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Santosh Thakur — Software Engineer & Problem Solver",
  description:
    "Santosh Thakur is a software engineer building scalable digital products, understanding systems and exploring AI-powered applications.",
  metadataBase: new URL("https://santosht.dev"),
  openGraph: {
    title: "Santosh Thakur — Software Engineer & Problem Solver",
    description: "Software engineering, scalable products and thoughtful AI-powered applications.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${space.variable}`}>{children}</body>
    </html>
  );
}
