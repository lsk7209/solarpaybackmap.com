import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const scanDirs = ["app", "components", "lib"];
const failures = [];
const CORE_ARTICLE_COUNT = 20;

const meaningfulKeywordTerms = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2 && !["and", "the", "for", "with", "solar"].includes(term));

const containsMeaningfulKeyword = (text, keyword) => {
  const lower = text.toLowerCase();
  const terms = meaningfulKeywordTerms(keyword);
  if (lower.includes(keyword.toLowerCase())) return true;
  return terms.some((term) => lower.includes(term));
};

const hasBadEditedSymbols = (text) => /[\u201C\u201D\u2018\u2019\uFFFD]/.test(text);

const shouldHaveFaq = (post) =>
  ["Policy", "Rates", "Battery", "Methodology", "Finance"].includes(post.category) ||
  ["comparison", "faq-brief"].includes(post.articleType);

function walk(dir) {
  const entries = fs.readdirSync(path.join(root, dir), { withFileTypes: true });
  return entries.flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(rel);
    return /\.(jsx?|tsx?|css)$/.test(entry.name) ? [rel] : [];
  });
}

const files = scanDirs.flatMap(walk);
const textByFile = new Map(files.map((file) => [file, fs.readFileSync(path.join(root, file), "utf8")]));
const combined = [...textByFile.values()].join("\n");
const inlineStyleAllowed = /opengraph-image\.jsx$/;

