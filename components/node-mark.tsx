/**
 * The site's identity mark: three connected nodes, the same motif already
 * used in the favicon and Open Graph cards (an input, a process, an
 * output — read as a pipeline, not a face). Used instead of a photo or
 * illustrated avatar, everywhere the site needs a small personal mark:
 * the header, the footer, the hero.
 */
export function NodeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 16" className={className} aria-hidden="true" focusable="false">
      <path d="M7.5 8h8.2M24.3 8H32.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="4" cy="8" r="3.25" fill="currentColor" />
      <circle cx="20" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="36" cy="8" r="3.25" fill="currentColor" />
    </svg>
  );
}
