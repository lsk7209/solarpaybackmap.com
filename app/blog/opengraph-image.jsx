import { ImageResponse } from "next/og";
import { formatDisplayDate, getLatestUpdated } from "@/lib/dates";
import { getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  const posts = getPublishedPosts();
  const latestUpdated = getLatestUpdated(posts);

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
          borderTop: "18px solid #2F7E78",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>Solar Payback Map Journal</div>
          <div
            style={{
              background: "#E7F0EB",
              border: "2px solid #2F7E78",
              borderRadius: 999,
              color: "#2F7E78",
              fontSize: 24,
              fontWeight: 800,
              padding: "10px 22px",
            }}
          >
            Solar Payback
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#2F7E78", fontSize: 30, fontWeight: 800, marginBottom: 22 }}>
            Public-source solar research
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.06, maxWidth: 1040 }}>
            Solar payback articles for policy, rates, incentives, and quote decisions
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, color: "#4A5963", fontSize: 26 }}>
          <span>{posts.length} published articles</span>
          <span>Updated {latestUpdated ? formatDisplayDate(latestUpdated) : "recently"}</span>
          <span>Reviewed sources</span>
          <span>No lead-gen math</span>
        </div>
      </div>
    ),
    size
  );
}
