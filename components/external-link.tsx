import type { ComponentPropsWithoutRef } from "react";

type ExternalLinkProps = Omit<ComponentPropsWithoutRef<"a">, "target" | "rel"> & {
  href: string;
  /** Buttons draw their own arrow in CSS, so they opt out of the inline one. */
  arrow?: boolean;
};

/** Opens in a new tab safely and tells screen-reader users that it will. */
export function ExternalLink({ children, arrow = true, ...props }: ExternalLinkProps) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer" data-external="">
      {children}
      {arrow && <span aria-hidden="true"> ↗</span>}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
