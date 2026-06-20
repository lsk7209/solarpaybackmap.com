import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata, createPageJsonLd } from "@/lib/site";

const title = "Solar Payback Map Terms of Use";
const description =
  "Terms of use for Solar Payback Map, including informational limits, source verification, advertising disclosure, and no professional advice.";

export const metadata = createMetadata({
  title,
  description,
  path: "/terms",
  keywords: [
    "Solar Payback Map terms",
    "solar payback disclaimer",
    "solar estimate terms",
    "solar information site terms",
  ],
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={createPageJsonLd({
          type: "WebPage",
          name: title,
          description,
          path: "/terms",
          about: ["terms of use", "solar estimate disclaimer", "advertising disclosure"],
        })}
      />
      <section className="about-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Terms", href: "/terms" }]} />
          <p className="eyebrow">Terms</p>
          <h1>Terms for using Solar Payback Map.</h1>
          <p className="lead">
            The site publishes general solar payback information to help readers
            understand assumptions before requesting quotes or making financial decisions.
          </p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose">
          <h2>Informational use only</h2>
          <p>
            Solar Payback Map content is general educational information. It is not
            financial, tax, legal, engineering, construction, or installer-selection
            advice. Readers should verify current utility rates, incentive rules, tax
            treatment, roof conditions, and quote details with qualified professionals.
          </p>

          <h2>Estimate limits</h2>
          <p>
            Payback ranges are screening tools based on public data and documented
            assumptions. Actual project economics can change because of roof orientation,
            shading, equipment choice, financing terms, utility tariffs, export credits,
            taxes, permits, labor costs, and local policy changes.
          </p>

          <h2>Advertising and links</h2>
          <p>
            The site may show contextual advertising when configured. Advertising does
            not control editorial conclusions. External source links are provided for
            reader verification and remain under the control of their respective owners.
          </p>

          <h2>Corrections</h2>
          <p>
            If a public source changes or a page contains an error, use the contact path
            with the affected URL, exact claim, and source evidence. Material updates may
            change article dates and source notes.
          </p>

          <h2>Related policies</h2>
          <ul className="trust-link-list">
            <li><Link href="/privacy">Privacy policy</Link></li>
            <li><Link href="/contact">Contact and correction paths</Link></li>
            <li><Link href="/methodology">Methodology</Link></li>
            <li><Link href="/legal#disclaimer">Detailed disclaimer</Link></li>
          </ul>
        </article>
      </div>
    </>
  );
}
