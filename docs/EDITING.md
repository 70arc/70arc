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
4. To send people to an outside address, add `url`. On the home page, that product then says "Visit product" and links to the address. Without `url`, it says "Learn more" and links to the product page. The visible words stay "Learn more". A visually hidden " about {name}" follows them, using `productsSection.learnMoreAbout`, so the link name is unique. The products index always links to the product page and uses the same hidden phrase. The product page shows "Visit product" only when `url` is set.

## Change a status

Set `status` on that product to one of the four statuses. The pill on the card, the menu, and the product page updates from that field.

## Hide a product

Set `published` to `false`. It leaves the menu, the cards, the footer, the sitemap, and the product page.

## Change other sentences

Edit the matching string in `content/site.ts`. Do not add claims that were not supplied for the company.

Nav labels live under `nav`, including `primary` and `mobile` for the navigation landmarks, and `contact` for the Contact item. The hero's second link is `hero.secondary`. The closing panel is `cta` (`title`, `products`, `contact`, `company`). These are interface labels. Do not add claims that are not already in this file.

## Change social profiles

Edit the `social` array in `content/site.ts`. Each entry has `label`, `handle`, `href`, `icon` (`linkedin`, `x`, or `instagram`), `aria` (the link name, including that it opens in a new tab), and `mark` (short text beside the icon in the footer; leave it empty when the icon is enough).

The footer icon row, the contact page, and the organization `sameAs` list all read this array. Keep four profiles unless the company actually changes them. Do not add an email address or a phone number.

## Change the location

`contact.place` is the footer location ("India"). `contact.based` is the line on the contact page ("Based in India"). `contact.countryCode` is the organization address country (`IN`). Do not add a city, street, or office.

## Contact page

The page is `/contact`. Its title, description, intro, and location labels are the `contact` object in `content/site.ts`. The header and the footer Company column use `nav.contact`. The home closing panel uses `cta.contact`.
