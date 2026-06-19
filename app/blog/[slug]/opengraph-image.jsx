import { ImageResponse } from "next/og";
import { formatDisplayDate } from "@/lib/dates";
import { getPublishedPost } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  const accent = post?.accent?.primary || "#2F7E78";
  const wash = post?.accent?.secondary || "#F6ECDA";

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
          borderTop: `18px solid ${accent}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>Solar Payback Map</div>
          <div
            style={{
              background: wash,
              border: `2px solid ${accent}`,
              borderRadius: 999,
              color: accent,
              fontSize: 24,
              fontWeight: 800,
              padding: "10px 22px",
            }}
          >
            {post?.category || "Solar Payback"}
          </div>
        </div>
        <div>
          <div style={{ color: accent, fontSize: 28, fontWeight: 800, marginBottom: 22 }}>
            {post?.mainKeyword || "Solar payback analysis"}
          </div>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.08, maxWidth: 1020 }}>
            {post?.title || "Solar payback article"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, color: "#4A5963", fontSize: 24 }}>
          <span>{post?.articleType || "decision-guide"}</span>
          <span>Updated {post?.updated ? formatDisplayDate(post.updated) : "recently"}</span>
          <span>Quality {post?.qualityScore || "reviewed"}</span>
          <span>Reviewed public sources</span>
          <span>No lead-gen math</span>
        </div>
      </div>
    ),
    size
  );
}
