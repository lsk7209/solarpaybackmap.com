# Deployment and Analytics Notes

## Deployment boundary

Push code to GitHub only when requested. Do not run Vercel deploy, Vercel project linking, domain/alias changes, environment variable changes, or Vercel CLI/API commands unless explicitly re-allowed for that task.

## Environment variables

Use `.env.example` as the contract:

- `NEXT_PUBLIC_SITE_URL`: production canonical origin for metadata, sitemap, and robots.
- `NEXT_PUBLIC_GA4_ID`: optional GA4 browser tag.
- `NEXT_PUBLIC_ADSENSE_CLIENT`: optional AdSense Auto Ads script client. The app does not render manual ad slots.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: optional GSC verification meta value.
- `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`: future server-side county/state precompute data source.

## Post-launch checks

After a real domain is connected:

1. Confirm canonical URLs and sitemap use the production origin.
2. Confirm `/sitemap.xml`, `/robots.txt`, and `/feed.xml` return 200 on the production domain.
3. Submit `/sitemap.xml` in GSC.
4. Match the domain to GA4 and confirm traffic collection.
5. Confirm AdSense site status and Auto Ads behavior.
6. Review Core Web Vitals field data after enough traffic is available.

## GSC sitemap auto-submit

Run this only after the production domain exists and is verified in GSC:

```powershell
$env:GSC_SITE_URL='https://example.com/'
$env:GSC_SITEMAP_URL='https://example.com/sitemap.xml'
$env:GSC_TOKEN_FILE='D:\env\gsc_token.json'
$env:GSC_CLIENT_SECRETS_FILE='D:\env\adsense_oauth_client.json'
npm run gsc:sitemap
```

The script fails if the property is not accessible in GSC. A successful verification requires `errors=0`, `warnings=0`, and `isPending=false` in the Search Console Sitemaps API response.

`/feed.xml` is available for content discovery. Submit only `/sitemap.xml` to GSC unless a future publishing workflow explicitly needs RSS submission elsewhere.
