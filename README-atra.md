# Atra × Dawn 16 — theme notes

Atra's storefront is **Dawn 16.0.0 plus an overlay of `atra-*` files**. Dawn stays
upgradeable: pull a new Dawn, re-apply the three small deltas listed below, done.

## What is Atra-specific

### New files (safe on any Dawn upgrade)

| File | Purpose |
|---|---|
| `assets/atra.css` | The whole visual identity: type, zero radius/shadow, buttons, header, mega menu, cards, facets, PDP, cart, newsletter band, footer, every `atra-*` section |
| `assets/atra-store-stock.js` | Re-renders the in-store stock box on variant change |
| `assets/atra-recently-viewed.js` | "Të shikuara së fundi" (localStorage + Section Rendering API) |
| `sections/atra-countdown.liquid` | Sale countdown band |
| `sections/atra-category-grid.liquid` | "Blej sipas kategorisë" tiles with product counts |
| `sections/atra-brand-shops.liquid` | attrattivo / ONLY / DESIREE cards |
| `sections/atra-shop-the-look.liquid` | Editorial image + shoppable list |
| `sections/atra-services.liquid` | Numbered dark services band |
| `sections/atra-instagram.liquid` | Square image grid |
| `sections/atra-collection-header.liquid` | Breadcrumbs + title + sub-category chips (replaces Dawn's collection banner) |
| `sections/atra-store-locator.liquid` | Tiranë / Fier / Vlorë cards |
| `sections/atra-columns.liquid` | Rule-topped text columns (About, size-guide notes) |
| `sections/atra-size-guide.liquid` | Size table |
| `sections/atra-faq.liquid` | Shipping rates aside + FAQ accordion |
| `sections/atra-contact.liquid` | Contact page (info + form) |
| `sections/atra-recently-viewed.liquid` | Recently viewed strip (product template) |
| `sections/atra-whatsapp.liquid` | Floating WhatsApp button (footer group) |
| `sections/atra-store-stock.liquid` | *Internal* — fetched by JS, not placeable |
| `sections/atra-product-card.liquid` | *Internal* — fetched by JS, not placeable |
| `snippets/atra-pdp-extras.liquid` | Size-guide link, reserve-in-store form, WhatsApp button |
| `snippets/atra-store-stock.liquid` + `atra-store-stock-list.liquid` | "Gjendja në dyqane" box |
| `snippets/atra-pdp-description.liquid` | Description as an accordion row |
| `snippets/atra-collection-subnav.liquid` | Image chips for the category tree |
| `snippets/atra-breadcrumbs.liquid` | Breadcrumbs from the main menu |
| `snippets/atra-mega-card.liquid` | Promo card inside the mega menu |
| `locales/sq.json` | Albanian storefront strings |
| `templates/page.about.json`, `page.contact.json`, `page.stores.json`, `page.size-guide.json`, `page.shipping.json` | Page templates |

### Dawn files that differ from upstream (re-apply after an upgrade)

| File | Delta |
|---|---|
| `layout/theme.liquid` | One line after `base.css`: `{{ 'atra.css' \| asset_url \| stylesheet_tag }}{% comment %}ATRA{% endcomment %}` |
| `snippets/header-mega-menu.liquid` | (1) `<ul class="mega-menu__list">` wrapped in `<div class="page-width atra-mega__grid">` (the `page-width` class moves to the wrapper); (2) `.atra-mega__cards` block after the list. Header comment in the file documents it. |
| `config/settings_schema.json` | "Atra" settings group appended at the end |
| `locales/en.default.json` | `atra` object appended at the end |

Everything else that changed is content, not code: `config/settings_data.json`,
`sections/header-group.json`, `sections/footer-group.json`, `templates/*.json`.

`git diff <baseline-commit> --stat` shows the full list.

## Upgrading Dawn

```bash
git remote add upstream https://github.com/Shopify/dawn.git
git fetch upstream --tags
git merge v16.1.0      # or whichever tag
```
Conflicts can only appear in the four files above. Resolve by keeping the Atra
line/block, then push. Shopify syncs the commit to the connected theme.

## Install

1. Push to GitHub (branch `atra`).
2. Shopify admin → Online Store → Themes → **Add theme → Connect from GitHub** → pick the repo/branch.
   The theme appears **unpublished**. Preview it, fill content, then publish.
   Do **not** push these files over the live, editor-customised theme:
   `settings_data.json` and the JSON templates only apply cleanly to a fresh theme.

   CLI alternative (Node is required):
   ```bash
   npm i -g @shopify/cli@latest
   shopify theme check
   shopify theme push --unpublished --store <store>.myshopify.com
   ```

## Admin checklist (content the code can't create)

1. **Typography** — Theme settings → Typography: headings *Cormorant* 300, body *Jost* 300 are preselected
   (the design uses Cormorant Garamond, which is not in Shopify's font library; Cormorant is the same family).
   To use Cormorant Garamond exactly, upload woff2 files to `assets/` and add `@font-face` + set `--atra-display` in `atra.css`.
2. **Theme settings → Atra** — WhatsApp number, default message, floating button, size-guide page, reserve-in-store on/off, store names.
3. **Menus** (Online Store → Navigation)
   - `main-menu` — already exists. For grouped columns in the mega menu (Sipër / Poshtë / Fustane) make Veshje three levels deep; a flat list renders as three columns automatically.
   - `mega-veshje`, `mega-kepuce`, `mega-aksesor`, `mega-brand` *(optional)* — up to two collection links each; their featured images become the promo cards. Without these menus the cards come from the first child collections that have an image.
   - `footer-blej`, `footer-ndihme`, `footer-atra` — the three footer columns.
4. **Collection images** — set a featured image on every collection in the menu (mega cards, category grid, sub-category chips).
5. **Pages** — create and assign the template suffix:
   | Page | Handle | Template |
   |---|---|---|
   | Rreth nesh | `rreth-nesh` | `page.about` |
   | Dyqanet tona | `dyqanet-tona` | `page.stores` |
   | Kontakt | `contact` (exists) | `page.contact` |
   | Tabela e përmasave | `tabela-e-permasave` | `page.size-guide` |
   | Dërgesa & kthimi | `dergesa-kthimi` | `page.shipping` |
   Section content (rates, FAQ, table rows, store addresses) is prefilled and editable in the theme editor.
6. **Local pickup** — Settings → Shipping and delivery → Local pickup, enabled for Tiranë, Fier, Vlorë.
   This drives the "Gjendja në dyqane" box (per-store stock, per-size) and the reserve-in-store store list.
7. **Home page** — hero image, shop-the-look image + 3 products, brand images (or collection images), Instagram images, countdown deadline.
8. **Languages / money** — Settings → Languages: Albanian as default (strings come from `locales/sq.json`);
   Settings → Store details → currency format `{{amount_no_decimals}} Lek`.

## How the custom pieces work

- **In-store stock** reads `variant.store_availabilities` (real inventory per location) — no app, no metafields.
  It lists sizes in stock per store by matching sibling variants with the same colour. Re-rendered on variant change via `/variants/:id?section_id=atra-store-stock`.
- **Reserve in store** is a Shopify contact form (emails the store with product, variant, store, name, phone). A true hold needs an app or draft orders.
- **WhatsApp** links use `wa.me` with a prefilled message; on product pages the message includes the product title and URL.
- **Recently viewed** stores handles in `localStorage` and renders Dawn product cards through `/products/:handle?section_id=atra-product-card`.
- **Mega menu promo cards** come from `mega-<handle>` menus, then the top-level collection, then child collections with images.
