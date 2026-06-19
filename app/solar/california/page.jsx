import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { sources } from "@/lib/solar-data";
import { createMetadata, DEFAULT_LASTMOD, getSiteUrl } from "@/lib/site";

export const metadata = createMetadata({
  title: "California Solar Payback and NEM 3.0",
  description:
    "California solar payback context, Worth-It Score drivers, and NEM 3.0 policy explanation for residential rooftop solar.",
  path: "/solar/california",
  keywords: ["California solar payback", "NEM 3.0 solar", "California solar policy", "solar Worth-It Score California", "residential solar California"],
});

export default function CaliforniaPage() {
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "California Solar Payback and NEM 3.0",
          url: `${siteUrl}/solar/california`,
          description:
            "California solar payback context with policy, rate, incentive, and export-credit considerations.",
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
          license: `${siteUrl}/legal#attribution`,
          about: ["California solar payback", "NEM 3.0", "residential solar economics"],
          citation: sources.map((source) => source.url),
        }}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "California solar", href: "/solar/california" }]} />
          <p className="eyebrow">State hub</p>
          <h1>California solar payback is still strong, but NEM 3.0 changed the math.</h1>
          <p className="lead">High retail rates and strong sun help. Reduced export credits mean self-consumption and batteries matter more than they used to.</p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose">
          <dl className="california-solar-scope" aria-label="California solar payback scope summary">
            <div>
              <dt>State focus</dt>
              <dd>Screen California solar payback using retail-rate pressure, sun exposure, policy context, and export-credit risk.</dd>
            </div>
            <div>
              <dt>Policy factor</dt>
              <dd>NEM 3.0 reduces the value of exported production, so self-consumption and battery economics matter more.</dd>
            </div>
            <div>
              <dt>Best use</dt>
              <dd>Compare the state-level economics before running a quote-specific calculator scenario.</dd>
            </div>
            <div>
              <dt>Not included</dt>
              <dd>Roof shade, county-level precompute, installer pricing, financing terms, and household usage shape.</dd>
            </div>
          </dl>

          <h2>Key drivers</h2>
          <dl className="stat-grid" aria-label="California solar payback screening metrics">
            <div className="stat-card"><dt className="metric">82</dt><dd className="dlabel">Worth-It Score</dd></div>
            <div className="stat-card"><dt className="metric">8-12</dt><dd className="dlabel">payback years</dd></div>
            <div className="stat-card"><dt className="metric">31.8c</dt><dd className="dlabel">sample retail rate per kWh</dd></div>
            <div className="stat-card"><dt className="metric">NEM 3.0</dt><dd className="dlabel">policy context</dd></div>
          </dl>
          <h2>Policy note</h2>
          <p>NEM 3.0 credits exported power at lower, time-varying values than the former retail-credit structure. That can extend payback for systems that export heavily.</p>
          <p className="disclaimer">
            Source attribution and data-use notes are listed in the{" "}
            <Link href="/legal#attribution">Solar Payback Map attribution policy</Link>.
          </p>
          <nav aria-label="California solar next steps">
            <ul className="trust-link-list">
              <li><Link href="/rankings">Inspect the state rankings</Link></li>
              <li><Link href="/calculator">Run your own assumptions in the calculator</Link></li>
            </ul>
          </nav>
        </article>
      </div>
    </>
  );
}
