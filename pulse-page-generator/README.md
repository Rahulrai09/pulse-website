# Pulse Page Generator

Turns a product row in your Supabase database into a real, styled product
page — matching the exact template used on the live pulseio.in site.

This is the missing link between your **pulse-admin** panel and your
**pulse-website** static site: add a product in the admin panel, run this
script, get a ready-to-publish HTML file.

## The workflow

1. **Add the product in pulse-admin** (`/dashboard/products`) — name, slug,
   category, description, image, highlight tags, key features, and the
   specs table. This is the one place all product data lives.
2. **Run this generator** with that product's slug.
3. It writes a complete HTML file at `<category-slug>/<product-slug>/index.html`,
   filled in with real data and styled identically to every other product page.
4. **Commit and push** that file to your `pulse-website` GitHub repo.
5. If it's a brand new product (not replacing an existing one), also add an
   entry to whatever file currently drives the category listing page's
   product grid, so it shows up there too. (This generator only creates the
   individual product page — the listing-page grid is a separate, currently
   hand-maintained piece we haven't automated yet.)

## Setup

```powershell
cd pulse-page-generator
npm install
copy .env.example .env
```

Open `.env` and paste in your real Supabase **anon public key** (same one
used in pulse-admin's `.env.local`). The URL is already filled in.

## Generate a page

```powershell
node generate-product-page.js pulse-sirova
```

Replace `pulse-sirova` with the exact slug you set for that product in the
admin panel.

## Where the file gets placed

By default, this assumes the generator script sits inside (or right next to)
your `pulse-website` repo, and writes to `../<category-slug>/<product-slug>/`.

If that's not where your repo lives, open `generate-product-page.js` and
change the `OUTPUT_ROOT` line near the top to point at your actual
`pulse-website` folder path.

## What maps to what

| Admin panel field | Shows up as |
|---|---|
| Name | Page title, H1, breadcrumb |
| Slug | URL path |
| Category | Breadcrumb, eyebrow text, back link |
| Short description | Hero paragraph, meta description fallback |
| Product image | Main image + thumbnail |
| Highlight tags | The small pills under the title |
| Key features | The checkmarked feature grid |
| Specifications table | The Technical Specifications table |
| SEO Title / SEO Description | Page `<title>` and meta description, if filled in |

Related products ("You May Also Need") are picked automatically — the 3
most recent other active products in the same category.

## Limitations, honestly

- Only handles **one image** per product (matches what the admin panel
  currently supports). If you want a multi-image gallery like some pages
  have, the admin panel's Products module would need a multi-upload
  upgrade first.
- Doesn't touch the category **listing page** grid — that's still a
  separate manual step for genuinely new products.
- This is a manual, run-it-yourself script — not an automatic pipeline.
  Nothing runs on its own when you add a product in the admin panel.
