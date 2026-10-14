# Final QA report (Phase 7)

Environment: headless Chromium (Playwright), Lighthouse 12, local server that mirrors Netlify
(`npm run preview`: prerendered files first, `app.html` fallback, brotli).

## Lighthouse (final build)

| Page | Mobile P / A / BP / SEO | Desktop P / A / BP / SEO | CLS |
|---|---|---|---|
| `/` | 93 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| `/menu/cakes` | 94 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| `/product/dark-truffle-drip-cake` | 94 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| `/checkout` | 91–92 / 100 / 100 / 66* | 100 / 100 / 100 / 66* | 0 |

\* `/checkout` and `/order/*` are deliberately `noindex` (private pages), which Lighthouse scores as
"not crawlable". Every public page scores SEO 100. Mobile scores vary ±2–3 between runs.

## Automated suites

| Suite | Result |
|---|---|
| Unit tests (Vitest) | 53 / 53 |
| `qa:prerender` — no-JS content, hydration, saved state, query strings, head tags | 7 / 7 |
| `qa:shell` — header, menu, routing, focus trap, 404, CLS | 14 / 14 |
| `qa:home` — scroll hero, cards, reviews, reduced motion | 13 / 13 |
| `qa:products` — filters, URL state, Quick View, stock, favourites, search | 14 / 14 |
| `qa:checkout` — cart math, validation, double-submit, WhatsApp, receipts | 13 / 13 |
| `qa:motion` — frame timing (4× CPU), reduced motion, loading states | 11 / 11 |
| `qa:screens` — 11 pages × 360/768/1024/1440: console + horizontal overflow | 44 / 44 |

## Final regression checklist

| Item | Status |
|---|---|
| All pages load without console errors or warnings | ✅ (all suites assert a clean console) |
| Every link and button works | ✅ (header, menu, tabs, footer, cards, CTAs, panels, forms covered) |
| Cart works end-to-end and survives refresh | ✅ |
| Forms validate and submit correctly (incl. 01XXXXXXXXX) | ✅ |
| Responsive at 360 / 768 / 1024 / 1440 | ✅ (no horizontal scroll; screenshots reviewed) |
| Works in Chrome | ✅ Chromium |
| Works in Firefox, Safari, mobile Chrome | ⚠️ **Not tested here** — only Chromium is available in this environment. Please check on real devices after deploy (list below). |
| Lighthouse 90+ on Performance, Accessibility, Best Practices, SEO | ✅ for every public page (see table; checkout SEO intentionally noindex) |
| Visual match with reference structure and feel, using our branding | ✅ with documented differences (see phase reports) |

### Manual checks to do after deploy
1. Safari (iPhone): scroll hero smoothness, sticky header blur, checkout bar above the home indicator.
2. Firefox desktop: hero, Quick View, cart drawer focus trap.
3. Android Chrome on a mid-range phone: hero scroll, Quick View open, adding to cart.
4. Share a product link in WhatsApp/Facebook — the preview should show the product name, price and image.
