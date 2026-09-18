import localFont from "next/font/local";

// Self-hosted from @fontsource packages: no third-party font request,
// no build-time network dependency, and Next generates size-adjusted fallbacks.
export const sans = localFont({
  src: "../node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "400 900",
  display: "swap",
});

export const mono = localFont({
  src: "../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
  preload: false,
});
