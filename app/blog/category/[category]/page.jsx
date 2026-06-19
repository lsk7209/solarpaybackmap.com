import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogGrid } from "@/components/BlogGrid";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import {
  categoryToSlug,
  getCategoryDescription,
  getCategoryIntent,
  getCategoryKeywords,
  getCategoryMetaDescription,
  slugToCategory,
} from "@/lib/categories";
import { formatDisplayDate, getLatestUpdated, toDateTime } from "@/lib/dates";
import { getPublishedCategories, getPublishedPostsByCategory } from "@/lib/posts";
import { createMetadata, getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return getPublishedCategories().map((category) => ({ category: categoryToSlug(category) }));
}

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;
  const category = slugToCategory(categorySlug, getPublishedCategories());
  if (!category) return {};

  return createMetadata({
    title: `${category} Solar Payback Articles`,
    description: getCategoryMetaDescription(category),
    path: `/blog/category/${categorySlug}`,
    image: `/blog/category/${categorySlug}/opengraph-image`,
    keywords: getCategoryKeywords(category),
  });
}

export default async function BlogCategoryPage({ params }) {
  const { category: categorySlug } = await params;
  const category = slugToCategory(categorySlug, getPublishedCategories());
  if (!category) notFound();

  const posts = getPublishedPostsByCategory(category);
  const featuredPosts = posts.slice(0, 3);
  const siteUrl = getSiteUrl();
  const categoryDescription = getCategoryDescription(category);
  const categoryIntent = getCategoryIntent(category);
  const latestUpdated = getLatestUpdated(posts);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category} Solar Payback Articles`,
          description: getCategoryMetaDescription(category),
          url: `${siteUrl}/blog/category/${categorySlug}`,
          inLanguage: "en-US",
          dateModified: latestUpdated,
          isAccessibleForFree: true,
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
            `${category.toLowerCase()} solar payback`,
            "residential solar decision research",
            "solar quote review",
          ],
          mainEntity: {
            "@type": "ItemList",
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
              },
            })),
          },
        }}
      />
      <section className="blog-hero">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { name: "Blog", href: "/blog" },
              { name: category, href: `/blog/category/${categorySlug}` },
            ]}
          />
          <p className="eyebrow">Topic Hub</p>
          <h1>{category} solar payback articles</h1>
          <p className="lead">{categoryDescription}</p>
          <dl className="category-hub-scope" aria-label={`${category} topic hub scope`}>
            <div>
              <dt>Research focus</dt>
              <dd>{categoryIntent}</dd>
            </div>
            <div>
              <dt>Reading order</dt>
              <dd>Start with the newest article, then compare related methodology, calculator, and adjacent-topic context.</dd>
            </div>
            <div>
              <dt>Quality basis</dt>
              <dd>Articles include source links, direct answers, internal next steps, and editorial review notes.</dd>
            </div>
            <div>
              <dt>Not included</dt>
              <dd>Installer-specific offers, personalized tax advice, engineering signoff, and roof-specific production modeling.</dd>
            </div>
          </dl>
          <dl className="hub-stats" aria-label={`${category} topic hub freshness`}>
            <div>
              <dt>{posts.length}</dt>
              <dd>published articles in this topic</dd>
            </div>
            <div>
              <dt>
                <time dateTime={toDateTime(latestUpdated)}>{formatDisplayDate(latestUpdated)}</time>
              </dt>
              <dd>latest article update reviewed in UTC</dd>
            </div>
            <div>
              <dt>Public-source</dt>
              <dd>articles include source links, CTA, direct answers, and editorial review notes</dd>
            </div>
          </dl>
          <div className="hub-intro">
            <p>{categoryIntent}</p>
            <p>
              This hub groups related solar payback articles so homeowners can move from a broad
              question to a specific quote check. Start with the first article if you need the main
              decision frame, then use the next articles to test policy, rate, cost, roof, or usage
              assumptions that can change the payback range.
            </p>
            <p>
              Solar Payback Map treats each topic as a pre-quote screen. The goal is not to prove that solar
              always works; it is to identify the input that could make a proposal stronger, weaker,
              or too uncertain to trust without a second review.
            </p>
            <p>
              Recommended path: read the newest article in this topic, compare it with the related
              methodology or calculator link inside the article, then open one adjacent topic before
              accepting a single payback number.
            </p>
          </div>
          <section className="read-path" aria-labelledby="recommended-reading-path">
            <h2 id="recommended-reading-path">Recommended reading path</h2>
            <ol>
              {featuredPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
            </ol>
          </section>
          <p className="section-action">
            <Link className="btn btn-ghost" href="/blog">
              Back to all articles
            </Link>
          </p>
          <h2 className="section-title section-title-spaced">
            {posts.length} articles in {category}
          </h2>
          <BlogGrid posts={posts} showCategories={false} />
          <nav aria-label={`${category} topic hub next steps`}>
            <ul className="trust-link-list">
              <li><Link href="/blog/category">Browse all topic hubs</Link></li>
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
