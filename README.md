# solarpaybackmap.com

Independent residential solar payback and Worth-It Score site built with Next.js App Router.

## Development

```powershell
npm install
npm run dev
```

## Checks

```powershell
npm run lint
npm run build
```

`npm run lint` is a project-specific SEO and AdSense readiness audit. It checks crawl routes, bad slug fallback, manual ad slot usage, placeholder domains, mojibake, and minimum blog article requirements.

## Crawl Endpoints

- `/sitemap.xml`
- `/robots.txt`
- `/feed.xml`

## Environment

Copy `.env.example` and set `NEXT_PUBLIC_SITE_URL` before production builds. Production builds should not use placeholder or example domains.
