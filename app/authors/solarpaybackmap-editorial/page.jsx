import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { formatDisplayDate, toDateTime } from "@/lib/dates";
import { getPublishedPosts } from "@/lib/posts";
import { createMetadata, DEFAULT_LASTMOD, getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Solar Payback Map Editorial Solar Payback Review Team",
  description:
    "Solar Payback Map Editorial is the review team behind Solar Payback Map solar payback articles, methodology notes, source standards, and homeowner quote-risk explainers.",
  path: "/authors/solarpaybackmap-editorial",
  keywords: ["Solar Payback Map Editorial", "solar payback review team", "solar source standards", "editorial review", "homeowner solar guidance"],
});

export default function SolarPaybackMapEditorialPage() {
  const siteUrl = getSiteUrl();
  const posts = getPublishedPosts().slice(0, 24);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${siteUrl}/authors/solarpaybackmap-editorial#author`,
          name: "Solar Payback Map Editorial",
          url: `${siteUrl}/authors/solarpaybackmap-editorial`,
          parentOrganization: { "@type": "Organization", name: "Solar Payback Map", url: siteUrl },
          publishingPrinciples: `${siteUrl}/editorial-policy`,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "editorial corrections and source review",
            url: `${siteUrl}/contact`,
            areaServed: "US",
            availableLanguage: "en-US",
          },
          knowsAbout: [
            "solar payback",
            "residential solar economics",
            "net metering",
            "electricity rates",
            "solar incentives",
            "quote review",
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: "Solar Payback Map Editorial author profile",
          url: `${siteUrl}/authors/solarpaybackmap-editorial`,
          description:
            "Author and reviewer profile for Solar Payback Map Editorial, the team reviewing solar payback articles, methodology notes, and quote-risk explainers.",
          inLanguage: "en-US",
          isAccessibleForFree: true,
          dateModified: DEFAULT_LASTMOD,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}/authors/solarpaybackmap-editorial`,
          },
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
          mainEntity: {
            "@id": `${siteUrl}/authors/solarpaybackmap-editorial#author`,
          },
        }}
      />
      {posts.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Recent Solar Payback Map Editorial reviewed articles",
            itemListElement: posts.map((post, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "BlogPosting",
                headline: post.title,
                url: `${siteUrl}/blog/${post.slug}`,
                datePublished: post.publishAt || post.date,
                dateModified: post.updated,
                articleSection: post.category,
                author: { "@id": `${siteUrl}/authors/solarpaybackmap-editorial#author` },
                reviewedBy: { "@id": `${siteUrl}/authors/solarpaybackmap-editorial#author` },
              },
            })),
          }}
        />
      ) : null}
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Solar Payback Map Editorial", href: "/authors/solarpaybackmap-editorial" }]} />
          <p className="eyebrow">Author and Reviewer</p>
          <h1>Solar Payback Map Editorial reviews solar payback articles before publication.</h1>
          <p className="lead">
            The Solar Payback Map Editorial team writes and reviews homeowner-facing solar payback content
            using public data, conservative assumptions, and visible source links.
          </p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose author-page">
          <dl className="author-policy-summary" aria-label="Solar Payback Map Editorial reviewer summary">
            <div>
              <dt>Review focus</dt>
              <dd>Residential solar payback, rate risk, incentives, export credits, battery economics, and quote-risk checks.</dd>
            </div>
            <div>
              <dt>Source standard</dt>
              <dd>Public datasets, tariff documents, regulator material, policy pages, and consumer-protection guidance come first.</dd>
            </div>
            <div>
              <dt>Independence</dt>
              <dd>Solar Payback Map Editorial does not sell homeowner leads or accept installer referral fees.</dd>
            </div>
            <div>
              <dt>Correction route</dt>
              <dd>Source updates and claim reviews are routed through the contact page and editorial policy.</dd>
            </div>
          </dl>

          <h2>Review scope</h2>
          <p>
            Solar Payback Map Editorial covers residential solar payback, electricity-rate risk, export-credit
            policy, incentive eligibility, battery economics, roof constraints, and quote review.
            The team does not sell leads or accept installer referral fees.
          </p>

          <h2>Source standards</h2>
          <p>
            Articles prioritize public sources such as NREL, EIA, LBNL, DSIRE, state agencies,
            utility tariffs, regulators, and consumer-protection guidance. When public data cannot
            answer a quote-specific question, the article names the uncertainty instead of treating
            an estimate as final advice.
          </p>

          <nav className="author-links" aria-label="Solar Payback Map Editorial trust links">
            <Link className="btn btn-primary" href="/editorial-policy">
              Read the editorial policy
            </Link>
            <Link className="btn btn-ghost" href="/methodology">
              Review methodology
            </Link>
            <Link className="btn btn-ghost" href="/contact">
              Request a correction
            </Link>
          </nav>

          <h2>Where to go next</h2>
          <nav aria-label="Solar Payback Map Editorial next steps">
            <ul className="trust-link-list">
              <li>
                <Link href="/editorial-policy">Review the editorial standards behind Solar Payback Map articles</Link>
              </li>
              <li>
                <Link href="/methodology">Check how payback estimates and rankings are modeled</Link>
              </li>
              <li>
                <Link href="/contact">Send a source correction or review request</Link>
              </li>
              <li>
                <Link href="/content-manifest">Browse the content manifest for published solar research</Link>
              </li>
            </ul>
          </nav>

          <h2>Recent reviewed articles</h2>
          <ol className="manifest-list">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                <dl className="reviewed-article-meta" aria-label={`${post.title} review metadata`}>
                  <div>
                    <dt>Category</dt>
                    <dd>{post.category}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>
                      <time dateTime={toDateTime(post.updated)}>{formatDisplayDate(post.updated)}</time>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </>
  );
}
