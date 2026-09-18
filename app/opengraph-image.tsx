import { site } from "@/lib/site";
import { ogCard, ogSize } from "@/lib/og-card";

export const alt = `${site.name}, full-stack AI engineer`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: "Full-stack AI engineer · Noida",
    title: site.name,
    subtitle: "AI products, engineered through every layer.",
  });
}
