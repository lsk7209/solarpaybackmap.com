import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata, createPageJsonLd } from "@/lib/site";

const title = "Solar Payback Editorial Policy";
const description =
  "Solar payback editorial policy for Solar Payback Map, including source standards, review rules, independence, corrections, and advertising separation.";

export const metadata = createMetadata({
  title,
  description,
  path: "/editorial-policy",
  keywords: ["solar payback editorial policy", "Solar Payback Map source standards", "solar corrections policy", "advertising separation", "editorial independence"],
});

export default function EditorialPolicyPage() {
  return (
    <>
      <JsonLd
        data={createPageJsonLd({
          type: "WebPage",
          name: title,
          description,
          path: "/editorial-policy",
          about: ["solar payback editorial standards", "source review", "advertising separation"],
        })}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Editorial policy", href: "/editorial-policy" }]} />
          <p className="eyebrow">Editorial Policy</p>
          <h1>How Solar Payback Map reviews solar payback content before publication.</h1>
          <p className="lead">
            Solar Payback Map publishes solar payback explainers for homeowners who need conservative
            decision guidance before they trust a quote, incentive claim, or savings estimate.
          </p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose">
          <dl className="editorial-policy-summary" aria-label="Solar Payback Map editorial policy summary">
            <div>
              <dt>Editorial independence</dt>
              <dd>No homeowner lead sales, installer referral payments, or ad influence over conclusions.</dd>
            </div>
            <div>
              <dt>Source basis</dt>
              <dd>Solar payback claims prioritize public data, tariff documents, incentive records, and regulator material.</dd>
            </div>
            <div>
              <dt>Update standard</dt>
              <dd>Material source, incentive, tariff, or policy changes trigger article-date and section reviews.</dd>
            </div>
            <div>
              <dt>Reader action</dt>
              <dd>Corrections should include the article URL, exact claim, changed public source, and affected assumption.</dd>
            </div>
          </dl>

          <h2>Independence</h2>
          <p>
            Solar Payback Map does not sell homeowner leads, operate an installer marketplace, or accept
            referral payments tied to a reader choosing solar. Advertising is separated from
            editorial decisions, and Auto Ads are not allowed to change our conclusions.
          </p>

          <h2>Source standards</h2>
          <p>
            Articles prioritize public primary sources such as NREL, EIA, LBNL, DSIRE, utility
            tariff documents, state policy pages, and regulator material. When a topic depends on a
            local rate plan or incentive rule, the article should name that uncertainty instead of
            presenting a single payback number as final.
          </p>

          <h2>Review process</h2>
          <ul className="review-process-list" aria-label="Editorial review process requirements">
            <li>Every publish-ready article must include a direct answer, internal links, external sources, and a homeowner next step.</li>
            <li>Solar payback claims are written as ranges or decision checks unless the source supports a fixed value.</li>
            <li>Policy, rate, incentive, battery, and finance articles receive FAQ checks for question-led search intent.</li>
            <li>Scheduled articles are visible only after their publication time and are added to sitemap and RSS feeds dynamically.</li>
          </ul>

          <h2>Corrections and updates</h2>
          <p>
            If a public source changes, an incentive expires, or a utility tariff materially changes
            the decision frame, Solar Payback Map updates the article date and revises the affected section.
            Readers can use the source list in each article to verify the public records behind the
            claim.
          </p>
          <h3>Correction request checklist</h3>
          <ul className="correction-checklist" aria-label="Editorial correction request details to include">
            <li>Include the article URL and the exact claim that may need review.</li>
            <li>Link the public source, tariff, incentive page, or regulator document that changed.</li>
            <li>Explain whether the issue affects a number, date, eligibility rule, policy summary, or quote-risk recommendation.</li>
          </ul>
          <p>
            Send correction and source-review requests through the{" "}
            <Link href="/contact">Solar Payback Map contact path</Link>. Material corrections update the
            article date and keep the source trail visible.
          </p>

          <h2>Where to go next</h2>
          <nav aria-label="Editorial policy next steps">
            <ul className="trust-link-list">
              <li><Link href="/methodology">Review the methodology</Link></li>
              <li><Link href="/about">Read the about page</Link></li>
              <li><Link href="/blog">Browse the solar payback journal</Link></li>
              <li><Link href="/legal#advertising">Read the advertising disclosure</Link></li>
            </ul>
          </nav>
        </article>
      </div>
    </>
  );
}
