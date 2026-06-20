import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata, createPageJsonLd } from "@/lib/site";

const title = "Solar Payback Map Privacy Policy";
const description =
  "Privacy policy for Solar Payback Map, including analytics, advertising cookies, source review messages, and the site's no lead-sale position.";

export const metadata = createMetadata({
  title,
  description,
  path: "/privacy",
  keywords: [
    "Solar Payback Map privacy policy",
    "solar advertising cookies",
    "solar payback privacy",
    "no solar lead sales",
  ],
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={createPageJsonLd({
          type: "PrivacyPolicy",
          name: title,
          description,
          path: "/privacy",
          about: ["privacy policy", "advertising cookies", "analytics"],
        })}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Privacy", href: "/privacy" }]} />
          <p className="eyebrow">Privacy</p>
          <h1>Privacy policy for an independent solar information site.</h1>
          <p className="lead">
            Solar Payback Map does not collect homeowner quote leads for resale.
            This page explains the limited technical data, analytics, and advertising
            signals that may be processed when the site is used.
          </p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose">
          <h2>Information we may process</h2>
          <p>
            Standard hosting, security, analytics, and advertising systems may process
            technical information such as IP address, browser type, device type, pages
            viewed, referral source, approximate location, and timestamps. This data is
            used to keep the site reliable, measure readership, prevent abuse, and
            improve published solar payback content.
          </p>

          <h2>Advertising and cookies</h2>
          <p>
            Google AdSense or other configured advertising providers may use cookies or
            similar technologies to measure ads, limit fraud, and show contextual or
            personalized advertising according to their own policies. Readers can manage
            Google ad personalization through Google's ad settings.
          </p>

          <h2>No lead resale</h2>
          <p>
            Solar Payback Map does not operate a homeowner quote marketplace, sell contact
            details to installers, or collect roof-specific project leads for resale.
            Editorial content is separated from advertising.
          </p>

          <h2>Contact and corrections</h2>
          <p>
            If you send a correction or source-review message, use only the information
            needed to identify the affected page, claim, source, or assumption. Do not
            send sensitive personal, financial, tax, or property-specific information.
          </p>

          <h2>Related policies</h2>
          <ul className="trust-link-list">
            <li><Link href="/terms">Terms of use</Link></li>
            <li><Link href="/contact">Contact and correction paths</Link></li>
            <li><Link href="/editorial-policy">Editorial policy</Link></li>
            <li><Link href="/legal#advertising">Advertising disclosure</Link></li>
          </ul>
        </article>
      </div>
    </>
  );
}
