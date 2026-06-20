import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getKeyTakeaways } from "@/lib/article-quality";
import { getCategoryPath } from "@/lib/categories";
import { formatDisplayDate, toDateTime } from "@/lib/dates";
import { getPublishedPost, getPublishedPosts } from "@/lib/posts";
import { createMetadata, getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) return {};
  const baseMetadata = createMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.subtitle,
    path: post.canonicalPath || `/blog/${post.slug}`,
    type: "article",
    image: `/blog/${post.slug}/opengraph-image`,
  });
  const publishedAt = post.publishAt || post.date;
  const authorUrl = `${getSiteUrl()}/authors/solarpaybackmap-editorial`;

  return {
    ...baseMetadata,
    keywords: post.keywords,
    authors: [{ name: "Solar Payback Map Editorial", url: authorUrl }],
    openGraph: {
      ...baseMetadata.openGraph,
      publishedTime: publishedAt,
      modifiedTime: post.updated,
      authors: [authorUrl],
      section: post.category,
      tags: post.keywords,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) notFound();

  const siteUrl = getSiteUrl();
  const publishedAt = post.publishAt || post.date;
  const wordCount = countArticleWords(post);
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const editorialAuthor = {
    "@type": "Organization",
    "@id": `${siteUrl}/authors/solarpaybackmap-editorial#author`,
    name: "Solar Payback Map Editorial",
    url: `${siteUrl}/authors/solarpaybackmap-editorial`,
  };
  const organization = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Solar Payback Map",
    url: siteUrl,
  };
  const keyTakeaways = getKeyTakeaways(post);
  const relatedPosts = getRelatedPosts(post);
  const nextAction = getNextAction(post);
  const directAnswers = getDirectAnswers(post);
  const faqItems = getFaqItems(post);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.metaDescription || post.subtitle,
          datePublished: publishedAt,
          dateModified: post.updated,
          author: editorialAuthor,
          editor: editorialAuthor,
          reviewedBy: editorialAuthor,
          publisher: organization,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
          },
          image: `${articleUrl}/opengraph-image`,
          thumbnailUrl: `${articleUrl}/opengraph-image`,
          inLanguage: "en-US",
          articleSection: post.category,
          wordCount,
          keywords: post.keywords.join(", "),
          about: {
            "@type": "Thing",
            name: post.mainKeyword,
          },
          mentions: post.expandedKeywords,
          citation: post.externalSources.map((source) => source.href),
          isAccessibleForFree: true,
          publishingPrinciples: `${siteUrl}/editorial-policy`,
        }}
      />
      {faqItems.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${articleUrl}#faq`,
            url: `${articleUrl}#faq`,
            inLanguage: "en-US",
            isAccessibleForFree: true,
            publisher: organization,
            reviewedBy: editorialAuthor,
            publishingPrinciples: `${siteUrl}/editorial-policy`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": articleUrl,
            },
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }}
        />
      ) : null}
      {relatedPosts.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Related solar payback reading for ${post.title}`,
            itemListElement: relatedPosts.map((relatedPost, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: relatedPost.title,
              url: `${siteUrl}/blog/${relatedPost.slug}`,
            })),
          }}
        />
      ) : null}
      <section
        className="about-hero article-hero"
        style={{
          "--article-accent": post.accent?.primary || "#B5762A",
          "--article-wash": post.accent?.secondary || "#F6ECDA",
        }}
      >
        <div className="wrap">
          <Breadcrumbs
            items={[
              { name: "Blog", href: "/blog" },
              { name: post.category, href: getCategoryPath(post.category) },
              { name: post.title, href: `/blog/${post.slug}` },
            ]}
          />
          <p className="eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="lead">{post.subtitle}</p>
          <p className="source article-source">
            By <Link href="/authors/solarpaybackmap-editorial">Solar Payback Map Editorial</Link> - Published{" "}
            <time dateTime={toDateTime(publishedAt)}>{formatLongDate(publishedAt)}</time> - Updated{" "}
            <time dateTime={toDateTime(post.updated)}>{formatLongDate(post.updated)}</time> -{" "}
            {post.read} min read - {post.articleType}
          </p>
        </div>
      </section>
      <div className="wrap article-layout">
        <nav className="card toc" aria-label="Article table of contents">
          <h2>On this page</h2>
          <ol>
            {post.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  {section.heading}
                </a>
              </li>
            ))}
            {keyTakeaways.length ? (
              <li>
                <a href="#key-takeaways">Key takeaways</a>
              </li>
            ) : null}
            <li>
              <a href="#evidence-snapshot">Evidence snapshot</a>
            </li>
            {faqItems.length ? (
              <li>
                <a href="#faq">FAQ</a>
              </li>
            ) : null}
            <li>
              <a href="#next-step">Next step</a>
            </li>
            {relatedPosts.length ? (
              <li>
                <a href="#related-reading">Related reading</a>
              </li>
            ) : null}
            <li>
              <a href="#sources">Sources</a>
            </li>
          </ol>
        </nav>
        <article
          className="prose article-prose"
          style={{
            "--article-accent": post.accent?.primary || "#B5762A",
            "--article-wash": post.accent?.secondary || "#F6ECDA",
          }}
        >
          <p className="first">{post.excerpt}</p>

          {directAnswers.length ? (
            <section className="answer-box" aria-label="Direct answer">
              <h2>Direct answer</h2>
              {directAnswers.map((answer) => (
                <p key={answer}>{answer}</p>
              ))}
            </section>
          ) : null}

          {keyTakeaways.length ? (
            <section className="key-takeaways" id="key-takeaways" aria-label="Key takeaways">
              <h2>Key takeaways</h2>
              <ul>
                {keyTakeaways.map((takeaway) => (
                  <li key={takeaway}>{takeaway}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="evidence-snapshot" id="evidence-snapshot" aria-label="Evidence snapshot">
            <div>
              <h2>Evidence snapshot</h2>
              <p>
                This article was reviewed by{" "}
                <Link href="/authors/solarpaybackmap-editorial">Solar Payback Map Editorial</Link> against public
                solar payback sources and the{" "}
                <Link href="/editorial-policy">Solar Payback Map editorial policy</Link>.
              </p>
            </div>
            <ul className="evidence-links" aria-label="Primary sources">
              {post.externalSources.slice(0, 4).map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noopener noreferrer external" aria-label={`${source.label} external source`}>
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {post.sections.map((section) => (
            <section key={section.id}>
              <h2 id={section.id}>{section.heading}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul className="article-checklist">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.table ? (
                <table>
                  <caption>{section.heading} data table</caption>
                  <tbody>
                    {section.table.map(([label, value]) => (
                      <tr key={label}>
                        <th scope="row">{label}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
              {section.callout ? (
                <div className="callout">
                  <strong>Payback note:</strong> {section.callout}
                </div>
              ) : null}
            </section>
          ))}

          {faqItems.length ? (
            <section className="faq-block" id="faq">
              <h2>FAQ</h2>
              <dl>
                {faqItems.map((item) => (
                  <div className="faq-item" key={item.question}>
                    <dt>{item.question}</dt>
                    <dd>{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <h2 id="next-step">Next step</h2>
          <section className="next-step-panel" aria-label="Recommended next action">
            <p className="tagline">Recommended next action</p>
            <h3>{nextAction.title}</h3>
            <p>{nextAction.body}</p>
            <nav className="next-actions" aria-label="Article next actions">
              <Link className="btn btn-primary" href={nextAction.primary.href}>
                {nextAction.primary.label}
              </Link>
              <Link className="btn btn-ghost" href={nextAction.secondary.href}>
                {nextAction.secondary.label}
              </Link>
            </nav>
            <nav className="internal-link-list" aria-label="Also review">
              <p className="source">Also review</p>
              <ul>
                {post.internalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          {relatedPosts.length ? (
            <section className="related-reading" id="related-reading" aria-label="Related reading">
              <h2>Related reading</h2>
              <ol className="related-grid">
                {relatedPosts.map((relatedPost) => (
                  <li key={relatedPost.slug}>
                    <Link
                      className="related-card"
                      href={`/blog/${relatedPost.slug}`}
                      aria-labelledby={`related-${relatedPost.slug}-title`}
                      aria-describedby={`related-${relatedPost.slug}-summary`}
                    >
                      <dl className="related-card-meta" aria-label={`${relatedPost.title} related article metadata`}>
                        <div>
                          <dt>Category</dt>
                          <dd>{relatedPost.category}</dd>
                        </div>
                      </dl>
                      <h3 id={`related-${relatedPost.slug}-title`}>{relatedPost.title}</h3>
                      <p id={`related-${relatedPost.slug}-summary`}>{relatedPost.excerpt}</p>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section className="source-list-section" aria-labelledby="sources">
            <h2 id="sources">Sources and further reading</h2>
            <ul className="source-list" aria-label="Article sources and further reading">
              {post.externalSources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noopener noreferrer external" aria-label={`${source.label} external source`}>
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="trust-box" aria-label="Editorial review notes">
            <h2>Editorial review</h2>
            <ul className="editorial-review-list" aria-label="Article editorial review checks">
              <li>Reviewed against public sources listed above, not installer lead-generation data.</li>
              <li>Written for homeowner decision quality, with conservative assumptions favored over sales optimism.</li>
              <li>
                Updated <time dateTime={toDateTime(post.updated)}>{formatLongDate(post.updated)}</time>{" "}
                and checked for policy, rate, source, and quote-risk context.
              </li>
            </ul>
            <p>
              Read the <Link href="/editorial-policy">Solar Payback Map editorial policy</Link> and{" "}
              <Link href="/authors/solarpaybackmap-editorial">Solar Payback Map Editorial profile</Link> for source,
              correction, advertising, authorship, and review standards.
            </p>
          </section>

          <p className="disclaimer">
            This article is general information, not financial, tax, legal, or engineering advice.
            Verify current incentives, utility tariffs, and quote-specific assumptions before relying
            on any estimate.
          </p>
        </article>
      </div>
    </>
  );
}

function formatLongDate(value) {
  return formatDisplayDate(value, { month: "long" });
}

function countArticleWords(post) {
  const parts = [
    post.title,
    post.subtitle,
    post.excerpt,
    ...getDirectAnswers(post),
    ...(post.sections || []).flatMap((section) => [
      section.heading,
      ...(section.body || []),
      ...(section.bullets || []),
      section.callout,
    ]),
    ...getFaqItems(post).flatMap((item) => [item.question, item.answer]),
  ];

  return parts
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function getDirectAnswers(post) {
  if (Array.isArray(post.directAnswer)) return post.directAnswer.filter(Boolean);
  if (typeof post.directAnswer === "string" && post.directAnswer.trim()) return [post.directAnswer];
  return [];
}

function getFaqItems(post) {
  return (post.faq || [])
    .map((item) => ({
      question: item.question || item.q,
      answer: item.answer || item.a,
    }))
    .filter((item) => item.question && item.answer);
}

function getRelatedPosts(post) {
  const publishedPosts = getPublishedPosts().filter((item) => item.slug !== post.slug);
  const sameCategory = publishedPosts.filter((item) => item.category === post.category);
  const otherPosts = publishedPosts.filter((item) => item.category !== post.category);

  return [...sameCategory, ...otherPosts].slice(0, 3);
}

function getNextAction(post) {
  const categoryActions = {
    Battery: {
      title: "Test the quote with and without storage.",
      body:
        "Battery assumptions can make payback look better or worse fast. Run a base solar case first, then compare the export-credit scenario before accepting a bundled quote.",
      primary: { label: "Run the calculator", href: "/calculator" },
      secondary: { label: "Compare policy context", href: "/blog/category/policy" },
    },
    Buying: {
      title: "Pressure-test the sales claim before sending contact details.",
      body:
        "Use the rankings and methodology pages to separate a strong market from an optimistic proposal. The goal is to know which quote assumptions deserve a challenge.",
      primary: { label: "Compare rankings", href: "/rankings" },
      secondary: { label: "Read the methodology", href: "/methodology" },
    },
    Data: {
      title: "Check the data assumptions behind the score.",
      body:
        "A useful solar estimate should show rate, production, policy, and review-date context. Use the source method before treating a score as decision-ready.",
      primary: { label: "Read the methodology", href: "/methodology" },
      secondary: { label: "Open the content manifest", href: "/content-manifest" },
    },
    Finance: {
      title: "Convert the finance claim into a payback scenario.",
      body:
        "Financing can turn a good roof into a weak deal. Model net cost, annual savings, and export value before comparing monthly-payment language.",
      primary: { label: "Run the calculator", href: "/calculator" },
      secondary: { label: "Compare rankings", href: "/rankings" },
    },
    Incentives: {
      title: "Separate eligible credits from guaranteed savings.",
      body:
        "Incentives help only when the homeowner can actually use them. Review the methodology, then rerun the payback case with conservative net cost assumptions.",
      primary: { label: "Read the methodology", href: "/methodology" },
      secondary: { label: "Run the calculator", href: "/calculator" },
    },
    Methodology: {
      title: "Apply the method to a real state or quote scenario.",
      body:
        "The model is a screening tool. Move from assumptions to a concrete comparison by checking rankings, then testing the payback range with your own inputs.",
      primary: { label: "Compare rankings", href: "/rankings" },
      secondary: { label: "Run the calculator", href: "/calculator" },
    },
    Policy: {
      title: "Check whether export credits change the decision.",
      body:
        "Policy details matter most when a system exports heavily. Compare the state context, then test a weaker export-credit factor before treating the quote as final.",
      primary: { label: "Compare rankings", href: "/rankings" },
      secondary: { label: "Run the calculator", href: "/calculator" },
    },
    Rates: {
      title: "Translate the rate story into annual savings.",
      body:
        "High rates can shorten payback, but only if production, export value, and usage timing cooperate. Use the calculator to test the rate assumption directly.",
      primary: { label: "Run the calculator", href: "/calculator" },
      secondary: { label: "Compare rankings", href: "/rankings" },
    },
    Roof: {
      title: "Decide whether the roof constraint should stop the quote.",
      body:
        "A weak roof, shade issue, or short ownership window can erase a good market signal. Use the model as a screen before spending time on installer-specific details.",
      primary: { label: "Read the methodology", href: "/methodology" },
      secondary: { label: "Compare rankings", href: "/rankings" },
    },
  };

  return categoryActions[post.category] || {
    title: "Move from article context to a conservative payback check.",
    body:
      "Use the internal research pages to verify the assumptions that matter most before treating a solar quote as decision-ready.",
    primary: { label: post.cta.label, href: post.cta.href },
    secondary: { label: "Browse topic hubs", href: "/blog/category" },
  };
}
