# Reference Analysis — zohasbakery.netlify.app

> **Phase 0 deliverable.** Source of truth: the owner's 32-second desktop screen recording
> (1280×720) plus one Quick View close-up screenshot. The live site could not be opened from
> the build environment (network policy blocks the host), so **anything not visible in the
> recording is marked _Unknown_** in §10 rather than guessed.
>
> Key frames are saved in [`docs/reference/`](docs/reference/) and referenced below as `[01]`, `[02]`…

---

## 1. Pages & routes

| # | Page | How it is reached | Evidence |
|---|------|------------------|----------|
| 1 | **Home** | `/` | [01]–[08] |
| 2 | **Category page — Cakes** | "Explore Cakes →" on a home category card | [09]–[15] |
| 3 | **Category page — Cookies** | Header tab "Cookies" | [16] |
| 4 | **Category page — Macarons** | Header tab "Macarons" | [17] |
| 5 | **Category page — Pastries** | Header tab "Pastries" | [18] |

The four category pages share **one template** (eyebrow, title, intro, filter chips, search, grid).
Exact URLs weren't visible in the recording. Plan: `/menu/:category` (e.g. `/menu/cakes`).

No standalone product-detail page appeared. Product detail is a **Quick View modal** opened from the grid.
No checkout page appeared either (see §10).

Overlays, available on every page:

- Cart drawer ("Your Order")
- Toast notifications
- Quick View modal
- Search: icon in the header, plus "Search Menu (Ctrl+K)" in the footer, so a command-palette style search exists
- Saved Favourites: heart icon
- Orders / "Order Receipts & Status": box icon

---

## 2. Global elements

### 2.1 Header — two variants

**Home variant** [01]
- Full-width bar, about 56px tall.
- Background is translucent cream with a backdrop blur and a hairline bottom border.
- **Left:** wordmark "Zoha's" in a serif face, with the `'s` in terracotta. Next to it is a small pill badge: "● Open" with a green dot. This is a live open/closed status, probably based on opening hours (8 AM–10 PM).
- **Right:** three 32px circular icon buttons (search 🔍, favourites ❤️, orders 📦), then a dark pill "🛒 Cart" with a terracotta count badge, then an outline pill "Menu".
- It stays fixed (sticky) over the hero and the rest of the page.

**Category-page variant** [10]
- Content is constrained to roughly 800px and centred.
- **Centre:** a segmented pill tab group: Cakes · Cookies · Macarons · Pastries. The active tab is filled dark brown with white text.
- The "Menu" button is not shown; the tabs replace it.
- Icons and cart sit on the right, the same as the home variant.

### 2.2 Footer [08]
- Dark forest-green background (`#2E3932`), with a 4-column grid inside a container of about 750px.

1. **Brand column:** "Zoha's Bakery" (serif, `'s` terracotta) and a 2-line blurb. Below that, an "● Open Daily: 8:00 AM – 10:00 PM" pill, then social pills: Instagram, Facebook, WhatsApp.
2. **Explore Menu:** emoji-prefixed links: Specialty Cakes, Warm Gourmet Cookies, Artisan French Macarons, French Pastries, The Counter Menu.
3. **Customer Care:**
   - Search Menu (Ctrl+K)
   - View Shopping Cart
   - Saved Favorites
   - Order Receipts & Status

   These open the overlays rather than going to new pages.
4. **"Fresh Batch Club 🥐" newsletter:** a short pitch, an email input and a gold "Subscribe" pill. Under it, "Accepted Payments:" badges for "💵 Cash on Delivery" and "💳 Card / EasyPaisa".

- **Bottom bar:** a hairline divider, then "© … Zoha's Bakery. All rights reserved." on the left. On the right, "📍 address • 📞 phone".

### 2.3 Toast [15]
- Dark pill at the bottom-right: `🛒 "<Product>" added to your cart!`
- It appears when an item is added and auto-dismisses. It is still visible about 1.5 seconds later [27].

---

## 3. Home page — sections in order

### 3.1 Scroll-driven cinematic hero ("three scenes") [01]–[04]

This is the signature feature of the site.

**Layout**
- A **pinned (sticky) full-viewport stage**, about 4–5 viewport heights of scroll in total.
- The background is a full-bleed **camera move that is scrubbed by scroll**. The camera dollies from the street storefront, through the door, past the display counter [02], into the bakehouse kitchen with steam coming off the ovens [03], and finally out to a terrace table with coffee and a croissant [04].
- It plays as one continuous moving shot, not as separate slides. That means it's either a **scroll-scrubbed video** or an **image sequence drawn to a `<canvas>`**, not real-time 3D (see §9).
- The left ~35% of the frame has a **cream gradient wash** (cream → transparent), so the text stays legible over the footage.

