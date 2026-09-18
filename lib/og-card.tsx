import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card so every page's social preview matches the site. */
export function ogCard({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f5f6f4",
          color: "#13233a",
          backgroundImage:
            "linear-gradient(#e3e6ea 1px, transparent 1px), linear-gradient(90deg, #e3e6ea 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#4b5870", fontWeight: 600 }}>{kicker}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 36, lineHeight: 1.3, color: "#4b5870", maxWidth: 980 }}>
            {subtitle}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {["Interface", "API", "Retrieval", "Model"].map((step, index) => (
            <div key={step} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  padding: "12px 22px",
                  border: "2px solid #2f3fe4",
                  borderRadius: 6,
                  background: "#ffffff",
                  fontSize: 26,
                  fontWeight: 600,
                }}
              >
                {step}
              </div>
              {index < 3 && <div style={{ display: "flex", width: 44, height: 2, background: "#2f3fe4" }} />}
            </div>
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}
