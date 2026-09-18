"use client";

import { useEffect, useState } from "react";

// True once any page has mounted in this tab. The first page load isn't a
// transition — it paints immediately (and counts for LCP); every client-side
// navigation after it settles in while the persistent 3D scene re-poses.
let hasMounted = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hasMounted);
  useEffect(() => {
    hasMounted = true;
  }, []);
  return (
    <div className="route" data-animate={animate ? "" : undefined}>
      {children}
    </div>
  );
}
