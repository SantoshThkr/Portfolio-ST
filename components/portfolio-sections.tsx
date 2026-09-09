import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { currentFocus, emailAddress, githubUrl, linkedinUrl } from "@/lib/content";
import type { Capability, EngineeringStory, Experience, NowItem, Project, ToolboxGroup } from "@/lib/content";
import { ActionPipeline, ProjectPipeline, SystemMap, WorkflowVisual } from "./engineering-visuals";

const flowLabels: Record<EngineeringStory["type"], string[]> = {
  performance: ["intent", "network", "render", "interaction", "outcome"],
  architecture: ["product", "complexity", "domains", "modules", "teams"],
  realtime: ["events", "services", "connection", "state", "interface"],
  migration: ["existing", "dependencies", "slices", "validate", "stable"]
};

export function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative mx-auto max-w-6xl scroll-mt-32 px-6 py-24 md:px-10 md:py-36">
      <div className="section-heading">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h2 id={`${id}-title`} className="max-w-3xl font-display text-4xl font-medium tracking-[-.04em] text-white md:text-6xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FlowVisual({ type }: { type: EngineeringStory["type"] }) {
  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border hairline bg-[#101218] p-5 md:p-8">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative grid min-h-32 grid-cols-2 items-center gap-2 md:flex md:justify-between md:gap-5">
        {flowLabels[type].map((label, index, labels) => (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-2 md:gap-5 last:col-span-2 md:last:col-span-1">
            <div className="relative flex h-14 w-full items-center justify-center break-words rounded-xl border border-white/10 bg-white/[.035] px-1 text-center text-[10px] uppercase tracking-[.12em] text-slate-300 md:h-20 md:text-xs">
              {index === 2 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-1/2 top-[-7px] h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_16px_#c8f36a]"
                />
              )}
              {label}
            </div>
            {index < labels.length - 1 && <ArrowUpRight aria-hidden="true" className="hidden h-4 w-4 shrink-0 text-electric/60 md:block" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryCard({ story }: { story: EngineeringStory }) {
  return (
    <article data-cursor="card" className="group border-t hairline py-12 transition-colors hover:border-electric/30">
      <div className="grid gap-8 md:grid-cols-[120px_1fr_1fr] md:gap-10">
        <div><span className="font-display text-3xl text-electric">{story.number}</span><p className="eyebrow mt-4">{story.tag}</p></div>
        <div><h3 className="font-display text-3xl leading-tight tracking-[-.03em] text-white md:text-4xl">{story.title}</h3><p className="mt-5 text-lg leading-8 text-slate-400">{story.summary}</p></div>
        <div className="text-sm leading-7 text-slate-400">
          <p><strong className="font-medium text-slate-200">Problem.</strong> {story.challenge}</p>
          <p className="mt-5"><strong className="font-medium text-slate-200">What I did.</strong> {story.approach}</p>
          <div className="mt-6 flex flex-wrap gap-2">{story.decisions.map(decision => <span key={decision} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{decision}</span>)}</div>
          <p className="mt-6 border-l border-lime/60 pl-4 text-slate-300"><strong className="font-medium text-lime">Result.</strong> {story.outcome}</p>
        </div>
      </div>
      <FlowVisual type={story.type} />
    </article>
  );
}

export function WorkSection({ stories }: { stories: EngineeringStory[] }) {
  return <Section id="work" eyebrow="Selected engineering stories" title="The hard part is making the right trade-off."><div className="mt-10 mb-12 max-w-3xl text-lg leading-8 text-slate-400">A few patterns I have worked through in production: finding the slow path, setting boundaries, keeping live state trustworthy, and modernizing without stopping delivery.</div><div className="mt-16">{stories.map(story => <StoryCard key={story.number} story={story} />)}</div></Section>;
}

export function CapabilitiesSection({ capabilities }: { capabilities: Capability[] }) {
  const groups = [
    { title: "Product engineering", description: "Interfaces and shared foundations that stay useful as products and teams grow.", tags: capabilities.slice(0, 2).map(item => item.title), link: "InterviewPilot" },
    { title: "Systems & APIs", description: "Service boundaries, integrations and data flows that connect a product to the systems behind it.", tags: [capabilities[3].title, "REST APIs", "GraphQL"], link: "OpsAI" },
    { title: "Real-time & performance", description: "Keeping changing state predictable and moving work out of the critical path.", tags: [capabilities[2].title, capabilities[4].title], link: "Production work" },
    { title: "AI applications", description: "Practical workflows around streaming, structured output, retrieval and evaluation.", tags: [capabilities[5].title, "Streaming", "RAG"], link: "InterviewPilot + OpsAI" }
  ];
  return <Section id="capabilities" eyebrow="What I build" title="From product surface to the systems behind it."><div className="capability-groups">{groups.map((group, index) => <article key={group.title} className="capability-group"><span className="card-number">0{index + 1}</span><h3>{group.title}</h3><p>{group.description}</p><div className="capability-tags">{group.tags.map(tag => <span key={tag}>{tag}</span>)}</div><small>Connected to {group.link}</small></article>)}</div></Section>;
}

function ProjectCard({ project }: { project: Project }) {
  const statusLabel = project.status === "built" ? "Built" : project.status === "building" ? "Currently building" : project.status === "live" ? "Live" : "Experiment";
  const pipelineProject = project.title === "InterviewPilot" || project.title === "OpsAI" ? project.title : null;
  return <article className={`project-card ${project.featured ? "project-card-featured" : ""}`}>
    {project.imageUrl && (project.liveUrl ?? project.githubUrl) && <a href={project.liveUrl ?? project.githubUrl} target="_blank" rel="noreferrer" className="mb-6 block overflow-hidden rounded-2xl border hairline"><Image src={project.imageUrl} alt={`${project.title} interface preview`} width={1200} height={750} className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]" /></a>}
    <div className="project-topline"><div><span className="eyebrow text-lime">{project.category}</span><h3>{project.title}</h3></div><span className="status-pill">{project.status === "building" && <span aria-hidden="true" className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-lime" />}{statusLabel}</span></div>
    <p className="project-description">{project.description}</p>
    {project.whyBuilt && <p className="project-why"><span>Why I built it:</span> {project.whyBuilt}</p>}
    <div className="project-facts"><div><p className="eyebrow">Problem</p><p>{project.problem}</p></div><div><p className="eyebrow">Result</p><p>{project.result}</p></div></div>
    <div className="project-highlight"><p className="eyebrow">Engineering focus</p><p>{project.engineeringProblem}</p></div>
    {pipelineProject && <ProjectPipeline project={pipelineProject} />}
    {project.title === "OpsAI" && <ActionPipeline />}
    <div className="project-body"><div><p className="eyebrow">What I built</p><p>{project.build}</p></div><div><p className="eyebrow">Key decision</p><p>{project.decision}</p></div></div>
    {project.architecture && <div className="project-architecture"><p className="eyebrow">Architecture</p><div className="pill-list">{project.architecture.map(layer => <span key={layer}>{layer}</span>)}</div></div>}
    <details className="project-details"><summary>More project detail <span aria-hidden="true">+</span></summary><div className="project-details-content"><p className="eyebrow">Technologies</p><div className="pill-list">{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</div></div></details>
    <div className="project-footer"><span className="eyebrow">Explore</span><div className="project-links">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={14} aria-hidden="true" /></a>}</div></div>
  </article>;
}

export function BuildsSection({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.filter(project => project.featured);
  const secondaryProjects = projects.filter(project => !project.featured);
  return <Section id="builds" eyebrow="Independent work" title="Things I build outside client work."><div className="mt-16 space-y-6">{featuredProjects.map(project => <ProjectCard key={project.title} project={project} />)}{secondaryProjects.length > 0 && <div className="grid gap-6">{secondaryProjects.map(project => <ProjectCard key={project.title} project={project} />)}</div>}</div></Section>;
}

export function ThinkingSection({ principles, engineeringPrinciples }: { principles: { number: string; label: string }[]; engineeringPrinciples: string[] }) {
  return (
    <Section id="thinking" eyebrow="How I work" title="How I work through difficult problems.">
      <WorkflowVisual />
      <div className="thinking-split"><p className="text-lg leading-8 text-slate-300">I try to keep the solution as simple as the problem allows.</p><div className="space-y-3 text-sm text-slate-400">{engineeringPrinciples.map(principle => <p key={principle} className="flex items-center gap-3 border-b hairline pb-3"><span aria-hidden="true" className="text-lime">↳</span>{principle}</p>)}</div></div>
      <SystemLayers />
    </Section>
  );
}

function SystemLayers() {
  return <div className="mt-16 border-t hairline pt-8"><p className="eyebrow mb-6">Thinking across the system</p><SystemMap /><p className="mt-6 text-sm text-slate-400">See this in practice in <a href="#builds" className="text-lime underline underline-offset-4 hover:text-white">OpsAI and InterviewPilot</a>.</p></div>;
}

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  return (
    <Section id="journey" eyebrow="Professional journey" title="The problems changed. So did the work around them.">
      <div className="relative mt-16">
        <div aria-hidden="true" className="absolute bottom-0 left-3 top-0 w-px bg-white/10 md:left-1/2" />
        <div aria-hidden="true" className="absolute left-3 top-0 h-1/3 w-px bg-lime md:left-1/2" />
        <div className="space-y-12 md:space-y-16">
          {experience.map((item, index) => (
            <article
              key={item.company}
              className={`relative pl-10 md:w-1/2 md:pl-0 ${index % 2 === 0 ? "md:pr-14" : "md:ml-auto md:pl-14"}`}
            >
              <span aria-hidden="true" className={`absolute left-0 top-2 h-6 w-6 rounded-full border-4 border-ink bg-lime shadow-[0_0_18px_rgba(200,243,106,.45)] md:top-8 ${index % 2 === 0 ? "md:left-auto md:right-[-13px]" : "md:left-[-13px] md:right-auto"}`} />
              <div className="rounded-2xl border hairline bg-[#101218] p-6 transition-colors hover:border-electric/40 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="eyebrow text-lime">{item.stage}</span>
                  <span className="text-xs text-slate-400">{item.period}</span>
                </div>
                <h3 className="mt-7 font-display text-3xl tracking-[-.04em] text-white">{item.company}</h3>
                <p className="mt-2 text-sm text-electric">{item.role}</p>
                <p className="mt-5 text-sm leading-7 text-slate-300">{item.summary}</p>
                <p className="mt-4 text-sm leading-7 text-slate-400">{item.scope}</p>
                <div className="mt-5 flex flex-wrap gap-2">{item.systems.map(system => <span key={system} className="rounded-full border border-electric/20 px-3 py-1 text-xs text-slate-400">{system}</span>)}</div>
                <div className="mt-6 flex flex-wrap gap-2">{item.areas.map(area => <span key={area} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{area}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ToolboxSection({ toolbox }: { toolbox: ToolboxGroup[] }) {
  return <Section id="toolbox" eyebrow="Technical toolbox" title="The tools I use to make and ship products."><div className="mt-14 divide-y divide-white/10 border-y hairline">{toolbox.map((group, index) => <div key={group.name} className="grid gap-3 py-6 md:grid-cols-[1fr_2fr]"><span className="text-sm text-slate-200"><span aria-hidden="true" className="mr-3 font-mono text-xs text-lime">0{index + 1}</span>{group.name}</span><span className="break-words text-sm leading-6 text-slate-400">{group.tools}</span></div>)}</div></Section>;
}

function CurrentFocus() {
  return <div className="mb-12 rounded-2xl border border-lime/20 bg-lime/[.035] p-5"><div className="flex flex-wrap items-center gap-3"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-lime shadow-[0_0_14px_#c8f36a]" /><span className="text-sm font-semibold text-lime">Current focus</span></div><div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-300">{currentFocus.map((focus, index) => <span key={focus} className="flex items-center gap-3"><span>{focus}</span>{index < currentFocus.length - 1 && <span aria-hidden="true" className="text-electric">+</span>}</span>)}</div></div>;
}

export function NowSection({ items }: { items: NowItem[] }) {
  const categories = ["building", "working-on", "interested-in", "recently"] as const;
  const categoryLabels = { building: "Building", "working-on": "Working on", "interested-in": "Interested in", recently: "Recently" };
  return <Section id="now" eyebrow="Now" title="What has my attention right now."><CurrentFocus /><div className="grid gap-4 md:grid-cols-2">{categories.map(category => { const item = items.find(entry => entry.category === category); return item ? <article key={item.category} className="rounded-2xl border hairline bg-[#101218] p-7 transition-colors hover:border-electric/40"><span className="text-sm font-semibold text-lime">{categoryLabels[item.category]}</span><h3 className="mt-8 font-display text-2xl text-white">{item.title}</h3><p className="mt-4 text-sm leading-7 text-slate-400">{item.description}</p></article> : null; })}</div><p className="mt-12 max-w-2xl border-l border-electric pl-5 text-lg leading-8 text-slate-300">I keep this list short: a few things I’m building, a few problems I’m paying attention to, and no roadmap theater.</p></Section>;
}

export function ContactSection() {
  return <Section id="contact" eyebrow="Start a conversation" title="Have something worth building?"><div className="mt-14 flex flex-col justify-between gap-10 border-t hairline pt-8 md:flex-row md:items-end"><div><p className="max-w-lg text-lg leading-8 text-slate-400">I’m always open to discussing products, engineering problems and useful ways to work together.</p><a href={`mailto:${emailAddress}`} data-cursor="cta" className="mt-8 inline-flex max-w-full items-center gap-3 break-words text-base text-white underline decoration-electric underline-offset-8 transition hover:text-lime sm:text-xl">{emailAddress} <ArrowUpRight aria-hidden="true" size={18} /></a></div><div className="flex gap-5 text-slate-400"><a href={linkedinUrl} target="_blank" rel="noreferrer" data-cursor="external" className="hover:text-white">LinkedIn</a><a href={githubUrl} target="_blank" rel="noreferrer" data-cursor="external" className="hover:text-white">GitHub</a></div></div></Section>;
}
