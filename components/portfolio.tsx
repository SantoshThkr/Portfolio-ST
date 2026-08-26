"use client";

import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, Menu, Minus, X } from "lucide-react";
import { useRef, useState } from "react";
import { engineeringPrinciples, explorations, mindsetPrinciples, navigation, stories, systemSteps, toolbox } from "@/lib/content";
import { ContactSection, JourneySection, NowSection, ThinkingSection, ToolboxSection, WorkSection } from "./portfolio-sections";

function Header({ menu, active, onMenuToggle, onNavigate }: { menu: boolean; active: number; onMenuToggle: () => void; onNavigate: (index: number) => void }) {
  return <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[.08] bg-ink/75 backdrop-blur-xl"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10"><a href="#" className="font-display text-lg tracking-[-.04em]">ST<span className="text-lime">.</span></a><nav className="hidden items-center gap-7 md:flex">{navigation.map((item, index) => <a key={item.id} href={`#${item.id}`} onClick={() => onNavigate(index)} className={`text-xs transition-colors ${active === index ? "text-white" : "text-slate-500 hover:text-white"}`}>{item.label}</a>)}</nav><button aria-label={menu ? "Close menu" : "Open menu"} onClick={onMenuToggle} className="md:hidden">{menu ? <X size={20} /> : <Menu size={20} />}</button></div>{menu && <div className="border-t border-white/10 px-6 py-5 md:hidden">{navigation.map(item => <a key={item.id} href={`#${item.id}`} onClick={onMenuToggle} className="block py-3 text-sm text-slate-300">{item.label}</a>)}</div>}</header>;
}

function Hero({ inView }: { inView: boolean }) {
  return <section id="home" className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-14 px-6 pb-20 pt-36 md:grid-cols-[1.1fr_.9fr] md:px-10 md:pt-28"><div className="absolute inset-x-0 top-0 -z-10 h-[680px] grid-bg" /><motion.div initial="hidden" animate={inView ? "show" : "hidden"} variants={{ hidden: {}, show: { transition: { staggerChildren: .1 } } }}><motion.p variants={heroFadeUp} className="eyebrow mb-7">Software Engineer · Problem Solver</motion.p><motion.h1 variants={heroFadeUp} className="max-w-3xl font-display text-6xl font-medium leading-[.98] tracking-[-.07em] text-balance md:text-8xl">I build systems that turn <span className="text-electric">complex problems</span> into simple experiences.</motion.h1><motion.p variants={heroFadeUp} className="mt-8 max-w-xl text-base leading-7 text-slate-400 md:text-lg">6.5+ years building scalable digital products. I care about the decisions behind the interface—and I’m exploring what happens when software becomes more intelligent.</motion.p><motion.div variants={heroFadeUp} className="mt-10 flex flex-wrap gap-3"><a href="#work" className="group inline-flex items-center gap-3 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink">Explore my work <ArrowDownRight size={16} className="transition-transform group-hover:rotate-[-45deg]" /></a><a href="#contact" className="inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm text-white transition hover:border-white/40">Let’s connect <ArrowUpRight size={16} /></a></motion.div><motion.div variants={heroFadeUp} className="mt-12 flex gap-5 text-slate-500"><a aria-label="LinkedIn" href="https://www.linkedin.com/in/ithakurr/" className="transition hover:text-white"><Linkedin size={18} /></a><a aria-label="GitHub" href="https://github.com/" className="transition hover:text-white"><Github size={18} /></a><a aria-label="Email" href="mailto:santoshthakurxd@gmail.com" className="transition hover:text-white"><Mail size={18} /></a></motion.div></motion.div><HeroSystem /></section>;
}

const heroFadeUp = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: .65, ease: [.22, 1, .36, 1] } } };

function HeroSystem() {
  return <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .35, duration: 1 }} className="relative mx-auto w-full max-w-md"><div className="absolute -inset-10 rounded-full bg-electric/10 blur-3xl" /><div className="relative rounded-3xl border hairline bg-[#0e1016]/90 p-5 shadow-2xl shadow-black/50"><div className="mb-8 flex items-center justify-between text-[10px] uppercase tracking-[.14em] text-slate-500"><span>System / 001</span><span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-lime" /> online</span></div><div className="space-y-3">{systemSteps.map((step, index) => <div key={step} className="flex items-center gap-3"><span className="font-mono text-xs text-electric">0{index + 1}</span><div className={`h-14 flex-1 rounded-xl border px-4 py-4 text-sm ${index === 1 ? "border-electric/40 bg-electric/[.08] text-white" : "border-white/10 bg-white/[.025] text-slate-400"}`}>{step}</div>{index < systemSteps.length - 1 && <Minus className="text-slate-700" size={14} />}</div>)}</div><div className="mt-8 flex items-end justify-between border-t border-white/10 pt-5"><span className="text-xs text-slate-500">clarity / scale / care</span><span className="font-display text-2xl text-lime">→</span></div></div></motion.div>;
}

export default function Portfolio() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return <main ref={ref} className="noise overflow-hidden"><motion.div className="fixed left-0 right-0 top-0 z-50 h-px origin-left bg-lime" style={{ scaleX }} /><Header menu={menu} active={active} onMenuToggle={() => setMenu(value => !value)} onNavigate={setActive} /><Hero inView={inView} /><WorkSection stories={stories} /><ThinkingSection principles={mindsetPrinciples} engineeringPrinciples={engineeringPrinciples} /><JourneySection /><ToolboxSection toolbox={toolbox} /><NowSection explorations={explorations} /><ContactSection /><footer className="mx-auto flex max-w-6xl justify-between border-t hairline px-6 py-8 text-xs text-slate-600 md:px-10"><span>Santosh Thakur · Noida, India</span><span>© {new Date().getFullYear()}</span></footer></main>;
}