**Left text block**, bottom-left and about 40% of the width:
- Mono counter `01 / 03`
- Uppercase letter-spaced eyebrow: gold in scene 1, terracotta in scenes 2–3
- Large bold sans headline over two lines, about 40px on desktop
- A 3-line paragraph
- Three outline chips

The text copy changes per scene:

| Scene | Right-rail label | Eyebrow | Headline | Chips |
|---|---|---|---|---|
| 01 | The Counter | FRESH OUT OF THE OVEN | "Three things done right." | Sponge & Cream · Nutella & Choco · Almond Shells |
| 02 | The Bakehouse | BEHIND THE GLASS | "Real butter, zero shortcuts." | 72hr Ferment · French Butter · Artisan Technique |
| 03 | The Terrace | F-7 MARKAZ, ISLAMABAD | "Morning sun, warm crusts." | Outdoor Seating · Pour-over · Daily 8am–10pm |

- Scene 03 also adds two CTAs: a dark pill **"Explore Category Menu"** and an outline pill **"Order Ahead"**.

**Right rail:** a vertical dot/progress indicator at the right edge. The active scene shows a white pill label ("The Counter" etc.), and the active dot turns terracotta.

**Text transitions:** the outgoing text fades and blurs/ghosts out [02], then the incoming text fades and slides up. These are tied to scroll position.

**End of hero:** the footage fades into the cream page background, leaving a tall empty cream gap before the next section [05].

### 3.2 "The Counter" — category cards [05]–[06]

**Heading block (centred)**
- Terracotta eyebrow: "THE COUNTER"
- Large serif title over two lines: "Four things we make properly."
- One-sentence intro in muted brown

**Card grid**
- 3 columns at desktop, each card about 235px wide inside a container of about 750px. Four cards, so the fourth wraps alone onto row 2, left-aligned.

**Each card**
- Top image, about 140px tall, with a dark pill badge "8 PRODUCTS" at the top-right.
- White body with a serif title, a 3-line description and a hairline divider.
- Footer row: "From Rs 1,800" in bold on the left, a terracotta pill "Explore Cakes →" on the right.

**Card hover** [06]
- The card lifts a few pixels and gets a softer, larger shadow.
- The border turns terracotta-tinted.
- The title turns terracotta.
- The CTA changes from terracotta to dark brown.

**Entrance:** the cards fade and slide up as they enter the viewport.

### 3.3 "Customer Love" — testimonials [07]
- Slightly lighter cream band (`#F7F2ED`) with a hairline top border.
- Centred eyebrow "CUSTOMER LOVE", serif title "What people are saying about Zoha's.", and a one-line intro.
- Three white cards in a row. Each has:
  - 5 gold stars
  - An italic quote
  - A hairline divider
  - A footer with the name in bold serif, the area/city in small muted text, and a terracotta-tinted pill naming the product they bought
- It's a static grid: no carousel was observed.

### 3.4 Footer (§2.2)

---

## 4. Category page template [09]–[18]

**Header:** the category-page variant (§2.1). The active tab matches the current category.

**Heading block (centred)**

| Category | Eyebrow | Title |
|---|---|---|
| Cakes | BAKED FRESH DAILY | Our Specialty Cakes |
| Cookies | WARM FROM THE OVEN | Gourmet Cookies |
| Macarons | FRENCH DELICATE PASTRIES | Artisan Macarons |
| Pastries | FRESH CREAM SLICES & PASTRIES | Artisan Pastries |

Each heading block also has a 2-line intro.

**Filter chips:** a single-select row of pills. The first chip is "All <Category> (n)"; the others are emoji-prefixed sub-collections. The active chip is filled dark; the others are white with a hairline border.

| Category | Chips |
|---|---|
| Cakes | All Cakes (8) · ⭐ Bestsellers · 🍫 Dark Chocolate & Fudge · 🍓 Fresh Berries & Cream |
| Cookies | All Cookies (6) · ⭐ Bestsellers · 🍫 Nutella & Stuffed · 🎁 Assorted Boxes |
| Macarons | All Macarons (6) · ⭐ Chef Specialties · 🎁 Gift Boxes & Sets · 🌸 Individual Shells |
| Pastries | All Pastries (6) · ⭐ Bestsellers · 🍫 Chocolate Fudge · ❤️ Red Velvet · 🍍 Fresh Pineapple |

- A product can belong to several chips. For example, "Rich Chocolate Fudge Drip Cake" appears under both Bestsellers and Dark Chocolate [12].

