import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const layerNames = ["Interface", "API", "Data & retrieval", "Model", "Infrastructure"];

/** Shared Open Graph card: the stack on the right, the words on the left. */
export function ogCard({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "72px 80px",
          background: "#0b0c0e",
          backgroundImage: "radial-gradient(circle at 78% 45%, rgba(255,138,61,0.16), transparent 55%)",
          color: "#ede9e3",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, color: "#aaa49b", textTransform: "uppercase" }}>
            {kicker}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
              {title}
            </div>
            <div style={{ display: "flex", marginTop: 28, fontSize: 32, lineHeight: 1.35, color: "#aaa49b" }}>
              {subtitle}
            </div>
          </div>
          <div style={{ display: "flex", width: 72, height: 4, background: "#ff8a3d" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 40, flex: 1 }}>
          {layerNames.map((name, i) => (
            <div key={name} style={{ display: "flex", alignItems: "center", marginTop: i === 0 ? 0 : 18 }}>
              <svg width="230" height="70" viewBox="0 0 230 70">
                <path
                  d="M115 2 L228 35 L115 68 L2 35 Z"
                  fill="#15171b"
                  stroke={i === 0 ? "#ff8a3d" : "rgba(237,233,227,0.35)"}
                  strokeWidth="2"
                />
              </svg>
              <div style={{ display: "flex", marginLeft: 14, fontSize: 17, letterSpacing: 2, color: i === 0 ? "#ff8a3d" : "#aaa49b" }}>
                {`0${i + 1} ${name.toUpperCase()}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}
