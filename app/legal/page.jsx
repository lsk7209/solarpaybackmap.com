import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata, createPageJsonLd, getSiteUrl } from "@/lib/site";

const title = "Solar Data Privacy, Disclaimer, and Attribution";
const description =
  "Solar Payback Map privacy policy, solar estimate disclaimer, and data attribution for public electricity, cost, policy, and solar production sources.";

export const metadata = createMetadata({
  title,
  description,
  path: "/legal",
  keywords: ["solar data privacy", "Solar Payback Map disclaimer", "solar estimate attribution", "advertising cookies", "public solar data"],
});

export default function LegalPage() {
  const siteUrl = getSiteUrl();
  const legalSections = [
    {
      name: "Privacy",
      href: "/legal#privacy",
      description: "How Solar Payback Map handles homeowner contact information, analytics, and configured scripts.",
    },
    {
      name: "Advertising and cookies",
      href: "/legal#advertising",
      description: "How AdSense Auto Ads, cookies, analytics, and editorial separation are handled.",
    },
    {
      name: "Disclaimer",
      href: "/legal#disclaimer",
      description: "Why Solar Payback Map estimates are general screening information, not professional advice.",
    },
    {
      name: "Data attribution",
      href: "/legal#attribution",
      description: "How public solar production, electricity, cost, and policy sources are attributed.",
    },
  ];

  return (
    <>
      <JsonLd
        data={createPageJsonLd({
          type: "WebPage",
          name: title,
          description,
          path: "/legal",
          about: ["solar data privacy", "advertising cookies", "solar estimate disclaimer", "data attribution"],
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Solar Payback Map legal sections",
          itemListElement: legalSections.map((section, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: section.name,
            description: section.description,
            url: `${siteUrl}${section.href}`,
          })),
        }}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Legal", href: "/legal" }]} />
          <p className="eyebrow">Legal</p>
          <h1>Privacy, disclaimer, and data attribution.</h1>
          <p className="lead">Plain terms for a site that does not sell solar leads.</p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose">
          <dl className="legal-policy-summary" aria-label="Solar Payback Map legal policy summary">
            <div>
              <dt>Privacy position</dt>
              <dd>Solar Payback Map does not collect homeowner quote leads for resale to installers.</dd>
            </div>
            <div>
              <dt>Advertising model</dt>
              <dd>AdSense Auto Ads may run only when configured, and no manual ad slots are inserted into articles.</dd>
            </div>
            <div>
              <dt>Estimate status</dt>
              <dd>Solar payback estimates are general screening information, not financial, tax, legal, or engineering advice.</dd>
            </div>
            <div>
              <dt>Data attribution</dt>
              <dd>Public electricity, cost, production, and policy sources are named for reader verification.</dd>
            </div>
          </dl>

          <h2>Legal sections</h2>
          <nav aria-label="Solar Payback Map legal sections">
            <ul className="legal-section-list">
              {legalSections.map((section) => (
                <li key={section.href}>
                  <Link href={section.href}>{section.name}</Link>
                  <dl className="legal-section-meta" aria-label={`${section.name} legal section scope`}>
                    <div>
                      <dt>Section scope</dt>
                      <dd>{section.description}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </nav>
          <h2 id="privacy">Privacy</h2>
          <p>Solar Payback Map does not collect homeowner contact information for resale to installers. Basic analytics and advertising scripts may run only when configured through environment variables.</p>
          <h2 id="advertising">Advertising and cookies</h2>
          <p>Solar Payback Map may use Google AdSense Auto Ads when an advertising client ID is configured. Advertising and analytics providers may use cookies or similar storage to measure visits, limit fraud, and personalize or contextualize ads according to their own policies. Solar Payback Map does not place manual ad slots inside articles.</p>
          <h2 id="disclaimer">Disclaimer</h2>
          <p>Solar Payback Map publishes general information, not financial, tax, legal, or engineering advice. Estimates are screening tools and should be checked against actual quotes and current local rules.</p>
          <h2 id="attribution">Data attribution</h2>
          <p>Source labels include NREL PVWatts, U.S. EIA electricity data, LBNL Tracking the Sun, and DSIRE policy references. Solar Payback Map is independent and is not endorsed by those organizations.</p>
          <h2>Where to go next</h2>
          <nav aria-label="Legal next steps">
            <ul className="trust-link-list">
              <li>
                <Link href="/contact">Contact Solar Payback Map about corrections or privacy questions</Link>
              </li>
              <li>
                <Link href="/editorial-policy">Review Solar Payback Map editorial standards</Link>
              </li>
              <li>
                <Link href="/methodology">Check the solar estimate methodology</Link>
              </li>
              <li>
                <Link href="/content-manifest">Browse the published content manifest</Link>
              </li>
            </ul>
          </nav>
        </article>
      </div>
    </>
  );
}
