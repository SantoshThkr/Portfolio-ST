import { layers } from "@/lib/content";

/**
 * A static drawing of the stack, shown only when the 3D scene can't run
 * (no JavaScript, or no WebGL2). Same object, same labels, no motion.
 */
export function StackFallback({ className }: { className?: string }) {
  const gap = 46;
  return (
    <svg viewBox="0 0 520 360" className={className} aria-hidden="true" focusable="false">
      {layers.map((layer, i) => {
        const y = 60 + i * gap;
        return (
          <g key={layer.id}>
            <path
              d={`M160 ${y} L280 ${y + 34} L160 ${y + 68} L40 ${y + 34} Z`}
              fill="#15171b"
              fillOpacity="0.9"
              stroke={i === 0 ? "#ff8a3d" : "rgb(237 233 227 / 0.35)"}
              strokeWidth="1"
            />
            <line x1="280" y1={y + 34} x2="306" y2={y + 34} stroke="rgb(237 233 227 / 0.35)" />
            <text
              x="314"
              y={y + 38}
              fill="#aaa49b"
              fontFamily="ui-monospace, monospace"
              fontSize="10"
              letterSpacing="1"
            >
              {String(i + 1).padStart(2, "0")} {layer.name.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