**Search input:** a pill-shaped field with a 🔍 icon and category-specific placeholder text, e.g. "Search cakes by name or ingredient…". It filters live within the category.

**Product grid**
- 3 columns at desktop.
- **When filtered to 2 results, the grid switches to 2 wider columns that span the full container** [12], instead of leaving an empty third column.

**Product card**
- Image about 140px tall.
- Top-right: a dark badge (BESTSELLER / FRESH DAILY / POPULAR / CHEF SPECIAL / TRENDING / CLASSIC / PLATTER / GIFT SET / ZESTY), overlapped by a circular **heart (favourite) toggle**.
- Serif title over 2 lines, then a 3-line description and a hairline divider.
- Price ("Rs 3,500") in bold, then a terracotta pill **"Add to Cart"**.

**Card hover** [11]
- The card lifts and its border turns terracotta-tinted.
- The image darkens with an overlay, and a centred white pill **"🔍 Quick View"** fades in.

**Grid entrance** [09]
- The grid is empty for a moment, then the cards fade and slide up in a **stagger**.
- The same reveal replays whenever the filter changes [12]: the chip change re-animates the grid.
- While images load, the image area shows a cream placeholder [10].

**Product counts:** Cakes has 8 products; Cookies, Macarons and Pastries have 6 each, so 26 products in total.

**Price ranges**

| Category | Range |
|---|---|
| Cakes | Rs 2,100 – 3,500 ("From Rs 1,800" on the home card) |
| Cookies | from Rs 250 (a platter costs Rs 1,400) |
| Macarons | from Rs 220 (a collection costs Rs 2,400) |
| Pastries | Rs 350 – 420 |

---

## 5. Quick View modal [13], [14], [19]

**Overlay:** dimmed and blurred backdrop. A cream rounded card (about 24px radius, thin light border) is centred in the top half of the viewport.

**Left side (about 45%)**
- Square product image with a rounded 16px radius.
- Top-left: a terracotta badge ("Bestseller", "Fresh Daily").
- Top-right: a circular heart toggle.

**Right side**
- Terracotta eyebrow "BAKERY SPECIALTY"
- Serif title (2 lines) and bold price "Rs 2,400"
- Description
- **"Key Ingredients & Features"** label, then white chips each prefixed with ✨ (e.g. "Fresh Wild Berries", "Madagascar Vanilla Bean")
- Grey "feature" chips: "🌿 100% Fresh Daily", "🧈 French Butter", "🚫 Zero Preservatives"
- **Quantity stepper:** a pill containing `-  1  +`
- Large dark pill button **"🛒 Add 1 to Cart • Rs 2,400"**. The label and total **update live with the quantity**: "Add 2 to Cart • Rs 7,000", then "Add 3 to Cart • Rs 10,500" [14].
- On hover, the button turns terracotta [14].

**Close:** a circular ✕ button at the top-right. Clicking the backdrop or pressing Esc also closes it (assumed, standard behaviour; see §10).

**Adding to cart:** this closes the modal, **opens the cart drawer**, and shows the toast [15].

---

## 6. Cart drawer — "Your Order" [15]

**Panel:** slides in from the right. It's about 280px wide at 1280px viewport width, full height, on a white body with a cream header. The backdrop is dimmed and blurred.

**Header:** serif "Your Order" and a ✕ close button.

**Each line item**
- 40px thumbnail
- Serif product name
- Unit price "Rs 3,500"
- Small round `-` qty `+` stepper
- A red ✕ remove button on the right

**Footer, pinned to the bottom**
- "Subtotal:" … "Rs 10,750", in bold
- A terracotta full-width pill button below it, mostly hidden by the toast in the recording. It's almost certainly "Checkout" / "Place Order"; the label is unknown.

**Maths checked from the video:** 1 × Rs 250 + 3 × Rs 3,500 = **Rs 10,750** ✔. The header badge went from 1 to **4**, so the badge counts **total quantity**, not distinct lines.

**Persistence:** the cart survives navigation between home and the category pages. Whether it survives a page refresh is not shown, but we will persist it to localStorage either way.

---

## 7. Interactions & motion inventory

