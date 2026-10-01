import { ImageResponse } from "next/og";

export const alt = "타이포그래피 기초 북마크 — 좋아하는 링크를 한입에";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#f5f1e8",
        color: "#171714",
        fontFamily: "serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.18em" }}>
        TYPOGRAPHY · BOOKMARKS
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.15 }}>
          Typography Bookmarks
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#665f54" }}>
          Curate the links worth returning to.
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24 }}>
        <div style={{ width: 64, height: 8, display: "flex", background: "#e85d3f" }} />
        A thoughtful home for the links you love.
      </div>
    </div>,
    size,
  );
}
