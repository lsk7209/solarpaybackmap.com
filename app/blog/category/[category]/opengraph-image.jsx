import { ImageResponse } from "next/og";
import { categoryToSlug, slugToCategory } from "@/lib/categories";
import { formatDisplayDate, getLatestUpdated } from "@/lib/dates";
import { getPublishedCategories, getPublishedPostsByCategory } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }) {
  const { category: categorySlug } = await params;
  const category = slugToCategory(categorySlug, getPublishedCategories()) || "Solar Payback";
  const posts = getPublishedPostsByCategory(category);
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
          borderTop: "18px solid #B5762A",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>Solar Payback Map Journal</div>
          <div style={{ color: "#B5762A", fontSize: 24, fontWeight: 800 }}>
            /blog/category/{categoryToSlug(category)}
          </div>
        </div>
        <div>
          <div style={{ color: "#B5762A", fontSize: 30, fontWeight: 800, marginBottom: 22 }}>
            Topic Hub
          </div>
          <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.05, maxWidth: 1000 }}>
            {category} solar payback articles
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, color: "#4A5963", fontSize: 26 }}>
          <span>{posts.length} articles</span>
          <span>Updated {latestUpdated ? formatDisplayDate(latestUpdated) : "recently"}</span>
          <span>Public-source review</span>
          <span>Quote decision guides</span>
        </div>
      </div>
    ),
    size
  );
}
