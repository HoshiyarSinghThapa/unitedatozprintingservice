# United AtoZ Printing Service — Website Package

Plain HTML/CSS/JS site, built for GitHub Pages. No build step, no dependencies to install.

## What's in this package

```
index.html      Homepage
about.html       About Us
services.html    Services (all 6 categories + FAQ schema)
products.html    Products / corporate gifts
gallery.html     Work gallery (filterable)
contact.html     Contact form + map
style.css        All styling (one file, uses CSS variables for brand colors)
script.js        Mobile nav, scroll animations, gallery filter, contact form handler
robots.txt       Search engine crawl rules
sitemap.xml      Page list for search engines
assets/          Logo, hero photo (PNG + WebP), favicon
```

## Brand colors used (from your reference design)
- Navy: `#002374`
- Pink/Magenta: `#D91474`
- Cyan: `#00A3E8`
- Yellow: `#FFD400`

These are set as CSS variables at the top of `style.css` — change them there and the whole site updates.

## Confirmed real data already wired in
- Phone: +977-9860607569 (call + WhatsApp, same number)
- Address: Bhaktapur 44600, Nepal
- Coordinates: 27.6753616, 85.3609801 (used for the embedded Google Map)
- Hours: Open 24 hours, every day
- Rating: 5.0 from 107 Google reviews
- Logo and hero product/machine photo (your uploaded files)

## Still open — search "TODO" in the files, or check this list

1. **Domain name** — canonical URLs and schema currently point to a placeholder (`unitedatozprinting.com.np`). Update every `<link rel="canonical">` and `og:url`/schema `image` field once your real domain is confirmed. Also update `sitemap.xml` and `robots.txt`.
2. **Contact form backend** — the form on `contact.html` currently just shows an alert. It needs a real handler (Formspree, Google Forms, or your own backend) to actually deliver messages to an inbox.
3. **Product & gallery photos** — `products.html` and `gallery.html` currently use icon placeholders instead of real photos. Swap these in once photography is ready.
4. **Social links** — Facebook/Instagram icons in the footer currently link to `#`. Add real profile URLs once available.
5. **Google review link** — "See all reviews on Google" button on the homepage needs the real GBP review link.
6. **About page founding details** — years in business, team size, and full founding story are placeholders pending your confirmation (marked with a TODO comment in `about.html`).
7. **OG share image** — currently reuses the hero photo for social share previews. A dedicated 1200×630 image would look better when links are shared on Facebook/WhatsApp.

## Deploying to GitHub Pages

1. Create a new GitHub repository (public, since GitHub Pages requires a paid plan for private repo Pages).
2. Push all files in this package to the repository root (or to a `/docs` folder if you prefer — just set that in step 4).
3. If you have a custom domain, add a `CNAME` file to the repo root containing just your domain, e.g. `unitedatozprinting.com.np`, and point your domain's DNS to GitHub Pages per GitHub's instructions.
4. In the repo, go to **Settings → Pages**, set the source branch (usually `main`) and folder (`/root` or `/docs`), save.
5. Your site will be live at `https://<username>.github.io/<repo-name>/` within a few minutes, or your custom domain once DNS propagates.

## Notes on SEO setup already in place
- Meta titles/descriptions on every page target the local + service keywords from the content plan (e.g. "best printing service Bhaktapur")
- LocalBusiness schema (with real coordinates, hours, rating) on the homepage
- FAQPage schema on the services page
- Every page has a unique title, description, and canonical URL
- Images use descriptive alt text carrying keyword weight where natural
- Semantic heading structure (one H1 per page, logical H2s)
