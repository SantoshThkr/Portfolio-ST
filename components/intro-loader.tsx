"use client";

import { m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const INTRO_KEY = "portfolio-intro-seen";
type IntroState = "visible" | "exiting" | "hidden";

export function IntroLoader() {
  const [state, setState] = useState<IntroState>("visible");
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    let isCurrent = true;

    try {
      if (typeof window !== "undefined" && window.sessionStorage.getItem(INTRO_KEY)) {
        setState("hidden");
        return;
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(INTRO_KEY, "true");
      }
    } catch {
      if (isCurrent) setState("hidden");
      return;
    }

    const exitDelay = reducedMotion ? 450 : 1800;
    const exitTimer = window.setTimeout(() => {
      if (isCurrent) setState("exiting");
    }, exitDelay);
    const hideTimer = window.setTimeout(() => {
      if (isCurrent) setState("hidden");
    }, exitDelay + (reducedMotion ? 150 : 650));

    return () => {
      isCurrent = false;
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [reducedMotion]);

  if (state === "hidden") return null;

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-0 z-[70] grid place-items-center bg-ink"
      initial={{ opacity: 1 }}
      animate={{ opacity: state === "exiting" ? 0 : 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex flex-col items-center">
        <m.div
          className="absolute -inset-14 rounded-full bg-electric/15 blur-3xl"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: state === "exiting" ? 0 : 1, scale: state === "exiting" ? 1.1 : 1 }}
          transition={{ duration: reducedMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <m.div
          className="relative grid h-24 w-24 place-items-center rounded-3xl border border-white/15 bg-[#101218] font-display text-4xl tracking-[-.08em] text-white shadow-2xl shadow-black/50"
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          ST<span className="text-lime">.</span>
        </m.div>
        <m.p
          className="mt-6 text-[10px] font-semibold tracking-[.35em] text-slate-400"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: state === "exiting" ? 0 : 1, y: state === "exiting" ? -4 : 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.45, duration: reducedMotion ? 0 : 0.55 }}
        >
          SANTOSH THAKUR
        </m.p>
      </div>
    </m.div>
  );
}
