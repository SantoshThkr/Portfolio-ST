import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "@/components/external-link";
import { FlowDiagram } from "@/components/flow-diagram";
import { JsonLd } from "@/components/json-ld";
import { caseStudies } from "@/lib/content";
import { site } from "@/lib/site";
import styles from "./page.module.css";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return caseStudies.map(project => ({ slug: project.slug }));
}

function findCaseStudy(slug: string) {
  return caseStudies.find(project => project.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = findCaseStudy(slug);
  if (!project) return {};

  const title = `${project.name} case study`;
  const path = `/work/${project.slug}`;
  return {
    title,
    description: project.tagline,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, title: `${title} — ${site.name}`, description: project.tagline },
    twitter: { card: "summary_large_image", title: `${title} — ${site.name}`, description: project.tagline },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = findCaseStudy(slug);
  if (!project) notFound();

  const { caseStudy } = project;
  const index = caseStudies.indexOf(project);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const url = `${site.url}/work/${project.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        name: project.name,
        description: project.tagline,
        url,
        codeRepository: project.repo,
        programmingLanguage: project.stack.filter(item => ["TypeScript", "Python"].includes(item)),
        keywords: project.stack.join(", "),
        author: { "@id": `${site.url}/#person` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Work", item: `${site.url}/#work` },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };

  return (
    <article aria-labelledby="case-title">
      <header className={`container ${styles.header}`}>
        <nav aria-label="Breadcrumb">
          <ol role="list" className={styles.breadcrumb}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/#work">Work</Link>
            </li>
            <li aria-current="page">{project.name}</li>
          </ol>
        </nav>
        <p className={styles.context}>{project.context}</p>
        <h1 id="case-title" className={styles.title}>
          {project.name}
        </h1>
        <p className={styles.tagline}>{project.tagline}</p>

        <dl className={styles.meta}>
          <div>
            <dt>My role</dt>
            <dd>{caseStudy.role}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.stack.join(", ")}</dd>
          </div>
          {project.repo && (
            <div>
              <dt>Source</dt>
              <dd>
                <ExternalLink href={project.repo} className="text-link">
                  {project.repo.replace("https://", "")}
                </ExternalLink>
              </dd>
            </div>
          )}
        </dl>
      </header>

      <section className="section" aria-labelledby="architecture-title">
        <div className="container">
          <h2 id="architecture-title" className={styles.h2}>
            Architecture
          </h2>
          <p className={styles.sectionLead}>{project.summary}</p>
          <FlowDiagram paths={project.flow} title={`${project.name} architecture`} note={project.flowNote} />
        </div>
      </section>

      <Section id="problem" title="The problem">
        <div className={styles.prose}>
          <p>{caseStudy.problem}</p>
          <p className="muted">{caseStudy.why}</p>
        </div>
      </Section>

      <Section id="built" title="What I built">
        <dl className={styles.pairs}>
          {caseStudy.built.map(item => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="decisions" title="Key decisions">
        <ul role="list" className={styles.decisions}>
          {caseStudy.decisions.map(item => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p className="muted">{item.body}</p>
            </li>
          ))}
        </ul>
        {caseStudy.table && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption>{caseStudy.table.caption}</caption>
              <thead>
                <tr>
                  {caseStudy.table.columns.map(column => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {caseStudy.table.rows.map(([tool, purpose, mutation]) => (
                  <tr key={tool}>
                    <th scope="row">
                      <code>{tool}</code>
                    </th>
                    <td>{purpose}</td>
                    <td>{mutation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {caseStudy.quality && (
        <Section id="quality" title="Testing and CI">
          <ul className={styles.list}>
            {caseStudy.quality.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="limits" title="Limits and what's next">
        <ul className={styles.list}>
          {caseStudy.limits.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <nav aria-label="More work" className="section">
        <div className={`container ${styles.pager}`}>
          <Link href="/#work" className="text-link">
            All work
          </Link>
          {next && next.slug !== project.slug && (
            <Link href={`/work/${next.slug}`} className={styles.next}>
              <span className="muted">Next case study</span>
              <span className={styles.nextName}>{next.name}</span>
            </Link>
          )}
        </div>
      </nav>

      <JsonLd data={structuredData} />
    </article>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="section" aria-labelledby={`${id}-title`}>
      <div className="container section-grid">
        <div className="section-title">
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
