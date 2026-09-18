"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import styles from "./about.module.css";

/**
 * The portrait as a small stage: the cut-out figure stands on the same
 * perspective grid as the 3D stack, with light behind. Pointer movement
 * shifts the layers by different amounts for a little real depth. No
 * listener at all when reduced motion is requested or there's no mouse.
 */
export function DepthPortrait() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      node.style.setProperty("--px", x.toFixed(3));
      node.style.setProperty("--py", y.toFixed(3));
    };
    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      x = 0;
      y = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const section = node.closest("section") ?? node;
    section.addEventListener("pointermove", onMove as EventListener);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove as EventListener);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={styles.stage}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.floor} aria-hidden="true" />
      <Image
        className={styles.figure}
        src={site.portrait.src}
        width={site.portrait.width}
        height={site.portrait.height}
        alt="Santosh Thakur, in a dark blazer and glasses, looking off to one side."
        sizes="(min-width: 56rem) 34vw, 86vw"
      />
      <span className={`${styles.tick} ${styles.tl}`} aria-hidden="true" />
      <span className={`${styles.tick} ${styles.tr}`} aria-hidden="true" />
      <span className={`${styles.tick} ${styles.bl}`} aria-hidden="true" />
      <span className={`${styles.tick} ${styles.br}`} aria-hidden="true" />
    </div>
  );
}
