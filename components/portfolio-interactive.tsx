"use client";

import { LazyMotion, domAnimation, m, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, Menu, Minus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { emailAddress, githubUrl, hasResume, linkedinUrl, navigation, resumeUrl, systemSteps } from "@/lib/content";

const resumeHref = hasResume ? resumeUrl : `mailto:${emailAddress}?subject=${encodeURIComponent("Resume request")}`;
const resumeExternal = hasResume;
const heroFadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
};

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function PageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <m.div aria-hidden="true" className="page-progress" style={{ scaleX }} />;
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

  useEffect(() => {
    if (!menu) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menu]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="#home" aria-label="Santosh Thakur home" className="brand">ST<span aria-hidden="true">.</span></a>
        <nav aria-label="Primary navigation" className="desktop-nav">
          {navigation.map((item, index) => <a key={item.id} href={`#${item.id}`} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)}>{item.label}</a>)}
        </nav>
        <div className="desktop-links">
          <a href={resumeHref} target={resumeExternal ? "_blank" : undefined} rel={resumeExternal ? "noreferrer" : undefined} className="resume-link">Resume</a>
          <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">IN</a>
        </div>
        <button type="button" aria-label={menu ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(value => !value)} className="menu-button">
          {menu ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>
      {menu && <div id="mobile-navigation" className="mobile-nav-panel" role="dialog" aria-label="Mobile navigation">
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => <a key={item.id} href={`#${item.id}`} aria-current={active === index ? "true" : undefined} onClick={() => setMenu(false)}>{item.label}</a>)}
        </nav>
        <div className="mobile-links">
          <a href={resumeHref} target={resumeExternal ? "_blank" : undefined} rel={resumeExternal ? "noreferrer" : undefined}>Resume</a>
          <a href={githubUrl} target="_blank" rel="noreferrer">GitHub</a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>}
    </header>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section ref={ref} id="home" aria-labelledby="hero-title" className="hero-section">
      <div aria-hidden="true" className="hero-grid" />
      <m.div initial={reducedMotion ? false : "hidden"} animate={reducedMotion ? undefined : inView ? "show" : "hidden"} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="hero-copy">
        <m.p variants={heroFadeUp} className="eyebrow hero-eyebrow">Full-Stack AI Engineer · Product-minded builder</m.p>
        <m.h1 id="hero-title" variants={heroFadeUp} className="hero-title">I build <span>AI-powered products</span> from the interface to the service layer.</m.h1>
        <m.p variants={heroFadeUp} className="hero-description">6.5+ years building production software across React, Next.js, APIs, real-time systems and AI application workflows.</m.p>
        <m.div variants={heroFadeUp} className="hero-actions">
          <a href="#builds" className="button button-primary">See the builds <ArrowDownRight aria-hidden="true" size={16} /></a>
          <a href="#contact" className="button button-secondary">Let’s connect <ArrowUpRight aria-hidden="true" size={16} /></a>
          <a href={resumeHref} target={resumeExternal ? "_blank" : undefined} rel={resumeExternal ? "noreferrer" : undefined} className="button button-secondary">Resume <ArrowUpRight aria-hidden="true" size={16} /></a>
        </m.div>
        <m.p variants={heroFadeUp} className="hero-stack">React · Next.js · TypeScript · APIs · real-time systems · LLM applications</m.p>
      </m.div>
      <HeroSystem reducedMotion={reducedMotion} />
    </section>
  );
}

function HeroSystem({ reducedMotion }: { reducedMotion: boolean }) {
  return <m.div initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={reducedMotion ? { duration: 0 } : { delay: 0.25, duration: 0.7 }} className="hero-approach">
    <div className="eyebrow-row"><span className="eyebrow">How I work</span><span className="status-pill">In practice</span></div>
    <ol>{systemSteps.map((step, index) => <li key={step}><span className="step-number">0{index + 1}</span><div><h2>{step}</h2><p>{["Understand the constraint before choosing the tool.", "Make boundaries and trade-offs explicit.", "Ship the smallest useful outcome and learn from it."][index]}</p></div>{index < systemSteps.length - 1 && <Minus aria-hidden="true" className="step-divider" size={14} />}</li>)}</ol>
    <div className="hero-approach-footer"><span>product / systems / AI</span><span aria-hidden="true" className="hero-arrow">→</span></div>
  </m.div>;
}
