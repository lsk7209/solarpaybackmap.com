import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { sources } from "@/lib/solar-data";
import { createMetadata, DEFAULT_LASTMOD, getSiteUrl } from "@/lib/site";

export const metadata = createMetadata({
  title: "San Diego County Solar Payback Example",
  description:
    "San Diego County solar payback example with a conservative Worth-It Score, policy context, and residential rooftop solar assumptions.",
  path: "/solar/california/san-diego-county",
  keywords: ["San Diego County solar payback", "San Diego rooftop solar", "California NEM 3.0", "solar Worth-It Score San Diego", "residential solar economics"],
});

export default function SanDiegoCountyPage() {
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "San Diego County Solar Payback Example",
          url: `${siteUrl}/solar/california/san-diego-county`,
          description:
            "San Diego County solar payback example with conservative screening assumptions and policy caveats.",
          inLanguage: "en-US",
          isAccessibleForFree: true,
          datePublished: DEFAULT_LASTMOD,
          dateModified: DEFAULT_LASTMOD,
          author: {
            "@type": "Organization",
            name: "Solar Payback Map Editorial",
            url: `${siteUrl}/authors/solarpaybackmap-editorial`,
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
          publishingPrinciples: `${siteUrl}/editorial-policy`,
          license: `${siteUrl}/legal#attribution`,
          about: ["San Diego County solar payback", "California solar economics", "residential rooftop solar"],
          citation: sources.map((source) => source.url),
        }}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { name: "California solar", href: "/solar/california" },
              { name: "San Diego County", href: "/solar/california/san-diego-county" },
            ]}
          />
          <p className="eyebrow">County example</p>
          <h1>San Diego County is a strong solar market, with policy caveats.</h1>
          <p className="lead">Excellent sun and high electricity value support the economics, while export-credit assumptions decide the edge cases.</p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose">
          <h2>Screening result</h2>
          <dl className="stat-grid" aria-label="San Diego County solar payback screening metrics">
            <div className="stat-card"><dt className="metric">84</dt><dd className="dlabel">Worth-It Score</dd></div>
            <div className="stat-card"><dt className="metric">7-11</dt><dd className="dlabel">payback years</dd></div>
            <div className="stat-card"><dt className="metric">$51k</dt><dd className="dlabel">25-year net estimate</dd></div>
            <div className="stat-card"><dt className="metric">Strong</dt><dd className="dlabel">verdict</dd></div>
          </dl>
          <h2>What could change it</h2>
          <p>Heavy shade, short homeowner tenure, weak tax appetite, high financing cost, or a system sized mainly for exports can move the estimate down.</p>
          <nav aria-label="San Diego County solar next steps">
            <ul className="trust-link-list">
              <li><Link href="/legal#attribution">Review the Solar Payback Map attribution policy</Link></li>
              <li><Link href="/solar/california">Compare the California state hub</Link></li>
              <li><Link href="/calculator">Run a roof-specific calculator scenario</Link></li>
            </ul>
          </nav>
          <p className="disclaimer">County examples are illustrative until production county-level precompute data is connected through Turso.</p>
        </article>
      </div>
    </>
  );
}