for (const [file, text] of textByFile) {
  if (/solarpaybackmap\.example/.test(text)) {
    failures.push(`${file}: placeholder canonical domain is present.`);
  }
  if (/[\uC568\uC9E4\uC419\uC40D]/.test(text)) {
    failures.push(`${file}: mojibake characters are present.`);
  }
  if (/<ins[^>]+adsbygoogle|className=["'][^"']*adsbygoogle/.test(text)) {
    failures.push(`${file}: manual AdSense ad slot detected; Auto Ads only is allowed.`);
  }
  if (!inlineStyleAllowed.test(file) && /\sstyle=\{\{[^}]+(?:marginTop|marginBottom|overflowX)/.test(text)) {
    failures.push(`${file}: repeated page/component layout spacing and overflow should use shared CSS classes instead of inline style objects.`);
  }
}

if (/return posts\.find\([^)]*\) \|\| posts\[0\]/.test(combined)) {
  failures.push("lib/posts.js: unknown blog slugs must not fall back to the first post.");
}

for (const [route, target] of [
  ["app/article/page.jsx", "/blog/how-we-estimate-solar-payback"],
  ["app/state/page.jsx", "/solar/california"],
  ["app/county/page.jsx", "/solar/california/san-diego-county"],
]) {
  const text = fs.readFileSync(path.join(root, route), "utf8");
  if (!/permanentRedirect/.test(text) || !text.includes(target) || /\bredirect\(/.test(text)) {
    failures.push(`${route}: legacy route should use permanentRedirect to ${target}.`);
  }
}

const packageText = fs.readFileSync(path.join(root, "package.json"), "utf8");
if (!/"smoke":\s*"node scripts\/runtime_smoke\.mjs"/.test(packageText)) {
  failures.push("package.json: npm run smoke should execute scripts/runtime_smoke.mjs.");
}

const runtimeSmokeText = fs.readFileSync(path.join(root, "scripts/runtime_smoke.mjs"), "utf8");
for (const expected of [
  "/sitemap.xml",
  "/robots.txt",
  "/ads.txt",
  "/feed.xml",
  "/feed.json",
  "/manifest.webmanifest",
  "/llms.txt",
  "/content-manifest",
  "/authors/solarpaybackmap-editorial",
  "x-content-type-options",
  "Skip to content",
  "Evidence snapshot",
  "Related reading",
]) {
  if (!runtimeSmokeText.includes(expected)) {
    failures.push(`scripts/runtime_smoke.mjs: missing runtime check for ${expected}.`);
  }
}

const nextConfigText = fs.readFileSync(path.join(root, "next.config.js"), "utf8");
if (!/poweredByHeader:\s*false/.test(nextConfigText) || !/async headers\(\)/.test(nextConfigText)) {
  failures.push("next.config.js: poweredByHeader should be disabled and custom headers should be configured.");
}
for (const header of ["X-Content-Type-Options", "X-DNS-Prefetch-Control", "Referrer-Policy", "X-Frame-Options", "Cross-Origin-Opener-Policy", "Origin-Agent-Cluster", "Permissions-Policy"]) {
  if (!nextConfigText.includes(header)) {
    failures.push(`next.config.js: ${header} security header is missing.`);
  }
}
if (!/X-DNS-Prefetch-Control"[^}]+value:\s*"on"/.test(nextConfigText)) {
  failures.push("next.config.js: DNS prefetch control should be explicitly enabled for predictable external-resource behavior.");
}
if (!/same-origin-allow-popups/.test(nextConfigText) || !/Origin-Agent-Cluster"[^}]+value:\s*"\?1"/.test(nextConfigText)) {
  failures.push("next.config.js: browser isolation headers should use AdSense-safe COOP and Origin-Agent-Cluster values.");
}
if (!/X-Robots-Tag/.test(nextConfigText) || !/Cache-Control/.test(nextConfigText) || !/public, max-age=3600/.test(nextConfigText) || !/feed\.json/.test(nextConfigText) || !/llms\.txt/.test(nextConfigText) || !/ads\.txt/.test(nextConfigText) || !/manifest\.webmanifest/.test(nextConfigText) || !/sitemap\.xml/.test(nextConfigText) || !/robots\.txt/.test(nextConfigText)) {
  failures.push("next.config.js: crawl utility routes should receive X-Robots-Tag and cache headers.");
}
if (!/source:\s*"\/opengraph-image"/.test(nextConfigText) || !/source:\s*"\/:path\*\/opengraph-image"/.test(nextConfigText)) {
  failures.push("next.config.js: Open Graph image routes should receive cache and X-Robots-Tag headers.");
}

const layoutText = fs.readFileSync(path.join(root, "app/layout.jsx"), "utf8");
if (!/JsonLd/.test(layoutText) || !/"@graph"/.test(layoutText) || !/"WebSite"/.test(layoutText) || !/"Organization"/.test(layoutText)) {
  failures.push("app/layout.jsx: global WebSite and Organization JSON-LD graph is missing.");
}
if (!/contactPoint/.test(layoutText) || !/editorial corrections and policy questions/.test(layoutText) || !/url:\s*`\$\{siteUrl\}\/contact`/.test(layoutText) || !/availableLanguage:\s*"en-US"/.test(layoutText)) {
  failures.push("app/layout.jsx: Organization JSON-LD should expose the contact page as an editorial corrections contactPoint.");
}
if (!/hasPart/.test(layoutText) || !/About Solar Payback Map/.test(layoutText) || !/Solar Worth-It rankings/.test(layoutText) || !/Solar Payback Map editorial policy/.test(layoutText) || !/Solar Payback Map Editorial author profile/.test(layoutText) || !/Solar Payback Map contact and corrections/.test(layoutText) || !/Solar Payback Map legal, privacy, advertising, disclaimer, and attribution/.test(layoutText) || !/Solar Payback Map content manifest/.test(layoutText)) {
  failures.push("app/layout.jsx: WebSite JSON-LD should expose key about, rankings, policy, author, contact, legal, and manifest pages in hasPart.");
}
if (!/SiteNavigationElement/.test(layoutText) || !/#primary-navigation/.test(layoutText) || !/Solar Payback Map primary navigation/.test(layoutText) || !/Worth-It Score explanation/.test(layoutText) || !/Solar payback calculator/.test(layoutText)) {
  failures.push("app/layout.jsx: global JSON-LD should expose primary navigation as SiteNavigationElement.");
}
if (!/DataFeed/.test(layoutText) || !/feed\.xml/.test(layoutText)) {
  failures.push("app/layout.jsx: global JSON-LD should expose the RSS feed as a DataFeed.");
}
if (!/feed\.json/.test(layoutText) || !/application\/feed\+json/.test(layoutText)) {
  failures.push("app/layout.jsx: metadata and JSON-LD should expose the JSON Feed.");
}
if (!/application\/rss\+xml/.test(layoutText) || !/types/.test(layoutText)) {
  failures.push("app/layout.jsx: metadata should include RSS feed discovery.");
}
if (!/manifest:\s*"\/manifest\.webmanifest"/.test(layoutText) || !/icon:\s*"\/icon\.svg"/.test(layoutText)) {
  failures.push("app/layout.jsx: app manifest and icon metadata are missing.");
}
if (!/export const viewport/.test(layoutText) || !/themeColor/.test(layoutText) || !/logo:/.test(layoutText)) {
  failures.push("app/layout.jsx: viewport theme color or Organization logo metadata is missing.");
}
if (!/defaultOgImage/.test(layoutText) || !/openGraph:[\s\S]*locale:\s*"en_US"[\s\S]*images:[\s\S]*defaultOgImage/.test(layoutText) || !/twitter:[\s\S]*images:\s*\[defaultOgImage\]/.test(layoutText)) {
  failures.push("app/layout.jsx: root metadata should explicitly expose Open Graph locale, the default Open Graph image, and Twitter image.");
}
if (!/languages:\s*\{[\s\S]*"en-US":\s*"\/"[\s\S]*"x-default":\s*"\/"/.test(layoutText)) {
  failures.push("app/layout.jsx: root metadata should expose en-US and x-default hreflang alternates.");
}
if (!/const gaId = process\.env\.NEXT_PUBLIC_GA4_ID/.test(layoutText) || !/\{gaId \? \(/.test(layoutText) || !/anonymize_ip:true/.test(layoutText)) {
  failures.push("app/layout.jsx: GA4 should be conditionally loaded with IP anonymization.");
}
if (!/getAdsenseClientId/.test(layoutText) || !/process\.env\.NEXT_PUBLIC_ADSENSE_CLIENT/.test(layoutText) || !/\{adsenseClient \? \(/.test(layoutText) || !/pagead2\.googlesyndication\.com/.test(layoutText) || !/crossOrigin="anonymous"/.test(layoutText)) {
  failures.push("app/layout.jsx: AdSense Auto Ads script should be conditionally loaded with a validated client ID and anonymous CORS.");
}
if (!/className="skip-link"/.test(layoutText) || !/href="#main-content"/.test(layoutText) || !/id="main-content"/.test(layoutText)) {
  failures.push("app/layout.jsx: skip link and main content landmark are missing.");
}

const navLinksText = fs.readFileSync(path.join(root, "components/NavLinks.jsx"), "utf8");
if (!/export function isActive/.test(navLinksText) || !/aria-current/.test(navLinksText) || !/Primary navigation/.test(navLinksText) || !/id="primary-navigation"/.test(navLinksText) || !/<ul>/.test(navLinksText) || !/<li key=\{link\.href\}>/.test(navLinksText)) {
  failures.push("components/NavLinks.jsx: primary navigation should expose reusable active-state logic, aria-current, a #primary-navigation id, and a semantic list.");
}

const headerText = fs.readFileSync(path.join(root, "components/Header.jsx"), "utf8");
if (!/NavActionLink/.test(headerText) || !/href="\/calculator"/.test(headerText)) {
  failures.push("components/Header.jsx: calculator CTA should use the active-state nav action link.");
}

const navActionLinkText = fs.readFileSync(path.join(root, "components/NavActionLink.jsx"), "utf8");
if (!/usePathname/.test(navActionLinkText) || !/aria-current=\{pathname === href \? "page" : undefined\}/.test(navActionLinkText) || !/btn btn-ghost btn-sm/.test(navActionLinkText)) {
  failures.push("components/NavActionLink.jsx: header action links should expose active-page aria-current while preserving button styling.");
}

const mobileMenuText = fs.readFileSync(path.join(root, "components/MobileMenu.jsx"), "utf8");
if (!/usePathname/.test(mobileMenuText) || !/aria-controls="mobile-navigation"/.test(mobileMenuText) || !/hidden=\{!open\}/.test(mobileMenuText) || !/aria-current/.test(mobileMenuText) || !/<ul>/.test(mobileMenuText) || !/<li key=\{link\.href\}>/.test(mobileMenuText)) {
  failures.push("components/MobileMenu.jsx: mobile menu should expose controlled navigation with active-page aria-current and a semantic list.");
}
if (!/aria-label=\{open \? "Close mobile navigation" : "Open mobile navigation"\}/.test(mobileMenuText) || !/aria-expanded=\{open\}/.test(mobileMenuText)) {
  failures.push("components/MobileMenu.jsx: mobile menu toggle should expose state-aware labels and aria-expanded.");
}
if (!/useEffect/.test(mobileMenuText) || !/keydown/.test(mobileMenuText) || !/event\.key === "Escape"/.test(mobileMenuText) || !/removeEventListener\("keydown", handleKeyDown\)/.test(mobileMenuText)) {
  failures.push("components/MobileMenu.jsx: open mobile menu should close on Escape and clean up its keydown listener.");
}
if (!/useRef/.test(mobileMenuText) || !/firstLinkRef/.test(mobileMenuText) || !/toggleRef/.test(mobileMenuText) || !/firstLinkRef\.current\?\.focus\(\)/.test(mobileMenuText) || !/toggleRef\.current\?\.focus\(\)/.test(mobileMenuText)) {
  failures.push("components/MobileMenu.jsx: mobile menu should move keyboard focus into the opened menu and return it to the toggle on Escape.");
}

const breadcrumbsText = fs.readFileSync(path.join(root, "components/Breadcrumbs.jsx"), "utf8");
if (!/BreadcrumbList/.test(breadcrumbsText) || !/className="breadcrumb"/.test(breadcrumbsText) || !/aria-label="Breadcrumb"/.test(breadcrumbsText) || !/aria-current="page"/.test(breadcrumbsText) || !/<ol>/.test(breadcrumbsText) || !/<li className="breadcrumb-item"/.test(breadcrumbsText)) {
  failures.push("components/Breadcrumbs.jsx: reusable breadcrumb UI, ordered-list semantics, current-page state, and JSON-LD are missing.");
}
for (const route of [
  "app/about/page.jsx",
  "app/methodology/page.jsx",
  "app/rankings/page.jsx",
  "app/calculator/page.jsx",
  "app/contact/page.jsx",
  "app/legal/page.jsx",
  "app/authors/solarpaybackmap-editorial/page.jsx",
  "app/editorial-policy/page.jsx",
  "app/content-manifest/page.jsx",
  "app/blog/page.jsx",
  "app/blog/category/page.jsx",
]) {
  const text = fs.readFileSync(path.join(root, route), "utf8");
  if (!/Breadcrumbs/.test(text)) {
    failures.push(`${route}: page should render reusable Breadcrumbs for crawlable hierarchy.`);
  }
}

const blogGridText = fs.readFileSync(path.join(root, "components/BlogGrid.jsx"), "utf8");
if (!/Published/.test(blogGridText) || !/Updated/.test(blogGridText) || !/<time dateTime=\{toDateTime/.test(blogGridText) || !/formatDisplayDate/.test(blogGridText)) {
  failures.push("components/BlogGrid.jsx: blog cards should expose semantic published and updated dates.");
}
if (!/<dl className="meta-row" aria-label=\{`\$\{post\.title\} article metadata`\}>/.test(blogGridText) || !/<dt>Category<\/dt>/.test(blogGridText) || !/<dd>\{post\.category\}<\/dd>/.test(blogGridText) || !/<dt>Published<\/dt>/.test(blogGridText) || !/<dt>Updated<\/dt>/.test(blogGridText) || !/<dt>Read time<\/dt>/.test(blogGridText) || !/<dt>Quality score<\/dt>/.test(blogGridText)) {
  failures.push("components/BlogGrid.jsx: blog card metadata should render as a labeled description list.");
}
if (!/<ol className="post-grid" aria-label="Article list">/.test(blogGridText) || !/<li key=\{post\.slug\}>/.test(blogGridText) || !/aria-labelledby=\{`post-\$\{post\.slug\}-title`\}/.test(blogGridText) || !/aria-describedby=\{`post-\$\{post\.slug\}-summary`\}/.test(blogGridText)) {
  failures.push("components/BlogGrid.jsx: blog cards should render as a labeled article list with title and summary-linked card links.");
}
if (!/<p className="post-count-summary" aria-live="polite">/.test(blogGridText) || !/Showing \{visiblePosts\.length\} published solar payback articles/.test(blogGridText)) {
  failures.push("components/BlogGrid.jsx: blog grid should expose the visible published-article count before the card list.");
}
if (!/<nav className="chips" aria-label="Filter posts by category">/.test(blogGridText) || !/aria-pressed=\{category === item\}/.test(blogGridText) || !/aria-label=\{`\$\{item\} solar payback topic hub`\}/.test(blogGridText)) {
  failures.push("components/BlogGrid.jsx: category chips should render as a labeled navigation landmark with selected state and descriptive topic-hub labels.");
}
if (!/@\/lib\/dates/.test(blogGridText)) {
  failures.push("components/BlogGrid.jsx: blog card dates should come from the shared date helper.");
}

const notFoundText = fs.readFileSync(path.join(root, "app/not-found.jsx"), "utf8");
for (const expected of ["/rankings", "/calculator", "/blog", "/blog/category", "/methodology", "/content-manifest"]) {
  if (!notFoundText.includes(expected)) {
    failures.push(`app/not-found.jsx: 404 recovery page should link to ${expected}.`);
  }
}
if (!/<nav aria-label="Helpful Solar Payback Map pages">/.test(notFoundText) || !/<ul className="not-found-links">/.test(notFoundText) || !/<li key=\{link\.href\}>/.test(notFoundText) || !/recoveryLinks\.map/.test(notFoundText)) {
  failures.push("app/not-found.jsx: 404 page should expose a semantic labeled recovery navigation list.");
}
if (!/<dl className="not-found-link-meta" aria-label=\{`\$\{link\.label\} recovery path`\}>/.test(notFoundText) || !/<dt>Recovery path<\/dt>/.test(notFoundText) || !/<dd>\{link\.description\}<\/dd>/.test(notFoundText)) {
  failures.push("app/not-found.jsx: 404 recovery link descriptions should render as labeled description-list metadata.");
}
if (!/metadata\s*=\s*\{/.test(notFoundText) || !/robots\s*:\s*\{/.test(notFoundText) || !/index\s*:\s*false/.test(notFoundText) || !/follow\s*:\s*false/.test(notFoundText)) {
  failures.push("app/not-found.jsx: 404 page should explicitly declare noindex,nofollow robots metadata.");
}

const manifestRouteText = fs.readFileSync(path.join(root, "app/manifest.js"), "utf8");
if (!/theme_color/.test(manifestRouteText) || !/background_color/.test(manifestRouteText) || !/\/icon\.svg/.test(manifestRouteText)) {
  failures.push("app/manifest.js: web app manifest should include theme colors and icons.");
}
if (!/id:\s*"\/"/.test(manifestRouteText) || !/orientation:\s*"portrait-primary"/.test(manifestRouteText) || !/dir:\s*"ltr"/.test(manifestRouteText) || !/prefer_related_applications:\s*false/.test(manifestRouteText) || !/shortcuts:\s*\[/.test(manifestRouteText) || !/\/calculator/.test(manifestRouteText) || !/\/rankings/.test(manifestRouteText) || !/\/methodology/.test(manifestRouteText) || !/\/blog"/.test(manifestRouteText) || !/\/blog\/category/.test(manifestRouteText) || !/\/content-manifest/.test(manifestRouteText) || !/\/contact/.test(manifestRouteText) || !/\/editorial-policy/.test(manifestRouteText) || !/\/legal/.test(manifestRouteText) || !/screenshots:\s*\[/.test(manifestRouteText) || !/\/opengraph-image/.test(manifestRouteText) || !/form_factor:\s*"wide"/.test(manifestRouteText)) {
  failures.push("app/manifest.js: web app manifest should expose id, language direction, orientation, discovery/trust shortcuts, related-app preference, and a screenshot hint.");
}
for (const iconFile of ["app/icon.svg"]) {
  const iconText = fs.readFileSync(path.join(root, iconFile), "utf8");
  if (!/<svg/.test(iconText) || !/#22303A/.test(iconText) || !/#D89B4A/.test(iconText)) {
    failures.push(`${iconFile}: Solar Payback Map SVG icon should use brand colors.`);
  }
}

const articlePageText = fs.readFileSync(path.join(root, "app/blog/[slug]/page.jsx"), "utf8");
if (!/dynamic\s*=\s*"force-dynamic"/.test(articlePageText) || !/dynamicParams\s*=\s*true/.test(articlePageText) || !/generateStaticParams/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article route should allow scheduled slugs to resolve dynamically after publish time.");
}
if (!/Editorial review/.test(articlePageText) || !/Reviewed against public sources/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article editorial trust box is missing.");
}
if (!/<ul className="editorial-review-list" aria-label="Article editorial review checks">/.test(articlePageText) || !/installer lead-generation data/.test(articlePageText) || !/formatLongDate\(post\.updated\)/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article editorial review checks should render as a labeled checklist with update date context.");
}
if (!/Breadcrumbs/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article should use reusable Breadcrumbs for UI and JSON-LD.");
}
if (!/datePublished:\s*publishedAt/.test(articlePageText) || !/wordCount/.test(articlePageText) || !/publishingPrinciples/.test(articlePageText) || !/mainEntityOfPage:\s*\{[\s\S]*"@type":\s*"WebPage"[\s\S]*"@id":\s*articleUrl/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article JSON-LD should include publishAt datePublished, wordCount, publishingPrinciples, and WebPage mainEntityOfPage.");
}
if (!/<caption>\{section\.heading\} data table<\/caption>/.test(articlePageText) || !/<th scope="row">\{label\}<\/th>/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article body tables should expose captions and row header scopes.");
}
if (!/image:\s*`\/blog\/\$\{post\.slug\}\/opengraph-image`/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article metadata should point to the dynamic Open Graph image route.");
}
if (!/baseMetadata\s*=\s*createMetadata/.test(articlePageText) || !/keywords:\s*post\.keywords/.test(articlePageText) || !/authors:\s*\[\{\s*name:\s*"Solar Payback Map Editorial",\s*url:\s*authorUrl\s*\}\]/.test(articlePageText) || !/publishedTime:\s*publishedAt/.test(articlePageText) || !/modifiedTime:\s*post\.updated/.test(articlePageText) || !/section:\s*post\.category/.test(articlePageText) || !/tags:\s*post\.keywords/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article metadata should expose author, keywords, and Open Graph article publish/modify/section/tag fields.");
}
if (!/Published/.test(articlePageText) || !/<time dateTime=\{toDateTime\(publishedAt\)\}/.test(articlePageText) || !/<time dateTime=\{toDateTime\(post\.updated\)\}/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article byline should expose published and updated dates with semantic time elements.");
}
if (!/@\/lib\/dates/.test(articlePageText) || !/formatLongDate/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article dates should use the shared date helper.");
}
if (!/\/editorial-policy/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article trust box should link to the editorial policy.");
}
if (!/\/authors\/solarpaybackmap-editorial/.test(articlePageText) || !/editorialAuthor/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article byline and JSON-LD should link to the Solar Payback Map Editorial author profile.");
}
if (!/Evidence snapshot/.test(articlePageText) || !/evidence-snapshot/.test(articlePageText) || !/post\.externalSources\.slice/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article should show an above-body evidence snapshot with source links.");
}
if (!/<ul className="evidence-links" aria-label="Primary sources">/.test(articlePageText) || !/<li key=\{source\.href\}>/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: evidence snapshot source links should render as a labeled semantic list.");
}
if (!/rel="noopener noreferrer external"/.test(articlePageText) || !/target="_blank"/.test(articlePageText) || !/aria-label=\{`\$\{source\.label\} external source`\}/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article external source links should use safe external-link attributes and labels.");
}
if (!/<section className="source-list-section" aria-labelledby="sources">/.test(articlePageText) || !/<ul className="source-list" aria-label="Article sources and further reading">/.test(articlePageText) || !/post\.externalSources\.map\(\(source\)/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article full source list should render as a labeled source section.");
}
if (!/relatedPosts/.test(articlePageText) || !/related-reading/.test(articlePageText) || !/getRelatedPosts/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article should show published-post related reading cards.");
}
if (!/<ol className="related-grid">/.test(articlePageText) || !/<li key=\{relatedPost\.slug\}>/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: related reading cards should render as an ordered list.");
}
if (!/aria-labelledby=\{`related-\$\{relatedPost\.slug\}-title`\}/.test(articlePageText) || !/aria-describedby=\{`related-\$\{relatedPost\.slug\}-summary`\}/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: related reading cards should link titles and summaries to the card link.");
}
if (!/<dl className="related-card-meta" aria-label=\{`\$\{relatedPost\.title\} related article metadata`\}>/.test(articlePageText) || !/<dt>Category<\/dt>/.test(articlePageText) || !/<dd>\{relatedPost\.category\}<\/dd>/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: related reading cards should expose category metadata as a labeled description list.");
}
if (!/ItemList/.test(articlePageText) || !/Related solar payback reading/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: related reading should include ItemList JSON-LD.");
}
if (!/href="#faq"/.test(articlePageText) || !/href="#next-step"/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: table of contents should include FAQ and next-step anchors when available.");
}
if (!/<nav className="card toc" aria-label="Article table of contents">/.test(articlePageText) || !/<ol>/.test(articlePageText) || !/<li key=\{section\.id\}>/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article table of contents should be a labeled nav with ordered-list semantics.");
}
if (!/"@type":\s*"FAQPage"/.test(articlePageText) || !/"@id":\s*`\$\{articleUrl\}#faq`/.test(articlePageText) || !/isAccessibleForFree:\s*true/.test(articlePageText) || !/publisher:\s*organization/.test(articlePageText) || !/reviewedBy:\s*editorialAuthor/.test(articlePageText) || !/publishingPrinciples:\s*`\$\{siteUrl\}\/editorial-policy`/.test(articlePageText) || !/mainEntityOfPage:\s*\{[\s\S]*"@type":\s*"WebPage"[\s\S]*"@id":\s*articleUrl[\s\S]*mainEntity:\s*post\.faq\.map/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: FAQPage JSON-LD should expose stable @id, publisher, review, free-access, editorial-policy, and WebPage context.");
}
if (!/<dl>/.test(articlePageText) || !/<dt>\{item\.question\}<\/dt>/.test(articlePageText) || !/<dd>\{item\.answer\}<\/dd>/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: visible FAQ content should use description-list question and answer semantics.");
}
if (!/getNextAction/.test(articlePageText) || !/next-step-panel/.test(articlePageText) || !/Recommended next action/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article next-step section should use contextual recommended actions.");
}
if (!/<nav className="next-actions" aria-label="Article next actions">/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article next-step CTA links should render in a labeled navigation landmark.");
}
if (!/<nav className="internal-link-list" aria-label="Also review">/.test(articlePageText) || !/post\.internalLinks\.map\(\(link\)/.test(articlePageText) || !/<ul>/.test(articlePageText) || !/<li key=\{link\.href\}>/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article internal links should render as a labeled navigation list.");
}
if (!/getKeyTakeaways/.test(articlePageText) || !/key-takeaways/.test(articlePageText) || !/Key takeaways/.test(articlePageText) || !/href="#key-takeaways"/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article should expose generated key takeaways near the top and in the TOC.");
}
if (!/@\/lib\/article-quality/.test(articlePageText)) {
  failures.push("app/blog/[slug]/page.jsx: article key takeaways should come from the shared article-quality helper.");
}
for (const category of ["Battery", "Buying", "Data", "Finance", "Incentives", "Methodology", "Policy", "Rates", "Roof"]) {
  if (!articlePageText.includes(`${category}:`)) {
    failures.push(`app/blog/[slug]/page.jsx: missing contextual next action for ${category}.`);
  }
}

const authorPageText = fs.readFileSync(path.join(root, "app/authors/solarpaybackmap-editorial/page.jsx"), "utf8");
if (!/Solar Payback Map Editorial/.test(authorPageText) || !/knowsAbout/.test(authorPageText) || !/getPublishedPosts/.test(authorPageText)) {
  failures.push("app/authors/solarpaybackmap-editorial/page.jsx: author profile should include schema, expertise scope, and reviewed articles.");
}
if (!/ProfilePage/.test(authorPageText) || !/mainEntity/.test(authorPageText) || !/mainEntityOfPage/.test(authorPageText) || !/dateModified:\s*DEFAULT_LASTMOD/.test(authorPageText) || !/publisher/.test(authorPageText) || !/isAccessibleForFree/.test(authorPageText)) {
  failures.push("app/authors/solarpaybackmap-editorial/page.jsx: author profile should expose ProfilePage schema with main entity, mainEntityOfPage, publisher, modified-date, and free-access context.");
}
if (!/contactPoint/.test(authorPageText) || !/editorial corrections and source review/.test(authorPageText) || !/Request a correction/.test(authorPageText) || !/href="\/contact"/.test(authorPageText)) {
  failures.push("app/authors/solarpaybackmap-editorial/page.jsx: author profile should expose correction contactPoint schema and a visible contact path.");
}
if (!/<dl className="author-policy-summary" aria-label="Solar Payback Map Editorial reviewer summary">/.test(authorPageText) || !/<dt>Review focus<\/dt>/.test(authorPageText) || !/<dt>Source standard<\/dt>/.test(authorPageText) || !/<dt>Independence<\/dt>/.test(authorPageText) || !/<dt>Correction route<\/dt>/.test(authorPageText)) {
  failures.push("app/authors/solarpaybackmap-editorial/page.jsx: author profile should expose a labeled reviewer summary with focus, sources, independence, and correction route.");
}
if (!/<nav className="author-links" aria-label="Solar Payback Map Editorial trust links">/.test(authorPageText) || !/href="\/editorial-policy"/.test(authorPageText) || !/href="\/methodology"/.test(authorPageText) || !/href="\/contact"/.test(authorPageText)) {
  failures.push("app/authors/solarpaybackmap-editorial/page.jsx: author profile trust CTAs should render as a labeled navigation landmark.");
}
if (!/<nav aria-label="Solar Payback Map Editorial next steps">/.test(authorPageText) || !/<ul className="trust-link-list">/.test(authorPageText) || !/href="\/editorial-policy"/.test(authorPageText) || !/href="\/methodology"/.test(authorPageText) || !/href="\/contact"/.test(authorPageText) || !/href="\/content-manifest"/.test(authorPageText)) {
  failures.push("app/authors/solarpaybackmap-editorial/page.jsx: author profile should expose labeled next-step links to editorial, methodology, contact, and manifest pages.");
}
if (!/Recent Solar Payback Map Editorial reviewed articles/.test(authorPageText) || !/"@type":\s*"ItemList"/.test(authorPageText) || !/itemListElement:\s*posts\.map/.test(authorPageText) || !/articleSection:\s*post\.category/.test(authorPageText) || !/<time dateTime=\{toDateTime\(post\.updated\)\}>/.test(authorPageText)) {
  failures.push("app/authors/solarpaybackmap-editorial/page.jsx: recent reviewed articles should be exposed as an ItemList with semantic updated dates.");
}
if (!/<dl className="reviewed-article-meta" aria-label=\{`\$\{post\.title\} review metadata`\}>/.test(authorPageText) || !/<dt>Category<\/dt>/.test(authorPageText) || !/<dt>Updated<\/dt>/.test(authorPageText) || !/formatDisplayDate\(post\.updated\)/.test(authorPageText)) {
  failures.push("app/authors/solarpaybackmap-editorial/page.jsx: recent reviewed article metadata should render as a labeled description list.");
}

const siteUtilText = fs.readFileSync(path.join(root, "lib/site.js"), "utf8");
if (!/createPageJsonLd/.test(siteUtilText) || !/isAccessibleForFree/.test(siteUtilText) || !/datePublished:\s*DEFAULT_PUBLISHED/.test(siteUtilText) || !/dateModified:\s*DEFAULT_LASTMOD/.test(siteUtilText) || !/reviewedBy/.test(siteUtilText) || !/"@id":\s*`\$\{pageUrl\}#webpage`/.test(siteUtilText) || !/mainEntityOfPage:\s*\{[\s\S]*"@type":\s*"WebPage"[\s\S]*"@id":\s*pageUrl/.test(siteUtilText)) {
  failures.push("lib/site.js: shared page JSON-LD helper should expose free-access, publish/modified dates, review, @id, and WebPage mainEntityOfPage context.");
}
for (const route of [
  "app/about/page.jsx",
  "app/contact/page.jsx",
  "app/methodology/page.jsx",
  "app/legal/page.jsx",
  "app/editorial-policy/page.jsx",
]) {
  const text = fs.readFileSync(path.join(root, route), "utf8");
  if (!/createPageJsonLd/.test(text) || !/description/.test(text) || !/about:/.test(text)) {
    failures.push(`${route}: trust page JSON-LD should use the shared page schema helper with description and about context.`);
  }
}
for (const route of ["app/page.jsx", "app/about/page.jsx", "app/methodology/page.jsx"]) {
  const text = fs.readFileSync(path.join(root, route), "utf8");
  if (!/source-card/.test(text) || !/target="_blank"/.test(text) || !/rel="noopener noreferrer external"/.test(text) || !/aria-label=\{`\$\{source\.name\} public data source`\}/.test(text)) {
    failures.push(`${route}: public source cards should use safe external-link attributes and descriptive labels.`);
  }
  if (!/<ul className="source-grid" aria-label="Public solar data sources">/.test(text) || !/<li key=\{source\.name\}>/.test(text)) {
    failures.push(`${route}: public source cards should render as a labeled semantic list.`);
  }
}
const aboutText = fs.readFileSync(path.join(root, "app/about/page.jsx"), "utf8");
if (!/<dl className="about-policy-summary" aria-label="Solar Payback Map about and independence summary">/.test(aboutText) || !/<dt>Site purpose<\/dt>/.test(aboutText) || !/<dt>Revenue model<\/dt>/.test(aboutText) || !/<dt>Data approach<\/dt>/.test(aboutText) || !/<dt>Decision limit<\/dt>/.test(aboutText)) {
  failures.push("app/about/page.jsx: about page should expose a labeled description-list summary of purpose, revenue model, data approach, and decision limits.");
}
if (!/<ol className="principles" aria-label="Solar Payback Map editorial principles">/.test(aboutText) || !/<li className="principle">/.test(aboutText)) {
  failures.push("app/about/page.jsx: editorial principles should render as a labeled ordered list.");
}
if (!/<nav aria-label="About Solar Payback Map next steps">/.test(aboutText) || !/<ul className="trust-link-list">/.test(aboutText) || !/href="\/methodology"/.test(aboutText) || !/href="\/rankings"/.test(aboutText)) {
  failures.push("app/about/page.jsx: methodology and rankings next-step links should render as a labeled navigation list.");
}
const methodologyText = fs.readFileSync(path.join(root, "app/methodology/page.jsx"), "utf8");
if (!/<dl className="methodology-scope-summary" aria-label="Solar payback methodology scope summary">/.test(methodologyText) || !/<dt>Inputs reviewed<\/dt>/.test(methodologyText) || !/<dt>Outputs published<\/dt>/.test(methodologyText) || !/<dt>Review cadence<\/dt>/.test(methodologyText) || !/<dt>Property limits<\/dt>/.test(methodologyText)) {
  failures.push("app/methodology/page.jsx: methodology should expose a labeled description-list summary of inputs, outputs, review cadence, and property limits.");
}
if (!/<caption>Solar payback model input and assumption table<\/caption>/.test(methodologyText) || !/<th scope="row">Production<\/th>/.test(methodologyText)) {
  failures.push("app/methodology/page.jsx: methodology model table should expose a caption and scoped row headers.");
}
if (!/<ul className="model-exclusion-list" aria-label="Solar payback model exclusions">/.test(methodologyText) || !/Roof orientation, shading, panel choice/.test(methodologyText) || !/property-specific tax treatment are not scored/.test(methodologyText)) {
  failures.push("app/methodology/page.jsx: methodology model exclusions should render as a labeled list.");
}
if (!/<nav aria-label="Methodology next steps">/.test(methodologyText) || !/<ul className="trust-link-list">/.test(methodologyText) || !/href="\/calculator"/.test(methodologyText) || !/href="\/rankings"/.test(methodologyText) || !/href="\/editorial-policy"/.test(methodologyText) || !/href="\/legal#disclaimer"/.test(methodologyText)) {
  failures.push("app/methodology/page.jsx: methodology next-step links should render as a labeled navigation list.");
}
const legalPageText = fs.readFileSync(path.join(root, "app/legal/page.jsx"), "utf8");
if (!/id="privacy"/.test(legalPageText) || !/id="advertising"/.test(legalPageText) || !/id="disclaimer"/.test(legalPageText) || !/id="attribution"/.test(legalPageText)) {
  failures.push("app/legal/page.jsx: legal page should expose privacy, advertising, disclaimer, and attribution anchors.");
}
if (!/<dl className="legal-policy-summary" aria-label="Solar Payback Map legal policy summary">/.test(legalPageText) || !/<dt>Privacy position<\/dt>/.test(legalPageText) || !/<dt>Advertising model<\/dt>/.test(legalPageText) || !/<dt>Estimate status<\/dt>/.test(legalPageText) || !/<dt>Data attribution<\/dt>/.test(legalPageText)) {
  failures.push("app/legal/page.jsx: legal page should expose a labeled description-list summary of privacy, advertising, estimate status, and attribution.");
}
if (!/AdSense Auto Ads/.test(legalPageText) || !/cookies or similar storage/.test(legalPageText) || !/does not place manual ad slots/.test(legalPageText)) {
  failures.push("app/legal/page.jsx: legal page should explain advertising, cookies, and Auto Ads policy.");
}
if (!/Solar Payback Map legal sections/.test(legalPageText) || !/legalSections\.map/.test(legalPageText) || !/Legal sections/.test(legalPageText) || !/href: "\/legal#privacy"/.test(legalPageText) || !/href: "\/legal#advertising"/.test(legalPageText) || !/href: "\/legal#disclaimer"/.test(legalPageText) || !/href: "\/legal#attribution"/.test(legalPageText)) {
  failures.push("app/legal/page.jsx: legal page should expose visible and structured section navigation for privacy, advertising, disclaimer, and attribution.");
}
if (!/<nav aria-label="Solar Payback Map legal sections">/.test(legalPageText) || !/<ul className="legal-section-list">/.test(legalPageText) || !/<li key=\{section\.href\}>/.test(legalPageText) || !/<Link href=\{section\.href\}>/.test(legalPageText)) {
  failures.push("app/legal/page.jsx: visible legal section links should render inside a labeled navigation landmark.");
}
if (!/<dl className="legal-section-meta" aria-label=\{`\$\{section\.name\} legal section scope`\}>/.test(legalPageText) || !/<dt>Section scope<\/dt>/.test(legalPageText) || !/<dd>\{section\.description\}<\/dd>/.test(legalPageText)) {
  failures.push("app/legal/page.jsx: legal section descriptions should render as labeled description-list metadata.");
}
if (!/<nav aria-label="Legal next steps">/.test(legalPageText) || !/<ul className="trust-link-list">/.test(legalPageText) || !/href="\/contact"/.test(legalPageText) || !/href="\/editorial-policy"/.test(legalPageText) || !/href="\/methodology"/.test(legalPageText) || !/href="\/content-manifest"/.test(legalPageText)) {
  failures.push("app/legal/page.jsx: legal page should expose labeled next-step links to contact, editorial policy, methodology, and content manifest pages.");
}

const contactPageText = fs.readFileSync(path.join(root, "app/contact/page.jsx"), "utf8");
if (!/ContactPage/.test(contactPageText) || !/Corrections and source review/.test(contactPageText) || !/Advertising and privacy questions/.test(contactPageText) || !/Methodology questions/.test(contactPageText)) {
  failures.push("app/contact/page.jsx: contact page should expose correction, advertising/privacy, and methodology contact paths with ContactPage schema.");
}
if (!/<dl className="contact-policy-summary" aria-label="Solar Payback Map contact and correction summary">/.test(contactPageText) || !/<dt>Correction path<\/dt>/.test(contactPageText) || !/<dt>Source evidence<\/dt>/.test(contactPageText) || !/<dt>Privacy route<\/dt>/.test(contactPageText) || !/<dt>Methodology route<\/dt>/.test(contactPageText)) {
  failures.push("app/contact/page.jsx: contact page should expose a labeled description-list summary of correction, source evidence, privacy, and methodology routes.");
}
if (!/\/editorial-policy/.test(contactPageText) || !/\/legal#advertising/.test(contactPageText) || !/\/legal#privacy/.test(contactPageText) || !/\/methodology/.test(contactPageText) || !/\/authors\/solarpaybackmap-editorial/.test(contactPageText)) {
  failures.push("app/contact/page.jsx: contact page should link to editorial, legal, methodology, and author trust pages.");
}
if (!/Solar Payback Map contact paths/.test(contactPageText) || !/contactPaths\.map/.test(contactPageText) || !/id="corrections"/.test(contactPageText) || !/id="advertising"/.test(contactPageText) || !/id="methodology"/.test(contactPageText) || !/What to include/.test(contactPageText) || !/article URL/.test(contactPageText)) {
  failures.push("app/contact/page.jsx: contact page should expose anchored contact paths, ItemList schema, and correction request details.");
}
if (!/<ul className="contact-path-list" aria-label="Solar Payback Map contact paths">/.test(contactPageText) || !/<li key=\{path\.href\}>/.test(contactPageText) || !/<Link href=\{path\.href\}>/.test(contactPageText) || !/url:\s*`\$\{siteUrl\}\$\{path\.href\}`/.test(contactPageText)) {
  failures.push("app/contact/page.jsx: contact path ItemList data should also render as a labeled visible link list.");
}
if (!/<dl className="contact-path-meta" aria-label=\{`\$\{path\.name\} route guidance`\}>/.test(contactPageText) || !/<dt>Route guidance<\/dt>/.test(contactPageText) || !/<dd>\{path\.description\}<\/dd>/.test(contactPageText)) {
  failures.push("app/contact/page.jsx: contact path descriptions should render as labeled description-list metadata.");
}
if (!/<ul className="correction-checklist" aria-label="Correction request details to include">/.test(contactPageText) || !/exact sentence, table, or claim/.test(contactPageText) || !/public source URL/.test(contactPageText)) {
  failures.push("app/contact/page.jsx: correction request details should render as a labeled checklist.");
}
if (!/<nav aria-label="Contact next steps">/.test(contactPageText) || !/<ul className="trust-link-list">/.test(contactPageText) || !/href="\/editorial-policy"/.test(contactPageText) || !/href="\/legal#advertising"/.test(contactPageText) || !/href="\/authors\/solarpaybackmap-editorial"/.test(contactPageText) || !/href="\/content-manifest"/.test(contactPageText)) {
  failures.push("app/contact/page.jsx: contact page should expose labeled next-step links to policy, legal, author, and manifest pages.");
}

const editorialPolicyText = fs.readFileSync(path.join(root, "app/editorial-policy/page.jsx"), "utf8");
if (!/<dl className="editorial-policy-summary" aria-label="Solar Payback Map editorial policy summary">/.test(editorialPolicyText) || !/<dt>Editorial independence<\/dt>/.test(editorialPolicyText) || !/<dt>Source basis<\/dt>/.test(editorialPolicyText) || !/<dt>Update standard<\/dt>/.test(editorialPolicyText) || !/<dt>Reader action<\/dt>/.test(editorialPolicyText)) {
  failures.push("app/editorial-policy/page.jsx: editorial policy should expose a labeled description-list summary of independence, source basis, update standard, and reader action.");
}
if (!/Correction request checklist/.test(editorialPolicyText) || !/article URL/.test(editorialPolicyText) || !/public source/.test(editorialPolicyText) || !/\/contact/.test(editorialPolicyText) || !/\/legal#advertising/.test(editorialPolicyText)) {
  failures.push("app/editorial-policy/page.jsx: editorial policy should expose correction-request requirements, contact path, and advertising disclosure link.");
}
if (!/<ul className="review-process-list" aria-label="Editorial review process requirements">/.test(editorialPolicyText) || !/publish-ready article/.test(editorialPolicyText) || !/<ul className="correction-checklist" aria-label="Editorial correction request details to include">/.test(editorialPolicyText)) {
  failures.push("app/editorial-policy/page.jsx: review process and correction request details should render as labeled checklists.");
}
if (!/<nav aria-label="Editorial policy next steps">/.test(editorialPolicyText) || !/<ul className="trust-link-list">/.test(editorialPolicyText) || !/href="\/methodology"/.test(editorialPolicyText) || !/href="\/about"/.test(editorialPolicyText) || !/href="\/blog"/.test(editorialPolicyText) || !/href="\/legal#advertising"/.test(editorialPolicyText)) {
  failures.push("app/editorial-policy/page.jsx: next-step trust links should render as a labeled navigation list.");
}

const homePageText = fs.readFileSync(path.join(root, "app/page.jsx"), "utf8");
if (hasBadEditedSymbols(homePageText)) {
  failures.push("app/page.jsx: home page copy should avoid smart quotes and non-ASCII symbols in edited content.");
}

if (!/Research paths/.test(homePageText) || !/\/content-manifest/.test(homePageText) || !/\/editorial-policy/.test(homePageText)) {
  failures.push("app/page.jsx: home page should link to research paths, content manifest, and editorial policy.");
}
if (!/<div className="hero-actions">/.test(homePageText) || !/href="\/rankings"/.test(homePageText) || !/href="\/calculator"/.test(homePageText) || !/Run a payback scenario/.test(homePageText) || !/href="\/methodology"/.test(homePageText)) {
  failures.push("app/page.jsx: home hero should expose direct CTAs to rankings, calculator, and methodology.");
}
if (!/<dl className="manifest-card-meta" aria-label=\{`\$\{item\.label\} research path description`\}>/.test(homePageText) || !/<dt>Description<\/dt>/.test(homePageText) || !/<dd>\{item\.description\}<\/dd>/.test(homePageText)) {
  failures.push("app/page.jsx: home research path descriptions should render as labeled description-list metadata.");
}
if (!/dynamic\s*=\s*"force-dynamic"/.test(homePageText) || !/getPublishedPosts/.test(homePageText) || !/Latest articles/.test(homePageText) || !/BlogGrid/.test(homePageText)) {
  failures.push("app/page.jsx: home page should dynamically expose latest published articles.");
}
if (!/ItemList/.test(homePageText) || !/Solar Payback Map solar payback research paths/.test(homePageText)) {
  failures.push("app/page.jsx: home page should include ItemList JSON-LD for research paths and latest articles.");
}
if (!/<table className="mini-rank">/.test(homePageText) || !/<caption className="sr-only">Top Solar Payback Map state scores/.test(homePageText) || !/<th scope="row"><strong>\{state\.name\}/.test(homePageText)) {
  failures.push("app/page.jsx: home Worth-It Score preview should be a semantic table with a caption and row headers.");
}

const categoryPageText = fs.readFileSync(path.join(root, "app/blog/category/[category]/page.jsx"), "utf8");
if (!/dynamic\s*=\s*"force-dynamic"/.test(categoryPageText) || !/dynamicParams\s*=\s*true/.test(categoryPageText) || !/generateStaticParams/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category route should allow newly published topic hubs to resolve dynamically.");
}
if (!/Recommended reading path/.test(categoryPageText) || !/hub-intro/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hub intro and reading path are missing.");
}
if (!/<dl className="category-hub-scope" aria-label=\{`\$\{category\} topic hub scope`\}>/.test(categoryPageText) || !/<dt>Research focus<\/dt>/.test(categoryPageText) || !/<dt>Reading order<\/dt>/.test(categoryPageText) || !/<dt>Quality basis<\/dt>/.test(categoryPageText) || !/<dt>Not included<\/dt>/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hub should expose a labeled scope summary for focus, reading order, quality basis, and exclusions.");
}
if (!/<section className="read-path" aria-labelledby="recommended-reading-path">/.test(categoryPageText) || !/<h2 id="recommended-reading-path">Recommended reading path<\/h2>/.test(categoryPageText) || !/<ol>/.test(categoryPageText) || !/<li key=\{post\.slug\}>/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: recommended reading path should render as a labeled section with an ordered article list.");
}
if (!/hub-stats/.test(categoryPageText) || !/dateModified:\s*latestUpdated/.test(categoryPageText) || !/Public-source/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hubs should expose freshness, article count, and quality signals.");
}
if (!/<dl className="hub-stats" aria-label=\{`\$\{category\} topic hub freshness`\}>/.test(categoryPageText) || !/<dt>\{posts\.length\}<\/dt>/.test(categoryPageText) || !/<dd>published articles in this topic<\/dd>/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hub stats should render as a labeled description list.");
}
if (!/publisher/.test(categoryPageText) || !/reviewedBy/.test(categoryPageText) || !/publishingPrinciples/.test(categoryPageText) || !/inLanguage/.test(categoryPageText) || !/isAccessibleForFree/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hub CollectionPage schema should expose publisher, review, language, editorial-policy, and free-access context.");
}
if (!/mainEntity:\s*\{[\s\S]*"@type":\s*"ItemList"[\s\S]*itemListElement:\s*posts\.map/.test(categoryPageText) || !/position:\s*index \+ 1/.test(categoryPageText) || !/articleSection:\s*post\.category/.test(categoryPageText) || !/about:\s*\[/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hub schema should expose an ItemList of articles with positions, sections, and topical about terms.");
}
if (!/@\/lib\/dates/.test(categoryPageText) || !/formatDisplayDate/.test(categoryPageText) || !/toDateTime/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hub dates should use the shared date helper.");
}
if (!/<time dateTime=\{toDateTime\(latestUpdated\)\}>\{formatDisplayDate\(latestUpdated\)\}<\/time>/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hub freshness dates should render with semantic time metadata.");
}
if (!/<nav aria-label=\{`\$\{category\} topic hub next steps`\}>/.test(categoryPageText) || !/<ul className="trust-link-list">/.test(categoryPageText) || !/href="\/blog\/category"/.test(categoryPageText) || !/href="\/calculator"/.test(categoryPageText) || !/href="\/methodology"/.test(categoryPageText) || !/href="\/content-manifest"/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hub should expose labeled next-step links to topic index, calculator, methodology, and content manifest.");
}
if (!/Breadcrumbs/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hub should use reusable Breadcrumbs for UI and JSON-LD.");
}
if (!/getCategoryMetaDescription/.test(categoryPageText) || !/getCategoryIntent/.test(categoryPageText) || !/getCategoryDescription/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hubs should use centralized unique category descriptions and intent.");
}
if (!/getCategoryKeywords/.test(categoryPageText) || !/keywords:\s*getCategoryKeywords\(category\)/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category hub metadata should use centralized category keywords.");
}
if (!/image:\s*`\/blog\/category\/\$\{categorySlug\}\/opengraph-image`/.test(categoryPageText)) {
  failures.push("app/blog/category/[category]/page.jsx: category metadata should point to the dynamic Open Graph image route.");
}

const californiaPageText = fs.readFileSync(path.join(root, "app/solar/california/page.jsx"), "utf8");
if (!/CollectionPage/.test(californiaPageText) || !/Breadcrumbs/.test(californiaPageText)) {
  failures.push("app/solar/california/page.jsx: state hub should include CollectionPage schema and reusable breadcrumb UI/JSON-LD.");
}
if (!/publisher/.test(californiaPageText) || !/reviewedBy/.test(californiaPageText) || !/dateModified:\s*DEFAULT_LASTMOD/.test(californiaPageText) || !/citation:\s*sources\.map/.test(californiaPageText) || !/publishingPrinciples/.test(californiaPageText) || !/license:\s*`\$\{siteUrl\}\/legal#attribution`/.test(californiaPageText)) {
  failures.push("app/solar/california/page.jsx: state hub CollectionPage schema should expose publisher, review, modified-date, citations, editorial-policy, and attribution-license context.");
}
if (!/\/legal#attribution/.test(californiaPageText) || !/Solar Payback Map attribution policy/.test(californiaPageText)) {
  failures.push("app/solar/california/page.jsx: state hub should visibly link the attribution policy.");
}
if (hasBadEditedSymbols(californiaPageText) || !/31\.8c/.test(californiaPageText)) {
  failures.push("app/solar/california/page.jsx: state hub should use ASCII rate notation.");
}

if (!/<dl className="california-solar-scope" aria-label="California solar payback scope summary">/.test(californiaPageText) || !/<dt>State focus<\/dt>/.test(californiaPageText) || !/<dt>Policy factor<\/dt>/.test(californiaPageText) || !/<dt>Best use<\/dt>/.test(californiaPageText) || !/<dt>Not included<\/dt>/.test(californiaPageText)) {
  failures.push("app/solar/california/page.jsx: state hub should expose a labeled scope summary for focus, policy factor, best use, and exclusions.");
}
if (!/<dl className="stat-grid" aria-label="California solar payback screening metrics">/.test(californiaPageText) || !/<dt className="metric">82<\/dt>/.test(californiaPageText) || !/<dd className="dlabel">Worth-It Score<\/dd>/.test(californiaPageText)) {
  failures.push("app/solar/california/page.jsx: state screening metrics should render as a labeled description list.");
}
if (!/<nav aria-label="California solar next steps">/.test(californiaPageText) || !/<ul className="trust-link-list">/.test(californiaPageText) || !/href="\/rankings"/.test(californiaPageText) || !/href="\/calculator"/.test(californiaPageText)) {
  failures.push("app/solar/california/page.jsx: state hub next-step links should render as a labeled navigation list.");
}

const sanDiegoPageText = fs.readFileSync(path.join(root, "app/solar/california/san-diego-county/page.jsx"), "utf8");
if (!/Article/.test(sanDiegoPageText) || !/Breadcrumbs/.test(sanDiegoPageText)) {
  failures.push("app/solar/california/san-diego-county/page.jsx: county page should include Article schema and reusable breadcrumb UI/JSON-LD.");
}
if (!/author/.test(sanDiegoPageText) || !/publisher/.test(sanDiegoPageText) || !/reviewedBy/.test(sanDiegoPageText) || !/dateModified:\s*DEFAULT_LASTMOD/.test(sanDiegoPageText) || !/citation:\s*sources\.map/.test(sanDiegoPageText) || !/publishingPrinciples/.test(sanDiegoPageText) || !/license:\s*`\$\{siteUrl\}\/legal#attribution`/.test(sanDiegoPageText)) {
  failures.push("app/solar/california/san-diego-county/page.jsx: county Article schema should expose author, publisher, review, modified-date, citations, editorial-policy, and attribution-license context.");
}
if (!/\/legal#attribution/.test(sanDiegoPageText) || !/Solar Payback Map attribution policy/.test(sanDiegoPageText)) {
  failures.push("app/solar/california/san-diego-county/page.jsx: county page should visibly link the attribution policy.");
}
if (!/<dl className="stat-grid" aria-label="San Diego County solar payback screening metrics">/.test(sanDiegoPageText) || !/<dt className="metric">84<\/dt>/.test(sanDiegoPageText) || !/<dd className="dlabel">Worth-It Score<\/dd>/.test(sanDiegoPageText)) {
  failures.push("app/solar/california/san-diego-county/page.jsx: county screening metrics should render as a labeled description list.");
}
if (!/<nav aria-label="San Diego County solar next steps">/.test(sanDiegoPageText) || !/<ul className="trust-link-list">/.test(sanDiegoPageText) || !/href="\/legal#attribution"/.test(sanDiegoPageText) || !/href="\/solar\/california"/.test(sanDiegoPageText) || !/href="\/calculator"/.test(sanDiegoPageText)) {
  failures.push("app/solar/california/san-diego-county/page.jsx: county next-step links should render as a labeled navigation list.");
}
if (!/keywords:\s*\[[\s\S]*San Diego County solar payback[\s\S]*\]/.test(sanDiegoPageText)) {
  failures.push("app/solar/california/san-diego-county/page.jsx: county page should declare focused metadata keywords.");
}

const calculatorPageText = fs.readFileSync(path.join(root, "app/calculator/page.jsx"), "utf8");
if (!/WebApplication/.test(calculatorPageText) || !/FinanceApplication/.test(calculatorPageText) || !/featureList/.test(calculatorPageText)) {
  failures.push("app/calculator/page.jsx: calculator page should include WebApplication structured data.");
}
if (!/publisher/.test(calculatorPageText) || !/reviewedBy/.test(calculatorPageText) || !/dateModified:\s*DEFAULT_LASTMOD/.test(calculatorPageText) || !/publishingPrinciples/.test(calculatorPageText)) {
  failures.push("app/calculator/page.jsx: calculator WebApplication schema should expose publisher, review, modified-date, and editorial-policy context.");
}
if (!/<dl className="calculator-page-summary" aria-label="Solar payback calculator scope summary">/.test(calculatorPageText) || !/<dt>Inputs used<\/dt>/.test(calculatorPageText) || !/<dt>Outputs shown<\/dt>/.test(calculatorPageText) || !/<dt>Best use<\/dt>/.test(calculatorPageText) || !/<dt>Not included<\/dt>/.test(calculatorPageText)) {
  failures.push("app/calculator/page.jsx: calculator page should expose a labeled scope summary for inputs, outputs, best use, and exclusions.");
}
if (!/<nav aria-label="Calculator next steps">/.test(calculatorPageText) || !/<ul className="trust-link-list">/.test(calculatorPageText) || !/href="\/methodology"/.test(calculatorPageText) || !/href="\/rankings"/.test(calculatorPageText) || !/href="\/blog\/category\/policy"/.test(calculatorPageText) || !/href="\/legal#disclaimer"/.test(calculatorPageText)) {
  failures.push("app/calculator/page.jsx: calculator page should expose labeled next-step links to methodology, rankings, topic content, and disclaimer.");
}

const rankingsPageText = fs.readFileSync(path.join(root, "app/rankings/page.jsx"), "utf8");
if (!/Dataset/.test(rankingsPageText) || !/variableMeasured/.test(rankingsPageText) || !/isAccessibleForFree/.test(rankingsPageText)) {
  failures.push("app/rankings/page.jsx: rankings page should include rich Dataset structured data.");
}
if (!/publisher/.test(rankingsPageText) || !/reviewedBy/.test(rankingsPageText) || !/dateModified:\s*DEFAULT_LASTMOD/.test(rankingsPageText) || !/citation:\s*sources\.map/.test(rankingsPageText) || !/license/.test(rankingsPageText)) {
  failures.push("app/rankings/page.jsx: rankings Dataset schema should expose publisher, review, modified-date, citations, and attribution context.");
}
if (!/<dl className="rankings-page-summary" aria-label="Solar rankings dataset scope summary">/.test(rankingsPageText) || !/<dt>Measures compared<\/dt>/.test(rankingsPageText) || !/<dt>Source basis<\/dt>/.test(rankingsPageText) || !/<dt>Best use<\/dt>/.test(rankingsPageText) || !/<dt>Not included<\/dt>/.test(rankingsPageText)) {
  failures.push("app/rankings/page.jsx: rankings page should expose a labeled dataset scope summary for measured variables, sources, best use, and exclusions.");
}
if (!/latestReviewDate/.test(rankingsPageText) || !/<dl className="stat-grid" aria-label="Solar rankings dataset summary">/.test(rankingsPageText) || !/<dt className="dlabel">states ranked<\/dt>/.test(rankingsPageText) || !/<dt className="dlabel">public source groups<\/dt>/.test(rankingsPageText) || !/<dt className="dlabel">latest review date<\/dt>/.test(rankingsPageText) || !/toDateTime\(latestReviewDate\)/.test(rankingsPageText)) {
  failures.push("app/rankings/page.jsx: rankings page should expose a labeled dataset summary before the table.");
}
if (!/<nav aria-label="Rankings next steps">/.test(rankingsPageText) || !/<ul className="trust-link-list">/.test(rankingsPageText) || !/href="\/calculator"/.test(rankingsPageText) || !/href="\/methodology"/.test(rankingsPageText) || !/href="\/blog\/category\/policy"/.test(rankingsPageText) || !/href="\/legal#attribution"/.test(rankingsPageText)) {
  failures.push("app/rankings/page.jsx: rankings page should expose labeled next-step links to calculator, methodology, topic content, and attribution.");
}

const calculatorComponentText = fs.readFileSync(path.join(root, "components/Calculator.jsx"), "utf8");
if (!/Electricity rate \(c\/kWh\)/.test(calculatorComponentText) || /¢/.test(calculatorComponentText)) {
  failures.push("components/Calculator.jsx: calculator rate label should use ASCII c/kWh notation.");
}
if (!/<fieldset/.test(calculatorComponentText) || !/<legend>Solar payback scenario inputs/.test(calculatorComponentText) || !/aria-live="polite"/.test(calculatorComponentText)) {
  failures.push("components/Calculator.jsx: calculator should group inputs with fieldset/legend and expose live results.");
}
if (!/<dl className="stat-grid" aria-label="Solar payback calculator results" aria-live="polite" role="status">/.test(calculatorComponentText) || !/<dt className="dlabel">simple payback<\/dt>/.test(calculatorComponentText) || !/<dd><output className="metric" htmlFor="system cost rate production export">/.test(calculatorComponentText)) {
  failures.push("components/Calculator.jsx: calculator results should render as a live description list with semantic output values.");
}
if (!/<dl className="calc-assumptions" aria-label="Current solar payback assumptions">/.test(calculatorComponentText) || !/<dt>System<\/dt>/.test(calculatorComponentText) || !/<dt>Bill value<\/dt>/.test(calculatorComponentText) || !/<dt>Export scenario<\/dt>/.test(calculatorComponentText) || !/getExportScenarioLabel/.test(calculatorComponentText)) {
  failures.push("components/Calculator.jsx: calculator should expose current assumptions as a labeled description list.");
}
if (!/clampNumber/.test(calculatorComponentText) || !/Number\.isFinite/.test(calculatorComponentText) || !/max="20"/.test(calculatorComponentText) || !/max="80"/.test(calculatorComponentText) || !/max="2200"/.test(calculatorComponentText)) {
  failures.push("components/Calculator.jsx: calculator inputs should clamp invalid values inside residential scenario ranges.");
}
if (!/aria-describedby="system-help"/.test(calculatorComponentText) || !/aria-describedby="cost-help"/.test(calculatorComponentText) || !/aria-describedby="rate-help"/.test(calculatorComponentText) || !/aria-describedby="production-help"/.test(calculatorComponentText) || !/aria-describedby="export-help"/.test(calculatorComponentText) || !/inputMode="decimal"/.test(calculatorComponentText)) {
  failures.push("components/Calculator.jsx: calculator numeric inputs should expose input modes and accessible range hints.");
}

const scoreTableText = fs.readFileSync(path.join(root, "components/ScoreTable.jsx"), "utf8");
if (!/c\/kWh/.test(scoreTableText) || /[¢·]/.test(scoreTableText)) {
  failures.push("components/ScoreTable.jsx: score table should use ASCII rate and score notation.");
}
if (!/<caption>State solar payback ranking table/.test(scoreTableText)) {
  failures.push("components/ScoreTable.jsx: score table should include a descriptive caption.");
}
if (!/className="card rank-table-card"/.test(scoreTableText)) {
  failures.push("components/ScoreTable.jsx: score table overflow should use the shared rank-table-card class.");
}
if (!/scope="col"/.test(scoreTableText) || !/scope="row"/.test(scoreTableText) || !/<th className="region" scope="row">/.test(scoreTableText)) {
  failures.push("components/ScoreTable.jsx: score table should use scoped column and row headers for assistive technology.");
}
if (!/useState/.test(scoreTableText) || !/aria-sort/.test(scoreTableText) || !/Sort by \$\{column\.label\}/.test(scoreTableText) || !/<button type="button"/.test(scoreTableText)) {
  failures.push("components/ScoreTable.jsx: score table should expose keyboard-accessible sortable headers with aria-sort.");
}
if (!/className="arr"/.test(scoreTableText) || !/"ASC"/.test(scoreTableText) || !/"DESC"/.test(scoreTableText) || !/currently sorted/.test(scoreTableText)) {
  failures.push("components/ScoreTable.jsx: score table sort indicators should use stable ASCII labels and screen-reader status text.");
}
if (!/<time dateTime=\{state\.sourceDate\}>\{state\.sourceDate\}<\/time>/.test(scoreTableText)) {
  failures.push("components/ScoreTable.jsx: score table review dates should render with semantic time metadata.");
}

const categoryIndexText = fs.readFileSync(path.join(root, "app/blog/category/page.jsx"), "utf8");
if (!/Topic Index/.test(categoryIndexText) || !/ItemList/.test(categoryIndexText) || !/category-index/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index should provide a crawlable ItemList of topic hubs.");
}
if (!/<dl className="topic-index-scope" aria-label="Solar payback topic index scope">/.test(categoryIndexText) || !/<dt>Hub purpose<\/dt>/.test(categoryIndexText) || !/<dt>Included topics<\/dt>/.test(categoryIndexText) || !/<dt>Best use<\/dt>/.test(categoryIndexText) || !/<dt>Not included<\/dt>/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index should expose a labeled scope summary for hub purpose, included topics, best use, and exclusions.");
}
if (!/<ol className="category-index" aria-label="Solar payback topic hubs">/.test(categoryIndexText) || !/<li key=\{item\.category\}>/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index cards should render as a labeled ordered list.");
}
if (!/<dl className="category-card-meta" aria-label=\{`\$\{item\.category\} topic hub metadata`\}>/.test(categoryIndexText) || !/<dt>Articles<\/dt>/.test(categoryIndexText) || !/<dd>\{item\.count\}<\/dd>/.test(categoryIndexText) || !/<dt>Latest<\/dt>/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index card metadata should render as a labeled description list.");
}
if (!/totalPublishedArticles/.test(categoryIndexText) || !/<dl className="topic-index-summary" aria-label="Solar payback topic index summary">/.test(categoryIndexText) || !/active topic hubs/.test(categoryIndexText) || !/published articles across hubs/.test(categoryIndexText) || !/latest topic update reviewed in UTC/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index should expose a labeled summary for topic and published-article counts.");
}
if (!/publisher/.test(categoryIndexText) || !/reviewedBy/.test(categoryIndexText) || !/dateModified:\s*latestUpdated/.test(categoryIndexText) || !/publishingPrinciples/.test(categoryIndexText) || !/isAccessibleForFree/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index CollectionPage schema should expose publisher, review, modified-date, editorial-policy, and free-access context.");
}
if (!/getCategoryDescription/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index should use centralized category descriptions.");
}
if (!/keywords:\s*\[[\s\S]*solar payback topic hubs[\s\S]*\]/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index should declare focused metadata keywords.");
}
if (!/getLatestUpdated/.test(categoryIndexText) || !/<dt>Updated<\/dt>/.test(categoryIndexText) || !/toDateTime/.test(categoryIndexText) || !/<time dateTime=\{toDateTime\(item\.latestUpdated\)\}>/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index cards should expose semantic latest updated dates.");
}
if (!/@\/lib\/dates/.test(categoryIndexText) || !/formatDisplayDate/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index dates should use the shared date helper.");
}
if (!/image:\s*"\/blog\/category\/opengraph-image"/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index metadata should point to its Open Graph image route.");
}
if (!/<nav aria-label="Topic index next steps">/.test(categoryIndexText) || !/<ul className="trust-link-list">/.test(categoryIndexText) || !/href="\/blog"/.test(categoryIndexText) || !/href="\/calculator"/.test(categoryIndexText) || !/href="\/methodology"/.test(categoryIndexText) || !/href="\/content-manifest"/.test(categoryIndexText)) {
  failures.push("app/blog/category/page.jsx: category index should expose labeled next-step links to articles, calculator, methodology, and content manifest.");
}

const categoriesText = fs.readFileSync(path.join(root, "lib/categories.js"), "utf8");
if (!/categoryProfiles/.test(categoriesText) || !/getCategoryMetaDescription/.test(categoriesText) || !/getCategoryIntent/.test(categoriesText) || !/getCategoryKeywords/.test(categoriesText)) {
  failures.push("lib/categories.js: category profile descriptions, intents, keywords, and meta descriptions should be centralized.");
}
for (const category of ["Battery", "Buying", "Data", "Finance", "Incentives", "Methodology", "Policy", "Rates", "Roof"]) {
  if (!categoriesText.includes(`${category}:`)) {
    failures.push(`lib/categories.js: missing category profile for ${category}.`);
  }
}

const blogPageText = fs.readFileSync(path.join(root, "app/blog/page.jsx"), "utf8");
if (!/\/blog\/category/.test(blogPageText)) {
  failures.push("app/blog/page.jsx: blog home should link to the topic hub index.");
}
if (!/Breadcrumbs/.test(blogPageText) || !/BreadcrumbList/.test(breadcrumbsText)) {
  failures.push("app/blog/page.jsx: blog home should render breadcrumb UI and JSON-LD.");
}
if (!/publisher/.test(blogPageText) || !/inLanguage/.test(blogPageText) || !/isAccessibleForFree:\s*true/.test(blogPageText) || !/dateModified:\s*latestUpdated/.test(blogPageText) || !/mainEntityOfPage/.test(blogPageText) || !/url:\s*`\$\{siteUrl\}\/blog`/.test(blogPageText)) {
  failures.push("app/blog/page.jsx: blog JSON-LD should expose url, language, free-access, modified-date, mainEntityOfPage, and publisher context.");
}
if (!/@\/lib\/dates/.test(blogPageText) || !/getLatestUpdated/.test(blogPageText) || !/formatDisplayDate/.test(blogPageText) || !/toDateTime/.test(blogPageText) || !/<time dateTime=\{toDateTime\(latestUpdated\)\}>/.test(blogPageText) || !/Latest article update reviewed in UTC/.test(blogPageText)) {
  failures.push("app/blog/page.jsx: blog home should expose semantic visible freshness using the shared date helper.");
}
if (!/editorialAuthor/.test(blogPageText) || !/description:\s*post\.metaDescription \|\| post\.subtitle \|\| post\.excerpt/.test(blogPageText) || !/mainEntityOfPage/.test(blogPageText) || !/datePublished:\s*post\.publishAt \|\| post\.date/.test(blogPageText) || !/articleSection:\s*post\.category/.test(blogPageText) || !/keywords:\s*post\.keywords\?\.join/.test(blogPageText) || !/image:\s*`\$\{siteUrl\}\/blog\/\$\{post\.slug\}\/opengraph-image`/.test(blogPageText) || !/publishingPrinciples:\s*`\$\{siteUrl\}\/editorial-policy`/.test(blogPageText) || !/isAccessibleForFree:\s*true/.test(blogPageText)) {
  failures.push("app/blog/page.jsx: blog home BlogPosting summaries should expose description, author, publisher, image, keywords, published date, section, editorial policy, and free-access context.");
}
if (!/<nav aria-label="Solar payback journal next steps">/.test(blogPageText) || !/<ul className="trust-link-list">/.test(blogPageText) || !/href="\/blog\/category"/.test(blogPageText) || !/href="\/calculator"/.test(blogPageText) || !/href="\/methodology"/.test(blogPageText) || !/href="\/content-manifest"/.test(blogPageText)) {
  failures.push("app/blog/page.jsx: blog home should expose labeled next-step links to topic hubs, calculator, methodology, and content manifest.");
}
if (!/image:\s*"\/blog\/opengraph-image"/.test(blogPageText)) {
  failures.push("app/blog/page.jsx: blog home metadata should point to its Open Graph image route.");
}

for (const [route, requiredText] of [
  ["app/blog/opengraph-image.jsx", "getPublishedPosts"],
  ["app/blog/category/opengraph-image.jsx", "getPublishedCategories"],
]) {
  const ogText = fs.readFileSync(path.join(root, route), "utf8");
  if (!/ImageResponse/.test(ogText) || !/contentType\s*=\s*"image\/png"/.test(ogText) || !/dynamic\s*=\s*"force-dynamic"/.test(ogText) || !ogText.includes(requiredText) || !/getLatestUpdated/.test(ogText) || !/formatDisplayDate/.test(ogText) || !/Updated \{latestUpdated/.test(ogText)) {
    failures.push(`${route}: static hub Open Graph image should return a dynamic PNG ImageResponse with live content and freshness context.`);
  }
}
for (const route of [
  "app/blog/[slug]/opengraph-image.jsx",
  "app/blog/category/[category]/opengraph-image.jsx",
]) {
  const ogText = fs.readFileSync(path.join(root, route), "utf8");
  if (!/ImageResponse/.test(ogText) || !/contentType\s*=\s*"image\/png"/.test(ogText) || !/dynamic\s*=\s*"force-dynamic"/.test(ogText) || !/formatDisplayDate/.test(ogText) || !/Updated \{/.test(ogText)) {
    failures.push(`${route}: dynamic Open Graph image should return a PNG ImageResponse with freshness context without static caching.`);
  }
}
const articleOgText = fs.readFileSync(path.join(root, "app/blog/[slug]/opengraph-image.jsx"), "utf8");
if (!/qualityScore/.test(articleOgText) || !/Quality \{post\?\.qualityScore/.test(articleOgText)) {
  failures.push("app/blog/[slug]/opengraph-image.jsx: article Open Graph image should expose quality review context.");
}
const categoryOgText = fs.readFileSync(path.join(root, "app/blog/category/[category]/opengraph-image.jsx"), "utf8");
if (!/getLatestUpdated\(posts\)/.test(categoryOgText)) {
  failures.push("app/blog/category/[category]/opengraph-image.jsx: category Open Graph image should use the latest article update in that category.");
}

const llmsText = fs.readFileSync(path.join(root, "app/llms.txt/route.js"), "utf8");
if (!/text\/plain/.test(llmsText) || !/Latest published articles/.test(llmsText) || !/getPublishedPosts/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should expose published articles as text/plain.");
}
if (!/getPlannedPosts/.test(llmsText) || !/pendingScheduledPosts/.test(llmsText) || !/Content operations/.test(llmsText) || !/Published articles available now/.test(llmsText) || !/Ready article drafts with approved metadata/.test(llmsText) || !/Pending scheduled articles not yet exposed to crawlers/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should expose content operations and scheduled publishing status.");
}
if (!/Latest published article update/.test(llmsText) || !/new Date\(latestUpdated\)\.toISOString\(\)/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should expose the latest published article update as an ISO timestamp.");
}
if (!/key takeaways/.test(llmsText) || !/quality score/.test(llmsText) || !/source counts/.test(llmsText) || !/internal-link counts/.test(llmsText) || !/legal disclosure context/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should describe article and feed quality metadata for AI crawlers.");
}
if (!/ProfilePage/.test(llmsText) || !/publishing principles/.test(llmsText) || !/main keyword/.test(llmsText) || !/author profile URL/.test(llmsText) || !/contact URL/.test(llmsText) || !/legal URL/.test(llmsText) || !/license URL/.test(llmsText) || !/legal disclosure/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should describe author ProfilePage and feed-level trust metadata.");
}
if (!/Web app manifest shortcuts/.test(llmsText) || !/editorial policy/.test(llmsText) || !/legal disclosures/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should describe web app manifest trust shortcuts.");
}
if (!/en_US Open Graph locale/.test(llmsText) || !/page-level keywords/.test(llmsText) || !/hreflang alternates/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should describe page-level locale, keyword, canonical, and hreflang metadata.");
}
if (!/\/feed\.json/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should link to the JSON Feed.");
}
if (!/\/ads\.txt/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should link to ads.txt.");
}
if (!/\/manifest\.webmanifest/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should link to the web app manifest.");
}
if (!/\/authors\/solarpaybackmap-editorial/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should link to the author profile.");
}
if (!/\/contact/.test(llmsText) || !/Contact and correction paths/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should link to the contact and correction paths page.");
}
if (!/\/legal/.test(llmsText) || !/Legal, privacy, advertising, disclaimer, and attribution/.test(llmsText)) {
  failures.push("app/llms.txt/route.js: llms.txt should link to the legal, advertising, privacy, disclaimer, and attribution page.");
}

const manifestText = fs.readFileSync(path.join(root, "app/content-manifest/page.jsx"), "utf8");
if (!/Content Manifest/.test(manifestText) || !/ItemList/.test(manifestText) || !/\/llms\.txt/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should expose key pages, ItemList JSON-LD, and llms.txt.");
}
if (!/publisher/.test(manifestText) || !/reviewedBy/.test(manifestText) || !/dateModified:\s*DEFAULT_LASTMOD/.test(manifestText) || !/publishingPrinciples/.test(manifestText) || !/isAccessibleForFree/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest CollectionPage schema should expose publisher, review, modified-date, editorial-policy, and free-access context.");
}
if (!/getPlannedPosts/.test(manifestText) || !/pendingScheduledPosts/.test(manifestText) || !/Content operations summary/.test(manifestText) || !/publication time/.test(manifestText) || !/pending scheduled articles not yet exposed to crawlers/.test(manifestText) || !/quality score/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should summarize publishing cadence and quality controls.");
}
if (!/<dl className="manifest-stats" aria-label="Content publication statistics">/.test(manifestText) || !/<dt>\{posts\.length\}<\/dt>/.test(manifestText) || !/<dd>published articles available to crawlers now<\/dd>/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content operation stats should render as a labeled description list.");
}
if (/posts\.slice\(0,\s*50\)/.test(manifestText) || !/every article currently published and available to crawlers/.test(manifestText) || !/\.\.\.posts\.map/.test(manifestText) || !/\{posts\.map/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should list every published article in visible HTML and ItemList schema.");
}
if (!/<dl className="manifest-article-meta" aria-label=\{`\$\{post\.title\} manifest metadata`\}>/.test(manifestText) || !/<dt>Category<\/dt>/.test(manifestText) || !/<dd>\{post\.category\}<\/dd>/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: published article metadata should render as a labeled description list.");
}
if (!/@\/lib\/dates/.test(manifestText) || !/formatScheduledDate/.test(manifestText) || !/toDateTime/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: scheduled article dates should use shared display and dateTime helpers.");
}
if (!/<dl className="manifest-note" aria-label="Content schedule status">/.test(manifestText) || !/<dt>Latest published<\/dt>/.test(manifestText) || !/<dt>Next scheduled<\/dt>/.test(manifestText) || !/<time dateTime=\{toDateTime\(nextScheduled\.publishAt\)\}>/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content schedule status should render as a labeled description list with semantic time metadata.");
}
if (!/\/feed\.json/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should link to the JSON Feed.");
}
if (!/\/ads\.txt/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should link to ads.txt.");
}
if (!/\/manifest\.webmanifest/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should link to the web app manifest.");
}
if (!/\/authors\/solarpaybackmap-editorial/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should link to the author profile.");
}
if (!/\/contact/.test(manifestText) || !/Contact and correction paths/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should link to the contact and correction paths page.");
}
if (!/\/legal/.test(manifestText) || !/Legal, privacy, advertising, disclaimer, and attribution/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should link to the legal, advertising, privacy, disclaimer, and attribution page.");
}
if (!/<ul className="manifest-grid" aria-label="Core Solar Payback Map resources">/.test(manifestText) || !/<ul className="manifest-grid" aria-label="Solar payback topic hubs">/.test(manifestText) || !/<li key=\{page\.href\}>/.test(manifestText) || !/<li key=\{category\}>/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: core resources and topic hubs should render as labeled semantic lists.");
}
if (!/<dl className="manifest-topic-meta" aria-label=\{`\$\{category\} topic publication status`\}>/.test(manifestText) || !/<dt>\{getPublishedPostsByCategory\(category\)\.length\}<\/dt>/.test(manifestText) || !/<dd>published articles<\/dd>/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: topic hub counts should render as labeled description-list metadata.");
}
if (!/Feed metadata also exposes author, editorial-policy, contact, and legal paths/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should explain feed-level trust metadata.");
}
if (!/<nav aria-label="Content manifest next steps">/.test(manifestText) || !/<ul className="trust-link-list">/.test(manifestText) || !/href="\/calculator"/.test(manifestText) || !/href="\/methodology"/.test(manifestText) || !/href="\/blog"/.test(manifestText) || !/href="\/contact"/.test(manifestText)) {
  failures.push("app/content-manifest/page.jsx: content manifest should expose labeled next-step links to calculator, methodology, journal, and contact pages.");
}

const feedText = fs.readFileSync(path.join(root, "app/feed.xml/route.js"), "utf8");
if (!/X-Robots-Tag/.test(feedText)) {
  failures.push("app/feed.xml/route.js: RSS feed should set X-Robots-Tag at the route level.");
}
if (!/dc:creator/.test(feedText) || !/<category>/.test(feedText) || /new Date\("2026-06-07"\)\.toUTCString\(\)/.test(feedText)) {
  failures.push("app/feed.xml/route.js: RSS category, creator, or dynamic lastBuildDate support is missing.");
}
if (!/post\.publishAt \|\| post\.date/.test(feedText)) {
  failures.push("app/feed.xml/route.js: RSS pubDate should use publishAt when available.");
}
if (!/xmlns:atom=/.test(feedText) || !/rel="self"/.test(feedText)) {
  failures.push("app/feed.xml/route.js: RSS feed should include an Atom self link.");
}
if (!/rel="author"/.test(feedText) || !/rel="help"/.test(feedText) || !/rel="license"/.test(feedText) || !/\/legal/.test(feedText)) {
  failures.push("app/feed.xml/route.js: RSS channel should expose author, editorial policy, and legal links.");
}
if (!/getKeyTakeaways/.test(feedText) || !/Key takeaways:/.test(feedText) || !/Quality score:/.test(feedText) || !/Source count:/.test(feedText) || !/Internal link count:/.test(feedText) || !/Canonical:/.test(feedText)) {
  failures.push("app/feed.xml/route.js: RSS descriptions should include key takeaways, quality score, source count, internal link count, and canonical context.");
}
if (!/function escapeCdata/.test(feedText) || !/function escapeXmlText/.test(feedText) || !/function escapeXmlAttr/.test(feedText) || !/escapeXmlAttr\(source\.href\)/.test(feedText) || !/escapeCdata\(description\)/.test(feedText)) {
  failures.push("app/feed.xml/route.js: RSS XML output should escape CDATA, text nodes, and attribute values.");
}
if (!/<language>en-US<\/language>/.test(feedText) || !/dc:publisher/.test(feedText) || !/Editorial policy:/.test(feedText) || !/Author profile:/.test(feedText) || !/Contact and corrections:/.test(feedText) || !/Legal and advertising disclosure:/.test(feedText)) {
  failures.push("app/feed.xml/route.js: RSS should expose language, publisher, author profile, editorial policy, contact, and legal context.");
}
if (!/<ttl>60<\/ttl>/.test(feedText) || !/<image>/.test(feedText) || !/`\$\{siteUrl\}\/icon\.svg`/.test(feedText) || !/<title>\$\{SITE_NAME\} Journal<\/title>/.test(feedText) || !/`\$\{siteUrl\}\/blog`/.test(feedText)) {
  failures.push("app/feed.xml/route.js: RSS channel should expose refresh TTL and brand image metadata.");
}
if (!/@\/lib\/article-quality/.test(feedText)) {
  failures.push("app/feed.xml/route.js: RSS key takeaways should come from the shared article-quality helper.");
}

const jsonFeedText = fs.readFileSync(path.join(root, "app/feed.json/route.js"), "utf8");
if (!/jsonfeed\.org\/version\/1\.1/.test(jsonFeedText) || !/JSON\.stringify\(feed\)/.test(jsonFeedText) || !/getPublishedPosts/.test(jsonFeedText)) {
  failures.push("app/feed.json/route.js: JSON Feed should use JSON Feed 1.1 and published posts.");
}
if (!/application\/feed\+json/.test(jsonFeedText) || !/X-Robots-Tag/.test(jsonFeedText)) {
  failures.push("app/feed.json/route.js: JSON Feed should return application/feed+json with route-level X-Robots-Tag.");
}
if (!/post\.publishAt \|\| post\.date/.test(jsonFeedText) || !/date_modified/.test(jsonFeedText) || !/_published_count:\s*posts\.length/.test(jsonFeedText) || !/_latest_article_update:\s*new Date\(latestUpdated\)\.toISOString\(\)/.test(jsonFeedText)) {
  failures.push("app/feed.json/route.js: JSON Feed should preserve scheduled publish dates, modified dates, published count, and feed-level latest article update.");
}
if (!/content_text/.test(jsonFeedText) || !/external_url/.test(jsonFeedText) || !/_quality_score/.test(jsonFeedText)) {
  failures.push("app/feed.json/route.js: JSON Feed should expose article text, source, and quality metadata.");
}
if (!/getKeyTakeaways/.test(jsonFeedText) || !/_key_takeaways/.test(jsonFeedText) || !/_source_count/.test(jsonFeedText) || !/_external_sources/.test(jsonFeedText) || !/_internal_link_count/.test(jsonFeedText) || !/_internal_links/.test(jsonFeedText) || !/_editorial_review/.test(jsonFeedText)) {
  failures.push("app/feed.json/route.js: JSON Feed should expose key takeaways, source/link lists, and editorial quality metadata.");
}
if (!/_publishing_principles/.test(jsonFeedText) || !/_author_profile_url/.test(jsonFeedText) || !/_contact_url/.test(jsonFeedText) || !/_license_url/.test(jsonFeedText) || !/_legal_disclosure/.test(jsonFeedText) || !/_category/.test(jsonFeedText) || !/_main_keyword/.test(jsonFeedText) || !/const mainKeyword = post\.mainKeyword \|\| post\.keywords\?\.\[0\] \|\| post\.title/.test(jsonFeedText)) {
  failures.push("app/feed.json/route.js: JSON Feed should expose editorial policy, author profile, contact, legal, category, and main keyword metadata.");
}
if (!/author:\s*\{\s*name:\s*"Solar Payback Map Editorial"/.test(jsonFeedText)) {
  failures.push("app/feed.json/route.js: JSON Feed should expose the legacy author object for feed-reader compatibility.");
}
if (!/@\/lib\/article-quality/.test(jsonFeedText)) {
  failures.push("app/feed.json/route.js: JSON Feed key takeaways should come from the shared article-quality helper.");
}
if (!/\/authors\/solarpaybackmap-editorial/.test(jsonFeedText)) {
  failures.push("app/feed.json/route.js: JSON Feed authors should link to the author profile.");
}

const adsTxtText = fs.readFileSync(path.join(root, "app/ads.txt/route.js"), "utf8");
const adsenseHelperText = fs.readFileSync(path.join(root, "lib/adsense.js"), "utf8");
if (!/ADSENSE_CLIENT/.test(adsTxtText) || !/NEXT_PUBLIC_ADSENSE_CLIENT/.test(adsTxtText) || !/google\.com/.test(adsTxtText) || !/f08c47fec0942fa0/.test(adsTxtText)) {
  failures.push("app/ads.txt/route.js: ads.txt should derive the Google publisher line from NEXT_PUBLIC_ADSENSE_CLIENT.");
}
if (!/getAdsensePublisherId/.test(adsTxtText) || !/replace\(\s*\/\^ca-/.test(adsenseHelperText)) {
  failures.push("app/ads.txt/route.js and lib/adsense.js: ads.txt should convert ca-pub IDs to pub IDs through the shared helper.");
}
if (!/ADSENSE_PUBLISHER_PATTERN/.test(adsenseHelperText) || !/\\d\{10,\}/.test(adsenseHelperText) || !/\^0\+\$/.test(adsenseHelperText) || !/startsWith\("ca-"\)/.test(adsenseHelperText)) {
  failures.push("lib/adsense.js: AdSense helpers should reject placeholders, all-zero IDs, and normalize pub IDs for Auto Ads.");
}
if (!/text\/plain/.test(adsTxtText) || !/Cache-Control/.test(adsTxtText) || !/X-Robots-Tag/.test(adsTxtText)) {
  failures.push("app/ads.txt/route.js: ads.txt should return text/plain with cache and robots headers.");
}

const sitemapText = fs.readFileSync(path.join(root, "app/sitemap.js"), "utf8");
if (/lastModified:\s*new Date\(\)/.test(sitemapText)) {
  failures.push("app/sitemap.js: sitemap lastModified should not use request time for category hubs.");
}
if (!/contentSensitiveRoutes/.test(sitemapText) || !/getLatestContentModified/.test(sitemapText) || !/getStaticRouteLastModified/.test(sitemapText)) {
  failures.push("app/sitemap.js: dynamic listing routes should use latest published content lastModified values.");
}
if (!/withSitemapAlternates/.test(sitemapText) || !/alternates:\s*\{[\s\S]*languages:\s*\{[\s\S]*"en-US":\s*entry\.url[\s\S]*"x-default":\s*entry\.url/.test(sitemapText)) {
  failures.push("app/sitemap.js: sitemap entries should expose en-US and x-default alternates.");
}
for (const route of ["/", "/blog", "/blog/category", "/content-manifest"]) {
  if (!sitemapText.includes(route)) {
    failures.push(`app/sitemap.js: ${route} should be treated as content-sensitive for sitemap lastModified.`);
  }
}
for (const utilityRoute of ["/feed.xml", "/feed.json", "/llms.txt"]) {
  if (sitemapText.includes(utilityRoute)) {
    failures.push(`app/sitemap.js: ${utilityRoute} should be discovered via head, robots-adjacent links, or llms.txt rather than listed as a sitemap URL.`);
  }
}

const requiredRoutes = [
  "app/sitemap.js",
  "app/robots.js",
  "app/ads.txt/route.js",
  "app/opengraph-image.jsx",
  "app/manifest.js",
  "app/icon.svg",
  "app/authors/solarpaybackmap-editorial/page.jsx",
  "app/editorial-policy/page.jsx",
  "app/content-manifest/page.jsx",
  "app/llms.txt/route.js",
  "app/feed.xml/route.js",
  "app/feed.json/route.js",
  "app/blog/[slug]/page.jsx",
  "app/blog/category/page.jsx",
  "app/blog/category/[category]/page.jsx",
  "app/blog/opengraph-image.jsx",
  "app/blog/category/opengraph-image.jsx",
  "app/blog/[slug]/opengraph-image.jsx",
  "app/blog/category/[category]/opengraph-image.jsx",
];

const robotsText = fs.readFileSync(path.join(root, "app/robots.js"), "utf8");
if (!/host:\s*siteUrl/.test(robotsText)) {
  failures.push("app/robots.js: robots.txt should expose the canonical host.");
}

for (const route of requiredRoutes) {
  if (!fs.existsSync(path.join(root, route))) {
    failures.push(`${route}: required crawl/indexing route is missing.`);
  }
}

const defaultOgText = fs.readFileSync(path.join(root, "app/opengraph-image.jsx"), "utf8");
if (!/ImageResponse/.test(defaultOgText) || !/contentType\s*=\s*"image\/png"/.test(defaultOgText) || !/dynamic\s*=\s*"force-dynamic"/.test(defaultOgText) || !/Conservative solar payback estimates/.test(defaultOgText) || !/getPublishedPosts/.test(defaultOgText) || !/getLatestUpdated/.test(defaultOgText) || !/Updated \{latestUpdated/.test(defaultOgText)) {
  failures.push("app/opengraph-image.jsx: sitewide default Open Graph image should return a branded dynamic PNG ImageResponse with live freshness context.");
}

const articleQualityText = fs.readFileSync(path.join(root, "lib/article-quality.js"), "utf8");
if (!/export function getKeyTakeaways/.test(articleQualityText) || !/directAnswer/.test(articleQualityText) || !/section\.bullets/.test(articleQualityText) || !/unique/.test(articleQualityText)) {
  failures.push("lib/article-quality.js: shared key takeaway helper should use direct answers, bullets, callouts, and duplicate filtering.");
}

const datesText = fs.readFileSync(path.join(root, "lib/dates.js"), "utf8");
if (!/export function formatDisplayDate/.test(datesText) || !/export function toDateTime/.test(datesText) || !/export function getLatestUpdated/.test(datesText) || !/timeZone:\s*"UTC"/.test(datesText)) {
  failures.push("lib/dates.js: shared date helper should expose display formatting, ISO dateTime, latest updated, and UTC defaults.");
}

const footerText = fs.readFileSync(path.join(root, "components/Footer.jsx"), "utf8");
if (!/aria-label="Footer navigation"/.test(footerText) || !/<nav/.test(footerText) || !/<ul>/.test(footerText) || !/<li><Link/.test(footerText)) {
  failures.push("components/Footer.jsx: footer links should be exposed as a labeled semantic navigation list.");
}
if (!/\/editorial-policy/.test(footerText)) {
  failures.push("components/Footer.jsx: footer should link to the editorial policy.");
}
if (!/\/contact/.test(footerText)) {
  failures.push("components/Footer.jsx: footer should link to the contact page.");
}
if (!/\/content-manifest/.test(footerText)) {
  failures.push("components/Footer.jsx: footer should link to the content manifest.");
}
if (!/\/authors\/solarpaybackmap-editorial/.test(footerText)) {
  failures.push("components/Footer.jsx: footer should link to the author profile.");
}
if (!/\/feed\.xml/.test(footerText) || !/\/feed\.json/.test(footerText)) {
  failures.push("components/Footer.jsx: footer should link to RSS and JSON feeds.");
}
if (!/\/legal#privacy/.test(footerText) || !/\/legal#advertising/.test(footerText) || !/\/legal#disclaimer/.test(footerText) || !/\/legal#attribution/.test(footerText)) {
  failures.push("components/Footer.jsx: footer should link to legal privacy, advertising, disclaimer, and attribution anchors.");
}
if (!/<dl className="footer-trust" aria-label="Solar Payback Map trust summary">/.test(footerText) || !/<dt>Publisher<\/dt>/.test(footerText) || !/<dt>Data sources<\/dt>/.test(footerText) || !/<time dateTime="2026-05">May 2026<\/time>/.test(footerText)) {
  failures.push("components/Footer.jsx: footer trust summary should render as a labeled description list with semantic review time.");
}

const siteText = fs.readFileSync(path.join(root, "lib/site.js"), "utf8");
if (!/\/authors\/solarpaybackmap-editorial/.test(siteText)) {
  failures.push("lib/site.js: author profile should be included in sitemap staticRouteMeta.");
}
if (!/\/contact/.test(siteText)) {
  failures.push("lib/site.js: contact page should be included in sitemap staticRouteMeta.");
}
if (!/\/editorial-policy/.test(siteText)) {
  failures.push("lib/site.js: editorial policy should be included in sitemap staticRouteMeta.");
}
if (!/\/content-manifest/.test(siteText)) {
  failures.push("lib/site.js: content manifest should be included in sitemap staticRouteMeta.");
}
if (!/imageUrl/.test(siteText) || !/openGraph:[\s\S]*locale:\s*"en_US"[\s\S]*images/.test(siteText) || !/twitter:[\s\S]*images/.test(siteText)) {
  failures.push("lib/site.js: createMetadata should support Open Graph locale/image and Twitter image metadata.");
}
if (!/keywords\s*=\s*\[\]/.test(siteText) || !/\.\.\(keywords\.length\s*\?\s*\{\s*keywords\s*\}/.test(siteText)) {
  failures.push("lib/site.js: createMetadata should support page-level metadata keywords.");
}
if (!/languages:\s*\{[\s\S]*"en-US":\s*canonical[\s\S]*"x-default":\s*canonical/.test(siteText)) {
  failures.push("lib/site.js: createMetadata should expose en-US and x-default hreflang alternates for crawlable pages.");
}
if (!/imagePath\s*=\s*image\s*\|\|\s*"\/opengraph-image"/.test(siteText)) {
  failures.push("lib/site.js: createMetadata should provide a sitewide default Open Graph image.");
}
if (!/\/blog\/category/.test(siteText)) {
  failures.push("lib/site.js: category index should be included in sitemap staticRouteMeta.");
}
for (const utilityRoute of ["/ads.txt", "/manifest.webmanifest", "/feed.xml", "/feed.json", "/llms.txt"]) {
  if (siteText.includes(utilityRoute)) {
    failures.push(`lib/site.js: ${utilityRoute} should not be listed in sitemap staticRouteMeta.`);
  }
}

for (const page of [
  "app/page.jsx",
  "app/about/page.jsx",
  "app/methodology/page.jsx",
  "app/rankings/page.jsx",
  "app/contact/page.jsx",
  "app/calculator/page.jsx",
  "app/blog/page.jsx",
  "app/content-manifest/page.jsx",
  "app/authors/solarpaybackmap-editorial/page.jsx",
  "app/editorial-policy/page.jsx",
  "app/legal/page.jsx",
  "app/solar/california/page.jsx",
  "app/solar/california/san-diego-county/page.jsx",
  "app/blog/category/page.jsx",
]) {
  const text = fs.readFileSync(path.join(root, page), "utf8");
  if (!/keywords:\s*\[[\s\S]+?\]/.test(text)) {
    failures.push(`${page}: crawlable hub or trust page should declare focused metadata keywords.`);
  }
}

const cssText = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
const tokenCssText = fs.readFileSync(path.join(root, "styles/tokens.css"), "utf8");
if (!/\.category-index/.test(cssText) || !/\.category-card/.test(cssText)) {
  failures.push("app/globals.css: category index card layout styles are missing.");
}
if (!/content-visibility:\s*auto/.test(cssText) || !/contain-intrinsic-block-size:\s*720px/.test(cssText) || !/\.post-grid,\s*[\s\S]*\.category-index,\s*[\s\S]*\.manifest-grid,\s*[\s\S]*\.related-grid/.test(cssText)) {
  failures.push("app/globals.css: repeated card grids should use content-visibility with intrinsic block-size for offscreen rendering performance.");
}
if (!/\.breadcrumb-item/.test(cssText)) {
  failures.push("app/globals.css: reusable breadcrumb item layout styles are missing.");
}
if (!/\.site-footer \.footer-trust/.test(cssText) || !/\.site-footer \.footer-trust dt/.test(cssText) || !/\.site-footer \.footer-trust dd/.test(cssText)) {
  failures.push("app/globals.css: footer trust summary description-list styles are missing.");
}
if (!/\.breadcrumb \[aria-current="page"\]/.test(cssText)) {
  failures.push("app/globals.css: breadcrumb current page state should have visible styling.");
}
if (!/\.hub-stats/.test(cssText)) {
  failures.push("app/globals.css: category hub freshness stats styles are missing.");
}
if (!/\.category-card-meta/.test(cssText) || !/\.category-card-meta dt/.test(cssText)) {
  failures.push("app/globals.css: category index card metadata styles are missing.");
}
if (!/\.not-found-links/.test(cssText) || !/list-style:\s*none/.test(cssText) || !/\.not-found-links li/.test(cssText)) {
  failures.push("app/globals.css: 404 recovery link list layout styles are missing.");
}
if (!/\.manifest-grid/.test(cssText) || !/\.manifest-list/.test(cssText) || !/\.manifest-article-meta/.test(cssText) || !/\.manifest-topic-meta/.test(cssText) || !/\.manifest-card-meta/.test(cssText)) {
  failures.push("app/globals.css: content manifest layout styles are missing.");
}
if (!/\.correction-checklist/.test(cssText) || !/\.model-exclusion-list/.test(cssText) || !/\.review-process-list/.test(cssText) || !/\.editorial-review-list/.test(cssText) || !/\.correction-checklist li \+ li/.test(cssText) || !/\.model-exclusion-list li \+ li/.test(cssText) || !/\.review-process-list li \+ li/.test(cssText) || !/\.editorial-review-list li \+ li/.test(cssText)) {
  failures.push("app/globals.css: correction, methodology exclusion, review-process, and article editorial checklist spacing styles are missing.");
}
if (!/\.methodology-scope-summary/.test(cssText) || !/\.methodology-scope-summary dt/.test(cssText) || !/\.methodology-scope-summary dd/.test(cssText) || !/\.editorial-policy-summary/.test(cssText) || !/\.editorial-policy-summary dt/.test(cssText) || !/\.editorial-policy-summary dd/.test(cssText) || !/\.legal-policy-summary/.test(cssText) || !/\.legal-policy-summary dt/.test(cssText) || !/\.legal-policy-summary dd/.test(cssText) || !/\.contact-policy-summary/.test(cssText) || !/\.contact-policy-summary dt/.test(cssText) || !/\.contact-policy-summary dd/.test(cssText) || !/\.about-policy-summary/.test(cssText) || !/\.about-policy-summary dt/.test(cssText) || !/\.about-policy-summary dd/.test(cssText) || !/\.author-policy-summary/.test(cssText) || !/\.author-policy-summary dt/.test(cssText) || !/\.author-policy-summary dd/.test(cssText) || !/\.calculator-page-summary/.test(cssText) || !/\.calculator-page-summary dt/.test(cssText) || !/\.calculator-page-summary dd/.test(cssText) || !/\.rankings-page-summary/.test(cssText) || !/\.rankings-page-summary dt/.test(cssText) || !/\.rankings-page-summary dd/.test(cssText) || !/\.topic-index-scope/.test(cssText) || !/\.topic-index-scope dt/.test(cssText) || !/\.topic-index-scope dd/.test(cssText) || !/\.category-hub-scope/.test(cssText) || !/\.category-hub-scope dt/.test(cssText) || !/\.category-hub-scope dd/.test(cssText) || !/\.california-solar-scope/.test(cssText) || !/\.california-solar-scope dt/.test(cssText) || !/\.california-solar-scope dd/.test(cssText)) {
  failures.push("app/globals.css: trust page summary styles are missing.");
}
if (!/\.contact-path-meta/.test(cssText) || !/\.contact-path-meta dt/.test(cssText) || !/\.legal-section-list/.test(cssText) || !/\.legal-section-meta/.test(cssText)) {
  failures.push("app/globals.css: contact and legal section metadata styles are missing.");
}
if (!/\.not-found-link-meta/.test(cssText) || !/\.not-found-link-meta dt/.test(cssText)) {
  failures.push("app/globals.css: 404 recovery link metadata styles are missing.");
}
if (!/\.manifest-stats/.test(cssText) || !/\.manifest-note/.test(cssText)) {
  failures.push("app/globals.css: content manifest operations summary styles are missing.");
}
if (!/\.author-page/.test(cssText) || !/\.author-links/.test(cssText) || !/\.reviewed-article-meta/.test(cssText)) {
  failures.push("app/globals.css: author profile layout styles are missing.");
}
if (!/\.skip-link/.test(cssText) || !/\.skip-link:focus/.test(cssText)) {
  failures.push("app/globals.css: skip link focus styles are missing.");
}
if (!/:where\(a, button, input, select, textarea, \[tabindex\]\):focus-visible/.test(cssText) || !/outline-offset: 3px/.test(cssText)) {
  failures.push("app/globals.css: global keyboard focus-visible styles are missing.");
}
if (!/\.category-card:focus-visible/.test(cssText) || !/\.post-card:focus-visible/.test(cssText) || !/\.related-card:focus-visible/.test(cssText)) {
  failures.push("app/globals.css: card links need visible keyboard focus states.");
}
if (!/\.mobile-menu a:focus-visible/.test(cssText) || !/\.chip:focus-visible/.test(cssText)) {
  failures.push("app/globals.css: mobile navigation and filter chips need visible keyboard focus states.");
}
if (!/table\.rank th button:focus-visible/.test(tokenCssText)) {
  failures.push("styles/tokens.css: sortable table header buttons need visible keyboard focus states.");
}
if (!/\.section-sub-spaced/.test(tokenCssText) || !/\.section-title-spaced/.test(tokenCssText) || !/\.section-action/.test(tokenCssText) || !/\.source-freshness/.test(tokenCssText) || !/\.rank-table-card/.test(tokenCssText)) {
  failures.push("styles/tokens.css: shared spacing and rank table overflow utility classes are missing.");
}
if (!/\.mobile-menu:not\(\[hidden\]\)/.test(cssText)) {
  failures.push("app/globals.css: mobile menu styles should respect the hidden attribute.");
}
if (!/\.rank caption/.test(cssText) || !/\.calc-fieldset/.test(cssText) || !/\.calc-assumptions/.test(cssText) || !/\.post-count-summary/.test(cssText) || !/\.topic-index-summary/.test(cssText)) {
  failures.push("app/globals.css: accessible table captions and calculator fieldset styles are missing.");
}
if (!/@media \(max-width: 900px\)[\s\S]*\.topic-index-summary[\s\S]*grid-template-columns:\s*repeat\(2, 1fr\)/.test(cssText) || !/@media \(max-width: 640px\)[\s\S]*\.topic-index-summary[\s\S]*grid-template-columns:\s*1fr/.test(cssText)) {
  failures.push("app/globals.css: topic index summary should collapse from desktop columns to tablet and mobile layouts.");
}
if (!/@media \(max-width: 900px\)[\s\S]*\.calc-assumptions[\s\S]*grid-template-columns:\s*repeat\(2, 1fr\)/.test(cssText) || !/@media \(max-width: 640px\)[\s\S]*\.calc-assumptions[\s\S]*grid-template-columns:\s*1fr/.test(cssText)) {
  failures.push("app/globals.css: calculator assumption summary should collapse from desktop columns to tablet and mobile layouts.");
}
if (!/\.mini-rank th,\s*[\s\S]*\.mini-rank td/.test(cssText) || !/\.mini-rank tr:last-child th/.test(cssText)) {
  failures.push("app/globals.css: mini ranking table should style row headers consistently with cells.");
}
if (!/\.post-grid\s*\{[\s\S]*list-style:\s*none[\s\S]*padding:\s*0/.test(cssText) || !/\.post-grid > li/.test(cssText)) {
  failures.push("app/globals.css: semantic blog post lists should reset list chrome without breaking card layout.");
}
if (!/\.meta-row dt/.test(cssText) || !/\.meta-row dd/.test(cssText) || !/\.meta-row div/.test(cssText)) {
  failures.push("app/globals.css: blog card metadata description-list styles are missing.");
}
if (!/\.evidence-snapshot/.test(cssText) || !/\.evidence-links/.test(cssText) || !/\.source-list-section/.test(cssText) || !/\.source-list/.test(cssText)) {
  failures.push("app/globals.css: evidence snapshot and source list layout styles are missing.");
}
if (!/\.prose caption/.test(cssText) || !/caption-side:\s*top/.test(cssText)) {
  failures.push("app/globals.css: prose table captions should have readable visual styling.");
}
if (!/\.key-takeaways/.test(cssText)) {
  failures.push("app/globals.css: article key takeaways styles are missing.");
}
if (!/\.related-reading/.test(cssText) || !/\.related-grid/.test(cssText) || !/\.related-card/.test(cssText) || !/\.related-card-meta/.test(cssText)) {
  failures.push("app/globals.css: related reading card layout and metadata styles are missing.");
}
if (!/\.next-step-panel/.test(cssText) || !/\.next-actions/.test(cssText)) {
  failures.push("app/globals.css: contextual article next-step styles are missing.");
}

const postsModule = fs.readFileSync(path.join(root, "lib/posts.js"), "utf8");
const { posts, getPlannedPosts } = await import(pathToFileURL(path.join(root, "lib/posts.js")).href);
const plannedPosts = getPlannedPosts();
const plannedSlugs = new Set(plannedPosts.map((post) => post.slug));
const plannedBySlug = new Map(plannedPosts.map((post) => [post.slug, post]));

for (const slug of [...postsModule.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1])) {
  if (!new RegExp(`href: "/blog/${slug}"|slug: "${slug}"`).test(postsModule)) {
    failures.push(`lib/posts.js: ${slug} is missing expected internal references.`);
  }
}

for (const post of posts) {
  if (!post.title || !post.title.toLowerCase().includes("solar")) {
    failures.push(`lib/posts.js: ${post.slug} title should include the target solar keyword.`);
  }
  if (!post.subtitle || post.subtitle.length < 80) {
    failures.push(`lib/posts.js: ${post.slug} needs a substantial meta description/subtitle.`);
  }
  if (!post.cta?.href || !post.cta?.label) {
    failures.push(`lib/posts.js: ${post.slug} is missing a CTA.`);
  }
  if (!Array.isArray(post.internalLinks) || post.internalLinks.length < 2) {
    failures.push(`lib/posts.js: ${post.slug} needs at least two internal links.`);
  }
  if (post.status === "ready") {
    const relatedPlannedLinks = post.internalLinks.filter((link) => {
      const slug = link.href?.replace(/^\/blog\//, "");
      return link.href?.startsWith("/blog/") && slug !== post.slug && plannedSlugs.has(slug);
    });
    const plannedIndex = plannedPosts.findIndex((plannedPost) => plannedPost.slug === post.slug);
    if (plannedIndex > 0 && relatedPlannedLinks.length < 1) {
      failures.push(`lib/posts.js: ${post.slug} needs at least one related internal link to another planned article.`);
    }
    for (const link of relatedPlannedLinks) {
      const slug = link.href.replace(/^\/blog\//, "");
      const target = plannedBySlug.get(slug);
      if (target && new Date(target.publishAt).getTime() > new Date(post.publishAt).getTime()) {
        failures.push(`lib/posts.js: ${post.slug} links to future unpublished planned article ${slug}.`);
      }
    }
  }
  if (!Array.isArray(post.externalSources) || post.externalSources.length < 1) {
    failures.push(`lib/posts.js: ${post.slug} needs at least one external source.`);
  }
  if (post.status === "ready" && post.externalSources.length < 2) {
    failures.push(`lib/posts.js: ${post.slug} needs at least two external sources for trust depth.`);
  }
  if (post.status === "ready" && (!Array.isArray(post.sections) || post.sections.length < 3)) {
    failures.push(`lib/posts.js: ${post.slug} needs at least three article sections.`);
  }
  if (post.status === "ready" && post.sections.length < 4) {
    failures.push(`lib/posts.js: ${post.slug} needs at least four article sections for publish-ready depth.`);
  }
  if (post.status === "ready" && (!Array.isArray(post.directAnswer) || post.directAnswer.length < 2)) {
    failures.push(`lib/posts.js: ${post.slug} needs a directAnswer block for AEO/GEO extraction.`);
  }
  const articleWordCount = (post.sections || [])
    .flatMap((section) => section.body || [])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  if (post.status === "ready" && articleWordCount < 500) {
    failures.push(`lib/posts.js: ${post.slug} needs at least 500 body words, found ${articleWordCount}.`);
  }
  if (post.status === "ready" && post.qualityScore < 90) {
    failures.push(`lib/posts.js: ${post.slug} needs a qualityScore of at least 90.`);
  }
  if (post.status === "ready" && post.codexOnly !== true) {
    failures.push(`lib/posts.js: ${post.slug} must confirm Codex-only content generation.`);
  }
  if (post.status === "ready" && (!post.metaTitle || !post.metaTitle.toLowerCase().includes(post.mainKeyword.toLowerCase()))) {
    failures.push(`lib/posts.js: ${post.slug} needs a metaTitle containing the main keyword.`);
  }
  if (post.status === "ready" && !containsMeaningfulKeyword(post.title, post.mainKeyword)) {
    failures.push(`lib/posts.js: ${post.slug} title needs the main keyword or a meaningful main-keyword term.`);
  }
  if (post.status === "ready" && !post.expandedKeywords.some((keyword) => containsMeaningfulKeyword(post.title, keyword))) {
    failures.push(`lib/posts.js: ${post.slug} title needs at least one expanded keyword term.`);
  }
  if (post.status === "ready" && !containsMeaningfulKeyword(post.subtitle, post.mainKeyword)) {
    failures.push(`lib/posts.js: ${post.slug} subtitle needs the main keyword.`);
  }
  if (post.status === "ready" && !post.expandedKeywords.every((keyword) => containsMeaningfulKeyword(post.subtitle, keyword))) {
    failures.push(`lib/posts.js: ${post.slug} subtitle needs all expanded keyword groups.`);
  }
  if (post.status === "ready" && (!post.metaDescription || post.expandedKeywords.some((keyword) => !post.metaDescription.toLowerCase().includes(keyword.toLowerCase().split(" ")[0])))) {
    failures.push(`lib/posts.js: ${post.slug} needs a metaDescription that reflects expanded keywords.`);
  }
  if (post.status === "ready" && post.canonicalPath !== `/blog/${post.slug}`) {
    failures.push(`lib/posts.js: ${post.slug} needs a canonicalPath matching the blog URL.`);
  }
  if (post.status === "ready" && (!post.featuredImageAlt || !post.featuredImageAlt.toLowerCase().includes(post.mainKeyword.toLowerCase()))) {
    failures.push(`lib/posts.js: ${post.slug} needs featured image alt text with the main keyword.`);
  }
  if (post.status === "ready" && (!post.articleType || !post.accent?.primary || !post.accent?.secondary)) {
    failures.push(`lib/posts.js: ${post.slug} needs articleType and one or two readability colors.`);
  }
  if (post.status === "ready" && !post.sections.some((section) => section.bullets || section.table || section.callout)) {
    failures.push(`lib/posts.js: ${post.slug} needs a topic-fit rich element such as bullets, table, or callout.`);
  }
  if (post.status === "ready" && (!Array.isArray(post.researchSources) || post.researchSources.length < 1)) {
    failures.push(`lib/posts.js: ${post.slug} needs tracked researchSources.`);
  }
  if (post.status === "ready" && shouldHaveFaq(post)) {
    if (!Array.isArray(post.faq) || post.faq.length < 3) {
      failures.push(`lib/posts.js: ${post.slug} needs at least three FAQ items for question-led search intent.`);
    }
    for (const item of post.faq || []) {
      if (!item.question?.includes("?") || !item.answer || item.answer.length < 80) {
        failures.push(`lib/posts.js: ${post.slug} has a weak FAQ item.`);
      }
    }
  }
}

if (plannedPosts.length !== 100) {
  failures.push(`lib/planned-posts.js: expected 100 planned posts, found ${plannedPosts.length}.`);
}

const seenTitles = new Set();
const seenSlugs = new Set();
const seenMainKeywords = new Set();
for (const post of plannedPosts) {
  for (const [set, value, label] of [
    [seenTitles, post.title, "title"],
    [seenSlugs, post.slug, "slug"],
    [seenMainKeywords, post.mainKeyword, "main keyword"],
  ]) {
    if (set.has(value)) failures.push(`lib/planned-posts.js: duplicate ${label}: ${value}`);
    set.add(value);
  }
  if (!post.publishAt) failures.push(`lib/planned-posts.js: ${post.slug} is missing publishAt.`);
}

for (let index = 1; index < plannedPosts.length; index += 1) {
  const prev = new Date(plannedPosts[index - 1].publishAt).getTime();
  const curr = new Date(plannedPosts[index].publishAt).getTime();
  if (curr - prev !== 5 * 60 * 60 * 1000) {
    failures.push(`lib/planned-posts.js: publishAt interval is not 5 hours at index ${index}.`);
  }
}

const readyPlanned = plannedPosts.filter((post) => post.status === "ready");
if (readyPlanned.length !== 100) {
  failures.push(`lib/planned-posts.js: expected 100 ready full articles, found ${readyPlanned.length}.`);
}

for (const [index, post] of plannedPosts.entries()) {
  if (index >= CORE_ARTICLE_COUNT) continue;

  const articleWordCount = (post.sections || [])
    .flatMap((section) => section.body || [])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  if (articleWordCount < 900) {
    failures.push(`lib/planned-posts.js: core article ${post.slug} needs at least 900 body words, found ${articleWordCount}.`);
  }
  if (!Array.isArray(post.externalSources) || post.externalSources.length < 2) {
    failures.push(`lib/planned-posts.js: core article ${post.slug} needs at least two external sources.`);
  }
  if (!post.sections.some((section) => /scenario|quote audit|failure case|decision checkpoint/i.test(section.heading))) {
    failures.push(`lib/planned-posts.js: core article ${post.slug} needs a scenario, quote audit, or failure-case section.`);
  }
  if (!post.sections.some((section) => /evidence stack/i.test(section.heading))) {
    failures.push(`lib/planned-posts.js: core article ${post.slug} needs an evidence stack section.`);
  }
}

const articleTypes = new Set(plannedPosts.map((post) => post.articleType));
if (articleTypes.size < 8) {
  failures.push(`lib/planned-posts.js: expected at least 8 article types, found ${articleTypes.size}.`);
}

const accentPairs = new Set(plannedPosts.map((post) => `${post.accent?.primary}/${post.accent?.secondary}`));
if (accentPairs.size < 6) {
  failures.push(`lib/planned-posts.js: expected at least 6 readability color pairs, found ${accentPairs.size}.`);
}

const ctaLabels = new Set(plannedPosts.map((post) => post.cta?.label));
if (ctaLabels.size < 60) {
  failures.push(`lib/planned-posts.js: expected at least 60 distinct CTA labels, found ${ctaLabels.size}.`);
}

const plannedHeadings = new Map();
const plannedParagraphs = new Map();
for (const post of plannedPosts) {
  for (const section of post.sections || []) {
    const headingKey = section.heading?.toLowerCase().trim();
    if (headingKey) plannedHeadings.set(headingKey, [...(plannedHeadings.get(headingKey) || []), post.slug]);
    for (const paragraph of section.body || []) {
      const paragraphKey = paragraph.toLowerCase().replace(/\s+/g, " ").trim();
      if (paragraphKey) plannedParagraphs.set(paragraphKey, [...(plannedParagraphs.get(paragraphKey) || []), post.slug]);
    }
  }
}

for (const [heading, slugs] of plannedHeadings) {
  if (slugs.length > 1) {
    failures.push(`lib/planned-posts.js: repeated planned article heading "${heading}" in ${slugs.join(", ")}.`);
  }
}

for (const [paragraph, slugs] of plannedParagraphs) {
  if (slugs.length > 1 && paragraph.length > 80) {
    failures.push(`lib/planned-posts.js: repeated planned article paragraph in ${slugs.join(", ")}.`);
  }
}

if (failures.length) {
  console.error("SEO audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("SEO audit passed: crawl routes, slug handling, metadata guard, AdSense guard, and article requirements are in place.");
