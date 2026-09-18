import localFont from "next/font/local";

// Self-hosted from @fontsource: no third-party font request and no build-time
// network dependency. One Archivo file covers both the expanded display cut
// and the normal-width text cut through its width axis.
export const sans = localFont({
  src: "../node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const mono = localFont({
  src: "../node_modules/@fontsource-variable/martian-mono/files/martian-mono-latin-standard-normal.woff2",
  variable: "--font-martian",
  weight: "100 800",
  display: "swap",
  // Not preloaded: it only sets small labels, so a brief swap is cheap, and
  // keeping it off the critical path keeps first paint lean.
  preload: false,
  declarations: [{ prop: "font-stretch", value: "75% 112.5%" }],
});
