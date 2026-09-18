"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import { StackMark } from "./stack-mark";
import styles from "./site-header.module.css";

const lockClass = styles.lock ?? "menu-open";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Solid background once the page moves; transparent over the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Which chapter is in the middle of the viewport.
  useEffect(() => {
    const sections = nav
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      entries => {
        const hit = entries.find(entry => entry.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  // Menu: Escape and outside clicks close it; focus goes back to the button.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 56rem)");
    const onChange = (event: MediaQueryListEvent) => event.matches && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onChange);
    document.documentElement.classList.add(lockClass);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onChange);
      document.documentElement.classList.remove(lockClass);
    };
  }, [open]);

  const close = () => setOpen(false);
  // Chapter highlighting only means something on the home page.
  const current = pathname === "/" ? active : null;

  return (
    <header className={`site-header ${styles.header}`} data-scrolled={scrolled} data-open={open}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={close}>
          <StackMark className={styles.mark} />
          <span className={styles.brandText}>
            <span className={styles.name}>{site.name}</span>
            <span className={styles.role}>{site.role}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className={styles.desktopNav}>
          <ol role="list">
            {nav.map((item, index) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={current === item.id ? "location" : undefined}>
                  <span className={styles.num} aria-hidden="true">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
          <a href={site.resume} className={styles.resume}>
            Résumé <span className="visually-hidden">(PDF)</span>
          </a>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(value => !value)}
        >
          <span className={styles.menuIcon} data-open={open} aria-hidden="true" />
          Menu
        </button>
      </div>

      <div id="mobile-menu" ref={panelRef} className={styles.panel} hidden={!open}>
        <nav aria-label="Mobile" className="container">
          <ol role="list">
            {nav.map((item, index) => (
              <li key={item.href} style={{ "--i": index } as React.CSSProperties}>
                <Link href={item.href} onClick={close}>
                  <span className={styles.num} aria-hidden="true">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
            <li style={{ "--i": nav.length } as React.CSSProperties}>
              <a href={site.resume} onClick={close}>
                <span className={styles.num} aria-hidden="true">
                  PDF
                </span>
                Résumé
              </a>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
}
