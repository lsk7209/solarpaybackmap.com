import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { sources } from "@/lib/solar-data";
import { createMetadata, createPageJsonLd } from "@/lib/site";

const title = "About Solar Payback Map Solar Payback Estimates";
const description =
  "About Solar Payback Map, an independent solar payback estimate site that explains how it makes money and why it does not sell homeowner leads.";

export const metadata = createMetadata({
  title,
  description,
  path: "/about",
  keywords: ["about Solar Payback Map", "solar payback estimates", "editorial independence", "no solar lead sales", "residential solar data"],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={createPageJsonLd({
          type: "AboutPage",
          name: title,
          description,
          path: "/about",
          about: ["solar payback estimates", "editorial independence", "residential solar economics"],
        })}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "About", href: "/about" }]} />
          <p className="eyebrow">About Solar Payback Map</p>
          <h1>We built a solar site for the decision before the quote form.</h1>
          <p className="lead">Many solar calculators are attached to lead-generation funnels. Solar Payback Map takes a different approach: explain the economics first, show the assumptions, and make the limits visible.</p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose">
          <dl className="about-policy-summary" aria-label="Solar Payback Map about and independence summary">
            <div>
              <dt>Site purpose</dt>
              <dd>Explain residential solar payback before a homeowner enters a quote funnel.</dd>
            </div>
            <div>
              <dt>Revenue model</dt>
              <dd>Contextual advertising may support the site, but Solar Payback Map does not sell homeowner leads.</dd>
            </div>
            <div>
              <dt>Data approach</dt>
              <dd>Public production, electricity, cost, and policy sources are translated into conservative payback ranges.</dd>
            </div>
            <div>
              <dt>Decision limit</dt>
              <dd>Estimates screen location-level economics and do not replace property-specific quotes or professional advice.</dd>
            </div>
          </dl>

          <h2>Why we exist</h2>
          <p>Deciding whether to put solar on your roof is a five-figure decision. Some websites that claim to help are also paid when a homeowner becomes a sales lead. That incentive can make optimistic assumptions feel normal.</p>
          <p>Solar Payback Map is built as an editorial and data product. We take public U.S. data, run it through a deliberately conservative model, and explain what the estimate says, including when solar may not be worth it where you live.</p>
          <h2>What we believe</h2>
          <ol className="principles" aria-label="Solar Payback Map editorial principles">
            <li className="principle"><div className="n">01</div><h3>Honest beats optimistic</h3><p>A conservative estimate you can trust is worth more than a rosy one you cannot.</p></li>
            <li className="principle"><div className="n">02</div><h3>Show the work</h3><p>Every number should point back to a source and assumption. No black boxes.</p></li>
            <li className="principle"><div className="n">03</div><h3>Ranges, not false precision</h3><p>We publish payback as a band because a single decimal is usually a promise the data cannot keep.</p></li>
            <li className="principle"><div className="n">04</div><h3>No incentive to mislead</h3><p>We do not sell leads, so we have nothing to gain from talking you into solar.</p></li>
          </ol>
          <h2>How we make money</h2>
          <div className="biz-box">
            <h3>Plainly: advertising, not your data.</h3>
            <p>Solar Payback Map is supported by <b>contextual display advertising</b>. We do not collect your contact information to sell to installers, run a quote marketplace, or take referral fees that would bias a recommendation.</p>
            <p>Because our revenue does not depend on talking you into solar, we can afford to tell you when it is a bad idea.</p>
          </div>
          <h2>The data behind every number</h2>
          <p>We stand on the shoulders of U.S. agencies, national labs, and public policy databases, and we cite them wherever the numbers appear.</p>
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
          <nav aria-label="About Solar Payback Map next steps">
            <ul className="trust-link-list">
              <li><Link href="/methodology">Read the full methodology</Link></li>
              <li><Link href="/rankings">Browse the dataset preview</Link></li>
            </ul>
          </nav>
          <p className="disclaimer">Solar Payback Map is an independent publisher and is not affiliated with, or endorsed by, NREL, EIA, LBNL, DSIRE, or any government agency. PVWatts is a registered trademark of the Alliance for Sustainable Energy, LLC. Our estimates are general information, not financial advice.</p>
        </article>
      </div>
    </>
  );
}
