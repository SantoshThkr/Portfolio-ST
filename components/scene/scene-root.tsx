"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { LayerId, SceneConfig } from "@/lib/content";
import type { Cue, StackEngine } from "./engine";
import styles from "./scene-root.module.css";

/**
 * Hosts the one persistent WebGL canvas. It lives in the root layout, so it
 * survives client-side navigation: opening a case study doesn't restart the
 * scene, it re-poses the same stack — that is the page transition.
 *
 * Pages never talk to the engine directly. They mark regions of the DOM with
 * `data-scene` (and `data-project`, `data-layer`), and this component reads
 * which region sits in the middle of the viewport. Content stays plain,
 * server-rendered HTML; the 3D is a layer on top that can fail or be absent
 * without taking anything with it.
 */
export function SceneRoot({ config }: { config: SceneConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<StackEngine | null>(null);
  const pathname = usePathname();

  // Boot the engine once, lazily, after the page is interactive.
  useEffect(() => {
    const canvas = canvasRef.current;
    const labels = labelsRef.current;
    if (!canvas || !labels) return;
    // No WebGL2, or the visitor asked to save data: skip the 3D download
    // entirely and show the static drawing instead.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || !supportsWebGL2()) {
      document.documentElement.classList.add("no-webgl");
      return;
    }

    let cancelled = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const boot = async () => {
      const { StackEngine } = await import("./engine");
      if (cancelled) return;
      engineRef.current = new StackEngine({
        canvas,
        labels,
        config,
        reducedMotion,
        classes: {
          layer: styles.layerLabel ?? "scene-layer-label",
          component: styles.componentLabel ?? "scene-component-label",
          active: styles.active ?? "is-active",
          index: styles.index ?? "scene-index",
        },
        onHoverLayer: id => {
          document.querySelectorAll<HTMLElement>("[data-scene='skills']").forEach(el => {
            if (id) el.dataset.hoverLayer = id;
            else delete el.dataset.hoverLayer;
          });
        },
      });
      document.documentElement.classList.add("scene-ready");
      void document.fonts?.ready.then(() => engineRef.current?.resize());
      window.dispatchEvent(new Event("scroll"));
    };

    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const handle = idle ? idle(() => void boot(), { timeout: 600 }) : window.setTimeout(() => void boot(), 120);

    const onResize = () => engineRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      if (!idle) window.clearTimeout(handle);
      window.removeEventListener("resize", onResize);
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [config]);

  // Director: map scroll position to a scene cue. Re-scans on every route.
  useEffect(() => {
    let frame = 0;
    let focus: LayerId | "quality" | null = null;

    const regions = () => Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));

    const compute = () => {
      frame = 0;
      const mid = window.innerHeight * 0.5;
      let cue: Cue | null = null;
      for (const el of regions()) {
        const rect = el.getBoundingClientRect();
        if (rect.top > mid || rect.bottom < mid) continue;
        const mode = el.dataset.scene;
        const project = el.dataset.project ?? "";
        if (mode === "anatomy") {
          const track = el.querySelector<HTMLElement>("[data-steps]") ?? el;
          const r = track.getBoundingClientRect();
          const progress = Math.min(0.9999, Math.max(0, (mid - r.top) / Math.max(1, r.height)));
          markStep(el, Math.min(5, Math.floor(progress * 6)));
          cue = { mode: "anatomy", progress };
        } else if (mode === "work" || mode === "case") {
          cue = { mode, project };
        } else if (mode === "skills") {
          cue = { mode: "skills", focus };
        } else if (mode === "hero" || mode === "contact" || mode === "quiet") {
          cue = { mode };
        }
        break;
      }
      if (cue) engineRef.current?.setCue(cue);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    // Skill rows and the 3D layers highlight each other.
    const onFocusIn = (event: Event) => {
      const row = (event.target as HTMLElement).closest<HTMLElement>("[data-layer]");
      focus = (row?.dataset.layer as LayerId | "quality" | undefined) ?? null;
      schedule();
    };
    const onFocusOut = (event: Event) => {
      const row = (event.target as HTMLElement).closest<HTMLElement>("[data-layer]");
      if (row) {
        focus = null;
        schedule();
      }
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("pointerover", onFocusIn);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("pointerout", onFocusOut);
    document.addEventListener("focusout", onFocusOut);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("pointerover", onFocusIn);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("pointerout", onFocusOut);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [pathname]);

  return (
    <div className={styles.stage} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={labelsRef} className={styles.labels} />
    </div>
  );
}

function markStep(section: HTMLElement, step: number) {
  if (section.dataset.activeStep === String(step)) return;
  section.dataset.activeStep = String(step);
  section.querySelectorAll<HTMLElement>("[data-step]").forEach(el => {
    el.toggleAttribute("data-current", el.dataset.step === String(step));
  });
}

/**
 * Hardware-accelerated WebGL2 only. `failIfMajorPerformanceCaveat` makes the
 * browser refuse when it would fall back to software rendering (no GPU, or a
 * blocklisted one) — there, a 60fps scene would burn the CPU, and the static
 * drawing is the better experience.
 */
function supportsWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}
