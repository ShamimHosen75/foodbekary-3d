# foodbekary-3d

E-commerce bakery storefront (Vite + React + TypeScript + Tailwind v4) modelled on the structure,
UX and motion of a reference site, with our own brand and content.

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build |
| `npm run lint` / `npm run typecheck` / `npm test` | Quality gates |
| `npm run qa:screens -- http://localhost:4173 / /menu/cakes` | Browser QA at 360/768/1024/1440 (needs `npm run preview`) |
| `npm run qa:home` | Browser tests for the home page: scroll hero, cards, reviews, reduced motion, CLS |
| `npm run qa:products` | Browser tests for catalogue: filters, search, Quick View, stock, favourites, 404 |
| `npm run qa:checkout` | Browser tests for cart, checkout validation, double-submit, WhatsApp, receipts |
| `npm run art` | Re-render the placeholder artwork in `src/assets` |
| `npm run qa:shell` | Browser tests for header, menu, routing, cart badge, 404, CLS (needs `npm run preview`) |

## Where things live
- Brand/contact placeholders: `src/data/site.ts`
- Products (one file per category): `src/data/products/*.ts`; filter chips: `src/data/collections.ts`
- Product images: `src/assets/products/<slug>-<n>-640.webp` (picked up automatically)
- Design tokens (colours, fonts, radii, shadows): `src/index.css` (`@theme`)
- UI primitives: `src/components/ui`

## Status
- **Phase 0 — Reference analysis:** done → [`REFERENCE_ANALYSIS.md`](REFERENCE_ANALYSIS.md)
- **Phase 1 — Setup & design system:** done (style guide at `/design`)
- **Phase 2 — Layout shell:** done (header ×2 variants, menu/cart drawers, footer, routes, 404)
- **Phase 3 — Home page:** done (scroll-driven 3-scene hero, category cards, testimonials)
- **Phase 4 — Products:** done (26 products, filters + search in the URL, Quick View, product pages, favourites, menu search)
- **Phase 5 — Cart & checkout:** done (cart drawer, checkout with BD phone validation, Cash on Delivery, WhatsApp orders, receipts)
- Phase 6 — Animations & polish: next

## Orders
There is no backend yet: orders are saved on the customer's device ("My orders") and can be sent to
the shop on WhatsApp (`site.contact.whatsapp`). Delivery fees live in `site.delivery`
(placeholders: ৳60 inside Dhaka, ৳120 outside). To receive every order automatically, connect a
backend (e.g. Supabase or a Netlify Function) in `src/pages/CheckoutPage.tsx` → `place()`.

## Swapping in real hero footage
Placeholder scenes live in `src/assets/hero`. For real scroll-scrubbed footage, put an MP4
in `public/` (encode with short keyframe intervals: `ffmpeg -i in.mp4 -c:v libx264 -g 6 -crf 24 -an public/hero.mp4`)
and set `heroVideo = { src: '/hero.mp4' }` in `src/data/heroScenes.ts`.

## Routes
| Path | Page |
|---|---|
| `/` | Home |
| `/menu/:category` | Category page (`cakes`, `cookies`, `macarons`, `pastries`; anything else → 404). Query: `?f=<filter>&q=<search>` |
| `/product/:slug` | Product page (unknown slug → 404) |
| `/checkout` | Checkout (empty basket → empty state) |
| `/order/:id` | Order confirmation / receipt |
| `/design` | Design-system style guide (internal) |
| `*` | 404 |
