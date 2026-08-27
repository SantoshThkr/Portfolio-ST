"use client";

import { m, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { EngineeringStory, Exploration, ToolboxGroup } from "@/lib/content";

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
      <div className="relative flex min-h-32 items-center justify-between gap-2 md:gap-5">
        {flowLabels[type].map((label, index, labels) => (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-2 md:gap-5">
            <div className="relative flex h-14 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[.035] px-1 text-center text-[10px] uppercase tracking-[.12em] text-slate-300 md:h-20 md:text-xs">
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
    <article className="group border-t hairline py-12">
      <div className="grid gap-8 md:grid-cols-[120px_1fr_1fr] md:gap-10">
        <div><span className="font-display text-3xl text-electric">{story.number}</span><p className="eyebrow mt-4">{story.tag}</p></div>
        <div><h3 className="font-display text-3xl leading-tight tracking-[-.03em] text-white md:text-4xl">{story.title}</h3><p className="mt-5 text-lg leading-8 text-slate-400">{story.summary}</p></div>
        <div className="text-sm leading-7 text-slate-400">
          <p><strong className="font-medium text-slate-200">The challenge.</strong> {story.challenge}</p>
          <p className="mt-5"><strong className="font-medium text-slate-200">The approach.</strong> {story.approach}</p>
          <div className="mt-6 flex flex-wrap gap-2">{story.decisions.map(decision => <span key={decision} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{decision}</span>)}</div>
          <p className="mt-6 border-l border-lime/60 pl-4 text-slate-300"><strong className="font-medium text-lime">Outcome.</strong> {story.outcome}</p>
        </div>
      </div>
      <FlowVisual type={story.type} />
    </article>
  );
}

export function WorkSection({ stories }: { stories: EngineeringStory[] }) {
  return <Section id="work" eyebrow="Selected engineering stories" title="The interesting part is rarely the technology. It’s the problem around it."><div className="mt-16">{stories.map(story => <StoryCard key={story.number} story={story} />)}</div></Section>;
}

export function ThinkingSection({ principles, engineeringPrinciples }: { principles: { number: string; label: string }[]; engineeringPrinciples: string[] }) {
  const reducedMotion = useReducedMotion();
  return (
    <Section id="thinking" eyebrow="Engineering mindset" title="How I approach difficult problems.">
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border hairline bg-white/10 md:grid-cols-5">{principles.map(principle => <m.div whileHover={reducedMotion ? undefined : { backgroundColor: "rgba(139,167,255,.08)" }} key={principle.number} className="bg-[#101218] p-6 md:min-h-48"><span aria-hidden="true" className="font-mono text-sm text-lime">{principle.number}</span><h3 className="mt-12 text-sm leading-6 text-slate-200">{principle.label}</h3></m.div>)}</div>
      <div className="mt-12 grid gap-5 md:grid-cols-2"><p className="text-lg leading-8 text-slate-300">The goal is not more code. The goal is a better solution.</p><div className="space-y-3 text-sm text-slate-400">{engineeringPrinciples.map(principle => <p key={principle} className="flex items-center gap-3 border-b hairline pb-3"><span aria-hidden="true" className="text-lime">↳</span>{principle}</p>)}</div></div>
    </Section>
  );
}

export function JourneySection() {
  return <Section id="journey" eyebrow="A growing practice" title="Experience is not a finish line. It is a wider view of the system."><div className="mt-16 grid gap-10 border-t hairline pt-8 md:grid-cols-[1fr_2fr]"><p className="font-display text-3xl leading-tight tracking-[-.03em] text-electric">From shaping interfaces<br />to shaping decisions.</p><div className="space-y-8 text-slate-400"><p className="text-lg leading-8">Over 6.5+ years, my work has moved through frontend craft, application architecture, performance, real-time experiences and the practical realities of evolving products.</p><p className="leading-7">React, Next.js, TypeScript, Angular, APIs, GraphQL, WebSockets, micro frontends, testing, accessibility, CI/CD, Docker and AWS have been tools in that journey—not the destination.</p></div></div></Section>;
}

export function ToolboxSection({ toolbox }: { toolbox: ToolboxGroup[] }) {
  return <Section id="toolbox" eyebrow="Technical toolbox" title="Tools are most useful when they disappear into the solution."><div className="mt-14 divide-y divide-white/10 border-y hairline">{toolbox.map((group, index) => <div key={group.name} className="grid gap-3 py-6 md:grid-cols-[1fr_2fr]"><span className="text-sm text-slate-200"><span className="mr-3 font-mono text-xs text-lime">0{index + 1}</span>{group.name}</span><span className="text-sm leading-6 text-slate-500">{group.tools}</span></div>)}</div></Section>;
}

export function NowSection({ explorations }: { explorations: Exploration[] }) {
  return <Section id="now" eyebrow="Currently exploring" title="Building beyond what I already know."><div className="mt-16 grid gap-4 md:grid-cols-3">{explorations.map(item => <div key={item.number} className="rounded-2xl border hairline bg-[#101218] p-7"><span className="font-mono text-sm text-lime">{item.number}</span><h3 className="mt-12 font-display text-2xl text-white">{item.title}</h3><p className="mt-4 text-sm leading-7 text-slate-400">{item.description}</p></div>)}</div><p className="mt-12 max-w-2xl border-l border-electric pl-5 text-lg leading-8 text-slate-300">I don’t believe experience means stopping learning. The best engineers continue expanding their understanding of the systems they build.</p></Section>;
}

export function ContactSection() {
  return <Section id="contact" eyebrow="Start a conversation" title="Have something complex to build?"><div className="mt-14 flex flex-col justify-between gap-10 border-t hairline pt-8 md:flex-row md:items-end"><div><p className="max-w-lg text-lg leading-8 text-slate-400">I’m interested in ambitious products, hard problems and thoughtful conversations about technology.</p><a href="mailto:santoshthakurxd@gmail.com" className="mt-8 inline-flex items-center gap-3 text-xl text-white underline decoration-electric underline-offset-8 transition hover:text-lime">santoshthakurxd@gmail.com <ArrowUpRight size={18} /></a></div><div className="flex gap-5 text-slate-400"><a href="https://www.linkedin.com/in/ithakurr/" className="hover:text-white">LinkedIn</a><a href="https://github.com/" className="hover:text-white">GitHub</a></div></div></Section>;
}
