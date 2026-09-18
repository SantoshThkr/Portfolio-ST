"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import { NodeMark } from "./node-mark";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
    // Close if the viewport grows past the mobile breakpoint while open.
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onChange = (event: MediaQueryListEvent) => event.matches && setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onChange);
    };
  }, [open]);

  // Marks the nav item for whichever section is currently nearest the
  // middle of the viewport. Purely a wayfinding aid — nothing depends on
  // it being right, so no fallback logic is needed if the page has no
  // matching sections (e.g. a case-study page).
  useEffect(() => {
    const ids = nav.map(item => item.href.split("#")[1]).filter((id): id is string => Boolean(id));
    const sections = ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0]!.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`site-header ${styles.header}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={close}>
          <NodeMark className={styles.mark} />
          <span className={styles.brandText}>
            <span className={styles.name}>{site.name}</span>
            <span className={styles.role}>{site.role}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className={styles.desktopNav}>
          <ul role="list">
            {nav.map(item => {
              const id = item.href.split("#")[1];
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active === id ? "location" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <a href={site.resume} className={styles.resume}>
                Résumé <span className="visually-hidden">(PDF)</span>
              </a>
            </li>
          </ul>
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
          <ul role="list">
            {nav.map(item => (
              <li key={item.href}>
                <Link href={item.href} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.resume} onClick={close}>
                Résumé <span className={styles.fileType}>PDF</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
