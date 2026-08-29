"use client";

import { m, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { currentFocus, emailAddress, githubUrl, linkedinUrl, systemLayers } from "@/lib/content";
import type { Capability, EngineeringNote, EngineeringStory, Experience, NowItem, Project, ToolboxGroup } from "@/lib/content";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
};

const flowLabels: Record<EngineeringStory["type"], string[]> = {
  performance: ["intent", "network", "render", "interaction", "outcome"],
  architecture: ["product", "complexity", "domains", "modules", "teams"],
  realtime: ["events", "services", "connection", "state", "interface"],
  migration: ["existing", "dependencies", "slices", "validate", "stable"]
};

export function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative mx-auto max-w-6xl scroll-mt-32 px-6 py-24 md:px-10 md:py-36">
      <m.div initial={reducedMotion ? false : "hidden"} whileInView={reducedMotion ? undefined : "show"} viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h2 id={`${id}-title`} className="max-w-3xl font-display text-4xl font-medium tracking-[-.04em] text-white md:text-6xl">{title}</h2>
      </m.div>
      {children}
    </section>
  );
}

function FlowVisual({ type }: { type: EngineeringStory["type"] }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border hairline bg-[#101218] p-5 md:p-8">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative grid min-h-32 grid-cols-2 items-center gap-2 md:flex md:justify-between md:gap-5">
        {flowLabels[type].map((label, index, labels) => (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-2 md:gap-5 last:col-span-2 md:last:col-span-1">
            <div className="relative flex h-14 w-full items-center justify-center break-words rounded-xl border border-white/10 bg-white/[.035] px-1 text-center text-[10px] uppercase tracking-[.12em] text-slate-300 md:h-20 md:text-xs">
              {index === 2 && (
                <m.span
                  aria-hidden="true"
                  className="absolute inset-x-1/2 top-[-7px] h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_16px_#c8f36a]"
                  animate={reducedMotion ? undefined : { y: [0, 78, 0], opacity: [0, 1, 0] }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 2.8, repeat: Infinity, delay: index * 0.15 }}
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
  return <Section id="work" eyebrow="Selected engineering stories" title="The hard part is making the right trade-off."><div className="mt-16">{stories.map(story => <StoryCard key={story.number} story={story} />)}</div></Section>;
}

export function CapabilitiesSection({ capabilities }: { capabilities: Capability[] }) {
  return <Section id="capabilities" eyebrow="What I build" title="Products that have real constraints behind them."><div className="mt-16 grid gap-px overflow-hidden rounded-2xl border hairline bg-white/10 md:grid-cols-3">{capabilities.map((capability, index) => <article key={capability.title} className="bg-[#101218] p-6 transition-colors hover:bg-electric/[.06] md:min-h-48"><span aria-hidden="true" className="font-mono text-sm text-lime">0{index + 1}</span><h3 className="mt-10 font-display text-2xl text-white">{capability.title}</h3><p className="mt-4 text-sm leading-7 text-slate-400">{capability.description}</p></article>)}</div></Section>;
}

function ProjectCard({ project }: { project: Project }) {
  return <article data-cursor="card" className="rounded-2xl border hairline bg-[#101218] p-6 transition-colors hover:border-electric/40 md:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="eyebrow text-lime">{project.category}</span><h3 className="mt-5 font-display text-3xl tracking-[-.04em] text-white">{project.title}</h3></div><span className="rounded-full border border-lime/30 px-3 py-1 text-xs capitalize text-lime">{project.status}</span></div><p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{project.description}</p><div className="mt-8 grid gap-5 border-y hairline py-6 md:grid-cols-2"><div><p className="eyebrow mb-2">Problem</p><p className="text-sm leading-7 text-slate-400">{project.problem}</p></div><div><p className="eyebrow mb-2">Result</p><p className="text-sm leading-7 text-slate-400">{project.result}</p></div></div><details className="group/details mt-6"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg border border-white/10 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-electric/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"><span>Open engineering details</span><span aria-hidden="true" className="text-electric transition-transform group-open/details:rotate-45">+</span></summary><div className="mt-6 grid gap-6 text-sm leading-7 text-slate-400 md:grid-cols-2"><div><p className="eyebrow mb-2">Build</p><p>{project.build}</p></div><div><p className="eyebrow mb-2">Interesting engineering problem</p><p>{project.engineeringProblem}</p></div><div><p className="eyebrow mb-2">Decision</p><p>{project.decision}</p></div>{project.architecture && <div><p className="eyebrow mb-2">Architecture</p><div className="flex flex-wrap gap-2">{project.architecture.map(layer => <span key={layer} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{layer}</span>)}</div></div>}</div></details><div className="mt-7 flex flex-wrap items-center gap-2"><span className="mr-2 text-xs text-slate-500">Stack</span>{project.technologies.map(technology => <span key={technology} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{technology}</span>)}{(project.githubUrl || project.liveUrl) && <div className="ml-auto flex gap-4 text-sm">{project.githubUrl && <a data-cursor="external" href={project.githubUrl} target="_blank" rel="noreferrer" className="text-slate-300 underline decoration-electric underline-offset-4 hover:text-white">GitHub</a>}{project.liveUrl && <a data-cursor="external" href={project.liveUrl} target="_blank" rel="noreferrer" className="text-slate-300 underline decoration-electric underline-offset-4 hover:text-white">Live demo</a>}</div>}</div></article>;
}

export function BuildsSection({ projects }: { projects: Project[] }) {
  return <Section id="builds" eyebrow="Independent work" title="Things I build outside client work."><div className="mt-16 grid gap-6">{projects.map(project => <ProjectCard key={project.title} project={project} />)}</div></Section>;
}

export function ThinkingSection({ principles, engineeringPrinciples }: { principles: { number: string; label: string }[]; engineeringPrinciples: string[] }) {
  const reducedMotion = useReducedMotion();
  return (
    <Section id="thinking" eyebrow="How I work" title="How I work through difficult problems.">
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border hairline bg-white/10 md:grid-cols-5">{principles.map(principle => <m.div whileHover={reducedMotion ? undefined : { backgroundColor: "rgba(139,167,255,.08)" }} key={principle.number} className="bg-[#101218] p-6 md:min-h-48"><span aria-hidden="true" className="font-mono text-sm text-lime">{principle.number}</span><h3 className="mt-12 text-sm leading-6 text-slate-200">{principle.label}</h3></m.div>)}</div>
      <div className="mt-12 grid gap-5 md:grid-cols-2"><p className="text-lg leading-8 text-slate-300">I try to keep the solution as simple as the problem allows.</p><div className="space-y-3 text-sm text-slate-400">{engineeringPrinciples.map(principle => <p key={principle} className="flex items-center gap-3 border-b hairline pb-3"><span aria-hidden="true" className="text-lime">↳</span>{principle}</p>)}</div></div>
      <SystemLayers />
    </Section>
  );
}

function SystemLayers() {
  return <div className="mt-16 border-t hairline pt-8"><p className="eyebrow mb-6">Thinking across the system</p><div className="grid gap-2 md:grid-cols-7">{systemLayers.map((layer, index) => <div key={layer.label} className="flex items-center gap-2 md:block"><div className="flex-1 rounded-xl border border-white/10 bg-[#101218] p-4 transition-colors hover:border-electric/40"><span className="font-display text-lg text-white">{layer.label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{layer.description}</span></div>{index < systemLayers.length - 1 && <><span aria-hidden="true" className="text-electric md:hidden">↓</span><span aria-hidden="true" className="hidden text-electric md:my-3 md:block md:text-center">→</span></>}</div>)}</div></div>;
}

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  const reducedMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 75%", "end 45%"] });
  const timelineScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <Section id="journey" eyebrow="Professional journey" title="The problems changed. So did the work around them.">
      <div ref={timelineRef} className="relative mt-16">
        <div aria-hidden="true" className="absolute bottom-0 left-3 top-0 w-px bg-white/10 md:left-1/2" />
        <m.div aria-hidden="true" className="absolute left-3 top-0 h-full w-px origin-top bg-lime md:left-1/2" style={{ scaleY: timelineScale }} />
        <div className="space-y-12 md:space-y-16">
          {experience.map((item, index) => (
            <m.article
              key={item.company}
              initial={reducedMotion ? false : { opacity: 0, y: 28 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: reducedMotion ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reducedMotion ? undefined : { y: -4 }}
              data-cursor="card"
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
            </m.article>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function ToolboxSection({ toolbox }: { toolbox: ToolboxGroup[] }) {
  return <Section id="toolbox" eyebrow="Technical toolbox" title="The tools I use to make and ship products."><div className="mt-14 divide-y divide-white/10 border-y hairline">{toolbox.map((group, index) => <div key={group.name} className="grid gap-3 py-6 md:grid-cols-[1fr_2fr]"><span className="text-sm text-slate-200"><span aria-hidden="true" className="mr-3 font-mono text-xs text-lime">0{index + 1}</span>{group.name}</span><span className="break-words text-sm leading-6 text-slate-400">{group.tools}</span></div>)}</div></Section>;
}

export function NotesSection({ notes }: { notes: EngineeringNote[] }) {
  return <Section id="notes" eyebrow="Engineering notebook" title="Notes from building things."><div className="mt-16 divide-y divide-white/10 border-y hairline">{notes.map(note => <article key={note.title} className="grid gap-5 py-7 md:grid-cols-[1fr_2fr_auto] md:items-center"><div><span className="eyebrow text-electric">{note.category}</span><h3 className="mt-3 font-display text-2xl text-white">{note.title}</h3></div><p className="text-sm leading-7 text-slate-400">{note.summary}</p><div className="flex items-center justify-between gap-4 text-xs text-slate-500 md:block md:text-right"><span>{note.date}</span><span className="ml-3">{note.readingTime}</span><span className="ml-3 block text-lime md:mt-2">{note.status === "planned" ? "Draft" : "Published"}</span></div></article>)}</div></Section>;
}

function CurrentFocus() {
  return <div className="mb-12 rounded-2xl border border-lime/20 bg-lime/[.035] p-5"><div className="flex flex-wrap items-center gap-3"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-lime shadow-[0_0_14px_#c8f36a]" /><span className="eyebrow text-lime">Current focus</span></div><div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-300">{currentFocus.map((focus, index) => <span key={focus} className="flex items-center gap-3"><span>{focus}</span>{index < currentFocus.length - 1 && <span aria-hidden="true" className="text-electric">+</span>}</span>)}</div></div>;
}

export function NowSection({ items }: { items: NowItem[] }) {
  const categories = ["building", "working-on", "interested-in", "recently"] as const;
  const categoryLabels = { building: "Building", "working-on": "Working on", "interested-in": "Interested in", recently: "Recently" };
  return <Section id="now" eyebrow="Now" title="What has my attention right now."><CurrentFocus /><div className="grid gap-4 md:grid-cols-2">{categories.map(category => { const item = items.find(entry => entry.category === category); return item ? <article key={item.category} className="rounded-2xl border hairline bg-[#101218] p-7 transition-colors hover:border-electric/40"><span className="eyebrow text-lime">{categoryLabels[item.category]}</span><h3 className="mt-8 font-display text-2xl text-white">{item.title}</h3><p className="mt-4 text-sm leading-7 text-slate-400">{item.description}</p></article> : null; })}</div><p className="mt-12 max-w-2xl border-l border-electric pl-5 text-lg leading-8 text-slate-300">I keep this list short: a few things I’m building, a few problems I’m paying attention to, and no roadmap theater.</p></Section>;
}

export function ContactSection() {
  return <Section id="contact" eyebrow="Start a conversation" title="Have something worth building?"><div className="mt-14 flex flex-col justify-between gap-10 border-t hairline pt-8 md:flex-row md:items-end"><div><p className="max-w-lg text-lg leading-8 text-slate-400">I’m always open to discussing products, engineering problems and useful ways to work together.</p><a href={`mailto:${emailAddress}`} data-cursor="cta" className="mt-8 inline-flex max-w-full items-center gap-3 break-words text-base text-white underline decoration-electric underline-offset-8 transition hover:text-lime sm:text-xl">{emailAddress} <ArrowUpRight aria-hidden="true" size={18} /></a></div><div className="flex gap-5 text-slate-400"><a href={linkedinUrl} data-cursor="external" className="hover:text-white">LinkedIn</a><a href={githubUrl} data-cursor="external" className="hover:text-white">GitHub</a></div></div></Section>;
}
