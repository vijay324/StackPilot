import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "#0A0A0B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #26262A",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 99,
          background: "#5B8DFF",
        }}
      />
    </div>,
    { ...size },
  );
}
