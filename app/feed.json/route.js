import { getKeyTakeaways } from "@/lib/article-quality";
import { getPublishedPosts } from "@/lib/posts";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export function GET() {
  const siteUrl = getSiteUrl();
  const posts = getPublishedPosts();
  const latestUpdated = posts
    .map((post) => new Date(post.updated).getTime())
    .reduce((latest, value) => Math.max(latest, value), new Date("2026-06-07").getTime());

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `${SITE_NAME} Journal`,
    home_page_url: `${siteUrl}/blog`,
    feed_url: `${siteUrl}/feed.json`,
    description: "Independent residential solar payback, policy, and methodology explainers.",
    language: "en-US",
    author: { name: "Solar Payback Map Editorial", url: `${siteUrl}/authors/solarpaybackmap-editorial` },
    authors: [{ name: "Solar Payback Map Editorial", url: `${siteUrl}/authors/solarpaybackmap-editorial` }],
    icon: `${siteUrl}/icon.svg`,
    favicon: `${siteUrl}/icon.svg`,
    _rss_url: `${siteUrl}/feed.xml`,
    _sitemap_url: `${siteUrl}/sitemap.xml`,
    _contact_url: `${siteUrl}/contact`,
    _license_url: `${siteUrl}/legal`,
    _publishing_principles: `${siteUrl}/editorial-policy`,
    _author_profile_url: `${siteUrl}/authors/solarpaybackmap-editorial`,
    _published_count: posts.length,
    _last_build_date: new Date(latestUpdated).toISOString(),
    _latest_article_update: new Date(latestUpdated).toISOString(),
    items: posts.map((post) => ({
      ...buildJsonFeedItem(post, siteUrl),
    })),
  };

  return new Response(JSON.stringify(feed), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
}

function buildJsonFeedItem(post, siteUrl) {
  const keyTakeaways = getKeyTakeaways(post);
  const mainKeyword = post.mainKeyword || post.keywords?.[0] || post.title;

  return {
      id: `${siteUrl}/blog/${post.slug}`,
      url: `${siteUrl}/blog/${post.slug}`,
      title: post.title,
      summary: post.excerpt,
      content_text: [
        post.subtitle,
        post.excerpt,
        "Key takeaways",
        ...keyTakeaways,
        ...(post.directAnswer || []),
        ...(post.sections || []).flatMap((section) => [section.heading, ...(section.body || [])]),
      ]
        .filter(Boolean)
        .join("\n\n"),
      date_published: new Date(post.publishAt || post.date).toISOString(),
      date_modified: new Date(post.updated).toISOString(),
      authors: [{ name: "Solar Payback Map Editorial", url: `${siteUrl}/authors/solarpaybackmap-editorial` }],
      tags: [post.category, ...(post.keywords || []), mainKeyword].filter(Boolean),
      external_url: post.externalSources?.[0]?.href,
      image: `${siteUrl}/blog/${post.slug}/opengraph-image`,
      _canonical_path: post.canonicalPath || `/blog/${post.slug}`,
      _author_profile_url: `${siteUrl}/authors/solarpaybackmap-editorial`,
      _publishing_principles: `${siteUrl}/editorial-policy`,
      _contact_url: `${siteUrl}/contact`,
      _license_url: `${siteUrl}/legal`,
      _legal_disclosure: "Solar Payback Map legal, privacy, advertising, disclaimer, and attribution disclosures.",
      _category: post.category,
      _main_keyword: mainKeyword,
      _quality_score: post.qualityScore,
      _article_type: post.articleType,
      _key_takeaways: keyTakeaways,
      _source_count: post.externalSources?.length || 0,
      _external_sources: (post.externalSources || []).map((source) => ({
        label: source.label,
        url: source.href,
      })),
      _internal_link_count: post.internalLinks?.length || 0,
      _internal_links: (post.internalLinks || []).map((link) => ({
        label: link.label,
        url: `${siteUrl}${link.href}`,
      })),
      _editorial_review: "Solar Payback Map Editorial review with public-source links and no lead-sale data.",
  };
}
