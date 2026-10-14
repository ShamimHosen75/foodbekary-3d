# foodbekary-3d

E-commerce bakery storefront (Vite + React + TypeScript + Tailwind v4) modelled on the structure,
UX and motion of a reference site, with our own brand and content.

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build |
| `npm run lint` / `npm run typecheck` / `npm test` | Quality gates |
| `npm run qa:screens -- http://localhost:4173 /` | Browser QA at 360/768/1024/1440 (needs `npm run preview`) |

## Where things live
- Brand/contact placeholders: `src/data/site.ts`
- Design tokens (colours, fonts, radii, shadows): `src/index.css` (`@theme`)
- UI primitives: `src/components/ui`

## Status
- **Phase 0 — Reference analysis:** done → [`REFERENCE_ANALYSIS.md`](REFERENCE_ANALYSIS.md)
- **Phase 1 — Setup & design system:** done (style guide currently renders at `/`)
- Phase 2 — Layout shell: next
