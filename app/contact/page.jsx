import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata, createPageJsonLd, getSiteUrl } from "@/lib/site";

const title = "Contact Solar Payback Map Editorial";
const description =
  "Contact guidance for Solar Payback Map editorial corrections, advertising and privacy questions, source review, and solar payback methodology concerns.";

export const metadata = createMetadata({
  title,
  description,
  path: "/contact",
  keywords: ["contact Solar Payback Map", "solar payback corrections", "editorial source review", "solar methodology questions", "advertising privacy questions"],
});

export default function ContactPage() {
  const siteUrl = getSiteUrl();
  const contactPaths = [
    {
      name: "Corrections and source review",
      description: "Use the article URL, exact claim, and public source that changed.",
      href: "/contact#corrections",
    },
    {
      name: "Advertising and privacy questions",
      description: "Review advertising, cookies, analytics, and editorial separation policies.",
      href: "/contact#advertising",
    },
    {
      name: "Methodology questions",
      description: "Review source hierarchy, payback ranges, export-credit handling, and excluded quote-specific factors.",
      href: "/contact#methodology",
    },
  ];

  return (
    <>
      <JsonLd
        data={createPageJsonLd({
          type: "ContactPage",
          name: title,
          description,
          path: "/contact",
          about: [
            "solar payback corrections",
            "editorial source review",
            "advertising and privacy questions",
          ],
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Solar Payback Map contact paths",
          itemListElement: contactPaths.map((path, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: path.name,
            description: path.description,
            url: `${siteUrl}${path.href}`,
          })),
        }}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />
          <p className="eyebrow">Contact</p>
          <h1>Contact paths for corrections, sources, and policy questions.</h1>
          <p className="lead">
            Solar Payback Map does not collect homeowner quote leads. Use the paths below to review sources,
            correction standards, advertising policy, and methodology assumptions.
          </p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose">
          <dl className="contact-policy-summary" aria-label="Solar Payback Map contact and correction summary">
            <div>
              <dt>Correction path</dt>
              <dd>Send the article URL, exact claim, affected assumption, and changed public source.</dd>
            </div>
            <div>
              <dt>Source evidence</dt>
              <dd>Tariff pages, incentive records, regulator documents, and public datasets are the strongest review inputs.</dd>
            </div>
            <div>
              <dt>Privacy route</dt>
              <dd>Advertising, analytics, cookies, and editorial separation questions start with the legal disclosures.</dd>
            </div>
            <div>
              <dt>Methodology route</dt>
              <dd>Model questions should reference payback ranges, export-credit handling, or excluded quote-specific factors.</dd>
            </div>
          </dl>

          <h2>Contact paths</h2>
          <ul className="contact-path-list" aria-label="Solar Payback Map contact paths">
            {contactPaths.map((path) => (
              <li key={path.href}>
                <Link href={path.href}>{path.name}</Link>
                <dl className="contact-path-meta" aria-label={`${path.name} route guidance`}>
                  <div>
                    <dt>Route guidance</dt>
                    <dd>{path.description}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          <h2 id="corrections">Corrections and source review</h2>
          <p>
            If a public source changes, an incentive expires, or a tariff update changes the decision
            frame, start with the article source list and the{" "}
            <Link href="/editorial-policy">editorial corrections policy</Link>. Solar Payback Map updates
            affected article dates when a material source change is reviewed.
          </p>
          <h3>What to include</h3>
          <ul className="correction-checklist" aria-label="Correction request details to include">
            <li>The article URL and the exact sentence, table, or claim that needs review.</li>
            <li>The public source URL, tariff page, incentive document, or regulator page that changed.</li>
            <li>Whether the issue affects a number, date, eligibility rule, source label, or recommendation.</li>
          </ul>

          <h2 id="advertising">Advertising and privacy questions</h2>
          <p>
            Solar Payback Map uses contextual display advertising only when advertising settings are
            configured. Review the <Link href="/legal#advertising">advertising and cookies</Link>{" "}
            section and the <Link href="/legal#privacy">privacy policy</Link> for how ads and
            analytics are separated from editorial decisions.
          </p>

          <h2 id="methodology">Methodology questions</h2>
          <p>
            For model assumptions, source hierarchy, payback ranges, export-credit handling, and
            excluded quote-specific factors, read the <Link href="/methodology">methodology</Link>{" "}
            and <Link href="/authors/solarpaybackmap-editorial">Solar Payback Map Editorial profile</Link>.
          </p>

          <h2>Where to go next</h2>
          <nav aria-label="Contact next steps">
            <ul className="trust-link-list">
              <li><Link href="/editorial-policy">Review editorial and correction standards</Link></li>
              <li><Link href="/legal#advertising">Read advertising and privacy disclosures</Link></li>
              <li><Link href="/authors/solarpaybackmap-editorial">Open the author and reviewer profile</Link></li>
              <li><Link href="/content-manifest">Open the content manifest</Link></li>
            </ul>
          </nav>

          <p className="disclaimer">
            Solar Payback Map is an independent information site. It does not provide individualized
            financial, tax, legal, engineering, or installer-selection advice.
          </p>
        </article>
      </div>
    </>
  );
}
