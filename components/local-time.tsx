"use client";

import { useEffect, useState } from "react";

/**
 * A quiet, live readout of the time where I'm actually based. Renders
 * nothing until mounted, so the server and the first client render match
 * exactly (no hydration mismatch) and nothing breaks if Intl or JS is
 * unavailable — it just never appears.
 */
export function LocalTime({ timeZone, label }: { timeZone: string; label: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let formatter: Intl.DateTimeFormat;
    try {
      formatter = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" });
    } catch {
      return;
    }

    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  if (!time) return null;

  return (
    <span>
      {label} <span aria-hidden="true">·</span> <time>{time}</time>{" "}
      <span className="visually-hidden">local time</span>
    </span>
  );
}
