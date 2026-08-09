# Pending Images

Referenced in code via `LazyImage` (so nothing is broken — each renders a styled
placeholder box until the real file exists) but not yet present in `public/images/`.
Drop the real PNG in with the exact filename below and it picks up automatically,
per Section 15.12 — no code changes needed.

| Filename | Used in | Dimensions |
|---|---|---|
| `trustscore-diagram.png` | `app/about/page.tsx` — "How TrustScore Works" section | 560×420 |
| `score-breakdown-placeholder.png` | `app/how-it-works/page.tsx` — closing category-breakdown visual | 1040×360 |
| `founder-flow-placeholder.png` | `app/page.tsx` (homepage) — closing CTA, "For founders" | 320×200 |
| `investor-flow-placeholder.png` | `app/page.tsx` (homepage) — closing CTA, "For investors" | 320×200 |
| `empty-state-directory.png` | `app/directory/DirectoryClient.tsx` — empty search-results state | 160×120 |

## Also worth knowing

Not in `public/images/` (they're at `public/` root), so out of scope above, but
still placeholders: `og-image.png` and `apple-touch-icon.png` are hand-generated
flat-navy PNGs (`scripts/generate-placeholder-images.mjs`), not designed artwork —
functional, but candidates for a real asset swap.

Present in `public/images/` but not referenced anywhere in the code: `about-globe.png`,
`isometric-badges.png`, `dashboard-preview.png` — unused, not missing.
