/**
 * The identity mark: the stack, seen from above — one lit layer over two.
 * The same object the 3D scene renders, reduced to a glyph.
 */
export function StackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M12 2.8 21.2 7.4 12 12 2.8 7.4Z" fill="var(--signal, #ff8a3d)" />
      <path d="m2.8 11.6 9.2 4.6 9.2-4.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m2.8 15.8 9.2 4.6 9.2-4.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.55" />
    </svg>
  );
}
