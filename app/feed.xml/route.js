import { getKeyTakeaways } from "@/lib/article-quality";
import { getPublishedPosts } from "@/lib/posts";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export function GET() {
  const siteUrl = getSiteUrl();
  const posts = getPublishedPosts();
  const lastBuildDate = posts
    .map((post) => new Date(post.updated).getTime())
    .reduce((latest, value) => Math.max(latest, value), new Date("2026-06-07").getTime());
  const items = posts
    .map(
      (post) => {
        const keyTakeaways = getKeyTakeaways(post);
        const description = [
          post.excerpt,
          "Key takeaways:",
          ...keyTakeaways.map((takeaway) => `- ${takeaway}`),
          `Quality score: ${post.qualityScore || "editorial review"}`,
          `Source count: ${post.externalSources?.length || 0}`,
          `Internal link count: ${post.internalLinks?.length || 0}`,
          `Author profile: ${siteUrl}/authors/solarpaybackmap-editorial`,
          `Editorial policy: ${siteUrl}/editorial-policy`,
          `Contact and corrections: ${siteUrl}/contact`,
          `Legal and advertising disclosure: ${siteUrl}/legal`,
          `Canonical: ${siteUrl}/blog/${post.slug}`,
        ].join("\n\n");
        const postUrl = `${siteUrl}/blog/${post.slug}`;

        return `    <item>
      <title><![CDATA[${escapeCdata(post.title)}]]></title>
      <link>${escapeXmlText(postUrl)}</link>
      <guid>${escapeXmlText(postUrl)}</guid>
      <pubDate>${new Date(post.publishAt || post.date).toUTCString()}</pubDate>
      <category><![CDATA[${escapeCdata(post.category)}]]></category>
      <dc:creator><![CDATA[Solar Payback Map Editorial]]></dc:creator>
      <dc:publisher><![CDATA[Solar Payback Map]]></dc:publisher>
      <dc:date>${new Date(post.updated).toISOString()}</dc:date>
      ${post.externalSources?.map((source) => `<source url="${escapeXmlAttr(source.href)}"><![CDATA[${escapeCdata(source.label)}]]></source>`).join("\n      ") || ""}
      <description><![CDATA[${escapeCdata(description)}]]></description>
    </item>`;
      }
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${SITE_NAME} Journal</title>
    <link>${escapeXmlText(`${siteUrl}/blog`)}</link>
    <atom:link href="${escapeXmlAttr(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <atom:link href="${escapeXmlAttr(`${siteUrl}/authors/solarpaybackmap-editorial`)}" rel="author" />
    <atom:link href="${escapeXmlAttr(`${siteUrl}/editorial-policy`)}" rel="help" />
    <atom:link href="${escapeXmlAttr(`${siteUrl}/legal`)}" rel="license" />
    <description>Independent residential solar payback, policy, and methodology explainers.</description>
    <language>en-US</language>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <copyright>${SITE_NAME}</copyright>
    <ttl>60</ttl>
    <image>
      <url>${escapeXmlText(`${siteUrl}/icon.svg`)}</url>
      <title>${SITE_NAME} Journal</title>
      <link>${escapeXmlText(`${siteUrl}/blog`)}</link>
    </image>
    <dc:publisher><![CDATA[Solar Payback Map]]></dc:publisher>
    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
}

function escapeCdata(value) {
  return String(value ?? "").replaceAll("]]>", "]]]]><![CDATA[>");
}

function escapeXmlText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeXmlAttr(value) {
  return escapeXmlText(value)
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
