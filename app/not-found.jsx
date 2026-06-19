import Link from "next/link";

const recoveryLinks = [
  {
    href: "/blog",
    label: "Journal",
    description: "Solar payback articles and policy explainers",
  },
  {
    href: "/blog/category",
    label: "Topic hubs",
    description: "Crawlable categories for rates, policy, roof, finance, and incentives",
  },
  {
    href: "/methodology",
    label: "Methodology",
    description: "Source policy, assumptions, and Worth-It Score model notes",
  },
  {
    href: "/content-manifest",
    label: "Content manifest",
    description: "A full index of public Solar Payback Map pages, feeds, and article routes",
  },
];

export const metadata = {
  title: "Page not found | Solar Payback Map",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="about-hero">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1>This page is not in the dataset yet.</h1>
        <p className="lead">
          The requested solar payback page is not available. Use the live research hubs below to
          continue with crawlable, reviewed Solar Payback Map content.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/rankings">Explore rankings</Link>
          <Link className="btn btn-ghost" href="/calculator">Run calculator</Link>
        </div>
        <nav aria-label="Helpful Solar Payback Map pages">
          <ul className="not-found-links">
            {recoveryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  {link.label}
                  <dl className="not-found-link-meta" aria-label={`${link.label} recovery path`}>
                    <div>
                      <dt>Recovery path</dt>
                      <dd>{link.description}</dd>
                    </div>
                  </dl>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
