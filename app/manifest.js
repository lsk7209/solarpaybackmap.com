import { SITE_NAME } from "@/lib/site";

export default function manifest() {
  return {
    name: "Solar Payback Map Solar Payback",
    short_name: SITE_NAME,
    description:
      "Independent residential solar payback estimates, methodology, topic hubs, and policy explainers.",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F7F3EA",
    theme_color: "#22303A",
    categories: ["business", "finance", "utilities"],
    lang: "en-US",
    dir: "ltr",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Solar payback calculator",
        short_name: "Calculator",
        description: "Run a conservative residential solar payback scenario.",
        url: "/calculator",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Solar payback rankings",
        short_name: "Rankings",
        description: "Compare state-level solar Worth-It rankings.",
        url: "/rankings",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Solar payback methodology",
        short_name: "Method",
        description: "Review the source policy and model assumptions.",
        url: "/methodology",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Solar payback journal",
        short_name: "Journal",
        description: "Read published solar payback, policy, and quote-review articles.",
        url: "/blog",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Solar payback topic hubs",
        short_name: "Topics",
        description: "Browse solar payback articles by policy, rates, incentives, finance, batteries, and roof constraints.",
        url: "/blog/category",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Solar Payback Map content manifest",
        short_name: "Manifest",
        description: "Open the crawlable index of pages, feeds, topic hubs, and published articles.",
        url: "/content-manifest",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Contact and corrections",
        short_name: "Contact",
        description: "Review correction, source-review, advertising, privacy, and methodology contact paths.",
        url: "/contact",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Solar Payback Map editorial policy",
        short_name: "Policy",
        description: "Review editorial standards, correction requirements, and advertising separation.",
        url: "/editorial-policy",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      {
        name: "Solar Payback Map legal disclosures",
        short_name: "Legal",
        description: "Open privacy, advertising, disclaimer, and data attribution disclosures.",
        url: "/legal",
        icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      },
    ],
    screenshots: [
      {
        src: "/opengraph-image",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "Solar Payback Map solar payback decision dashboard",
      },
    ],
  };
}
