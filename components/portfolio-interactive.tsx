"use client";

import { LazyMotion, domAnimation, m, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, Menu, Minus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { emailAddress, githubUrl, linkedinUrl, navigation, resumeUrl, systemSteps } from "@/lib/content";

const heroFadeUp = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: .65, ease: [.22, 1, .36, 1] } } };

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function PageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <m.div aria-hidden="true" className="fixed left-0 right-0 top-0 z-50 h-px origin-left bg-lime" style={{ scaleX }} />;
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");
    let pointerX = -100;
    let pointerY = -100;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;

    const render = () => {
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = window.requestAnimationFrame(render);
    };
    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("a, button, [data-cursor]") : null;
      const kind = target?.dataset.cursor ?? (target?.matches("a") ? (target.matches('a[href^="http"]') ? "external" : "link") : "default");
      ringRef.current?.setAttribute("data-state", kind);
    };
    const onLeave = () => ringRef.current?.setAttribute("data-state", "hidden");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;
  return <><div ref={dotRef} aria-hidden="true" className="custom-cursor-dot" /><div ref={ringRef} aria-hidden="true" data-state="default" className="custom-cursor-ring" /></>;
}

export function Header() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = navigation.map(item => document.getElementById(item.id)).filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const index = navigation.findIndex(item => item.id === visible.target.id);
        if (index >= 0) setActive(index);
      }
    }, { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] });

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[.08] bg-ink/75 backdrop-blur-xl"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10"><a href="#home" aria-label="Santosh Thakur home" className="rounded-sm font-display text-lg tracking-[-.04em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink">ST<span aria-hidden="true" className="text-lime">.</span></a><nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">{navigation.map((item, index) => <a key={item.id} href={`#${item.id}`} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)} data-cursor="link" className={`relative rounded-sm text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${active === index ? "text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-lime after:content-['']" : "text-slate-400 hover:text-white"}`}>{item.label}</a>)}<a href={resumeUrl} data-cursor="external" className="text-xs text-lime transition-colors hover:text-white">Resume</a></nav><button type="button" aria-label={menu ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(value => !value)} className="rounded-md p-2 text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:hidden">{menu ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}</button></div>{menu && <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-white/10 px-6 py-5 md:hidden">{navigation.map(item => <a key={item.id} href={`#${item.id}`} onClick={() => setMenu(false)} className="block rounded-sm py-3 text-sm text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink">{item.label}</a>)}</nav>}</header>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion() ?? false;

  return <section ref={ref} id="home" aria-labelledby="hero-title" className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-14 px-6 pb-20 pt-36 md:grid-cols-[1.1fr_.9fr] md:px-10 md:pt-28"><div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[680px] grid-bg" /><m.div initial={shouldReduceMotion ? false : "hidden"} animate={shouldReduceMotion ? undefined : inView ? "show" : "hidden"} variants={{ hidden: {}, show: { transition: { staggerChildren: shouldReduceMotion ? 0 : .1 } } }}><m.p variants={heroFadeUp} className="eyebrow mb-7">Software Engineer · Problem Solver</m.p><m.h1 id="hero-title" variants={heroFadeUp} className="max-w-3xl text-[clamp(2.75rem,13vw,6rem)] font-display font-medium leading-[.98] tracking-[-.07em] text-balance md:text-8xl">I build systems that turn <span className="text-electric">complex problems</span> into simple experiences.</m.h1><m.p variants={heroFadeUp} className="mt-8 max-w-xl text-base leading-7 text-slate-400 md:text-lg">6.5+ years building production software, scalable applications and products that have to hold up under real-world constraints.</m.p><m.div variants={heroFadeUp} className="mt-10 flex flex-wrap gap-3"><a href="#work" data-cursor="cta" className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink">Explore my work <ArrowDownRight aria-hidden="true" size={16} className="transition-transform group-hover:rotate-[-45deg]" /></a>  <a href="#contact" data-cursor="cta" className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm text-white transition hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink">Let’s connect <ArrowUpRight aria-hidden="true" size={16} /></a><a href={resumeUrl} data-cursor="external" className="inline-flex min-h-11 items-center gap-3 rounded-full border border-electric/30 px-5 py-3 text-sm text-electric transition hover:border-electric hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink">Resume <ArrowUpRight aria-hidden="true" size={16} /></a></m.div><m.div variants={heroFadeUp} className="mt-12 flex gap-5 text-slate-400"><a aria-label="LinkedIn" href={linkedinUrl} data-cursor="external" className="rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink transition hover:text-white"><Linkedin aria-hidden="true" size={18} /></a><a aria-label="GitHub" href={githubUrl} data-cursor="external" className="rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink transition hover:text-white"><Github aria-hidden="true" size={18} /></a><a aria-label="Email" href={`mailto:${emailAddress}`} data-cursor="link" className="rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink transition hover:text-white"><Mail aria-hidden="true" size={18} /></a></m.div></m.div><HeroSystem reducedMotion={shouldReduceMotion} /></section>;
}

function HeroSystem({ reducedMotion }: { reducedMotion: boolean }) {
  return <m.div initial={reducedMotion ? false : { opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={reducedMotion ? { duration: 0 } : { delay: .35, duration: 1 }} className="relative mx-auto w-full max-w-md"><div aria-hidden="true" className="absolute -inset-10 rounded-full bg-electric/10 blur-3xl" /><div className="relative rounded-3xl border hairline bg-[#0e1016]/90 p-5 shadow-2xl shadow-black/50"><div className="mb-8 flex items-center justify-between text-[10px] uppercase tracking-[.14em] text-slate-400"><span>System / 001</span><span className="flex items-center gap-2"><i aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" /> online</span></div><div className="space-y-3">{systemSteps.map((step, index) => <div key={step} className="flex items-center gap-3"><span aria-hidden="true" className="font-mono text-xs text-electric">0{index + 1}</span><div className={`h-14 flex-1 rounded-xl border px-4 py-4 text-sm ${index === 1 ? "border-electric/40 bg-electric/[.08] text-white" : "border-white/10 bg-white/[.025] text-slate-400"}`}>{step}</div>{index < systemSteps.length - 1 && <Minus aria-hidden="true" className="text-slate-700" size={14} />}</div>)}</div><div className="mt-8 flex items-end justify-between border-t border-white/10 pt-5"><span className="text-xs text-slate-400">production / performance / product</span><span aria-hidden="true" className="font-display text-2xl text-lime">→</span></div></div></m.div>;
}
