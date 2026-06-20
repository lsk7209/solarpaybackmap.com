import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { sources } from "@/lib/solar-data";
import { createMetadata, createPageJsonLd } from "@/lib/site";

const title = "Solar Payback Methodology and Assumptions";
const description =
  "Solar payback methodology for Solar Payback Map Worth-It Scores, including assumptions, source policy, export credits, incentives, and excluded factors.";

export const metadata = createMetadata({
  title,
  description,
  path: "/methodology",
  keywords: ["solar payback methodology", "Worth-It Score assumptions", "solar estimate model", "export credit policy", "residential solar data"],
});

export default function MethodologyPage() {
  return (
    <>
      <JsonLd
        data={createPageJsonLd({
          type: "TechArticle",
          name: title,
          description,
          path: "/methodology",
          about: ["solar payback methodology", "Worth-It Score", "public solar data"],
        })}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Methodology", href: "/methodology" }]} />
          <p className="eyebrow">Methodology</p>
          <h1>How we estimate solar payback without making it look better than it is.</h1>
          <p className="lead">The model is intentionally conservative, source-led, and designed for comparison, not quote replacement.</p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose">
          <dl className="methodology-scope-summary" aria-label="Solar payback methodology scope summary">
            <div>
              <dt>Inputs reviewed</dt>
              <dd>Production, retail electricity value, installed cost, federal credit, export policy, and incentive context.</dd>
            </div>
            <div>
              <dt>Outputs published</dt>
              <dd>Worth-It Score, conservative payback range, savings context, and source-dated comparison notes.</dd>
            </div>
            <div>
              <dt>Review cadence</dt>
              <dd>Major public-data and policy inputs are labeled with review dates and refreshed when source assumptions change.</dd>
            </div>
            <div>
              <dt>Property limits</dt>
              <dd>Roof shade, financing, installer quote terms, tax appetite, and battery configuration require a property-specific review.</dd>
            </div>
          </dl>
          <h2>Solar payback core equation</h2>
          <p>Annual production is multiplied by the local value of electricity and adjusted for policy. Net installed cost is reduced by modeled incentives. Payback is the net cost divided by expected annual savings.</p>
          <p>
            The equation is deliberately presented as a screening model rather than a promise. A
            homeowner still needs a property-specific quote, a roof and shade review, utility rate
            confirmation, tax-credit eligibility review, and a check of whether exported energy is
            credited at retail, avoided cost, or another tariff-defined value. The model keeps those
            limits visible so a short payback estimate does not hide the assumptions that can change
            the result.
          </p>
          <table>
            <caption>Solar payback model input and assumption table</caption>
            <tbody>
              <tr><th scope="row">Production</th><td>Modeled annual kWh from a representative residential system. Roof-specific shade and azimuth are not included in state preview pages.</td></tr>
              <tr><th scope="row">Electricity rate</th><td>Residential retail electricity value, reviewed as a dated public-data input and shown as cents per kWh.</td></tr>
              <tr><th scope="row">Installed cost</th><td>State or national installed-cost context expressed in dollars per watt before credits.</td></tr>
              <tr><th scope="row">Federal credit</th><td>Modeled as a tax-credit reduction when the scenario assumes eligibility. Homeowner tax appetite is not guaranteed.</td></tr>
              <tr><th scope="row">Export credit</th><td>Policy factor for exported energy, with weaker values under net billing or reduced-export regimes.</td></tr>
              <tr><th scope="row">Range</th><td>Published as conservative-to-typical years rather than a single decimal.</td></tr>
            </tbody>
          </table>
          <h2>Worth-It Score</h2>
          <p>The 0-100 score is a relative indicator that blends payback range, electricity rate, production potential, installed cost, and export-credit policy. It is a comparison tool, not a guarantee for any roof.</p>
          <p>
            A higher score means the public inputs look more favorable under the same conservative
            framework. It does not mean every quote in that place is a good deal. Installer pricing,
            system size, panel orientation, roof condition, financing cost, utility interconnection
            rules, and household tax position can move the final answer. Use the score to decide
            what to verify next, then compare the actual proposal against the sources below.
          </p>
          <h2>Source policy</h2>
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
          <h2>What the model excludes</h2>
          <ul className="model-exclusion-list" aria-label="Solar payback model exclusions">
            <li>Roof orientation, shading, panel choice, financing, and household usage can change the result.</li>
            <li>Policy and incentive rules change, so dated source labels are part of the product.</li>
            <li>County and state pages should be treated as screening tools before installer-specific quotes.</li>
            <li>Installer workmanship, warranty strength, battery attachment rates, and property-specific tax treatment are not scored.</li>
          </ul>
          <h2>Where to go next</h2>
          <nav aria-label="Methodology next steps">
            <ul className="trust-link-list">
              <li><Link href="/calculator">Run the solar payback calculator</Link></li>
              <li><Link href="/rankings">Compare state Worth-It rankings</Link></li>
              <li><Link href="/editorial-policy">Review editorial standards</Link></li>
              <li><Link href="/legal#disclaimer">Read the estimate disclaimer</Link></li>
            </ul>
          </nav>
          <p className="disclaimer">Solar Payback Map estimates are general information for comparing locations, not financial advice or a guarantee for any individual property.</p>
        </article>
      </div>
    </>
  );
}
