import Link from "next/link";
import { BlogGrid } from "@/components/BlogGrid";
import { JsonLd } from "@/components/JsonLd";
import { ScoreTable } from "@/components/ScoreTable";
import { getPublishedPosts } from "@/lib/posts";
import { sources, states } from "@/lib/solar-data";
import { createMetadata, getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Solar Payback Estimates and Worth-It Scores",
  description:
    "Solar payback estimates for U.S. homeowners, with conservative Worth-It Scores built from public data and transparent assumptions.",
  path: "/",
  keywords: ["solar payback estimates", "Worth-It Scores", "residential solar economics", "solar calculator", "solar policy"],
});

export default function HomePage() {
  const siteUrl = getSiteUrl();
  const top = [...states].sort((a, b) => b.score - a.score).slice(0, 5);
  const latestPosts = getPublishedPosts().slice(0, 3);
  const researchPaths = [
    {
      label: "Solar payback journal",
      href: "/blog",
      description: "Read source-led solar payback explainers, policy notes, and quote-risk checks.",
    },
    {
      label: "Topic hubs",
      href: "/blog/category",
      description: "Browse content by policy, rates, battery, incentives, finance, and roof constraints.",
    },
    {
      label: "Editorial policy",
      href: "/editorial-policy",
      description: "See how Solar Payback Map separates source review, advertising, and homeowner guidance.",
    },
    {
      label: "Content manifest",
      href: "/content-manifest",
      description: "Open the crawlable index of pages, feeds, topic hubs, and published articles.",
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Solar Payback Map",
          url: siteUrl,
          description:
            "Independent residential solar payback estimates and Worth-It Scores.",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Solar Payback Map solar payback research paths",
          itemListElement: [...researchPaths, ...latestPosts.map((post) => ({
            label: post.title,
            href: `/blog/${post.slug}`,
          }))].map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            url: `${siteUrl}${item.href}`,
          })),
        }}
      />
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">Independent solar math</p>
            <h1>
              Where solar <em>actually</em> pays off, and where it does not.
            </h1>
            <p className="lead">
              We estimate residential solar payback with public U.S. data, conservative assumptions,
              and no lead-sales incentive. The point is not to make solar look good. The point is to
              make the decision clearer.
            </p>
            <div className="hero-actions">
              <Link href="/rankings" className="btn btn-primary">Explore rankings</Link>
              <Link href="/calculator" className="btn btn-amber">Run a payback scenario</Link>
              <Link href="/methodology" className="btn btn-ghost">See methodology</Link>
            </div>
          </div>
          <div className="data-panel" aria-label="Top Solar Payback Map state scores">
            <div className="panel-head">
              <div>
                <strong>Worth-It Score preview</strong>
                <p className="dlabel">Illustrative state-level dataset</p>
              </div>
              <Link href="/rankings" className="btn btn-amber btn-sm">Full table</Link>
            </div>
            <table className="mini-rank">
              <caption className="sr-only">Top Solar Payback Map state scores with policy context and payback range</caption>
              <tbody>
                {top.map((state) => (
                  <tr key={state.abbr}>
                    <td><span className="score-dot" style={{ background: scoreBg(state.score) }}>{state.score}</span></td>
                    <th scope="row"><strong>{state.name}</strong><br /><span className="dlabel">{state.policy}</span></th>
                    <td>{state.payback} yrs<br /><span className="dlabel">payback range</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" id="score">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Worth-It Score</p>
              <h2 className="section-title">A conservative signal, not a quote.</h2>
              <p className="section-sub">
                The score blends production, local electricity value, installed cost, incentives,
                and export-credit policy into one comparable signal.
              </p>
            </div>
          </div>
          <div className="feature-grid">
            <div className="feature-card"><h3>Payback as a range</h3><p>Single numbers pretend the roof, shade, financing, and future rates are knowable. We publish a band.</p></div>
            <div className="feature-card"><h3>Policy-aware</h3><p>Retail net metering, net billing, and reduced export credits are treated as first-order inputs.</p></div>
            <div className="feature-card"><h3>No lead funnel</h3><p>Solar Payback Map does not collect your phone number or sell installer leads, so the model can say no.</p></div>
          </div>
        </div>
      </section>

      <section className="section section-sunk">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Transparent sources</p>
              <h2 className="section-title">The data behind the decision.</h2>
            </div>
            <Link href="/methodology" className="btn btn-ghost">Read the full method</Link>
          </div>
          <ul className="source-grid" aria-label="Public solar data sources">
            {sources.map((source) => (
              <li key={source.name}>
                <a className="source-card" href={source.url} target="_blank" rel="noopener noreferrer external" aria-label={`${source.name} public data source`}>
                  <h3>{source.name}</h3>
                  <p>{source.role}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Dataset preview</p>
              <h2 className="section-title">Best and worst both matter.</h2>
            </div>
          </div>
          <ScoreTable rows={states} />
        </div>
      </section>

      <section className="section section-sunk">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Research paths</p>
              <h2 className="section-title">Move from score to evidence.</h2>
              <p className="section-sub">
                Use the article hub, topic index, editorial policy, and content manifest to inspect
                the assumptions behind the solar payback model.
              </p>
            </div>
            <Link href="/blog" className="btn btn-ghost">Read the journal</Link>
          </div>
          <ul className="manifest-grid" aria-label="Research paths">
            {researchPaths.map((item) => (
              <li key={item.href}>
                <Link className="manifest-card" href={item.href}>
                  {item.label}
                  <dl className="manifest-card-meta" aria-label={`${item.label} research path description`}>
                    <div>
                      <dt>Description</dt>
                      <dd>{item.description}</dd>
                    </div>
                  </dl>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {latestPosts.length ? (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">Latest articles</p>
                <h2 className="section-title">Recent solar payback research.</h2>
                <p className="section-sub">
                  Fresh articles enter the sitemap, RSS feed, JSON feed, and topic hubs after their
                  scheduled publication time.
                </p>
              </div>
              <Link href="/blog/category" className="btn btn-ghost">Browse topic hubs</Link>
            </div>
            <BlogGrid posts={latestPosts} showCategories={false} />
          </div>
        </section>
      ) : null}
    </>
  );
}

function scoreBg(score) {
  if (score >= 85) return "#2F7E78";
  if (score >= 72) return "#6FA89B";
  if (score >= 55) return "#D8C8A6";
  return "#B5544A";
}