| # | Interaction | Where | Behaviour (observed) |
|---|---|---|---|
| M1 | Scroll-scrubbed camera move | Hero | Background video/sequence progress = scroll progress across pinned section |
| M2 | Scene text swap | Hero | Fade + blur/slide out, fade + slide up in, per scene threshold |
| M3 | Scene progress rail | Hero right edge | Active dot terracotta + label pill follows scene |
| M4 | Hero → page fade | End of hero | Footage dissolves into cream bg |
| M5 | Sticky translucent header | All | Fixed, blurred cream background |
| M6 | Reveal on scroll | Section headings, category cards, testimonials | Fade + translateY up |
| M7 | Card hover lift | Category + product cards | translateY(-4px), shadow grows, terracotta border, title → terracotta, CTA colour swap |
| M8 | Quick View hover | Product card image | Dark overlay + centred "Quick View" pill fades in |
| M9 | Staggered grid reveal | Category grid, on load **and on filter change** | Cards fade/slide in one after another |
| M10 | Grid reflow | Category grid | 3 cols → 2 wide cols when ≤2 results |
| M11 | Modal open/close | Quick View | Backdrop blur fade + card scale/fade |
| M12 | Live button label | Quick View | "Add N to Cart • Rs total" |
| M13 | Drawer slide | Cart | Slides in from right, backdrop dims |
| M14 | Toast | Bottom-right | Slide/fade in, auto-dismiss |
| M15 | Button hover colour swaps | All pills | terracotta ↔ dark brown |
| M16 | Image placeholder | Cards | Cream block while image loads |
| M17 | Chip active state | Filters / header tabs | Dark fill transition |

**Not seen:** a custom cursor, a page-transition curtain, a preloader, or real-time 3D. These may exist in parts of the site the recording didn't cover.

---

## 8. Visual system

### 8.1 Colour roles (sampled from frames)

| Role | Hex | Used for |
|---|---|---|
| Page background (cream) | `#F2EEE4` | Body, category pages |
| Alt section background | `#F7F2ED` | Testimonials band |
| Surface | `#FFFFFF` / `#FCFCFC` | Cards, chips, inputs, drawer |
| Modal surface | `#F3EEE4` | Quick View card, drawer header |
| Ink (primary text, dark buttons) | `#2C231A` – `#312620` | Headings, active chips, dark CTAs, cart pill |
| Muted text | ~`#6B5E54` | Body copy, descriptions |
| **Accent — terracotta** | `#E08D6E` | Eyebrows, primary CTAs, badges, cart count, hover title |
| Accent tint | ~`#FBE6DD` | Product pills in testimonials, soft badges |
| Gold | `#BB9F61` | Subscribe button, stars, hero eyebrow scene 1 |
| Footer (forest green) | `#2E3932` | Footer background |
| Success green | `#3C723D` | "Open" status dot |
| Danger | ~`#E0565B` | Cart remove ✕ |

### 8.2 Typography

**Display serif:** a soft, high-contrast bold serif, used for section titles, card titles, the wordmark, "Your Order" and the modal title.
- Closest Google Fonts: **Fraunces** (600–700), or alternatively **Young Serif / DM Serif Display**.
- Section title about 32–36px; card title about 16–18px.

**Hero headline:** a bold geometric/humanist **sans** at about 40px, line-height about 1.1. It's distinct from the serif.
- Closest match: **Lato / Nunito Sans 800**; we'll use **Inter Tight 700** or similar.

**UI / body sans:** **Inter**-like, 13–15px for body text and 12px for small text.

**Eyebrows:** 10–11px, uppercase, wide letter-spacing (about 0.18em), semi-bold.

**Hero counter:** a monospace face, 10px (`01 / 03`).

### 8.3 Shape, depth and icons

**Radius**
- Pills are fully rounded: buttons, chips, badges, tabs, search, status.
- Cards are about 14–16px; the modal is about 24px; modal images about 16px.

**Shadows:** very soft and low-contrast at rest (`0 1px 2px` plus a hairline border). On hover they get larger and warmer (`0 12px 30px -12px rgba(44,35,26,.25)`).

**Borders:** 1px hairlines in a warm grey-beige (`#ECE6DC`). On hover they turn terracotta.

**Icons:** colour **emoji** throughout (🔍 ❤️ 📦 🛒 ⭐ 🍫 🎁 ✨ 🌿 🧈 🚫 📍 📞). There's no icon font, apart from the ✕ close glyphs.

**Container widths**
- About 750–780px for content grids and the footer, which is quite narrow and "boutique".
- About 1240px for the home header.

**Spacing:** generous vertical section padding (about 96–120px), card gaps of about 24px, and a centred heading stack with about 12px between its elements.

---

## 9. Detected technology

| Item | Finding | Confidence |
|---|---|---|
| Hosting | Netlify (`*.netlify.app`) | Certain |
| Framework | **React** — footer reads "Crafted with React & AI"; SPA behaviour (header swaps without full reload feel) | High |
| Styling | Utility-class look (Tailwind-like radii/spacing scale) | Medium — DevTools not available |
| Animation | Scroll-linked + staggered reveals → consistent with **Framer Motion** (`useScroll`/`whileInView`) or **GSAP ScrollTrigger** | Medium |
| Hero | Scroll-scrubbed **video or frame sequence** (motion blur/steam = pre-rendered footage, likely AI-generated) — **not Three.js** | High |
| Images | Mix of stock photos (Shutterstock watermarks visible) | Certain |
| Backend | No evidence of accounts; "Order Receipts & Status" suggests orders stored at least locally | Low |

