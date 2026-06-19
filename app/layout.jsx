import Script from "next/script";
import { Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { getAdsenseClientId } from "@/lib/adsense";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

const siteUrl = getSiteUrl();
const defaultOgImage = `${siteUrl}/opengraph-image`;
const defaultGaId = "G-85ET570CDB";
const clarityProjectId = "x97livixnl";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: {
    default: "Solar Payback Map - Where solar actually pays off",
    template: "%s | Solar Payback Map",
  },
  description:
    "Independent residential solar payback estimates, Worth-It Scores, methodology, and plain-English policy explainers built from public U.S. data.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/",
    },
    types: {
      "application/rss+xml": "/feed.xml",
      "application/feed+json": "/feed.json",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: "Solar Payback Map - Where solar actually pays off",
    description:
      "Conservative residential solar payback estimates and transparent assumptions. No lead sales.",
    url: siteUrl,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Solar Payback Map solar payback estimates",
      },
    ],
  },
  other: {
    "application-name": SITE_NAME,
    "naver-site-verification": "fd8c0ea6456d84d5c96284a89003345471a0e4c0",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Payback Map - Where solar actually pays off",
    description:
      "Conservative residential solar payback estimates and transparent assumptions. No lead sales.",
    images: [defaultOgImage],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "xrbht1_9aGwU5JL82OPgqGKclRploKGySADJJWoL5Bc",
  },
};

export const viewport = {
  themeColor: "#22303A",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID || defaultGaId;
  const adsenseClient = getAdsenseClientId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);

  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${publicSans.variable}`}>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
            </Script>
          </>
        ) : null}
        {clarityProjectId ? (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityProjectId}");`}
          </Script>
        ) : null}
        {adsenseClient ? (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          />
        ) : null}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                name: SITE_NAME,
                url: siteUrl,
                logo: `${siteUrl}/icon.svg`,
                publishingPrinciples: `${siteUrl}/editorial-policy`,
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "editorial corrections and policy questions",
                  url: `${siteUrl}/contact`,
                  areaServed: "US",
                  availableLanguage: "en-US",
                },
                sameAs: [
                  "https://pvwatts.nrel.gov/",
                  "https://www.eia.gov/electricity/",
                  "https://emp.lbl.gov/tracking-the-sun",
                  "https://www.dsireusa.org/",
                ],
              },
              {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                name: SITE_NAME,
                url: siteUrl,
                publisher: { "@id": `${siteUrl}/#organization` },
                inLanguage: "en-US",
                isAccessibleForFree: true,
                hasPart: [
                  { "@type": "AboutPage", name: "About Solar Payback Map", url: `${siteUrl}/about` },
                  { "@type": "WebPage", name: "Solar payback journal", url: `${siteUrl}/blog` },
                  { "@type": "WebPage", name: "Solar payback topic hubs", url: `${siteUrl}/blog/category` },
                  { "@type": "WebPage", name: "Solar payback methodology", url: `${siteUrl}/methodology` },
                  { "@type": "WebPage", name: "Solar payback calculator", url: `${siteUrl}/calculator` },
                  { "@type": "WebPage", name: "Solar Worth-It rankings", url: `${siteUrl}/rankings` },
                  { "@type": "WebPage", name: "Solar Payback Map editorial policy", url: `${siteUrl}/editorial-policy` },
                  { "@type": "ProfilePage", name: "Solar Payback Map Editorial author profile", url: `${siteUrl}/authors/solarpaybackmap-editorial` },
                  { "@type": "ContactPage", name: "Solar Payback Map contact and corrections", url: `${siteUrl}/contact` },
                  { "@type": "WebPage", name: "Solar Payback Map legal, privacy, advertising, disclaimer, and attribution", url: `${siteUrl}/legal` },
                  { "@type": "CollectionPage", name: "Solar Payback Map content manifest", url: `${siteUrl}/content-manifest` },
                ],
              },
              {
                "@type": "SiteNavigationElement",
                "@id": `${siteUrl}/#primary-navigation`,
                name: "Solar Payback Map primary navigation",
                hasPart: [
                  { "@type": "WebPage", name: "Solar Worth-It rankings", url: `${siteUrl}/rankings` },
                  { "@type": "WebPage", name: "Worth-It Score explanation", url: `${siteUrl}/#score` },
                  { "@type": "Blog", name: "Solar payback journal", url: `${siteUrl}/blog` },
                  { "@type": "TechArticle", name: "Solar payback methodology", url: `${siteUrl}/methodology` },
                  { "@type": "WebApplication", name: "Solar payback calculator", url: `${siteUrl}/calculator` },
                ],
              },
              {
                "@type": "DataFeed",
                "@id": `${siteUrl}/feed.xml#feed`,
                name: `${SITE_NAME} Journal RSS Feed`,
                url: `${siteUrl}/feed.xml`,
                encodingFormat: "application/rss+xml",
                publisher: { "@id": `${siteUrl}/#organization` },
              },
              {
                "@type": "DataFeed",
                "@id": `${siteUrl}/feed.json#feed`,
                name: `${SITE_NAME} Journal JSON Feed`,
                url: `${siteUrl}/feed.json`,
                encodingFormat: "application/feed+json",
                publisher: { "@id": `${siteUrl}/#organization` },
              },
            ],
          }}
        />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main className="site-main" id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
