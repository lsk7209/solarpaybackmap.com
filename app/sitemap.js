import { getCategoryPath } from "@/lib/categories";
import { getPublishedCategories, getPublishedPosts, getPublishedPostsByCategory } from "@/lib/posts";
import { getSiteUrl, staticRouteMeta } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function sitemap() {
  const siteUrl = getSiteUrl();
  const publishedPosts = getPublishedPosts();
  const publishedCategories = getPublishedCategories();
  const latestContentModified = getLatestContentModified(publishedPosts);

  return [
    ...staticRouteMeta.map((route) =>
      withSitemapAlternates({
        url: `${siteUrl}${route.path === "/" ? "" : route.path}`,
        lastModified: getStaticRouteLastModified(route, latestContentModified),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      })
    ),
    ...publishedPosts.map((post) =>
      withSitemapAlternates({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated),
        changeFrequency: "monthly",
        priority: 0.8,
      })
    ),
    ...publishedCategories.map((category) =>
      withSitemapAlternates({
        url: `${siteUrl}${getCategoryPath(category)}`,
        lastModified: new Date(
          Math.max(
            ...getPublishedPostsByCategory(category).map((post) => new Date(post.updated).getTime())
          )
        ),
        changeFrequency: "weekly",
        priority: 0.75,
      })
    ),
  ];
}

const contentSensitiveRoutes = new Set([
  "/",
  "/authors/solarpaybackmap-editorial",
  "/blog",
  "/blog/category",
  "/content-manifest",
]);

function getLatestContentModified(posts) {
  return new Date(
    posts
      .map((post) => new Date(post.updated).getTime())
      .reduce((latest, value) => Math.max(latest, value), new Date("2026-06-07").getTime())
  );
}

function getStaticRouteLastModified(route, latestContentModified) {
  if (contentSensitiveRoutes.has(route.path)) return latestContentModified;
  return new Date(route.lastModified);
}

function withSitemapAlternates(entry) {
  return {
    ...entry,
    alternates: {
      languages: {
        "en-US": entry.url,
        "x-default": entry.url,
      },
    },
  };
}
