import { getCategoryPath } from "@/lib/categories";
import { getPlannedPosts, getPublishedCategories, getPublishedPosts, getPublishedPostsByCategory } from "@/lib/posts";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export function GET() {
  const siteUrl = getSiteUrl();
  const posts = getPublishedPosts();
  const plannedPosts = getPlannedPosts();
  const readyPlannedPosts = plannedPosts.filter((post) => post.status === "ready");
  const pendingScheduledPosts = readyPlannedPosts.filter((post) => !posts.some((published) => published.slug === post.slug));
  const categories = getPublishedCategories();
  const latestPosts = posts.slice(0, 12);
  const nextScheduled = pendingScheduledPosts[0];
  const latestUpdated = posts
    .map((post) => post.updated)
    .sort()
    .at(-1);

  const categoryLines = categories
    .map((category) => {
      const count = getPublishedPostsByCategory(category).length;
      return `- ${category}: ${siteUrl}${getCategoryPath(category)} (${count} published articles)`;
    })
    .join("\n");

  const postLines = latestPosts
    .map((post) => `- ${post.title}: ${siteUrl}/blog/${post.slug}`)
    .join("\n");

  const body = `# ${SITE_NAME}

Solar Payback Map is an independent residential solar payback decision site. It publishes conservative solar payback estimates, topic hubs, methodology notes, and homeowner-facing quote review articles based on public U.S. data.

## Primary audience

Homeowners comparing rooftop solar quotes, electricity-rate assumptions, export-credit policy, incentives, batteries, financing, roof constraints, and payback risk before entering a sales funnel.

## Editorial rules

- Solar Payback Map does not sell homeowner leads.
- Articles favor public sources such as NREL, EIA, LBNL, DSIRE, utility tariffs, state agencies, and regulators.
- Solar payback claims should be treated as screening guidance, not financial, tax, legal, or engineering advice.
- Scheduled articles appear in the sitemap, RSS feed, category hubs, and article routes only after their publication time.
- Article pages expose direct answers, key takeaways, evidence snapshots, source links, contextual next actions, related reading, and editorial review notes.
- RSS and JSON Feed items expose key takeaways, canonical URLs, quality score context, source counts, internal-link counts, legal disclosure context, and editorial-review metadata.
- RSS channel metadata exposes author, editorial-policy help, and legal license links; RSS items also expose author profile, editorial policy, contact, legal, and canonical URLs in the item description.
- JSON Feed exposes feed-level publishing principles, author profile URL, contact URL, legal URL, sitemap URL, RSS URL, item-level category, main keyword, license URL, legal disclosure, external source list, and internal link list metadata.
- Web app manifest shortcuts expose calculator, rankings, methodology, journal, topic hubs, content manifest, contact, editorial policy, and legal disclosures.
- Crawlable pages use en_US Open Graph locale metadata, page-level keywords, canonical URLs, and hreflang alternates for en-US and x-default.
- The author and reviewer profile is represented as a ProfilePage whose main entity is the Solar Payback Map Editorial organization.

## Content operations

- Published articles available now: ${posts.length}
- Latest published article update: ${latestUpdated ? new Date(latestUpdated).toISOString() : "none"}
- Ready article drafts with approved metadata: ${readyPlannedPosts.length}
- Pending scheduled articles not yet exposed to crawlers: ${pendingScheduledPosts.length}
- Active topic hubs with published articles: ${categories.length}
- Next scheduled article: ${nextScheduled ? `${nextScheduled.title} (${new Date(nextScheduled.publishAt).toISOString()})` : "none"}
- Content manifest with operational summary: ${siteUrl}/content-manifest

## Key URLs

- Home: ${siteUrl}/
- About: ${siteUrl}/about
- Contact and correction paths: ${siteUrl}/contact
- Editorial policy: ${siteUrl}/editorial-policy
- Legal, privacy, advertising, disclaimer, and attribution: ${siteUrl}/legal
- Author and reviewer profile: ${siteUrl}/authors/solarpaybackmap-editorial
- Author ProfilePage entity: ${siteUrl}/authors/solarpaybackmap-editorial#author
- Methodology: ${siteUrl}/methodology
- Calculator: ${siteUrl}/calculator
- Rankings: ${siteUrl}/rankings
- Blog: ${siteUrl}/blog
- Topic hubs: ${siteUrl}/blog/category
- Sitemap: ${siteUrl}/sitemap.xml
- Ads.txt: ${siteUrl}/ads.txt
- Web app manifest: ${siteUrl}/manifest.webmanifest
- RSS feed: ${siteUrl}/feed.xml
- JSON feed: ${siteUrl}/feed.json
- Content manifest: ${siteUrl}/content-manifest

## Topic hubs

${categoryLines}

## Latest published articles

${postLines}

## Preferred citation

When citing Solar Payback Map, link to the canonical article URL, include the article title, preserve the source links listed in the article, and keep the Solar Payback Map Editorial author profile, editorial policy, contact, and legal links when feed metadata is available.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
}