---

## 10. Things I could NOT determine (need input or a 2nd recording)

1. The **checkout / order flow** after the drawer's bottom button: the form fields, Cash on Delivery vs card, whether orders go to WhatsApp, and the confirmation screen.
2. What happens on the **"Menu"** button (home header): a full-screen overlay menu? a dropdown?
3. The **Search (Ctrl+K)** overlay UI and how it behaves.
4. The **Favourites** panel and the **Orders / "Order Receipts & Status"** panel.
5. Where **"Order Ahead"** and **"Explore Category Menu"** go.
6. **Mobile layout (360 / 768px):** the hero text placement, the mobile header, the grid column counts, and the drawer width. Nothing below 1280px was recorded.
7. The exact **URLs/routes**, **page-transition** effects, and any **preloader**.
8. **Fonts**, **library versions** and the hero asset format. All of these need DevTools on the live site.
9. Whether the cart **persists after a refresh**.
10. The behaviour of the newsletter form.

My default for each gap is in §12. Tell me if you want something different.

---

## 11. Component plan

```
src/
  components/
    ui/            Button (dark | accent | outline | ghost, pill), IconButton, Chip, Badge,
                   Container, SectionHeading (eyebrow/title/intro), Card, QuantityStepper,
                   PriceTag, StatusPill, Toast, Modal, Drawer, Skeleton, Stars
    layout/        Header (variant: home | category), CategoryTabs, Footer, SkipLink
    product/       ProductCard, ProductGrid (stagger + 2-col reflow), FilterChips,
                   CategorySearch, FavoriteButton, QuickViewModal, IngredientChips
    cart/          CartDrawer, CartLine, CartSummary, CartButton (live count)
    overlays/      SearchPalette (Ctrl+K), FavoritesPanel, OrdersPanel, MenuOverlay
    checkout/      CheckoutForm, OrderSummary, OrderConfirmation (Phase 5)
  sections/
    home/          ScrollHero (pinned stage + scrubbed media + SceneCopy + SceneRail),
                   CategoryShowcase, Testimonials
    category/      CategoryHero
  pages/           HomePage, CategoryPage, CheckoutPage, OrderConfirmationPage, NotFoundPage
  store/           cartStore, favoritesStore, uiStore (drawer/modal/search/toast), ordersStore — Zustand + persist
  data/            categories.ts, products.ts (26 typed sample products), testimonials.ts, site.ts (brand/contact)
  hooks/           useScrollScene, useReducedMotion, useHotkey, useOpenStatus, useLockBodyScroll
  lib/             formatPrice (৳), cn, whatsapp (order message builder), validation (BD phone)
```

---

## 12. Proposed adaptation for our brand (needs your confirmation)

- **Stack:** the requested stack fits well: Vite + React + TypeScript + Tailwind + React Router + Framer Motion + Zustand, with **no Three.js** (the reference has no real-time 3D), **no Supabase** (no accounts were seen), and products kept in `src/data/products.ts`.
- **Hero media:** this is the **one asset I can't produce myself**. It needs a 3-scene pre-rendered camera-move video of *your* shop, 10–15 seconds long. Until you supply one, I'll build the scrubbing engine against 3 placeholder images with a crossfade plus a slow zoom (Ken Burns), so the effect can be swapped in without code changes.
- **Currency:** "Rs" becomes **৳** (BDT), formatted as `৳ 2,400`.
- **Checkout (default, unless your recording shows otherwise):**
  - The drawer's button leads to `/checkout`.
  - The form asks for name, phone (validated as `01XXXXXXXXX`), address, area and notes.
  - **Cash on Delivery**, plus a "Send order on WhatsApp" option.
  - The order is saved to "My Orders" in localStorage, then a confirmation screen is shown.
- **Menu button:** a full-screen overlay listing the categories, contact details and hours.
- **Copy, logo, brand name and photos:** all ours, nothing copied from the reference. Pricing and product names are placeholders until you send real ones.

### Still needed from you before Phase 1
- Brand name, what you sell, tagline
- 3 brand colours (or "keep this warm palette")
- Fonts (or "choose fitting Google Fonts")
- WhatsApp, phone, email and address
- Facebook and Instagram links
- Product categories, if they differ from cakes, cookies, macarons and pastries
