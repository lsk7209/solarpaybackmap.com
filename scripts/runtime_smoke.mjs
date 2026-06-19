import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { getAdsenseClientId, getAdsensePublisherId } from "../lib/adsense.js";
import { getPublishedPosts } from "../lib/posts.js";

const host = "127.0.0.1";
const port = Number(process.env.SMOKE_PORT || 3210);
const origin = `http://${host}:${port}`;
const failures = [];

const nextCommand = process.execPath;
const server = spawn(
  nextCommand,
  ["node_modules/next/dist/bin/next", "start", "--hostname", host, "--port", String(port)],
  {
    cwd: process.cwd(),
    env: cleanEnv({ ...process.env, PORT: String(port) }),
    stdio: ["ignore", "pipe", "pipe"],
  }
);

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

try {
  await waitForServer(`${origin}/`, 15000);
  await runChecks();
} finally {
  await stopServer();
}

if (failures.length) {
  console.error("Runtime smoke failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  if (serverOutput.trim()) {
    console.error("\nServer output:");
    console.error(serverOutput.trim());
  }
  process.exit(1);
}

console.log("Runtime smoke passed: core routes, feeds, manifest, ads.txt, headers, and article trust UI are live.");

async function runChecks() {
  const publishedPosts = getPublishedPosts();
  const articleSlug = publishedPosts[0]?.slug;
  const faqArticleSlug = publishedPosts.find((post) => Array.isArray(post.faq) && post.faq.length)?.slug;
  const latestUpdated = publishedPosts
    .map((post) => post.updated)
    .sort()
    .at(-1);
  if (!articleSlug) failures.push("No published article is available for article route smoke checks.");
  if (getAdsenseClientId("ca-pub-0000000000000000") || getAdsensePublisherId("pub-0000000000000000")) {
    failures.push("AdSense helper should reject all-zero placeholder publisher IDs.");
  }
  if (getAdsenseClientId("pub-1234567890123456") !== "ca-pub-1234567890123456" || getAdsensePublisherId("ca-pub-1234567890123456") !== "pub-1234567890123456") {
    failures.push("AdSense helper should normalize valid ca-pub/pub publisher IDs consistently.");
  }

  const home = await get("/");
  expectStatus(home, 200, "/");
  expectHeader(home, "x-content-type-options", "nosniff", "/");
  expectHeader(home, "x-dns-prefetch-control", "on", "/");
  expectHeader(home, "referrer-policy", "strict-origin-when-cross-origin", "/");
  expectHeader(home, "cross-origin-opener-policy", "same-origin-allow-popups", "/");
  expectHeader(home, "origin-agent-cluster", "?1", "/");
  expectText(home, "Skip to content", "/ should include a keyboard skip link.");
  expectText(home, "id=\"main-content\"", "/ should expose the main content landmark.");
  expectText(home, "aria-controls=\"mobile-navigation\"", "/ should expose a controlled mobile navigation toggle.");
  expectText(home, "Open mobile navigation", "/ should expose a clear initial mobile menu button label.");
  expectText(home, "aria-expanded=\"false\"", "/ should expose the initial collapsed mobile menu state.");
  expectText(home, "id=\"mobile-navigation\"", "/ should render the mobile navigation landmark.");
  expectText(home, "id=\"primary-navigation\"", "/ should render the primary navigation fragment referenced by JSON-LD.");
  expectText(home, "<nav class=\"nav-links\" aria-label=\"Primary navigation\" id=\"primary-navigation\"><ul>", "/ primary navigation should render a semantic list.");
  expectText(home, "id=\"mobile-navigation\"><ul>", "/ mobile navigation should render a semantic list.");
  expectText(home, "Footer navigation", "/ should expose a labeled footer navigation landmark.");
  expectText(home, "<nav class=\"links\" aria-label=\"Footer navigation\"><ul>", "/ footer navigation should render a semantic list.");
  expectText(home, "<dl class=\"footer-trust\" aria-label=\"Solar Payback Map trust summary\">", "/ footer trust summary should render as a labeled description list.");
  expectText(home, "<time dateTime=\"2026-05\">May 2026</time>", "/ footer trust summary should expose semantic last-reviewed time.");
  expectText(home, "/contact", "/ should link to the contact page.");
  expectText(home, "/manifest.webmanifest", "/ should link to the web app manifest.");
  expectText(home, "/icon.svg", "/ should link to the site icon.");
  expectText(home, "/feed.xml", "/ should link to the RSS feed.");
  expectText(home, "/feed.json", "/ should link to the JSON Feed.");
  expectText(home, "hrefLang=\"en-US\"", "/ should expose en-US hreflang metadata.");
  expectText(home, "hrefLang=\"x-default\"", "/ should expose x-default hreflang metadata.");
  expectText(home, "application/feed+json", "/ should expose JSON Feed discovery.");
  expectText(home, "og:locale", "/ should include Open Graph locale metadata.");
  expectText(home, "en_US", "/ should expose U.S. English Open Graph locale.");
  expectText(home, "og:image", "/ should include sitewide Open Graph image metadata.");
  expectText(home, "/opengraph-image", "/ should use the sitewide default Open Graph image route.");
  expectText(home, "twitter:card", "/ should include Twitter card metadata.");
  expectText(home, "summary_large_image", "/ should use a large-image Twitter card.");
  expectText(home, "twitter:image", "/ should include Twitter image metadata.");
  expectText(home, "name=\"keywords\"", "/ should render page-level metadata keywords.");
  expectText(home, "solar payback estimates", "/ keyword metadata should include the page search intent.");
  expectText(home, "Top Solar Payback Map state scores with policy context and payback range", "/ home score preview should expose a semantic table caption.");
  expectText(home, "scope=\"row\"", "/ home score preview should expose state row headers.");
  expectText(home, "Run a payback scenario", "/ hero should link directly to the calculator.");
  expectText(home, "<ul class=\"source-grid\" aria-label=\"Public solar data sources\">", "/ public source cards should render as a labeled list.");
  expectText(home, "googletagmanager.com/gtag/js?id=G-85ET570CDB", "/ should load the configured GA4 tag.");
  expectText(home, "gtag('config','G-85ET570CDB'", "/ should inline the configured GA4 config.");
  expectText(home, "name=\"google-site-verification\" content=\"xrbht1_9aGwU5JL82OPgqGKclRploKGySADJJWoL5Bc\"", "/ should expose Google Search Console verification.");
  expectText(home, "name=\"naver-site-verification\" content=\"fd8c0ea6456d84d5c96284a89003345471a0e4c0\"", "/ should expose Naver site verification.");
  expectText(home, "https://www.clarity.ms/tag/", "/ should load Microsoft Clarity.");
  expectText(home, "x97livixnl", "/ should use the configured Microsoft Clarity project id.");
  const expectedAdsenseClient = getAdsenseClientId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
  if (!expectedAdsenseClient) {
    expectNotText(home, "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", "/ should not load AdSense when NEXT_PUBLIC_ADSENSE_CLIENT is unset.");
    expectNotText(home, "client=ca-pub-XXXXXXXXXXXXXXXX", "/ should not load placeholder AdSense clients.");
  } else {
    expectText(home, `client=${expectedAdsenseClient}`, "/ should load Auto Ads only with the normalized AdSense client ID.");
  }
  expectText(home, "\"@type\":\"WebSite\"", "/ should include WebSite JSON-LD.");
  expectText(home, "contactPoint", "/ should include Organization contactPoint JSON-LD.");
  expectText(home, "editorial corrections and policy questions", "/ Organization contactPoint should describe correction routing.");
  expectText(home, "About Solar Payback Map", "/ WebSite JSON-LD should include about page in hasPart.");
  expectText(home, "Solar Worth-It rankings", "/ WebSite JSON-LD should include rankings in hasPart.");
  expectText(home, "Solar Payback Map editorial policy", "/ WebSite JSON-LD should include editorial policy in hasPart.");
  expectText(home, "Solar Payback Map Editorial author profile", "/ WebSite JSON-LD should include author profile in hasPart.");
  expectText(home, "Solar Payback Map contact and corrections", "/ WebSite JSON-LD should include contact in hasPart.");
  expectText(home, "Solar Payback Map legal, privacy, advertising, disclaimer, and attribution", "/ WebSite JSON-LD should include legal page in hasPart.");
  expectText(home, "Solar Payback Map content manifest", "/ WebSite JSON-LD should include content manifest in hasPart.");
  expectText(home, "SiteNavigationElement", "/ should include primary navigation JSON-LD.");
  expectText(home, "Solar Payback Map primary navigation", "/ primary navigation JSON-LD should be named.");
  expectText(home, "Worth-It Score explanation", "/ primary navigation JSON-LD should include score anchor.");
  expectText(home, "Solar Payback Map solar payback research paths", "/ should include home research-path ItemList JSON-LD.");
  expectText(home, "Research paths", "/ should link users into research paths.");
  expectText(home, "<dl class=\"manifest-card-meta\" aria-label=", "/ research path descriptions should render as labeled metadata.");
  expectText(home, "<dt>Description</dt>", "/ research path descriptions should expose a description label.");
  expectText(home, "/content-manifest", "/ should link to the content manifest.");
  expectText(home, "/editorial-policy", "/ should link to the editorial policy.");
  expectText(home, "Latest articles", "/ should expose latest published articles.");
  expectText(home, "\"logo\":\"", "/ should include Organization logo JSON-LD.");

  const defaultOgImage = await get("/opengraph-image");
  expectStatus(defaultOgImage, 200, "/opengraph-image");
  expectHeader(defaultOgImage, "content-type", "image/png", "/opengraph-image");
  expectHeader(defaultOgImage, "cache-control", "public, max-age=3600", "/opengraph-image");
  expectHeader(defaultOgImage, "x-robots-tag", "index, follow", "/opengraph-image");

  const sitemap = await get("/sitemap.xml");
  expectStatus(sitemap, 200, "/sitemap.xml");
  expectHeader(sitemap, "cache-control", "public, max-age=3600", "/sitemap.xml");
  expectHeader(sitemap, "x-robots-tag", "index, follow", "/sitemap.xml");
  expectText(sitemap, "/blog/category", "sitemap should include category index.");
  expectText(sitemap, "/content-manifest", "sitemap should include the content manifest.");
  expectText(sitemap, "hreflang=\"en-US\"", "sitemap should expose en-US alternate links.");
  expectText(sitemap, "hreflang=\"x-default\"", "sitemap should expose x-default alternate links.");
  expectNotText(sitemap, "/ads.txt", "sitemap should not list ads.txt utility route.");
  expectNotText(sitemap, "/manifest.webmanifest", "sitemap should not list web app manifest utility route.");
  expectNotText(sitemap, "/feed.xml", "sitemap should not list RSS utility route.");
  if (latestUpdated && !sitemap.text.includes(latestUpdated)) {
    failures.push("sitemap should expose the latest published content updated date.");
  }

  const robots = await get("/robots.txt");
  expectStatus(robots, 200, "/robots.txt");
  expectHeader(robots, "cache-control", "public, max-age=3600", "/robots.txt");
  expectHeader(robots, "x-robots-tag", "index, follow", "/robots.txt");
  expectText(robots, "Sitemap:", "robots.txt should include a sitemap directive.");
  expectText(robots, "Host:", "robots.txt should include the canonical host directive.");

  const notFound = await get("/missing-solar-payback-page");
  expectStatus(notFound, 404, "/missing-solar-payback-page");
  expectText(notFound, "This page is not in the dataset yet.", "404 page should render useful recovery copy.");
  expectText(notFound, "noindex", "404 page should expose noindex robots metadata.");
  expectText(notFound, "nofollow", "404 page should expose nofollow robots metadata.");
  expectText(notFound, "aria-label=\"Helpful Solar Payback Map pages\"", "404 page should expose a labeled recovery navigation.");
  expectText(notFound, "<ul class=\"not-found-links\"", "404 recovery links should render as a semantic list.");
  expectText(notFound, "<dl class=\"not-found-link-meta\" aria-label=", "404 recovery link descriptions should render as labeled metadata.");
  expectText(notFound, "<dt>Recovery path</dt>", "404 recovery links should expose recovery path labels.");
  for (const link of ["/rankings", "/calculator", "/blog", "/blog/category", "/methodology", "/content-manifest"]) {
    expectText(notFound, link, `404 page should link to ${link}.`);
  }

  const ads = await get("/ads.txt");
  expectStatus(ads, 200, "/ads.txt");
  expectHeader(ads, "content-type", "text/plain", "/ads.txt");
  expectHeader(ads, "cache-control", "public, max-age=3600", "/ads.txt");
  expectHeader(ads, "x-robots-tag", "index, follow", "/ads.txt");
  const expectedAdsensePublisher = getAdsensePublisherId(
    process.env.ADSENSE_CLIENT || process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  );
  if (expectedAdsensePublisher) {
    expectText(ads, `google.com, ${expectedAdsensePublisher}, DIRECT, f08c47fec0942fa0`, "/ads.txt should expose the normalized Google seller line.");
  } else {
    expectText(ads, "Invalid, placeholder, or non-numeric publisher IDs are ignored.", "/ads.txt should explain inactive or invalid publisher configuration.");
    expectNotText(ads, "google.com, pub-XXXXXXXXXXXXXXXX", "/ads.txt should not expose placeholder seller IDs.");
  }

  const rss = await get("/feed.xml");
  expectStatus(rss, 200, "/feed.xml");
  expectHeader(rss, "content-type", "application/rss+xml", "/feed.xml");
  expectHeader(rss, "cache-control", "public, max-age=3600", "/feed.xml");
  expectHeader(rss, "x-robots-tag", "index, follow", "/feed.xml");
  expectText(rss, "<rss", "RSS feed should be XML.");
  expectText(rss, "<atom:link", "RSS feed should include Atom self link.");
  expectText(rss, "Key takeaways:", "RSS feed should include key takeaways in item descriptions.");
  expectText(rss, "Quality score:", "RSS feed should include quality context in item descriptions.");
  expectText(rss, "Source count:", "RSS feed should include source-count context in item descriptions.");
  expectText(rss, "Internal link count:", "RSS feed should include internal-link context in item descriptions.");
  expectText(rss, "<language>en-US</language>", "RSS feed should expose language metadata.");
  expectText(rss, "<source url=", "RSS feed should expose source URL elements.");
  expectText(rss, "rel=\"author\"", "RSS channel should link the author profile.");
  expectText(rss, "rel=\"help\"", "RSS channel should link the editorial policy.");
  expectText(rss, "rel=\"license\"", "RSS channel should link legal terms.");
  expectText(rss, "Editorial policy:", "RSS item descriptions should link editorial policy context.");
  expectText(rss, "Author profile:", "RSS item descriptions should link author profile context.");
  expectText(rss, "Contact and corrections:", "RSS item descriptions should link contact/correction context.");
  expectText(rss, "Legal and advertising disclosure:", "RSS item descriptions should link legal disclosure context.");
  expectText(rss, "Canonical:", "RSS feed should include canonical context in item descriptions.");
  expectText(rss, "<ttl>60</ttl>", "RSS channel should expose a feed refresh TTL.");
  expectText(rss, "<image>", "RSS channel should expose brand image metadata.");
  expectText(rss, "/icon.svg", "RSS channel image should use the site icon.");

  const jsonFeed = await getJson("/feed.json");
  expectHeader(jsonFeed, "content-type", "application/feed+json", "/feed.json");
  expectHeader(jsonFeed, "cache-control", "public, max-age=3600", "/feed.json");
  expectHeader(jsonFeed, "x-robots-tag", "index, follow", "/feed.json");
  expectJsonValue(jsonFeed, "version", "https://jsonfeed.org/version/1.1", "/feed.json");
  if (!Array.isArray(jsonFeed.data.items) || jsonFeed.data.items.length < 1) {
    failures.push("/feed.json should include at least one published item.");
  }
  if (jsonFeed.data._published_count !== jsonFeed.data.items?.length) {
    failures.push("/feed.json _published_count should match the published item count.");
  }
  if (latestUpdated && jsonFeed.data._latest_article_update !== new Date(latestUpdated).toISOString()) {
    failures.push("/feed.json _latest_article_update should match the newest published article update.");
  }
  if (!jsonFeed.data.items?.[0]?.content_text || !jsonFeed.data.items?.[0]?.date_published) {
    failures.push("/feed.json items should include content_text and date_published.");
  }
  if (!Array.isArray(jsonFeed.data.items?.[0]?._key_takeaways) || jsonFeed.data.items[0]._key_takeaways.length < 3) {
    failures.push("/feed.json items should include at least three key takeaways.");
  }
  if (!jsonFeed.data.items?.[0]?._editorial_review || !jsonFeed.data.items?.[0]?._source_count || !jsonFeed.data.items?.[0]?._internal_link_count) {
    failures.push("/feed.json items should include editorial review, source count, and internal link count metadata.");
  }
  if (!Array.isArray(jsonFeed.data.items?.[0]?._external_sources) || !jsonFeed.data.items[0]._external_sources[0]?.url || !Array.isArray(jsonFeed.data.items?.[0]?._internal_links) || !jsonFeed.data.items[0]._internal_links[0]?.url) {
    failures.push("/feed.json items should include external source and internal link lists.");
  }
  if (!jsonFeed.data.author?.url || !jsonFeed.data._publishing_principles || !jsonFeed.data._author_profile_url || !jsonFeed.data._contact_url || !jsonFeed.data._license_url) {
    failures.push("/feed.json should include feed-level author, publishing principles, contact, legal, and author profile metadata.");
  }
  if (!jsonFeed.data.items?.[0]?._publishing_principles || !jsonFeed.data.items?.[0]?._author_profile_url || !jsonFeed.data.items?.[0]?._contact_url || !jsonFeed.data.items?.[0]?._license_url || !jsonFeed.data.items?.[0]?._legal_disclosure || !jsonFeed.data.items?.[0]?._category || !jsonFeed.data.items?.[0]?._main_keyword) {
    failures.push("/feed.json items should include publishing principles, author profile, contact, legal, category, and main keyword metadata.");
  }

  const manifest = await getJson("/manifest.webmanifest");
  expectHeader(manifest, "cache-control", "public, max-age=3600", "/manifest.webmanifest");
  expectHeader(manifest, "x-robots-tag", "index, follow", "/manifest.webmanifest");
  expectJsonValue(manifest, "theme_color", "#22303A", "/manifest.webmanifest");
  expectJsonValue(manifest, "id", "/", "/manifest.webmanifest");
  expectJsonValue(manifest, "orientation", "portrait-primary", "/manifest.webmanifest");
  expectJsonValue(manifest, "dir", "ltr", "/manifest.webmanifest");
  expectJsonValue(manifest, "prefer_related_applications", false, "/manifest.webmanifest");
  if (!manifest.data.icons?.some((icon) => icon.src === "/icon.svg")) {
    failures.push("/manifest.webmanifest should include /icon.svg.");
  }
  if (!manifest.data.shortcuts?.some((shortcut) => shortcut.url === "/calculator") || !manifest.data.shortcuts?.some((shortcut) => shortcut.url === "/rankings") || !manifest.data.shortcuts?.some((shortcut) => shortcut.url === "/methodology") || !manifest.data.shortcuts?.some((shortcut) => shortcut.url === "/blog") || !manifest.data.shortcuts?.some((shortcut) => shortcut.url === "/blog/category") || !manifest.data.shortcuts?.some((shortcut) => shortcut.url === "/content-manifest") || !manifest.data.shortcuts?.some((shortcut) => shortcut.url === "/contact") || !manifest.data.shortcuts?.some((shortcut) => shortcut.url === "/editorial-policy") || !manifest.data.shortcuts?.some((shortcut) => shortcut.url === "/legal")) {
    failures.push("/manifest.webmanifest should include calculator, rankings, methodology, journal, topic hub, content manifest, contact, editorial policy, and legal shortcuts.");
  }
  if (!manifest.data.screenshots?.some((screenshot) => screenshot.src === "/opengraph-image" && screenshot.form_factor === "wide")) {
    failures.push("/manifest.webmanifest should include a wide screenshot hint.");
  }

  const icon = await get("/icon.svg");
  expectStatus(icon, 200, "/icon.svg");
  expectHeader(icon, "content-type", "image/svg+xml", "/icon.svg");

  const llms = await get("/llms.txt");
  expectStatus(llms, 200, "/llms.txt");
  expectHeader(llms, "cache-control", "public, max-age=3600", "/llms.txt");
  expectHeader(llms, "x-robots-tag", "index, follow", "/llms.txt");
  expectText(llms, "Latest published articles", "llms.txt should expose latest published articles.");
  expectText(llms, "Content operations", "llms.txt should expose content operations.");
  expectText(llms, "Published articles available now", "llms.txt should expose published article count.");
  expectText(llms, "Latest published article update", "llms.txt should expose latest published article update.");
  if (latestUpdated) expectText(llms, new Date(latestUpdated).toISOString(), "llms.txt latest update should match the newest published article update.");
  expectText(llms, "Ready article drafts with approved metadata", "llms.txt should expose ready article count.");
  expectText(llms, "Pending scheduled articles not yet exposed to crawlers", "llms.txt should expose pending scheduled article count.");
  expectText(llms, "key takeaways", "llms.txt should describe key takeaway metadata.");
  expectText(llms, "quality score", "llms.txt should describe quality score metadata.");
  expectText(llms, "legal disclosure context", "llms.txt should describe item-level legal disclosure metadata.");
  expectText(llms, "ProfilePage", "llms.txt should describe author ProfilePage metadata.");
  expectText(llms, "publishing principles", "llms.txt should describe feed-level publishing principles metadata.");
  expectText(llms, "main keyword", "llms.txt should describe JSON Feed main keyword metadata.");
  expectText(llms, "contact URL", "llms.txt should describe JSON Feed contact metadata.");
  expectText(llms, "legal URL", "llms.txt should describe JSON Feed legal metadata.");
  expectText(llms, "license URL", "llms.txt should describe JSON Feed item license metadata.");
  expectText(llms, "Web app manifest shortcuts", "llms.txt should describe manifest shortcut metadata.");
  expectText(llms, "en_US Open Graph locale", "llms.txt should describe Open Graph locale metadata.");
  expectText(llms, "page-level keywords", "llms.txt should describe page keyword metadata.");
  expectText(llms, "/authors/solarpaybackmap-editorial", "llms.txt should link to the author profile.");
  expectText(llms, "/contact", "llms.txt should link to the contact page.");
  expectText(llms, "/legal", "llms.txt should link to the legal page.");

  const manifestPage = await get("/content-manifest");
  expectStatus(manifestPage, 200, "/content-manifest");
  expectText(manifestPage, "solar payback content manifest", "content manifest should render focused keyword metadata.");
  expectText(manifestPage, "BreadcrumbList", "content manifest should include breadcrumb JSON-LD.");
  expectText(manifestPage, "CollectionPage", "content manifest should include CollectionPage JSON-LD.");
  expectText(manifestPage, "publisher", "content manifest CollectionPage schema should expose publisher context.");
  expectText(manifestPage, "reviewedBy", "content manifest CollectionPage schema should expose review context.");
  expectText(manifestPage, "dateModified", "content manifest CollectionPage schema should expose modified-date context.");
  expectText(manifestPage, "publishingPrinciples", "content manifest CollectionPage schema should link editorial policy.");
  expectText(manifestPage, "Content Manifest", "content manifest page should render.");
  expectText(manifestPage, "Content operations summary", "content manifest should show content operations summary.");
  expectText(manifestPage, "<dl class=\"manifest-stats\" aria-label=\"Content publication statistics\">", "content manifest stats should render as a labeled description list.");
  expectText(manifestPage, "publication time", "content manifest should explain scheduled publication timing.");
  expectText(manifestPage, "<dl class=\"manifest-note\" aria-label=\"Content schedule status\">", "content manifest schedule status should render as a labeled description list.");
  expectText(manifestPage, "<time dateTime=", "content manifest schedule status should render semantic time metadata.");
  expectText(manifestPage, "pending scheduled articles not yet exposed to crawlers", "content manifest should separate unpublished scheduled articles from published content.");
  expectText(manifestPage, "quality score", "content manifest should expose quality-control language.");
  expectText(manifestPage, "every article currently published and available to crawlers", "content manifest should state that published article list is complete.");
  expectText(manifestPage, "<dl class=\"manifest-article-meta\" aria-label=", "content manifest published article metadata should render as a labeled description list.");
  expectText(manifestPage, "<dt>Category</dt>", "content manifest published article metadata should expose category as a description term.");
  expectText(manifestPage, "<ul class=\"manifest-grid\" aria-label=\"Core Solar Payback Map resources\">", "content manifest core resources should render as a labeled list.");
  expectText(manifestPage, "<ul class=\"manifest-grid\" aria-label=\"Solar payback topic hubs\">", "content manifest topic hubs should render as a labeled list.");
  expectText(manifestPage, "<dl class=\"manifest-topic-meta\" aria-label=", "content manifest topic hub counts should render as labeled metadata.");
  expectText(manifestPage, "<dd>published articles</dd>", "content manifest topic hub counts should expose the published article label.");
  expectText(manifestPage, "/contact", "content manifest should link to the contact page.");
  expectText(manifestPage, "/legal", "content manifest should link to the legal page.");
  expectText(manifestPage, "Feed metadata also exposes author", "content manifest should explain feed-level trust metadata.");
  expectText(manifestPage, "/manifest.webmanifest", "content manifest should link to the web app manifest.");
  expectText(manifestPage, "<nav aria-label=\"Content manifest next steps\"><ul class=\"trust-link-list\">", "content manifest next-step links should render as a labeled navigation list.");
  expectText(manifestPage, "/calculator", "content manifest should link to the calculator.");
  expectText(manifestPage, "/methodology", "content manifest should link to methodology.");
  expectText(manifestPage, "/blog", "content manifest should link to the journal.");

  const author = await get("/authors/solarpaybackmap-editorial");
  expectStatus(author, 200, "/authors/solarpaybackmap-editorial");
  expectText(author, "solar payback review team", "author profile should render focused keyword metadata.");
  expectText(author, "BreadcrumbList", "author profile should include breadcrumb JSON-LD.");
  expectText(author, "ProfilePage", "author profile should include ProfilePage JSON-LD.");
  expectText(author, "mainEntity", "author profile ProfilePage schema should point to the author entity.");
  expectText(author, "dateModified", "author profile ProfilePage schema should expose modified-date context.");
  expectText(author, "publisher", "author profile ProfilePage schema should expose publisher context.");
  expectText(author, "mainEntityOfPage", "author profile should expose mainEntityOfPage context.");
  expectText(author, "editorial corrections and source review", "author profile should expose correction contactPoint context.");
  expectText(author, "<dl class=\"author-policy-summary\" aria-label=\"Solar Payback Map Editorial reviewer summary\">", "author profile should expose a labeled reviewer summary.");
  expectText(author, "<dt>Review focus</dt>", "author profile summary should expose review focus.");
  expectText(author, "<dt>Source standard</dt>", "author profile summary should expose source standard.");
  expectText(author, "<dt>Independence</dt>", "author profile summary should expose independence.");
  expectText(author, "<dt>Correction route</dt>", "author profile summary should expose correction route.");
  expectText(author, "<nav class=\"author-links\" aria-label=\"Solar Payback Map Editorial trust links\">", "author profile trust CTAs should render as a labeled navigation landmark.");
  expectText(author, "<nav aria-label=\"Solar Payback Map Editorial next steps\"><ul class=\"trust-link-list\">", "author profile next-step links should render as a labeled navigation list.");
  expectText(author, "Request a correction", "author profile should link to the correction contact path.");
  expectText(author, "/editorial-policy", "author profile should link to editorial standards.");
  expectText(author, "/methodology", "author profile should link to methodology.");
  expectText(author, "/contact", "author profile should link to contact and corrections.");
  expectText(author, "/content-manifest", "author profile should link to the content manifest.");
  expectText(author, "Recent reviewed articles", "author profile should show reviewed articles.");
  expectText(author, "Recent Solar Payback Map Editorial reviewed articles", "author profile should expose reviewed-article ItemList schema.");
  expectText(author, "articleSection", "author reviewed-article ItemList should expose article sections.");
  expectText(author, "<dl class=\"reviewed-article-meta\" aria-label=", "author reviewed-article metadata should render as a labeled description list.");
  expectText(author, "<dt>Category</dt>", "author reviewed-article metadata should expose category as a description term.");
  expectText(author, "<dt>Updated</dt>", "author reviewed-article metadata should expose updated date as a description term.");
  expectText(author, "dateTime", "author reviewed-article list should render semantic updated dates.");
  expectText(author, "knowsAbout", "author profile should include expertise schema.");

  const blog = await get("/blog");
  expectStatus(blog, 200, "/blog");
  expectText(blog, "solar payback blog", "/blog should render focused keyword metadata.");
  expectText(blog, "og:locale", "/blog should include Open Graph locale metadata.");
  expectText(blog, "og:image", "/blog should include Open Graph image metadata.");
  expectText(blog, "/blog/opengraph-image", "/blog OG image should use the static hub image route.");
  expectText(blog, "BreadcrumbList", "/blog should include breadcrumb JSON-LD.");
  expectText(blog, "\"@type\":\"Blog\"", "/blog should include Blog JSON-LD.");
  expectText(blog, "publisher", "/blog Blog JSON-LD should include publisher context.");
  expectText(blog, "dateModified", "/blog Blog JSON-LD should expose modified-date context.");
  expectText(blog, "isAccessibleForFree", "/blog Blog JSON-LD should expose free-access context.");
  expectText(blog, "Latest article update reviewed in UTC", "/blog should visibly expose freshness context.");
  expectText(blog, "source-freshness", "/blog freshness context should use shared spacing class.");
  expectText(blog, "<time dateTime=", "/blog freshness context should render semantic time metadata.");
  expectText(blog, "description", "/blog BlogPosting summaries should include descriptions.");
  expectText(blog, "mainEntityOfPage", "/blog BlogPosting summaries should include mainEntityOfPage.");
  expectText(blog, "datePublished", "/blog BlogPosting summaries should include published dates.");
  expectText(blog, "articleSection", "/blog BlogPosting summaries should expose article sections.");
  expectText(blog, "publishingPrinciples", "/blog BlogPosting summaries should link editorial policy.");
  expectText(blog, "/blog/how-we-estimate-solar-payback/opengraph-image", "/blog BlogPosting summaries should include article image URLs.");
  expectText(blog, "/authors/solarpaybackmap-editorial", "/blog BlogPosting summaries should link to the author profile.");
  expectText(blog, "aria-current=\"page\"", "/blog should mark the active primary navigation link.");
  expectText(blog, "aria-label=\"Article list\"", "/blog cards should render as a labeled article list.");
  expectText(blog, "post-count-summary", "/blog should expose the visible published-article count before the card list.");
  expectText(blog, "published solar payback articles", "/blog article count summary should describe the listed content.");
  expectText(blog, "<ol", "/blog cards should use semantic ordered-list markup.");
  expectText(blog, "<nav class=\"chips\" aria-label=\"Filter posts by category\">", "/blog category filter should render as a labeled navigation landmark.");
  expectText(blog, "aria-pressed=\"true\"", "/blog category filter should expose selected state.");
  expectText(blog, "solar payback topic hub", "/blog category links should expose descriptive labels.");
  expectText(blog, "aria-labelledby=\"post-", "/blog article cards should link card labels to article titles.");
  expectText(blog, "aria-describedby=\"post-", "/blog article cards should link card descriptions to article summaries.");
  expectText(blog, "Published", "/blog cards should show published dates.");
  expectText(blog, "Updated", "/blog cards should show updated dates.");
  expectText(blog, "<dl class=\"meta-row\" aria-label=", "/blog card metadata should render as a labeled description list.");
  expectText(blog, "<dt>Category</dt>", "/blog card metadata should expose category as a description term.");
  expectText(blog, "<dt>Read time</dt>", "/blog card metadata should expose read time as a description term.");
  expectText(blog, "<dt>Quality score</dt>", "/blog card metadata should expose quality score as a description term.");
  expectText(blog, "dateTime", "/blog cards should render semantic time metadata.");
  expectText(blog, "<nav aria-label=\"Solar payback journal next steps\"><ul class=\"trust-link-list\">", "/blog next-step links should render as a labeled navigation list.");
  expectText(blog, "/calculator", "/blog should link to the calculator.");
  expectText(blog, "/content-manifest", "/blog should link to the content manifest.");

  const blogOgImage = await get("/blog/opengraph-image");
  expectStatus(blogOgImage, 200, "/blog/opengraph-image");
  expectHeader(blogOgImage, "content-type", "image/png", "/blog/opengraph-image");
  expectHeader(blogOgImage, "cache-control", "public, max-age=3600", "/blog/opengraph-image");
  expectHeader(blogOgImage, "x-robots-tag", "index, follow", "/blog/opengraph-image");

  const categoryIndex = await get("/blog/category");
  expectStatus(categoryIndex, 200, "/blog/category");
  expectText(categoryIndex, "solar payback topic hubs", "/blog/category should render focused keyword metadata.");
  expectText(categoryIndex, "og:image", "/blog/category should include Open Graph image metadata.");
  expectText(categoryIndex, "/blog/category/opengraph-image", "/blog/category OG image should use the static hub image route.");
  expectText(categoryIndex, "BreadcrumbList", "/blog/category should include breadcrumb JSON-LD.");
  expectText(categoryIndex, "CollectionPage", "/blog/category should include CollectionPage JSON-LD.");
  expectText(categoryIndex, "publisher", "/blog/category CollectionPage schema should expose publisher context.");
  expectText(categoryIndex, "reviewedBy", "/blog/category CollectionPage schema should expose review context.");
  expectText(categoryIndex, "dateModified", "/blog/category CollectionPage schema should expose modified-date context.");
  expectText(categoryIndex, "publishingPrinciples", "/blog/category CollectionPage schema should link editorial policy.");
  expectText(categoryIndex, "Topic hubs", "/blog/category should render breadcrumb copy.");
  expectText(categoryIndex, "<dl class=\"topic-index-scope\" aria-label=\"Solar payback topic index scope\">", "/blog/category should expose a labeled topic index scope summary.");
  expectText(categoryIndex, "<dt>Hub purpose</dt>", "/blog/category scope summary should expose hub purpose.");
  expectText(categoryIndex, "<dt>Included topics</dt>", "/blog/category scope summary should expose included topics.");
  expectText(categoryIndex, "<dt>Best use</dt>", "/blog/category scope summary should expose best use.");
  expectText(categoryIndex, "<dt>Not included</dt>", "/blog/category scope summary should expose exclusions.");
  expectText(categoryIndex, "<dl class=\"topic-index-summary\" aria-label=\"Solar payback topic index summary\">", "/blog/category should expose a labeled topic index summary.");
  expectText(categoryIndex, "published articles across hubs", "/blog/category summary should expose total published articles across hubs.");
  expectText(categoryIndex, "<ol class=\"category-index\" aria-label=\"Solar payback topic hubs\">", "/blog/category topic hub cards should render as a labeled ordered list.");
  expectText(categoryIndex, "<dl class=\"category-card-meta\" aria-label=", "/blog/category cards should expose labeled metadata.");
  expectText(categoryIndex, "<dt>Articles</dt>", "/blog/category card metadata should expose article counts.");
  expectText(categoryIndex, "<dt>Updated</dt>", "/blog/category cards should expose latest updated date labels.");
  expectText(categoryIndex, "<dt>Latest</dt>", "/blog/category cards should expose latest article labels.");
  expectText(categoryIndex, "<time dateTime=", "/blog/category latest updated dates should render semantic time metadata.");
  expectText(categoryIndex, "<nav aria-label=\"Topic index next steps\"><ul class=\"trust-link-list\">", "/blog/category next-step links should render as a labeled navigation list.");
  expectText(categoryIndex, "/calculator", "/blog/category should link to the calculator.");
  expectText(categoryIndex, "/content-manifest", "/blog/category should link to the content manifest.");

  const categoryIndexOgImage = await get("/blog/category/opengraph-image");
  expectStatus(categoryIndexOgImage, 200, "/blog/category/opengraph-image");
  expectHeader(categoryIndexOgImage, "content-type", "image/png", "/blog/category/opengraph-image");
  expectHeader(categoryIndexOgImage, "cache-control", "public, max-age=3600", "/blog/category/opengraph-image");
  expectHeader(categoryIndexOgImage, "x-robots-tag", "index, follow", "/blog/category/opengraph-image");

  const policyHub = await get("/blog/category/policy");
  expectStatus(policyHub, 200, "/blog/category/policy");
  expectText(policyHub, "policy solar payback", "category hub should render category-specific keyword metadata.");
  expectText(policyHub, "CollectionPage", "category hub should include CollectionPage JSON-LD.");
  expectText(policyHub, "publisher", "category hub CollectionPage schema should expose publisher context.");
  expectText(policyHub, "reviewedBy", "category hub CollectionPage schema should expose review context.");
  expectText(policyHub, "dateModified", "category hub CollectionPage schema should expose modified-date context.");
  expectText(policyHub, "publishingPrinciples", "category hub CollectionPage schema should link editorial policy.");
  expectText(policyHub, "ItemList", "category hub CollectionPage schema should expose an article ItemList.");
  expectText(policyHub, "itemListElement", "category hub CollectionPage schema should expose ordered article items.");
  expectText(policyHub, "articleSection", "category hub article items should expose article sections.");
  expectText(policyHub, "<dl class=\"category-hub-scope\" aria-label=\"Policy topic hub scope\">", "category hub should expose a labeled scope summary.");
  expectText(policyHub, "<dt>Research focus</dt>", "category hub scope summary should expose research focus.");
  expectText(policyHub, "<dt>Reading order</dt>", "category hub scope summary should expose reading order.");
  expectText(policyHub, "<dt>Quality basis</dt>", "category hub scope summary should expose quality basis.");
  expectText(policyHub, "<dt>Not included</dt>", "category hub scope summary should expose exclusions.");
  expectText(policyHub, "<dl class=\"hub-stats\" aria-label=\"Policy topic hub freshness\">", "category hub freshness stats should render as a labeled description list.");
  expectText(policyHub, "published articles in this topic", "category hub should expose article count.");
  expectText(policyHub, "<time dateTime=", "category hub freshness date should render semantic time metadata.");
  expectText(policyHub, "latest article update reviewed in UTC", "category hub should expose freshness context.");
  expectText(policyHub, "Public-source", "category hub should expose quality context.");
  expectText(policyHub, "<section class=\"read-path\" aria-labelledby=\"recommended-reading-path\">", "category hub recommended reading path should render as a labeled section.");
  expectText(policyHub, "<h2 id=\"recommended-reading-path\">Recommended reading path</h2><ol>", "category hub recommended reading path should expose an ordered list.");
  expectText(policyHub, "<nav aria-label=\"Policy topic hub next steps\"><ul class=\"trust-link-list\">", "category hub next-step links should render as a labeled navigation list.");
  expectText(policyHub, "/calculator", "category hub should link to the calculator.");
  expectText(policyHub, "/content-manifest", "category hub should link to the content manifest.");

  const california = await get("/solar/california");
  expectStatus(california, 200, "/solar/california");
  expectText(california, "BreadcrumbList", "/solar/california should include breadcrumb JSON-LD.");
  expectText(california, "CollectionPage", "/solar/california should include CollectionPage JSON-LD.");
  expectText(california, "publisher", "/solar/california CollectionPage schema should expose publisher context.");
  expectText(california, "reviewedBy", "/solar/california CollectionPage schema should expose review context.");
  expectText(california, "dateModified", "/solar/california CollectionPage schema should expose modified-date context.");
  expectText(california, "citation", "/solar/california CollectionPage schema should expose citations.");
  expectText(california, "license", "/solar/california CollectionPage schema should expose attribution-license context.");
  expectText(california, "/legal#attribution", "/solar/california should visibly link attribution policy.");
  expectText(california, "California solar", "/solar/california should render breadcrumb copy.");
  expectText(california, "<dl class=\"california-solar-scope\" aria-label=\"California solar payback scope summary\">", "/solar/california should expose a labeled state scope summary.");
  expectText(california, "<dt>State focus</dt>", "/solar/california scope summary should expose state focus.");
  expectText(california, "<dt>Policy factor</dt>", "/solar/california scope summary should expose policy factor.");
  expectText(california, "<dt>Best use</dt>", "/solar/california scope summary should expose best use.");
  expectText(california, "<dt>Not included</dt>", "/solar/california scope summary should expose exclusions.");
  expectText(california, "<dl class=\"stat-grid\" aria-label=\"California solar payback screening metrics\">", "/solar/california screening metrics should render as a labeled description list.");
  expectText(california, "31.8c", "/solar/california should render ASCII rate notation.");
  expectText(california, "<nav aria-label=\"California solar next steps\"><ul class=\"trust-link-list\">", "/solar/california next-step links should render as a labeled navigation list.");
  expectText(california, "/calculator", "/solar/california should link to the calculator.");

  const sanDiego = await get("/solar/california/san-diego-county");
  expectStatus(sanDiego, 200, "/solar/california/san-diego-county");
  expectText(sanDiego, "San Diego County solar payback", "/solar/california/san-diego-county should render focused keyword metadata.");
  expectText(sanDiego, "BreadcrumbList", "/solar/california/san-diego-county should include breadcrumb JSON-LD.");
  expectText(sanDiego, "\"@type\":\"Article\"", "/solar/california/san-diego-county should include Article JSON-LD.");
  expectText(sanDiego, "author", "/solar/california/san-diego-county Article schema should expose author context.");
  expectText(sanDiego, "publisher", "/solar/california/san-diego-county Article schema should expose publisher context.");
  expectText(sanDiego, "reviewedBy", "/solar/california/san-diego-county Article schema should expose review context.");
  expectText(sanDiego, "dateModified", "/solar/california/san-diego-county Article schema should expose modified-date context.");
  expectText(sanDiego, "citation", "/solar/california/san-diego-county Article schema should expose citations.");
  expectText(sanDiego, "license", "/solar/california/san-diego-county Article schema should expose attribution-license context.");
  expectText(sanDiego, "/legal#attribution", "/solar/california/san-diego-county should visibly link attribution policy.");
  expectText(sanDiego, "San Diego County", "/solar/california/san-diego-county should render breadcrumb copy.");
  expectText(sanDiego, "<dl class=\"stat-grid\" aria-label=\"San Diego County solar payback screening metrics\">", "/solar/california/san-diego-county screening metrics should render as a labeled description list.");
  expectText(sanDiego, "<nav aria-label=\"San Diego County solar next steps\"><ul class=\"trust-link-list\">", "/solar/california/san-diego-county next-step links should render as a labeled navigation list.");
  expectText(sanDiego, "/solar/california", "/solar/california/san-diego-county should link back to the California state hub.");
  expectText(sanDiego, "/calculator", "/solar/california/san-diego-county should link to the calculator.");

  const calculator = await get("/calculator");
  expectStatus(calculator, 200, "/calculator");
  expectText(calculator, "class=\"btn btn-ghost btn-sm\" aria-current=\"page\" href=\"/calculator\"", "/calculator should mark the desktop calculator CTA as the current page.");
  expectText(calculator, "BreadcrumbList", "/calculator should include breadcrumb JSON-LD.");
  expectText(calculator, "WebApplication", "/calculator should include WebApplication JSON-LD.");
  expectText(calculator, "FinanceApplication", "/calculator should expose finance application schema.");
  expectText(calculator, "publisher", "/calculator WebApplication schema should expose publisher context.");
  expectText(calculator, "reviewedBy", "/calculator WebApplication schema should expose review context.");
  expectText(calculator, "dateModified", "/calculator WebApplication schema should expose modified-date context.");
  expectText(calculator, "publishingPrinciples", "/calculator WebApplication schema should link editorial policy.");
  expectText(calculator, "<dl class=\"calculator-page-summary\" aria-label=\"Solar payback calculator scope summary\">", "/calculator should expose a labeled calculator scope summary.");
  expectText(calculator, "<dt>Inputs used</dt>", "/calculator scope summary should expose inputs used.");
  expectText(calculator, "<dt>Outputs shown</dt>", "/calculator scope summary should expose outputs shown.");
  expectText(calculator, "<dt>Best use</dt>", "/calculator scope summary should expose best use.");
  expectText(calculator, "<dt>Not included</dt>", "/calculator scope summary should expose exclusions.");
  expectText(calculator, "c/kWh", "/calculator should render ASCII electricity rate notation.");
  expectText(calculator, "<fieldset", "/calculator should group inputs in a fieldset.");
  expectText(calculator, "Solar payback scenario inputs", "/calculator should expose an input group legend.");
  expectText(calculator, "aria-live=\"polite\"", "/calculator results should be announced politely.");
  expectText(calculator, "role=\"status\"", "/calculator results should expose a status region.");
  expectText(calculator, "<dl class=\"stat-grid\" aria-label=\"Solar payback calculator results\" aria-live=\"polite\" role=\"status\">", "/calculator results should render as a live description list.");
  expectText(calculator, "<dt class=\"dlabel\">simple payback</dt>", "/calculator result labels should render as description terms.");
  expectText(calculator, "<dl class=\"calc-assumptions\" aria-label=\"Current solar payback assumptions\">", "/calculator should expose current assumptions as a labeled description list.");
  expectText(calculator, "<dt>Export scenario</dt>", "/calculator assumptions should expose export scenario context.");
  expectText(calculator, "<output", "/calculator results should use semantic output elements.");
  expectText(calculator, "max=\"20\"", "/calculator system size input should expose a residential max bound.");
  expectText(calculator, "max=\"80\"", "/calculator rate input should expose a max bound.");
  expectText(calculator, "max=\"2200\"", "/calculator production input should expose a max bound.");
  expectText(calculator, "aria-describedby=\"system-help\"", "/calculator system input should expose range help.");
  expectText(calculator, "aria-describedby=\"export-help\"", "/calculator export-credit select should expose scenario help.");
  expectText(calculator, "Use annual production between 800 and 2200 kWh per kW.", "/calculator should render accessible production range help.");
  expectText(calculator, "<nav aria-label=\"Calculator next steps\"><ul class=\"trust-link-list\">", "/calculator next-step links should render as a labeled navigation list.");
  expectText(calculator, "/methodology", "/calculator should link to methodology.");
  expectText(calculator, "/legal#disclaimer", "/calculator should link to the estimate disclaimer.");

  const rankings = await get("/rankings");
  expectStatus(rankings, 200, "/rankings");
  expectText(rankings, "BreadcrumbList", "/rankings should include breadcrumb JSON-LD.");
  expectText(rankings, "Dataset", "/rankings should include Dataset JSON-LD.");
  expectText(rankings, "variableMeasured", "/rankings Dataset schema should expose measured variables.");
  expectText(rankings, "publisher", "/rankings Dataset schema should expose publisher context.");
  expectText(rankings, "reviewedBy", "/rankings Dataset schema should expose review context.");
  expectText(rankings, "dateModified", "/rankings Dataset schema should expose modified-date context.");
  expectText(rankings, "citation", "/rankings Dataset schema should expose public-source citations.");
  expectText(rankings, "c/kWh", "/rankings should render ASCII electricity rate notation.");
  expectText(rankings, "<dl class=\"rankings-page-summary\" aria-label=\"Solar rankings dataset scope summary\">", "/rankings should expose a labeled dataset scope summary.");
  expectText(rankings, "<dt>Measures compared</dt>", "/rankings scope summary should expose measured variables.");
  expectText(rankings, "<dt>Source basis</dt>", "/rankings scope summary should expose source basis.");
  expectText(rankings, "<dt>Best use</dt>", "/rankings scope summary should expose best use.");
  expectText(rankings, "<dt>Not included</dt>", "/rankings scope summary should expose exclusions.");
  expectText(rankings, "<dl class=\"stat-grid\" aria-label=\"Solar rankings dataset summary\">", "/rankings should expose a labeled dataset summary before the table.");
  expectText(rankings, "<dt class=\"dlabel\">states ranked</dt>", "/rankings dataset summary should expose state count.");
  expectText(rankings, "<dt class=\"dlabel\">latest review date</dt>", "/rankings dataset summary should expose latest review date.");
  expectText(rankings, "card rank-table-card", "/rankings score table wrapper should use the shared overflow class.");
  expectText(rankings, "<caption>State solar payback ranking table", "/rankings table should include a descriptive caption.");
  expectText(rankings, "scope=\"col\"", "/rankings table should expose scoped column headers.");
  expectText(rankings, "scope=\"row\"", "/rankings table should expose scoped row headers.");
  expectText(rankings, "aria-sort=\"descending\"", "/rankings score table should expose current sort direction.");
  expectText(rankings, "Sort by Score ascending", "/rankings score table should expose keyboard sortable header labels.");
  expectText(rankings, ">DESC</span>", "/rankings score table should expose a stable visible descending sort indicator.");
  expectText(rankings, "currently sorted descending", "/rankings score table should expose screen-reader sort status text.");
  expectText(rankings, "<time dateTime=\"2026-05-28\">2026-05-28</time>", "/rankings score table should expose semantic review dates.");
  expectText(rankings, "<nav aria-label=\"Rankings next steps\"><ul class=\"trust-link-list\">", "/rankings next-step links should render as a labeled navigation list.");
  expectText(rankings, "/calculator", "/rankings should link to the calculator.");
  expectText(rankings, "/legal#attribution", "/rankings should link to data attribution.");

  for (const [path, label, schemaType] of [
    ["/about", "About", "AboutPage"],
    ["/contact", "Contact", "ContactPage"],
    ["/methodology", "Methodology", "TechArticle"],
    ["/editorial-policy", "Editorial policy", "WebPage"],
    ["/legal", "Legal", "WebPage"],
  ]) {
    const page = await get(path);
    expectStatus(page, 200, path);
    expectText(page, "BreadcrumbList", `${path} should include breadcrumb JSON-LD.`);
    expectText(page, "<nav class=\"breadcrumb\" aria-label=\"Breadcrumb\"><ol>", `${path} breadcrumb should render as an ordered list.`);
    expectText(page, "aria-current=\"page\"", `${path} breadcrumb should mark the current page.`);
    expectText(page, `"@type":"${schemaType}"`, `${path} should include its page schema type.`);
    expectText(page, "isAccessibleForFree", `${path} should expose free-access page schema.`);
    expectText(page, "datePublished", `${path} should expose published-date page schema.`);
    expectText(page, "dateModified", `${path} should expose modified-date page schema.`);
    expectText(page, "reviewedBy", `${path} should expose reviewed-by page schema.`);
    expectText(page, "mainEntityOfPage", `${path} should expose WebPage mainEntityOfPage schema.`);
    expectText(page, "#webpage", `${path} should expose a stable page schema @id.`);
    expectText(page, label, `${path} should render breadcrumb copy.`);
    if (path === "/about" || path === "/methodology") {
      expectText(page, "<ul class=\"source-grid\" aria-label=\"Public solar data sources\">", `${path} public source cards should render as a labeled list.`);
      expectText(page, "rel=\"noopener noreferrer external\"", `${path} public source cards should use safe external-link attributes.`);
      expectText(page, "public data source", `${path} public source cards should expose descriptive external labels.`);
    }
    if (path === "/methodology") {
      expectText(page, "<dl class=\"methodology-scope-summary\" aria-label=\"Solar payback methodology scope summary\">", "/methodology should expose a labeled methodology scope summary.");
      expectText(page, "<dt>Inputs reviewed</dt>", "/methodology scope summary should expose reviewed inputs.");
      expectText(page, "<dt>Outputs published</dt>", "/methodology scope summary should expose published outputs.");
      expectText(page, "<dt>Review cadence</dt>", "/methodology scope summary should expose review cadence.");
      expectText(page, "<dt>Property limits</dt>", "/methodology scope summary should expose property limits.");
      expectText(page, "<caption>Solar payback model input and assumption table</caption>", "/methodology model table should expose a descriptive caption.");
      expectText(page, "<th scope=\"row\">Production</th>", "/methodology model table should expose scoped row headers.");
      expectText(page, "<ul class=\"model-exclusion-list\" aria-label=\"Solar payback model exclusions\">", "/methodology model exclusions should render as a labeled list.");
      expectText(page, "property-specific tax treatment are not scored", "/methodology model exclusions should explain property-specific limits.");
      expectText(page, "<nav aria-label=\"Methodology next steps\"><ul class=\"trust-link-list\">", "/methodology next-step links should render as a labeled navigation list.");
      expectText(page, "/calculator", "/methodology should link to the calculator.");
      expectText(page, "/legal#disclaimer", "/methodology should link to the estimate disclaimer.");
    }
    if (path === "/about") {
      expectText(page, "<dl class=\"about-policy-summary\" aria-label=\"Solar Payback Map about and independence summary\">", "/about should expose a labeled about and independence summary.");
      expectText(page, "<dt>Site purpose</dt>", "/about summary should expose site purpose.");
      expectText(page, "<dt>Revenue model</dt>", "/about summary should expose revenue model.");
      expectText(page, "<dt>Data approach</dt>", "/about summary should expose data approach.");
      expectText(page, "<dt>Decision limit</dt>", "/about summary should expose decision limits.");
      expectText(page, "<ol class=\"principles\" aria-label=\"Solar Payback Map editorial principles\">", "/about editorial principles should render as a labeled ordered list.");
      expectText(page, "<nav aria-label=\"About Solar Payback Map next steps\"><ul class=\"trust-link-list\">", "/about next-step links should render as a labeled navigation list.");
      expectText(page, "/rankings", "/about should link to the dataset preview.");
    }
  }

  const legal = await get("/legal");
  expectText(legal, "id=\"privacy\"", "/legal should expose a privacy anchor.");
  expectText(legal, "id=\"advertising\"", "/legal should expose an advertising anchor.");
  expectText(legal, "id=\"disclaimer\"", "/legal should expose a disclaimer anchor.");
  expectText(legal, "id=\"attribution\"", "/legal should expose an attribution anchor.");
  expectText(legal, "<dl class=\"legal-policy-summary\" aria-label=\"Solar Payback Map legal policy summary\">", "/legal should expose a labeled legal policy summary.");
  expectText(legal, "<dt>Privacy position</dt>", "/legal summary should expose privacy position.");
  expectText(legal, "<dt>Advertising model</dt>", "/legal summary should expose advertising model.");
  expectText(legal, "<dt>Estimate status</dt>", "/legal summary should expose estimate status.");
  expectText(legal, "<dt>Data attribution</dt>", "/legal summary should expose data attribution.");
  expectText(legal, "Solar Payback Map legal sections", "/legal should expose legal section ItemList schema.");
  expectText(legal, "Legal sections", "/legal should expose visible legal section navigation.");
  expectText(legal, "<nav aria-label=\"Solar Payback Map legal sections\"><ul class=\"legal-section-list\">", "/legal visible legal section links should render inside a labeled navigation landmark.");
  expectText(legal, "<dl class=\"legal-section-meta\" aria-label=", "/legal section descriptions should render as labeled metadata.");
  expectText(legal, "<dt>Section scope</dt>", "/legal section descriptions should expose a section scope label.");
  expectText(legal, "/legal#privacy", "/legal should link to privacy section.");
  expectText(legal, "/legal#advertising", "/legal should link to advertising section.");
  expectText(legal, "AdSense Auto Ads", "/legal should explain Auto Ads usage.");
  expectText(legal, "cookies or similar storage", "/legal should explain advertising cookies.");
  expectText(legal, "<nav aria-label=\"Legal next steps\"><ul class=\"trust-link-list\">", "/legal next-step links should render as a labeled navigation list.");
  expectText(legal, "/contact", "/legal should link to contact and corrections.");
  expectText(legal, "/editorial-policy", "/legal should link to editorial standards.");
  expectText(legal, "/methodology", "/legal should link to methodology.");
  expectText(legal, "/content-manifest", "/legal should link to the content manifest.");

  const contact = await get("/contact");
  expectStatus(contact, 200, "/contact");
  expectText(contact, "ContactPage", "/contact should include ContactPage JSON-LD.");
  expectText(contact, "Solar Payback Map contact paths", "/contact should expose contact path ItemList schema.");
  expectText(contact, "<dl class=\"contact-policy-summary\" aria-label=\"Solar Payback Map contact and correction summary\">", "/contact should expose a labeled contact policy summary.");
  expectText(contact, "<dt>Correction path</dt>", "/contact summary should expose correction path.");
  expectText(contact, "<dt>Source evidence</dt>", "/contact summary should expose source evidence.");
  expectText(contact, "<dt>Privacy route</dt>", "/contact summary should expose privacy route.");
  expectText(contact, "<dt>Methodology route</dt>", "/contact summary should expose methodology route.");
  expectText(contact, "<ul class=\"contact-path-list\" aria-label=\"Solar Payback Map contact paths\">", "/contact should render contact paths as a labeled visible list.");
  expectText(contact, "<dl class=\"contact-path-meta\" aria-label=", "/contact path descriptions should render as labeled metadata.");
  expectText(contact, "<dt>Route guidance</dt>", "/contact path descriptions should expose a route guidance label.");
  expectText(contact, "id=\"corrections\"", "/contact should expose corrections anchor.");
  expectText(contact, "id=\"advertising\"", "/contact should expose advertising anchor.");
  expectText(contact, "id=\"methodology\"", "/contact should expose methodology anchor.");
  expectText(contact, "Corrections and source review", "/contact should explain correction routing.");
  expectText(contact, "What to include", "/contact should explain correction request details.");
  expectText(contact, "<ul class=\"correction-checklist\" aria-label=\"Correction request details to include\">", "/contact correction request details should render as a labeled checklist.");
  expectText(contact, "/legal#advertising", "/contact should link to advertising policy.");
  expectText(contact, "/authors/solarpaybackmap-editorial", "/contact should link to author profile.");
  expectText(contact, "<nav aria-label=\"Contact next steps\"><ul class=\"trust-link-list\">", "/contact next-step links should render as a labeled navigation list.");
  expectText(contact, "/content-manifest", "/contact should link to the content manifest.");

  const editorialPolicy = await get("/editorial-policy");
  expectText(editorialPolicy, "<dl class=\"editorial-policy-summary\" aria-label=\"Solar Payback Map editorial policy summary\">", "/editorial-policy should expose a labeled policy summary.");
  expectText(editorialPolicy, "<dt>Editorial independence</dt>", "/editorial-policy summary should expose editorial independence.");
  expectText(editorialPolicy, "<dt>Source basis</dt>", "/editorial-policy summary should expose source basis.");
  expectText(editorialPolicy, "<dt>Update standard</dt>", "/editorial-policy summary should expose update standard.");
  expectText(editorialPolicy, "<dt>Reader action</dt>", "/editorial-policy summary should expose reader action.");
  expectText(editorialPolicy, "Correction request checklist", "/editorial-policy should explain correction request requirements.");
  expectText(editorialPolicy, "/contact", "/editorial-policy should link to the contact path.");
  expectText(editorialPolicy, "<ul class=\"review-process-list\" aria-label=\"Editorial review process requirements\">", "/editorial-policy review process should render as a labeled checklist.");
  expectText(editorialPolicy, "<ul class=\"correction-checklist\" aria-label=\"Editorial correction request details to include\">", "/editorial-policy correction request details should render as a labeled checklist.");
  expectText(editorialPolicy, "<nav aria-label=\"Editorial policy next steps\"><ul class=\"trust-link-list\">", "/editorial-policy next-step links should render as a labeled navigation list.");
  expectText(editorialPolicy, "/legal#advertising", "/editorial-policy should link to advertising disclosure.");

  for (const [from, to] of [
    ["/article", "/blog/how-we-estimate-solar-payback"],
    ["/state", "/solar/california"],
    ["/county", "/solar/california/san-diego-county"],
  ]) {
    const legacy = await getRedirect(from);
    expectStatus(legacy, 308, `${from} legacy redirect`);
    expectHeader(legacy, "location", to, `${from} legacy redirect`);
  }

  if (articleSlug) {
    const article = await get(`/blog/${articleSlug}`);
    expectStatus(article, 200, `/blog/${articleSlug}`);
    expectText(article, "Evidence snapshot", "article should render evidence snapshot.");
    expectText(article, "<ul class=\"evidence-links\" aria-label=\"Primary sources\">", "article evidence snapshot source links should render as a labeled list.");
    expectText(article, "rel=\"noopener noreferrer external\"", "article source links should use safe external-link attributes.");
    expectText(article, "external source", "article source links should expose descriptive external labels.");
    expectText(article, "<section class=\"source-list-section\" aria-labelledby=\"sources\">", "article full source list should render as a labeled source section.");
    expectText(article, "<ul class=\"source-list\" aria-label=\"Article sources and further reading\">", "article full source list should render as a labeled source list.");
    expectText(article, "Key takeaways", "article should render key takeaways.");
    expectText(article, "key-takeaways", "article should include key takeaways markup.");
    expectText(article, "<nav class=\"card toc\" aria-label=\"Article table of contents\"><h2>On this page</h2><ol>", "article TOC should render as a labeled ordered-list navigation.");
    expectText(article, "#key-takeaways", "article TOC should link to key takeaways.");
    expectText(article, "Recommended next action", "article should render a contextual next action panel.");
    expectText(article, "next-step-panel", "article should include contextual next-step markup.");
    expectText(article, "<nav class=\"next-actions\" aria-label=\"Article next actions\">", "article next-step CTA links should render in a labeled navigation landmark.");
    expectText(article, "<nav class=\"internal-link-list\" aria-label=\"Also review\">", "article internal links should render as a labeled navigation list.");
    expectText(article, "Related reading", "article should render related reading.");
    expectText(article, "<ol class=\"related-grid\">", "article related reading cards should render as an ordered list.");
    expectText(article, "aria-labelledby=\"related-", "article related reading cards should link labels to titles.");
    expectText(article, "aria-describedby=\"related-", "article related reading cards should link descriptions to summaries.");
    expectText(article, "<dl class=\"related-card-meta\" aria-label=", "article related reading cards should expose labeled metadata.");
    expectText(article, "<dt>Category</dt>", "article related reading cards should expose category labels.");
    expectText(article, "/authors/solarpaybackmap-editorial", "article should link to author profile.");
    expectText(article, "Published", "article should show a visible published date.");
    expectText(article, "dateTime", "article should render semantic time metadata.");
    expectText(article, "og:image", "article should include Open Graph image metadata.");
    expectText(article, `/blog/${articleSlug}/opengraph-image`, "article OG image should use the dynamic route.");
    expectText(article, "article:published_time", "article should include Open Graph published time metadata.");
    expectText(article, "article:modified_time", "article should include Open Graph modified time metadata.");
    expectText(article, "article:section", "article should include Open Graph section metadata.");
    expectText(article, "article:tag", "article should include Open Graph tag metadata.");
    expectText(article, "publishingPrinciples", "article should include editorial policy JSON-LD.");
    expectText(article, "mainEntityOfPage", "article should expose WebPage mainEntityOfPage JSON-LD.");
    expectText(article, "<caption>", "article data tables should expose visible captions.");
    expectText(article, "scope=\"row\"", "article data tables should expose scoped row headers.");
    expectText(article, "<ul class=\"editorial-review-list\" aria-label=\"Article editorial review checks\">", "article editorial review checks should render as a labeled checklist.");
  }

  if (faqArticleSlug) {
    const faqArticle = await get(`/blog/${faqArticleSlug}`);
    expectStatus(faqArticle, 200, `/blog/${faqArticleSlug}`);
    expectText(faqArticle, "\"@type\":\"FAQPage\"", "FAQ article should expose FAQPage JSON-LD.");
    expectText(faqArticle, "#faq", "FAQ article schema should use a stable FAQ @id.");
    expectText(faqArticle, "acceptedAnswer", "FAQ article schema should expose accepted answers.");
    expectText(faqArticle, "publishingPrinciples", "FAQ article schema should include editorial policy context.");
    expectText(faqArticle, "<section class=\"faq-block\" id=\"faq\"><h2>FAQ</h2><dl>", "FAQ article visible FAQ should render as a description list.");
    expectText(faqArticle, "<dt>", "FAQ article questions should render as description terms.");
    expectText(faqArticle, "<dd>", "FAQ article answers should render as description details.");
  }
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (server.exitCode !== null) {
      throw new Error(`next start exited early with code ${server.exitCode}`);
    }
    try {
      const response = await fetchWithTimeout(url, 1200);
      if (response.status < 500) return;
    } catch {
      // Retry until the server is listening.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function get(path) {
  const response = await fetchWithTimeout(`${origin}${path}`, 5000);
  return {
    path,
    status: response.status,
    headers: response.headers,
    text: await response.text(),
  };
}

async function getRedirect(path) {
  const response = await fetchWithTimeout(`${origin}${path}`, 5000, { redirect: "manual" });
  return {
    path,
    status: response.status,
    headers: response.headers,
    text: await response.text(),
  };
}

async function getJson(path) {
  const response = await get(path);
  try {
    return { ...response, data: JSON.parse(response.text) };
  } catch (error) {
    failures.push(`${path} should return valid JSON: ${error.message}`);
    return { ...response, data: {} };
  }
}

function expectStatus(response, expected, label) {
  if (response.status !== expected) {
    failures.push(`${label} expected ${expected}, received ${response.status}.`);
  }
}

function expectHeader(response, header, expectedIncludes, label) {
  const value = response.headers.get(header) || "";
  if (!value.toLowerCase().includes(expectedIncludes.toLowerCase())) {
    failures.push(`${label} header ${header} should include "${expectedIncludes}", found "${value}".`);
  }
}

function expectText(response, expectedIncludes, message) {
  if (!response.text.includes(expectedIncludes)) failures.push(message);
}

function expectNotText(response, unexpectedIncludes, message) {
  if (response.text.includes(unexpectedIncludes)) failures.push(message);
}

function expectJsonValue(response, key, expected, label) {
  if (response.data?.[key] !== expected) {
    failures.push(`${label} expected ${key}=${expected}, found ${response.data?.[key]}.`);
  }
}

function cleanEnv(env) {
  return Object.fromEntries(
    Object.entries(env).filter(([, value]) => typeof value === "string")
  );
}

async function fetchWithTimeout(url, timeoutMs, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function stopServer() {
  if (server.exitCode !== null) return;
  if (process.platform === "win32" && server.pid) {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    server.kill("SIGTERM");
  }
  await Promise.race([
    once(server, "exit"),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]);
}
