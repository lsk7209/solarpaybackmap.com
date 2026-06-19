import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getSiteUrl } from "@/lib/site";

export function Breadcrumbs({ items }) {
  const siteUrl = getSiteUrl();
  const crumbs = [{ name: "Home", href: "/" }, ...items];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.href}`,
          })),
        }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          {crumbs.map((item, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li className="breadcrumb-item" key={item.href}>
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {isLast ? <span aria-current="page">{item.name}</span> : <Link href={item.href}>{item.name}</Link>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
