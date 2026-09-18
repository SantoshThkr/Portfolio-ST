import { caseStudies } from "@/lib/content";
import { site } from "@/lib/site";
import { ogCard, ogSize } from "@/lib/og-card";

export const alt = "Case study by Santosh Thakur";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map(project => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = caseStudies.find(item => item.slug === slug);
  return ogCard({
    kicker: `Case study by ${site.name}`,
    title: project?.name ?? site.name,
    subtitle: project?.tagline ?? site.description,
  });
}
