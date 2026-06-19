import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Calculator } from "@/components/Calculator";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata, DEFAULT_LASTMOD, getSiteUrl } from "@/lib/site";

export const metadata = createMetadata({
  title: "Solar Payback Calculator",
  description:
    "Solar payback calculator for residential systems using system size, installed cost, electricity rate, production, and export-credit assumptions.",
  path: "/calculator",
  keywords: ["solar payback calculator", "residential solar calculator", "solar savings estimate", "solar system cost", "export credit assumptions"],
});

export default function CalculatorPage() {
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Solar Payback Calculator",
          url: `${siteUrl}/calculator`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          isAccessibleForFree: true,
          inLanguage: "en-US",
          dateModified: DEFAULT_LASTMOD,
          softwareVersion: "1.0",
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
          description:
            "A residential solar payback calculator for system size, installed cost, electricity rate, production, and export-credit assumptions.",
          featureList: [
            "System size input",
            "Installed cost per watt input",
            "Electricity rate input",
            "Production estimate input",
            "Export-credit factor scenario",
            "Simple payback and 25-year net estimate",
          ],
        }}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Calculator", href: "/calculator" }]} />
          <p className="eyebrow">Calculator</p>
          <h1>Run your own conservative solar payback scenario.</h1>
          <p className="lead">Adjust the assumptions before you spend time comparing quotes.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <dl className="calculator-page-summary" aria-label="Solar payback calculator scope summary">
            <div>
              <dt>Inputs used</dt>
              <dd>System size, installed cost, retail electricity rate, production estimate, and export-credit factor.</dd>
            </div>
            <div>
              <dt>Outputs shown</dt>
              <dd>Net cost after federal credit, annual savings, simple payback, and 25-year net estimate.</dd>
            </div>
            <div>
              <dt>Best use</dt>
              <dd>Screen quote assumptions before comparing installer proposals or state-level payback rankings.</dd>
            </div>
            <div>
              <dt>Not included</dt>
              <dd>Roof shade, financing terms, tax appetite, installer variance, panel selection, and battery sizing.</dd>
            </div>
          </dl>

          <h2 className="section-title">Solar payback calculator inputs</h2>
          <p className="section-sub section-sub-spaced">
            Use your bill and quote assumptions to test whether the payback still works outside the optimistic case.
          </p>
          <Calculator />
          <nav aria-label="Calculator next steps">
            <ul className="trust-link-list">
              <li><Link href="/methodology">Review the payback methodology</Link></li>
              <li><Link href="/rankings">Compare state Worth-It rankings</Link></li>
              <li><Link href="/blog/category/policy">Read policy payback articles</Link></li>
              <li><Link href="/legal#disclaimer">Read the estimate disclaimer</Link></li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
