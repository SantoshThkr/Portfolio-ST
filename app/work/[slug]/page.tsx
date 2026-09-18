import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "@/components/external-link";
import { FlowDiagram } from "@/components/flow-diagram";
import { JsonLd } from "@/components/json-ld";
import { caseStudies, layers } from "@/lib/content";
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
  const next = caseStudies[(index + 1) % caseStudies.length] ?? project;
  const url = `${site.url}/work/${project.slug}`;

  const sections = [
    { id: "architecture", title: "Architecture" },
    { id: "problem", title: "The problem" },
    { id: "built", title: "What I built" },
    { id: "decisions", title: "Key decisions" },
    ...(caseStudy.quality ? [{ id: "quality", title: "Testing and CI" }] : []),
    { id: "limits", title: "Limits and what's next" },
  ];
  const number = (id: string) => String(sections.findIndex(section => section.id === id) + 1).padStart(2, "0");

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
      {/* The stack re-poses as this project; the header sits beside it. */}
      <header className={styles.hero} data-scene="case" data-project={project.slug}>
        <div className={`container ${styles.heroInner}`}>
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
          <p className={styles.status}>
            Case study <span aria-hidden="true">·</span> {project.status}
          </p>
          <h1
            id="case-title"
            className={`display ${styles.title}`}
            style={{ "--chars": project.name.length } as React.CSSProperties}
          >
            {project.name}
          </h1>
          <p className={styles.tagline}>{project.tagline}</p>

          <dl className={styles.meta}>
            <div>
              <dt>Role</dt>
              <dd>{caseStudy.role}</dd>
            </div>
            <div>
              <dt>Layers</dt>
              <dd>
                {layers
                  .filter(layer => project.components[layer.id])
                  .map(layer => layer.name)
                  .join(" · ")}
              </dd>
            </div>
            {project.repo && (
              <div>
                <dt>Source</dt>
                <dd>
                  <ExternalLink href={project.repo} className="text-link">
                    {project.repo.replace("https://github.com/", "")}
                  </ExternalLink>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      <div className={styles.body} data-scene="quiet">
        <section className={styles.section} aria-labelledby="architecture-title">
          <div className="container">
            <SectionHead id="architecture" num={number("architecture")} title="Architecture" />
            <p className={styles.sectionLead}>{project.summary}</p>
            <FlowDiagram paths={project.flow} title={`${project.name} architecture`} note={project.flowNote} />
            <ul role="list" className={`tags ${styles.stack}`} aria-label={`${project.name} stack`}>
              {project.stack.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <Section id="problem" num={number("problem")} title="The problem">
          <p className={styles.prose}>{caseStudy.problem}</p>
          <figure className={styles.why}>
            <blockquote>
              <p>{caseStudy.why}</p>
            </blockquote>
            <figcaption className="label">Why I built it</figcaption>
          </figure>
        </Section>

        <Section id="built" num={number("built")} title="What I built">
          <dl className={styles.pairs}>
            {caseStudy.built.map(item => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="decisions" num={number("decisions")} title="Key decisions">
          <ol role="list" className={styles.decisions}>
            {caseStudy.decisions.map((item, i) => (
              <li key={item.title}>
                <span className={styles.dIndex}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
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
                      <td data-mutates={mutation !== "No" ? "" : undefined}>{mutation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {caseStudy.quality && (
          <Section id="quality" num={number("quality")} title="Testing and CI">
            <ul className={styles.list}>
              {caseStudy.quality.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>
        )}

        <Section id="limits" num={number("limits")} title="Limits and what's next">
          <ul className={`${styles.list} ${styles.limits}`}>
            {caseStudy.limits.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Scrolling here re-poses the stack as the next project — a preview before the click. */}
      <nav aria-label="More work" className={styles.next} data-scene="case" data-project={next.slug}>
        <div className={`container ${styles.nextInner}`}>
          <Link href="/#work" className="text-link">
            All work
          </Link>
          {next.slug !== project.slug && (
            <Link href={`/work/${next.slug}`} className={styles.nextLink}>
              <span className="label">Next case study</span>
              <span
                className={`display ${styles.nextName}`}
                style={{ "--chars": next.name.length } as React.CSSProperties}
              >
                {next.name}
              </span>
              <span className={styles.nextTagline}>{next.tagline}</span>
            </Link>
          )}
        </div>
      </nav>

      <JsonLd data={structuredData} />
    </article>
  );
}

function SectionHead({ id, num, title }: { id: string; num: string; title: string }) {
  return (
    <div className={styles.sectionHead}>
      <p className="eyebrow">
        <b>{num}</b> {title}
      </p>
      <h2 id={`${id}-title`} className={styles.h2}>
        {title}
      </h2>
    </div>
  );
}

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={`container ${styles.split}`}>
        <SectionHead id={id} num={num} title={title} />
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}
