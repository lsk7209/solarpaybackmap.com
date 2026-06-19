import { getAdsensePublisherId } from "@/lib/adsense";

export const dynamic = "force-dynamic";

export function GET() {
  const publisherId = getAdsensePublisherId(
    process.env.ADSENSE_CLIENT || process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  );
  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : [
        "# Solar Payback Map ads.txt",
        "# Set ADSENSE_CLIENT=ca-pub-0000000000000000 before enabling AdSense revenue.",
        "# NEXT_PUBLIC_ADSENSE_CLIENT is also accepted when it is present at build time.",
        "# Invalid, placeholder, or non-numeric publisher IDs are ignored.",
        "# Auto Ads are loaded from layout when that environment variable is present.",
        "",
      ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
}
