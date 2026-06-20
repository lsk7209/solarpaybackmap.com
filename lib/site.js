export const SITE_NAME = "Solar Payback Map";
export const DEFAULT_SITE_URL = "https://solarpaybackmap.com";
export const DEFAULT_PUBLISHED = "2026-06-07";
export const DEFAULT_LASTMOD = "2026-06-07";

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  const isProductionHost = process.env.VERCEL_ENV === "production" || process.env.CI === "true";

  if (!value || /example/i.test(value)) {
    if (isProductionHost) {
      return DEFAULT_SITE_URL;
    }
    return "http://localhost:3000";
  }

  return value.replace(/\/$/, "");
}

export function createMetadata({ title, description, path = "/", type = "website", image, keywords = [] }) {
  const siteUrl = getSiteUrl();
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const url = `${siteUrl}${canonical}`;
  const imagePath = image || "/opengraph-image";
  const imageUrl = `${siteUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;

  return {
    title,
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: {
      canonical,
      languages: {
        "en-US": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      type,
      locale: "en_US",
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: `${title} | ${SITE_NAME}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export function createPageJsonLd({ type = "WebPage", name, description, path, about, reviewedBy = "Solar Payback Map Editorial" }) {
  const siteUrl = getSiteUrl();
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const pageUrl = `${siteUrl}${canonical}`;

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${pageUrl}#webpage`,
    name,
    headline: name,
    url: pageUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    datePublished: DEFAULT_PUBLISHED,
    dateModified: DEFAULT_LASTMOD,
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: SITE_NAME,
      url: siteUrl,
    },
    reviewedBy: {
      "@type": "Organization",
      name: reviewedBy,
      url: `${siteUrl}/authors/solarpaybackmap-editorial`,
    },
    ...(about ? { about } : {}),
  };
}

export const staticRouteMeta = [
  { path: "/", lastModified: DEFAULT_LASTMOD, priority: 1, changeFrequency: "weekly" },
  { path: "/about", lastModified: DEFAULT_LASTMOD, priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", lastModified: DEFAULT_LASTMOD, priority: 0.55, changeFrequency: "monthly" },
  { path: "/privacy", lastModified: DEFAULT_LASTMOD, priority: 0.55, changeFrequency: "yearly" },
  { path: "/terms", lastModified: DEFAULT_LASTMOD, priority: 0.55, changeFrequency: "yearly" },
  { path: "/authors/solarpaybackmap-editorial", lastModified: DEFAULT_LASTMOD, priority: 0.6, changeFrequency: "monthly" },
  { path: "/editorial-policy", lastModified: DEFAULT_LASTMOD, priority: 0.6, changeFrequency: "monthly" },
  { path: "/content-manifest", lastModified: DEFAULT_LASTMOD, priority: 0.55, changeFrequency: "weekly" },
  { path: "/blog", lastModified: DEFAULT_LASTMOD, priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/category", lastModified: DEFAULT_LASTMOD, priority: 0.75, changeFrequency: "weekly" },
  { path: "/methodology", lastModified: DEFAULT_LASTMOD, priority: 0.8, changeFrequency: "monthly" },
  { path: "/rankings", lastModified: DEFAULT_LASTMOD, priority: 0.8, changeFrequency: "weekly" },
  { path: "/calculator", lastModified: DEFAULT_LASTMOD, priority: 0.7, changeFrequency: "monthly" },
  { path: "/legal", lastModified: DEFAULT_LASTMOD, priority: 0.5, changeFrequency: "yearly" },
  { path: "/solar/california", lastModified: DEFAULT_LASTMOD, priority: 0.7, changeFrequency: "monthly" },
  { path: "/solar/california/san-diego-county", lastModified: DEFAULT_LASTMOD, priority: 0.7, changeFrequency: "monthly" },
];
