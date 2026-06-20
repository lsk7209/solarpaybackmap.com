import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getCategoryPath } from "@/lib/categories";
import { formatDisplayDate, toDateTime } from "@/lib/dates";
import { getPlannedPosts, getPublishedCategories, getPublishedPosts, getPublishedPostsByCategory } from "@/lib/posts";
import { createMetadata, DEFAULT_LASTMOD, getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Solar Payback Content Manifest",
  description:
    "A crawlable Solar Payback Map content manifest linking the solar payback methodology, calculator, topic hubs, RSS feed, sitemap, and published articles.",
  path: "/content-manifest",
  keywords: ["solar payback content manifest", "crawlable solar articles", "Solar Payback Map sitemap", "solar RSS feed", "solar topic hubs"],
});

export default function ContentManifestPage() {
  const siteUrl = getSiteUrl();
  const posts = getPublishedPosts();
  const plannedPosts = getPlannedPosts();
  const readyPlannedPosts = plannedPosts.filter((post) => post.status === "ready");
  const pendingScheduledPosts = readyPlannedPosts.filter((post) => !posts.some((published) => published.slug === post.slug));
  const categories = getPublishedCategories();
  const latestPublished = posts[0];
  const nextScheduled = pendingScheduledPosts[0];
  const keyPages = [
    { label: "About Solar Payback Map", href: "/about" },
    { label: "Contact and correction paths", href: "/contact" },
    { label: "Editorial policy", href: "/editorial-policy" },
    { label: "Legal, privacy, advertising, disclaimer, and attribution", href: "/legal" },
    { label: "Solar Payback Map Editorial author profile", href: "/authors/solarpaybackmap-editorial" },
    { label: "Solar payback methodology", href: "/methodology" },
    { label: "Solar payback calculator", href: "/calculator" },
    { label: "Worth-It rankings", href: "/rankings" },
    { label: "Solar payback journal", href: "/blog" },
    { label: "Topic hubs", href: "/blog/category" },
    { label: "RSS feed", href: "/feed.xml" },
    { label: "JSON feed", href: "/feed.json" },
    { label: "Sitemap", href: "/sitemap.xml" },
    { label: "Ads.txt", href: "/ads.txt" },
    { label: "Web app manifest", href: "/manifest.webmanifest" },
    { label: "LLMs text", href: "/llms.txt" },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Solar Payback Map Content Manifest",
          url: `${siteUrl}/content-manifest`,
          description: "A crawlable index of Solar Payback Map's key solar payback resources.",
          inLanguage: "en-US",
          isAccessibleForFree: true,
          dateModified: DEFAULT_LASTMOD,
          publisher: {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: "Solar Payback Map",
            url: siteUrl,
          },
          reviewedBy: {
            "@type": "Organization",
            name: "Solar Payback Map Editorial",
            url: `${siteUrl}/authors/solarpaybackmap-editorial`,
          },
          publishingPrinciples: `${siteUrl}/editorial-policy`,
          about: [
            "solar payback content inventory",
            "published solar articles",
            "scheduled solar research",
            "editorial quality controls",
          ],
          mainEntity: {
            "@type": "ItemList",
            itemListElement: [
              ...keyPages.map((page, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: page.label,
                url: `${siteUrl}${page.href}`,
              })),
              ...posts.map((post, index) => ({
                "@type": "ListItem",
                position: keyPages.length + index + 1,
                name: post.title,
                url: `${siteUrl}/blog/${post.slug}`,
              })),
            ],
          },
        }}
      />
      <section className="blog-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Content manifest", href: "/content-manifest" }]} />
          <p className="eyebrow">Content Manifest</p>
          <h1>Solar Payback Map solar payback resources for crawlers and readers.</h1>
          <p className="lead">
            A direct index of the pages, topic hubs, feeds, and published articles that define the
            Solar Payback Map solar payback knowledge base.
          </p>

          <section className="manifest-section" aria-label="Content operations summary">
            <h2>Content operations summary</h2>
            <dl className="manifest-stats" aria-label="Content publication statistics">
              <div>
                <dt>{posts.length}</dt>
                <dd>published articles available to crawlers now</dd>
              </div>
              <div>
                <dt>{readyPlannedPosts.length}</dt>
                <dd>ready article drafts with approved metadata</dd>
              </div>
              <div>
                <dt>{pendingScheduledPosts.length}</dt>
                <dd>pending scheduled articles not yet exposed to crawlers</dd>
              </div>
              <div>
                <dt>{categories.length}</dt>
                <dd>active topic hubs with published content</dd>
              </div>
            </dl>
            <p className="section-sub">
              Scheduled articles become visible only after their publication time, then enter the
              sitemap, RSS feed, JSON feed, topic hubs, and article routes automatically. Each ready
              article carries a quality score, source links, internal links, CTA, canonical path,
              direct answer, and editorial-review metadata.
              Feed metadata also exposes author, editorial-policy, contact, and legal paths for
              crawlers that need source and advertising-disclosure context.
            </p>
            <p className="section-sub">
              The manifest is also a source-discovery page. A crawler or reader can start here,
              confirm that a topic hub has published articles, open the RSS or sitemap feed, and then
              follow the source trail inside each article. Solar Payback Map keeps this page readable
              because trust-sensitive solar topics change when utility rates, export-credit policy,
              installed-cost data, or incentive rules change.
            </p>
            <ul className="source-list" aria-label="Content manifest public source references">
              <li><a href="https://pvwatts.nrel.gov/" target="_blank" rel="noopener noreferrer external">NREL PVWatts production reference</a></li>
              <li><a href="https://www.eia.gov/electricity/" target="_blank" rel="noopener noreferrer external">U.S. EIA electricity data</a></li>
              <li><a href="https://emp.lbl.gov/tracking-the-sun" target="_blank" rel="noopener noreferrer external">LBNL Tracking the Sun cost data</a></li>
              <li><a href="https://www.dsireusa.org/" target="_blank" rel="noopener noreferrer external">DSIRE incentive database</a></li>
            </ul>
            <dl className="manifest-note" aria-label="Content schedule status">
              <div>
                <dt>Latest published</dt>
                <dd>
                  {latestPublished ? (
                    <>
                      {latestPublished.title} - updated{" "}
                      <time dateTime={toDateTime(latestPublished.updated || latestPublished.publishAt || latestPublished.date)}>
                        {formatDisplayDate(latestPublished.updated || latestPublished.publishAt || latestPublished.date)}
                      </time>
                    </>
                  ) : (
                    "No published article yet"
                  )}
                </dd>
              </div>
              <div>
                <dt>Next scheduled</dt>
                <dd>
                  {nextScheduled ? (
                    <>
                      {nextScheduled.title} -{" "}
                      <time dateTime={toDateTime(nextScheduled.publishAt)}>
                        {formatScheduledDate(nextScheduled.publishAt)}
                      </time>
                    </>
                  ) : (
                    "No pending scheduled article"
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section className="manifest-section">
            <h2>Core resources</h2>
            <ul className="manifest-grid" aria-label="Core Solar Payback Map resources">
              {keyPages.map((page) => (
                <li key={page.href}>
                  <Link className="manifest-card" href={page.href}>
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="manifest-section">
            <h2>Topic hubs</h2>
            <ul className="manifest-grid" aria-label="Solar payback topic hubs">
              {categories.map((category) => (
                <li key={category}>
                  <Link className="manifest-card" href={getCategoryPath(category)}>
                    {category} solar payback articles
                    <dl className="manifest-topic-meta" aria-label={`${category} topic publication status`}>
                      <div>
                        <dt>{getPublishedPostsByCategory(category).length}</dt>
                        <dd>published articles</dd>
                      </div>
                    </dl>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="manifest-section">
            <h2>Published articles</h2>
            <p className="section-sub">
              This list includes every article currently published and available to crawlers.
            </p>
            <ol className="manifest-list">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  <dl className="manifest-article-meta" aria-label={`${post.title} manifest metadata`}>
                    <div>
                      <dt>Category</dt>
                      <dd>{post.category}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
          </section>

          <section className="manifest-section">
            <h2>Where to go next</h2>
            <nav aria-label="Content manifest next steps">
              <ul className="trust-link-list">
                <li>
                  <Link href="/calculator">Run a solar payback scenario</Link>
                </li>
                <li>
                  <Link href="/methodology">Review the Solar Payback Map methodology</Link>
                </li>
                <li>
                  <Link href="/blog">Read the solar payback journal</Link>
                </li>
                <li>
                  <Link href="/contact">Send a correction or source question</Link>
                </li>
              </ul>
            </nav>
          </section>
        </div>
      </section>
    </>
  );
}

function formatScheduledDate(value) {
  return formatDisplayDate(value, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  });
}
