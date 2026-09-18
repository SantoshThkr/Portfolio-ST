import { site } from "@/lib/site";
import { ogCard, ogSize } from "@/lib/og-card";

export const alt = `${site.name}, full-stack AI engineer`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: "Full-stack AI engineer, Noida",
    title: site.name,
    subtitle: "AI applications end to end: React interfaces, APIs, retrieval pipelines and the model calls between them.",
  });
}
