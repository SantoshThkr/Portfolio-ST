import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Santosh Thakur — Software Engineer & Problem Solver",
  description:
    "Santosh Thakur is a software engineer building scalable digital products and turning complex problems into simple experiences.",
  metadataBase: new URL("https://santosht.dev"),
  openGraph: {
    title: "Santosh Thakur — Software Engineer & Problem Solver",
    description: "Building scalable digital products with clarity and care.",
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
