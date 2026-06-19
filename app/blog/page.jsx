import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BlogGrid } from "@/components/BlogGrid";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import { formatDisplayDate, getLatestUpdated, toDateTime } from "@/lib/dates";
import { getPublishedPosts } from "@/lib/posts";
import { createMetadata, getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Solar Payback Blog and Policy Journal",
  description:
    "Solar payback blog articles about net metering, electricity rates, incentives, and cases where rooftop solar may not make sense.",
  path: "/blog",
  image: "/blog/opengraph-image",
  keywords: ["solar payback blog", "solar policy journal", "net metering articles", "solar incentives", "electricity rate analysis"],
});

export default function BlogPage() {
  const siteUrl = getSiteUrl();
  const publishedPosts = getPublishedPosts();
  const latestUpdated = getLatestUpdated(publishedPosts);
  const editorialAuthor = {
    "@type": "Organization",
    "@id": `${siteUrl}/authors/solarpaybackmap-editorial#author`,
    name: "Solar Payback Map Editorial",
    url: `${siteUrl}/authors/solarpaybackmap-editorial`,
  };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Solar Payback Map Journal",
          url: `${siteUrl}/blog`,
          description:
            "Solar payback articles about policy, rates, incentives, batteries, finance, and quote-risk decisions.",
          inLanguage: "en-US",
          isAccessibleForFree: true,
          dateModified: latestUpdated,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}/blog`,
          },
          publisher: {
            "@type": "Organization",
            name: "Solar Payback Map",
            url: siteUrl,
          },
          author: editorialAuthor,
          blogPost: publishedPosts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.metaDescription || post.subtitle || post.excerpt,
            url: `${siteUrl}/blog/${post.slug}`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${siteUrl}/blog/${post.slug}`,
            },
            datePublished: post.publishAt || post.date,
            dateModified: post.updated,
            author: editorialAuthor,
            publisher: {
              "@type": "Organization",
              "@id": `${siteUrl}/#organization`,
              name: "Solar Payback Map",
              url: siteUrl,
            },
            articleSection: post.category,
            keywords: post.keywords?.join(", "),
            image: `${siteUrl}/blog/${post.slug}/opengraph-image`,
            inLanguage: "en-US",
            isAccessibleForFree: true,
            publishingPrinciples: `${siteUrl}/editorial-policy`,
          })),
        }}
      />
      <section className="blog-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
          <p className="eyebrow">The Journal</p>
          <h1>Data, policy, and the honest case for and against solar.</h1>
          <p className="lead">
            Plain-English analysis built on the same public data behind our scores, with every
            article dated and every trust-sensitive claim tied to a source.
          </p>
          <p className="source source-freshness">
            Latest article update reviewed in UTC:{" "}
            <time dateTime={toDateTime(latestUpdated)}>{formatDisplayDate(latestUpdated)}</time>
          </p>
          <p className="section-action">
            <Link className="btn btn-ghost" href="/blog/category">
              Browse topic hubs
            </Link>
          </p>
          <h2 className="section-title section-title-spaced">Latest solar payback articles</h2>
          <BlogGrid posts={publishedPosts} />
          <nav aria-label="Solar payback journal next steps">
            <ul className="trust-link-list">
              <li><Link href="/blog/category">Browse topic hubs</Link></li>
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
