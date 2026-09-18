"use client";

import { useEffect, useState } from "react";

/**
 * A live readout of the time where I'm based. Renders nothing until mounted,
 * so server and client markup match and nothing breaks without JS or Intl.
 */
export function LocalTime({ timeZone, prefix }: { timeZone: string; prefix?: string }) {
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
      {prefix}
      <time>{time}</time> IST<span className="visually-hidden"> local time</span>
    </span>
  );
}
