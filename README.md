# SEQ Campers Website

Astro frontend + Sanity CMS backend for SEQ Campers (Queensland off-road caravan dealer).

**Status:** Foundation complete (2026-05-23). 7 pages building, Sanity connected.
**Stack:** Astro 4, React 18, Sanity 3 (project `ttam87n8`).
**Repo:** [BlueSeasAI/seq-campers](https://github.com/BlueSeasAI/seq-campers)

## Quick start (after a fresh clone)

```bash
# 1. Install dependencies
cd seq-campers-website
npm install
cd sanity && npm install && cd ..

# 2. Create .env from the example and fill in the Sanity project ID
cp .env.example .env
# Edit .env:
#   PUBLIC_SANITY_PROJECT_ID=ttam87n8
#   PUBLIC_SANITY_DATASET=production
#   PUBLIC_SANITY_API_VERSION=2024-01-01

# 3. Run the Astro dev server (port 4400)
npm run dev

# 4. (In another terminal) Run the Sanity Studio locally
cd sanity
npx sanity login        # first time only
npm run dev             # Studio at http://localhost:3333
```

## Project structure

```
seq-campers-website/
├── astro.config.mjs            # Astro config (React integration, static output, port 4400)
├── package.json                # Astro + React + Sanity client deps
├── .env                        # Sanity project ID (gitignored)
├── .env.example                # Template for .env
├── src/
│   ├── layouts/
│   │   └── Site.astro          # Shared header/footer/nav - edit once, applies everywhere
│   ├── lib/
│   │   └── sanity.js           # Sanity client + GROQ query helpers
│   ├── pages/
│   │   ├── index.astro         # Home (hero + featured caravans)
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── sold.astro          # Sold archive
│   │   └── stock/
│   │       ├── index.astro     # Stock listing grid
│   │       └── [slug].astro    # Individual caravan page (one per Sanity entry)
│   └── styles/
│       └── global.css          # Palette, fonts, components
└── sanity/                     # Sanity Studio (separate npm project)
    ├── package.json
    ├── sanity.config.js        # Studio config + project ID
    ├── theme.jsx               # Custom SEQ logo in Studio header
    └── schemas/
        ├── caravan.js          # Caravan document schema
        ├── brand.js            # Brand reference schema
        └── index.js            # Schema registry
```

## Palette and typography

Per Maud's signed-off mockup (May 2026):

| Token | Hex | Use |
|---|---|---|
| `--sand` | `#F4EDE0` | Primary background |
| `--sand-deep` | `#E8E0D0` | Outer chrome / secondary |
| `--tan-border` | `#DCCBA8` | Hairlines, card borders |
| `--ink` | `#2A1608` | Primary text / dark sections |
| `--ink-deep` | `#1a0e06` | Footer (deepest) |
| `--muted` | `#8B6A40` | Secondary text |
| `--rust` | `#C0341A` | Primary CTA |
| `--rust-dark` | `#9c2a14` | CTA hover |
| `--gold` | `#D4943A` | Accent strips, eyebrow text |

**Fonts:** Inter Tight (headings, 500-900), Inter (body, 400-700). Loaded from Google Fonts.

## Sanity Studio

Studio config lives in [sanity/](./sanity/). The schema for a caravan listing is in [sanity/schemas/caravan.js](./sanity/schemas/caravan.js).

**To deploy Studio to studio.sanity.io (for Maud to use):**

```bash
cd sanity
npx sanity login
npx sanity deploy
# Pick a hostname like seqcampers.sanity.studio
```

After deploy, Maud edits at `https://seqcampers.sanity.studio` and her changes appear on the website after the next Netlify rebuild (triggered by Sanity publish webhook).

## What's missing from MVP

Not yet built (in build-order priority):

- [ ] Filter bar on `/stock` (brand, status, price range)
- [ ] Configurator React component on caravan detail pages
- [ ] Hero video loop on home page (SEQ YouTube footage)
- [ ] CaravanCard component (right now the card markup is inlined in each page)
- [ ] Image optimisation via Sanity's `?w=` CDN params
- [ ] GA4 via Google Tag Manager
- [ ] SEO meta + Open Graph per page
- [ ] Netlify webhook (Sanity publish → site rebuild)

See `OneDrive/.../SEQ Campers/New potential website/SCOPE_SPEC_PATH_B.md` for the full scope and remaining hour estimates.

## Resuming on a new PC

1. Install Node LTS and GitHub CLI (`winget install OpenJS.NodeJS.LTS GitHub.cli`)
2. `gh auth login` (web browser flow)
3. `gh repo clone BlueSeasAI/seq-campers ~/Projects/seq-campers-website`
4. Follow Quick start above.
