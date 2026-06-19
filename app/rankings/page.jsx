import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ScoreTable } from "@/components/ScoreTable";
import { toDateTime } from "@/lib/dates";
import { sources, states } from "@/lib/solar-data";
import { createMetadata, DEFAULT_LASTMOD, getSiteUrl } from "@/lib/site";

export const metadata = createMetadata({
  title: "Solar Worth-It Rankings by State",
  description:
    "Solar Worth-It rankings by state with payback ranges, electricity rates, policy signals, and 25-year residential solar estimates.",
  path: "/rankings",
  keywords: ["solar rankings by state", "Solar Worth-It rankings", "solar payback by state", "residential solar economics", "solar policy signals"],
});

export default function RankingsPage() {
  const siteUrl = getSiteUrl();
  const latestReviewDate = states
    .map((state) => state.sourceDate)
    .sort()
    .at(-1);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Solar Payback Map Solar Worth-It Rankings",
          url: `${siteUrl}/rankings`,
          description: "State-level residential solar economics preview dataset.",
          creator: {
            "@type": "Organization",
            name: "Solar Payback Map",
            url: siteUrl,
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
          dateModified: DEFAULT_LASTMOD,
          inLanguage: "en-US",
          isAccessibleForFree: true,
          license: `${siteUrl}/legal#attribution`,
          measurementTechnique: "Conservative state-level solar payback screening model",
          keywords: [
            "solar payback rankings",
            "residential solar economics",
            "solar worth-it score",
            "state solar policy",
          ],
          variableMeasured: [
            "Worth-It Score",
            "Payback range",
            "Residential electricity rate",
            "Policy context",
            "25-year net estimate",
            "Review date",
          ],
          citation: sources.map((source) => source.url),
        }}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Rankings", href: "/rankings" }]} />
          <p className="eyebrow">Dataset</p>
          <h1>Solar Worth-It rankings by state.</h1>
          <p className="lead">A transparent preview of the state-level dataset. Full county-level precompute belongs in Turso once production data is ready.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <dl className="rankings-page-summary" aria-label="Solar rankings dataset scope summary">
            <div>
              <dt>Measures compared</dt>
              <dd>Worth-It Score, payback range, electricity rate, policy context, 25-year net estimate, and review date.</dd>
            </div>
            <div>
              <dt>Source basis</dt>
              <dd>Public solar production, electricity, installed-cost, and policy datasets are cited through the attribution page.</dd>
            </div>
            <div>
              <dt>Best use</dt>
              <dd>Compare state-level economics before running a calculator scenario or reviewing local quote assumptions.</dd>
            </div>
            <div>
              <dt>Not included</dt>
              <dd>Roof shade, local installer pricing, household usage shape, financing terms, and tax-specific eligibility.</dd>
            </div>
          </dl>

          <h2 className="section-title">State solar payback ranking table</h2>
          <p className="section-sub section-sub-spaced">
            Compare states by score, payback range, electricity rate, policy context, and last reviewed date.
          </p>
          <dl className="stat-grid" aria-label="Solar rankings dataset summary">
            <div className="stat-card">
              <dt className="dlabel">states ranked</dt>
              <dd className="metric">{states.length}</dd>
            </div>
            <div className="stat-card">
              <dt className="dlabel">public source groups</dt>
              <dd className="metric">{sources.length}</dd>
            </div>
            <div className="stat-card">
              <dt className="dlabel">latest review date</dt>
              <dd className="metric">
                <time dateTime={toDateTime(latestReviewDate)}>{latestReviewDate}</time>
              </dd>
            </div>
          </dl>
          <ScoreTable rows={states} />
          <nav aria-label="Rankings next steps">
            <ul className="trust-link-list">
              <li><Link href="/calculator">Run the solar payback calculator</Link></li>
              <li><Link href="/methodology">Review the scoring methodology</Link></li>
              <li><Link href="/blog/category/policy">Read policy payback articles</Link></li>
              <li><Link href="/legal#attribution">Check data attribution</Link></li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
