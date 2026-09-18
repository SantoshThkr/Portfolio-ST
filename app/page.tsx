import { CopyEmail } from "@/components/copy-email";
import { ExternalLink } from "@/components/external-link";
import { ProjectEntry } from "@/components/project-entry";
import { education, experience, otherWork, principles, projects, skills } from "@/lib/content";
import { site } from "@/lib/site";
import styles from "./page.module.css";

const proof = [
  "Took a RAG platform for contracts from zero to production in five weeks.",
  "Built React and Next.js apps serving 5M+ daily users.",
  "Built real-time dashboards for 200K+ concurrent users.",
];

export default function HomePage() {
  return (
    <>
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        <p className={styles.intro}>
          {site.name}, full-stack AI engineer in {site.location.city}, {site.location.country}
        </p>
        <h1 id="hero-title" className={styles.heroTitle}>
          I build AI applications end to end, from the React interface to the retrieval pipeline and APIs behind it.
        </h1>
        <p className={styles.lead}>
          Six years of production web engineering, now focused on LLM features that behave like the rest of the
          system: authenticated, streamed, cited and tested.
        </p>
        <div className={styles.actions}>
          <a href="#work" className="button button-primary">
            See selected work
          </a>
          <a href={`mailto:${site.email}`} className="button button-secondary">
            Email me
          </a>
          <a href={site.resume} className={`text-link ${styles.resumeLink}`}>
            Résumé (PDF)
          </a>
        </div>
        <ul className={styles.proof} aria-label="Highlights">
          {proof.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="work" className="section" aria-labelledby="work-title">
        <div className="container section-grid">
          <div className="section-title">
            <h2 id="work-title">Selected work</h2>
            <p>One production system and two open-source builds, each with its real architecture.</p>
          </div>
          <div>
            {projects.map(project => (
              <ProjectEntry key={project.slug} project={project} />
            ))}
            <div className={styles.other}>
              <h3 className={styles.subheading}>Other professional work</h3>
              <dl className={styles.otherList}>
                {otherWork.map(item => (
                  <div key={item.name}>
                    <dt>{item.name}</dt>
                    <dd>{item.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="section" aria-labelledby="experience-title">
        <div className="container section-grid">
          <div className="section-title">
            <h2 id="experience-title">Experience</h2>
            <p>6+ years across enterprise delivery, high-traffic products and AI applications.</p>
          </div>
          <ol role="list" className={styles.roles}>
            {experience.map(role => (
              <li key={role.company} className={styles.role}>
                <p className={styles.period}>
                  <time dateTime={role.startIso}>{role.start}</time> – <time dateTime={role.endIso}>{role.end}</time>
                </p>
                <div className={styles.roleBody}>
                  <h3 className={styles.roleCompany}>{role.company}</h3>
                  <p className={styles.roleTitle}>{role.title}</p>
                  <p className="muted">{role.summary}</p>
                  <ul className={styles.rolePoints}>
                    {role.points.map(point => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <ul role="list" className="tags" aria-label={`${role.company} stack`}>
                    {role.stack.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="skills" className="section" aria-labelledby="skills-title">
        <div className="container section-grid">
          <div className="section-title">
            <h2 id="skills-title">Skills</h2>
            <p>Grouped by where they sit in a system, with where I&apos;ve used them.</p>
          </div>
          <dl className={styles.skills}>
            {skills.map(group => (
              <div key={group.name} className={styles.skillRow}>
                <dt className={styles.skillName}>{group.name}</dt>
                <dd className={styles.skillItems}>{group.items.join(", ")}</dd>
                <dd className={styles.skillEvidence}>{group.evidence}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="approach" className="section" aria-labelledby="approach-title">
        <div className="container section-grid">
          <div className="section-title">
            <h2 id="approach-title">How I work</h2>
            <p>A few habits, each backed by something I&apos;ve built.</p>
          </div>
          <div className={styles.approach}>
            <ul role="list" className={styles.principles}>
              {principles.map(item => (
                <li key={item.title}>
                  <h3 className={styles.principleTitle}>{item.title}</h3>
                  <p className="muted">{item.body}</p>
                </li>
              ))}
            </ul>
            <div>
              <h3 className={styles.subheading}>Education</h3>
              <ul role="list" className={styles.education}>
                {education.map(item => (
                  <li key={item.degree}>
                    <span className={styles.degree}>{item.degree}</span>
                    <span className="muted">
                      {item.school}, {item.years}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section" aria-labelledby="contact-title">
        <div className="container section-grid">
          <div className="section-title">
            <h2 id="contact-title">Contact</h2>
          </div>
          <div className={styles.contact}>
            <p className={styles.contactLead}>
              Open to conversations about full-stack and AI engineering work. Email is the quickest way to reach me.
            </p>
            <a href={`mailto:${site.email}`} className={styles.email}>
              {site.email}
            </a>
            <CopyEmail email={site.email} />
            <ul role="list" className={styles.contactLinks}>
              <li>
                <ExternalLink href={site.linkedin} className="text-link">
                  LinkedIn
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href={site.github} className="text-link">
                  GitHub
                </ExternalLink>
              </li>
              <li>
                <a href={site.resume} className="text-link">
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
