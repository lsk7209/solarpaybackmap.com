import { ImageResponse } from "next/og";
import { formatDisplayDate, getLatestUpdated } from "@/lib/dates";
import { getPublishedCategories, getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  const categories = getPublishedCategories();
  const latestUpdated = getLatestUpdated(getPublishedPosts());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F5F0",
          color: "#22303A",
          padding: 64,
          borderTop: "18px solid #B5762A",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>Solar Payback Map Journal</div>
          <div style={{ color: "#B5762A", fontSize: 24, fontWeight: 800 }}>
            /blog/category
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#B5762A", fontSize: 30, fontWeight: 800, marginBottom: 22 }}>
            Crawlable Topic Hubs
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.04, maxWidth: 1020 }}>
            Solar payback research organized by homeowner decision theme
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, color: "#4A5963", fontSize: 26 }}>
          <span>{categories.length} topic hubs</span>
          <span>Updated {latestUpdated ? formatDisplayDate(latestUpdated) : "recently"}</span>
          <span>Policy, rates, roof, finance</span>
          <span>Search-ready structure</span>
        </div>
      </div>
    ),
    size
  );
}
