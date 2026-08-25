"use client";

import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, Menu, Minus, X } from "lucide-react";
import { useRef, useState } from "react";
import { stories, toolbox } from "@/lib/content";

const fadeUp = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: .65, ease: [.22, 1, .36, 1] } } };

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="relative mx-auto max-w-6xl scroll-mt-28 px-6 py-24 md:px-10 md:py-36">
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
      <p className="eyebrow mb-5">{eyebrow}</p><h2 className="max-w-3xl font-display text-4xl font-medium tracking-[-.04em] text-white md:text-6xl">{title}</h2>
    </motion.div>{children}
  </section>;
}

function FlowVisual({ type }: { type: string }) {
  const labels = type === "realtime" ? ["events", "services", "connection", "state", "interface"] : type === "migration" ? ["existing", "dependencies", "slices", "validate", "stable"] : type === "architecture" ? ["product", "complexity", "domains", "modules", "teams"] : ["intent", "network", "render", "interaction", "outcome"];
  return <div className="relative mt-10 overflow-hidden rounded-2xl border hairline bg-[#101218] p-5 md:p-8">
    <div className="absolute inset-0 grid-bg opacity-40" /><div className="relative flex min-h-32 items-center justify-between gap-2 md:gap-5">
      {labels.map((label, index) => <div key={label} className="flex min-w-0 flex-1 items-center gap-2 md:gap-5">
        <div className="relative flex h-14 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[.035] px-1 text-center text-[10px] uppercase tracking-[.12em] text-slate-300 md:h-20 md:text-xs">
          {index === 2 && <motion.span className="absolute inset-x-1/2 top-[-7px] h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_16px_#c8f36a]" animate={{ y: [0, 78, 0], opacity: [0, 1, 0] }} transition={{ duration: 2.8, repeat: Infinity, delay: index * .15 }} />}
          {label}
        </div>{index < labels.length - 1 && <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-electric/60 md:block" />}
      </div>)}
    </div>
  </div>;
}

function StoryCard({ story }: { story: (typeof stories)[number] }) {
  return <article className="group border-t hairline py-12">
    <div className="grid gap-8 md:grid-cols-[120px_1fr_1fr] md:gap-10">
      <div><span className="font-display text-3xl text-electric">{story.number}</span><p className="eyebrow mt-4">{story.tag}</p></div>
      <div><h3 className="font-display text-3xl leading-tight tracking-[-.03em] text-white md:text-4xl">{story.title}</h3><p className="mt-5 text-lg leading-8 text-slate-400">{story.summary}</p></div>
      <div className="text-sm leading-7 text-slate-400"><p><strong className="font-medium text-slate-200">The challenge.</strong> {story.challenge}</p><p className="mt-5"><strong className="font-medium text-slate-200">The approach.</strong> {story.approach}</p><div className="mt-6 flex flex-wrap gap-2">{story.decisions.map(d => <span key={d} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{d}</span>)}</div><p className="mt-6 border-l border-lime/60 pl-4 text-slate-300"><strong className="font-medium text-lime">Outcome.</strong> {story.outcome}</p></div>
    </div><FlowVisual type={story.type} />
  </article>;
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const nav = [["Work", "work"], ["Thinking", "thinking"], ["Journey", "journey"], ["Toolbox", "toolbox"], ["Now", "now"], ["Contact", "contact"]];
  return <main ref={ref} className="noise overflow-hidden">
    <motion.div className="fixed left-0 right-0 top-0 z-50 h-px origin-left bg-lime" style={{ scaleX }} />
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[.08] bg-ink/75 backdrop-blur-xl"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
      <a href="#" className="font-display text-lg tracking-[-.04em]">ST<span className="text-lime">.</span></a>
      <nav className="hidden items-center gap-7 md:flex">{nav.map(([label, id], i) => <a key={id} href={`#${id}`} onClick={() => setActive(i)} className={`text-xs transition-colors ${active === i ? "text-white" : "text-slate-500 hover:text-white"}`}>{label}</a>)}</nav>
      <button aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu(!menu)} className="md:hidden">{menu ? <X size={20} /> : <Menu size={20} />}</button>
    </div>{menu && <div className="border-t border-white/10 px-6 py-5 md:hidden">{nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)} className="block py-3 text-sm text-slate-300">{label}</a>)}</div>}</header>

    <section id="home" className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-14 px-6 pb-20 pt-36 md:grid-cols-[1.1fr_.9fr] md:px-10 md:pt-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[680px] grid-bg" /><motion.div initial="hidden" animate={inView ? "show" : "hidden"} variants={{ hidden: {}, show: { transition: { staggerChildren: .1 } } }}>
        <motion.p variants={fadeUp} className="eyebrow mb-7">Software Engineer · Problem Solver</motion.p>
        <motion.h1 variants={fadeUp} className="max-w-3xl font-display text-6xl font-medium leading-[.98] tracking-[-.07em] text-balance md:text-8xl">I build systems that turn <span className="text-electric">complex problems</span> into simple experiences.</motion.h1>
        <motion.p variants={fadeUp} className="mt-8 max-w-xl text-base leading-7 text-slate-400 md:text-lg">6.5+ years building scalable digital products. I care about the decisions behind the interface—and I’m exploring what happens when software becomes more intelligent.</motion.p>
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3"><a href="#work" className="group inline-flex items-center gap-3 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink">Explore my work <ArrowDownRight size={16} className="transition-transform group-hover:rotate-[-45deg]" /></a><a href="#contact" className="inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm text-white transition hover:border-white/40">Let’s connect <ArrowUpRight size={16} /></a></motion.div>
        <motion.div variants={fadeUp} className="mt-12 flex gap-5 text-slate-500"><a aria-label="LinkedIn" href="https://www.linkedin.com/in/ithakurr/" className="transition hover:text-white"><Linkedin size={18} /></a><a aria-label="GitHub" href="https://github.com/" className="transition hover:text-white"><Github size={18} /></a><a aria-label="Email" href="mailto:santosh.thakur36911@gmail.com" className="transition hover:text-white"><Mail size={18} /></a></motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .35, duration: 1 }} className="relative mx-auto w-full max-w-md">
        <div className="absolute -inset-10 rounded-full bg-electric/10 blur-3xl" /><div className="relative rounded-3xl border hairline bg-[#0e1016]/90 p-5 shadow-2xl shadow-black/50"><div className="mb-8 flex items-center justify-between text-[10px] uppercase tracking-[.14em] text-slate-500"><span>System / 001</span><span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-lime" /> online</span></div><div className="space-y-3">{["Complex problem", "Engineering thinking", "Simple outcome"].map((x, i) => <div key={x} className="flex items-center gap-3"><span className="font-mono text-xs text-electric">0{i + 1}</span><div className={`h-14 flex-1 rounded-xl border px-4 py-4 text-sm ${i === 1 ? "border-electric/40 bg-electric/[.08] text-white" : "border-white/10 bg-white/[.025] text-slate-400"}`}>{x}</div>{i < 2 && <Minus className="text-slate-700" size={14} />}</div>)}</div><div className="mt-8 flex items-end justify-between border-t border-white/10 pt-5"><span className="text-xs text-slate-500">clarity / scale / care</span><span className="font-display text-2xl text-lime">→</span></div></div>
      </motion.div>
    </section>

    <Section id="work" eyebrow="Selected engineering stories" title="The interesting part is rarely the technology. It’s the problem around it.">
      <div className="mt-16">{stories.map(story => <StoryCard key={story.number} story={story} />)}</div>
    </Section>

    <Section id="thinking" eyebrow="Engineering mindset" title="How I approach difficult problems.">
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border hairline bg-white/10 md:grid-cols-5">{["Understand before changing", "Find the real bottleneck", "Simplify complexity", "Design for change", "Validate the outcome"].map((x, i) => <motion.div whileHover={{ backgroundColor: "rgba(139,167,255,.08)" }} key={x} className="bg-[#101218] p-6 md:min-h-48"><span className="font-mono text-sm text-lime">0{i + 1}</span><h3 className="mt-12 text-sm leading-6 text-slate-200">{x}</h3></motion.div>)}</div>
      <div className="mt-12 grid gap-5 md:grid-cols-2"><p className="text-lg leading-8 text-slate-300">The goal is not more code. The goal is a better solution.</p><div className="space-y-3 text-sm text-slate-400">{["Performance is part of the product.", "Measure before optimizing.", "Good abstractions reduce complexity.", "AI can accelerate development, but judgment still matters."].map(principle => <p key={principle} className="flex items-center gap-3 border-b hairline pb-3"><span className="text-lime">↳</span>{principle}</p>)}</div></div>
    </Section>

    <Section id="journey" eyebrow="A growing practice" title="Experience is not a finish line. It is a wider view of the system.">
      <div className="mt-16 grid gap-10 border-t hairline pt-8 md:grid-cols-[1fr_2fr]"><p className="font-display text-3xl leading-tight tracking-[-.03em] text-electric">From shaping interfaces<br />to shaping decisions.</p><div className="space-y-8 text-slate-400"><p className="text-lg leading-8">Over 6.5+ years, my work has moved through frontend craft, application architecture, performance, real-time experiences and the practical realities of evolving products.</p><p className="leading-7">React, Next.js, TypeScript, Angular, APIs, GraphQL, WebSockets, micro frontends, testing, accessibility, CI/CD, Docker and AWS have been tools in that journey—not the destination.</p></div></div>
    </Section>

    <Section id="toolbox" eyebrow="Technical toolbox" title="Tools are most useful when they disappear into the solution.">
      <div className="mt-14 divide-y divide-white/10 border-y hairline">{toolbox.map(([name, tools], i) => <div key={name} className="grid gap-3 py-6 md:grid-cols-[1fr_2fr]"><span className="text-sm text-slate-200"><span className="mr-3 font-mono text-xs text-lime">0{i + 1}</span>{name}</span><span className="text-sm leading-6 text-slate-500">{tools}</span></div>)}</div>
    </Section>

    <Section id="now" eyebrow="Currently exploring" title="Building beyond what I already know.">
      <div className="mt-16 grid gap-4 md:grid-cols-3">{[["01", "Backend systems", "Going deeper into APIs, data, server-side architecture and how complete systems work."], ["02", "AI-powered applications", "Exploring LLM APIs, streaming, structured outputs and useful AI workflows."], ["03", "Modern engineering", "Learning how architecture and development practices evolve as applications become more intelligent."]].map(([n, t, d]) => <div key={n} className="rounded-2xl border hairline bg-[#101218] p-7"><span className="font-mono text-sm text-lime">{n}</span><h3 className="mt-12 font-display text-2xl text-white">{t}</h3><p className="mt-4 text-sm leading-7 text-slate-400">{d}</p></div>)}</div><p className="mt-12 max-w-2xl border-l border-electric pl-5 text-lg leading-8 text-slate-300">I don’t believe experience means stopping learning. The best engineers continue expanding their understanding of the systems they build.</p>
    </Section>

    <Section id="contact" eyebrow="Start a conversation" title="Have something complex to build?">
      <div className="mt-14 flex flex-col justify-between gap-10 border-t hairline pt-8 md:flex-row md:items-end"><div><p className="max-w-lg text-lg leading-8 text-slate-400">I’m interested in ambitious products, hard problems and thoughtful conversations about technology.</p><a href="mailto:santoshthakurxd@gmail.com" className="mt-8 inline-flex items-center gap-3 text-xl text-white underline decoration-electric underline-offset-8 transition hover:text-lime">santoshthakurxd@gmail.com <ArrowUpRight size={18} /></a></div><div className="flex gap-5 text-slate-400"><a href="https://www.linkedin.com/in/ithakurr/" className="hover:text-white">LinkedIn</a><a href="https://github.com/" className="hover:text-white">GitHub</a></div></div>
    </Section>
    <footer className="mx-auto flex max-w-6xl justify-between border-t hairline px-6 py-8 text-xs text-slate-600 md:px-10"><span>Santosh Thakur · Noida, India</span><span>© {new Date().getFullYear()}</span></footer>
  </main>;
}
