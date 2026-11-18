# Editing the site

Site sentences live in `content/site.ts`. Product names, status, art, and links live in `content/products.ts`. Change those files, then reload the site. Listings, the product menu, product pages, the sitemap, and the footer all read from `content/products.ts`.

## Replace a stand-in product

1. Open `content/products.ts`.
2. Replace the name, slug, tagline, summary, status, and art for that entry.
3. Remove the comment above that entry.
4. Keep `published` set to `true` when the product should appear.

Use a slug with lowercase letters and hyphens. Art is `stack`, `grid`, or `exploded`. Status is `Coming soon`, `In development`, `Beta`, or `Live`.

## Add a product

1. Copy one product object in `content/products.ts`.
2. Give it a new slug and the fields above.
3. Set `published` to `true`.
4. To send people to an outside address, add `url`. The card then says "Visit product". Without `url`, the card links to the product page.

## Change a status

Set `status` on that product to one of the four statuses. The pill on the card, the menu, and the product page updates from that field.

## Hide a product

Set `published` to `false`. It leaves the menu, the cards, the footer, the sitemap, and the product page.

## Change other sentences

Edit the matching string in `content/site.ts`. Do not add claims that were not supplied for the company.
