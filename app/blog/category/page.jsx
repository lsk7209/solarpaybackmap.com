import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getCategoryDescription, getCategoryPath } from "@/lib/categories";
import { formatDisplayDate, getLatestUpdated, toDateTime } from "@/lib/dates";
import { getPublishedCategories, getPublishedPostsByCategory } from "@/lib/posts";
import { createMetadata, DEFAULT_LASTMOD, getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Solar Payback Topic Hubs",
  description:
    "Solar payback topic hubs for policy, rates, incentives, batteries, finance, roof constraints, and quote-review decisions.",
  path: "/blog/category",
  image: "/blog/category/opengraph-image",
  keywords: ["solar payback topic hubs", "solar policy articles", "solar rate articles", "solar incentive guides", "rooftop solar decisions"],
});

export default function BlogCategoryIndexPage() {
  const siteUrl = getSiteUrl();
  const categories = getPublishedCategories()
    .map((category) => {
      const posts = getPublishedPostsByCategory(category);
      const latestUpdated = getLatestUpdated(posts);
      return {
        category,
        href: getCategoryPath(category),
        count: posts.length,
        latestPost: posts[0],
        latestUpdated,
      };
    })
    .filter((item) => item.count > 0);
  const latestUpdated = getLatestUpdated(categories.map((item) => ({ updated: item.latestUpdated }))) || DEFAULT_LASTMOD;
  const totalPublishedArticles = categories.reduce((total, item) => total + item.count, 0);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Solar Payback Topic Hubs",
          url: `${siteUrl}/blog/category`,
          description: "A crawlable index of Solar Payback Map solar payback article categories.",
          inLanguage: "en-US",
          isAccessibleForFree: true,
          dateModified: latestUpdated,
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
          mainEntity: {
            "@type": "ItemList",
            itemListElement: categories.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${item.category} solar payback articles`,
              url: `${siteUrl}${item.href}`,
            })),
          },
        }}
      />
      <section className="blog-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Blog", href: "/blog" }, { name: "Topic hubs", href: "/blog/category" }]} />
          <p className="eyebrow">Topic Index</p>
          <h1>Solar payback topic hubs for homeowner research.</h1>
          <p className="lead">
            Browse solar payback articles by decision theme, then move into the focused hub that
            matches the quote, policy, rate, battery, roof, or finance question you need to verify.
          </p>
          <dl className="topic-index-scope" aria-label="Solar payback topic index scope">
            <div>
              <dt>Hub purpose</dt>
              <dd>Group solar payback articles by homeowner decision theme instead of publication date alone.</dd>
            </div>
            <div>
              <dt>Included topics</dt>
              <dd>Policy, rates, incentives, batteries, finance, roof constraints, buying decisions, and methodology.</dd>
            </div>
            <div>
              <dt>Best use</dt>
              <dd>Start with the topic that matches a quote assumption, then compare calculator and methodology context.</dd>
            </div>
            <div>
              <dt>Not included</dt>
              <dd>Installer-specific offers, personalized tax advice, engineering reviews, and local permitting decisions.</dd>
            </div>
          </dl>
          <dl className="topic-index-summary" aria-label="Solar payback topic index summary">
            <div>
              <dt>{categories.length}</dt>
              <dd>active topic hubs</dd>
            </div>
            <div>
              <dt>{totalPublishedArticles}</dt>
              <dd>published articles across hubs</dd>
            </div>
            <div>
              <dt>
                <time dateTime={toDateTime(latestUpdated)}>{formatDisplayDate(latestUpdated)}</time>
              </dt>
              <dd>latest topic update reviewed in UTC</dd>
            </div>
          </dl>
          <section className="manifest-section" aria-label="Topic index source trail">
            <h2>Source trail used across topic hubs</h2>
            <p className="section-sub">
              Topic hubs are organized by homeowner decision, but each hub should still lead back to
              public evidence. Production assumptions are checked against NREL PVWatts context,
              rate-related claims are compared with U.S. EIA electricity data or utility material,
              installed-cost context points to LBNL Tracking the Sun, and incentive or policy claims
              point readers toward DSIRE or public regulator material before a quote is treated as
              decision-ready.
            </p>
            <ul className="source-list" aria-label="Topic hub public source references">
              <li><a href="https://pvwatts.nrel.gov/" target="_blank" rel="noopener noreferrer external">NREL PVWatts</a></li>
              <li><a href="https://www.eia.gov/electricity/" target="_blank" rel="noopener noreferrer external">U.S. EIA electricity data</a></li>
              <li><a href="https://emp.lbl.gov/tracking-the-sun" target="_blank" rel="noopener noreferrer external">LBNL Tracking the Sun</a></li>
              <li><a href="https://www.dsireusa.org/" target="_blank" rel="noopener noreferrer external">DSIRE</a></li>
            </ul>
          </section>
          <ol className="category-index" aria-label="Solar payback topic hubs">
            {categories.map((item) => (
              <li key={item.category}>
                <Link className="category-card" href={item.href}>
                  <h2>{item.category} solar payback articles</h2>
                  <p>{getCategoryDescription(item.category)}</p>
                  <dl className="category-card-meta" aria-label={`${item.category} topic hub metadata`}>
                    <div>
                      <dt>Articles</dt>
                      <dd>{item.count}</dd>
                    </div>
                    <div>
                      <dt>Updated</dt>
                      <dd>
                        <time dateTime={toDateTime(item.latestUpdated)}>
                          {formatDisplayDate(item.latestUpdated)}
                        </time>
                      </dd>
                    </div>
                    {item.latestPost ? (
                      <div>
                        <dt>Latest</dt>
                        <dd>{item.latestPost.title}</dd>
                      </div>
                    ) : null}
                  </dl>
                </Link>
              </li>
            ))}
          </ol>
          <nav aria-label="Topic index next steps">
            <ul className="trust-link-list">
              <li><Link href="/blog">Browse all solar payback articles</Link></li>
              <li><Link href="/calculator">Run the solar payback calculator</Link></li>
              <li><Link href="/methodology">Review the scoring methodology</Link></li>
              <li><Link href="/content-manifest">Open the content manifest</Link></li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
