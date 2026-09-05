import { ImageResponse } from "next/og";

export const alt = "StackPilot — Pick your stack. Scale with confidence.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#0A0A0B",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        color: "#F2F2F3",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: 28,
          color: "#9A9AA2",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            border: "1px solid #26262A",
            background: "#141416",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 99,
              background: "#5B8DFF",
            }}
          />
        </div>
        StackPilot
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 72, fontWeight: 500, letterSpacing: "-2px" }}>
          Pick your stack.
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 500,
            color: "#9A9AA2",
            letterSpacing: "-2px",
          }}
        >
          Scale with confidence.
        </div>
      </div>
      <div style={{ fontSize: 24, color: "#9A9AA2" }}>
        19 stacks · deterministic rules · shareable URL
      </div>
    </div>,
    { ...size },
  );
}
