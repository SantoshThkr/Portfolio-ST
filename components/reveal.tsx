"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Which element to render — kept to a fixed set so the ref stays simply typed. */
  as?: "div" | "li" | "article";
  className?: string;
  /** Stagger index; converted to a delay in milliseconds. */
  index?: number;
  /** Milliseconds per step of `index`. */
  step?: number;
  id?: string;
  "aria-labelledby"?: string;
};

/**
 * Fades an element up into place the first time it scrolls into view.
 *
 * Content is visible by default (see the `.reveal` rules in globals.css):
 * the hidden-then-revealed state only exists once a `reveal-armed` class
 * lands on <html>, which the inline script in layout.tsx only adds when JS
 * runs and the OS has not requested reduced motion. So this component can
 * never leave content invisible for someone without JS, and never animates
 * for someone who asked not to see motion.
 */
export function Reveal({
  children,
  as = "div",
  className = "",
  index = 0,
  step = 70,
  id,
  "aria-labelledby": ariaLabelledBy,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // A callback ref (rather than ref={ref}) so the same ref object can be
  // attached to whichever concrete tag `as` renders without an `any` cast.
  const attach = (node: HTMLElement | null) => {
    ref.current = node;
  };

  useEffect(() => {
    const node = ref.current;
    if (!node || !document.documentElement.classList.contains("reveal-armed")) {
      node?.setAttribute("data-visible", "true");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.setAttribute("data-visible", "true");
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style = { "--reveal-delay": `${index * step}ms` } as CSSProperties;
  const combined = `reveal ${className}`.trim();

  if (as === "li") {
    return (
      <li ref={attach} className={combined} style={style} id={id} aria-labelledby={ariaLabelledBy}>
        {children}
      </li>
    );
  }
  if (as === "article") {
    return (
      <article ref={attach} className={combined} style={style} id={id} aria-labelledby={ariaLabelledBy}>
        {children}
      </article>
    );
  }
  return (
    <div ref={attach} className={combined} style={style} id={id} aria-labelledby={ariaLabelledBy}>
      {children}
    </div>
  );
}
