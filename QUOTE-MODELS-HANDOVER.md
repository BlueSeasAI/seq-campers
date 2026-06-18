# Quote Configurator - Handover for the Other 6 Models

Paste this into the website-build chat. It explains how the Rover quote page was fixed and the exact recipe for adding the remaining models so the same mistake never happens again.

Models still to do: **kruiswagen, kruiser (S and T), karavan, kube, trekka, pod, and accessories.**
Source of truth for each = **Bart's hand-built HTML file** (like `rover-example.html`), never the manufacturer's public website.

---

## 1. What went wrong on Rover (so you don't repeat it)

The quote pages are data-driven. The page template is fine. The Rover **data** had been copied from the **Stockman public website**, not Bart's HTML. That caused:

1. **Dealer delivery double-counted.** Base prices were $63,490 / $78,490. Those are Bart's ex-factory ($59,990 / $74,990) with the $3,500 dealer delivery already baked in. The page then added delivery *again* as a line. Every total was $3,500+ too high.
2. **Wrong variant set.** Only 2 variants showed, plus a bogus "Super Light chassis option" checkbox. Bart's HTML has 4 variants (XT + Super Lite, each Intrepid/Ultra).
3. **The discontinued "Light" version was referenced.** It must never appear.
4. **Option prices stripped / options missing** (600Ah, REDARC Manager 50, Woodbox).

All fixed and live: https://new-seqcampers-website.netlify.app/quote/rover

---

## 2. The hard rules (apply to every model)

- **NEVER take prices from the manufacturer's public website.** Only from Bart's verified HTML. He spends hours getting these right.
- **`basePrice` = TRUE ex-factory only (GST incl).** Never bake dealer delivery into it. Sanity check: if `manufacturer RRP - basePrice = the delivery figure`, the RRP had delivery baked in. Strip it.
- **Dealer delivery is per-model and added ONCE** as a separate line. It varies a lot. The **Kruiswagen (motorhome) sits around $19,000** because of 5% stamp duty. Set it per model.
- **Never include the discontinued Light version**, even if it's in the source HTML.
- Australian English. No em dashes.

---

## 3. The data model (`src/data/quote-builders.js`)

Each model is one object in the `quoteBuilders` array. The page `/quote/<slug>` is generated automatically from it.

```js
{
  slug: 'kube',                       // URL slug -> /quote/kube
  brandFamily: 'Kimberley',           // Kimberley | Stockman
  name: 'Kimberley Kube',
  intro: 'One-line subtitle.',
  delivery: 3500,                     // PER-MODEL dealer delivery, added once (motorhome ~19000)

  variants: [
    {
      id: 'classic',                  // unique within this model
      name: 'Kube Classic',
      basePrice: 76865,               // TRUE ex-factory, no delivery baked in
      flags: { ultra: false, lite: false },   // optional, only if you use the Rover-style inclusion logic
      delivery: 19000,                // OPTIONAL per-variant override (rare; falls back to model delivery)
      included: [ 'Spec bullet', 'Spec bullet' ],
    },
    // ...more variants
  ],

  categories: [
    {
      id: 'power',
      title: 'Power & Solar',
      options: [
        // FLAT price (same on every variant):
        { id: 'water-filter', label: 'Water Filter', note: 'optional sub-text', price: 250 },

        // PER-VARIANT price (0 = Included with that variant, null = Not available):
        { id: 'rooftop-ac', label: '240V Reverse-Cycle A/C',
          priceByVariant: { 'classic': 3800, 'eco-suite': 0 } },

        // DEPENDENCY: locks until a prerequisite is present, shows depNote:
        { id: 'battery-600ah', label: 'Upgrade to 600Ah',
          requires: ['battery-300ah'], depNote: 'Add 300Ah', price: 1850 },

        // BLOCK: goes N/A when a conflicting option is present, shows blockedNote:
        { id: 'inverter-12v', label: '2000W 12V Inverter',
          blockedBy: ['redvision'], blockedNote: 'Use REDARC',
          naNote: 'Ultra: REDARC',
          priceByVariant: { 'classic': 1600, 'eco-suite': null } },
      ],
    },
  ],
}
```

### Price value meanings
| Value | Renders as | Meaning |
|---|---|---|
| `number > 0` | `+ $X` | Added when ticked |
| `0` | `Included` | Comes with this variant |
| `null` (in priceByVariant) | `naNote` or `N/A` | Not available on this variant |
| `'POA'` | `POA` | Price on application |
| negative | `- $X credit` | Credit (downgrade) |

### Dependency engine (encodes Bart's HTML guardrails)
- **"present"** = the prerequisite option is Included on the current variant (price `0`) OR the visitor has ticked it.
- `requires: [ids]` - ALL must be present, else the row locks and shows `depNote`.
- `blockedBy: [ids]` - if ANY is present, the row becomes N/A and shows `blockedNote`.
- `naNote` - text shown when `priceByVariant` is `null` for the selected variant (e.g. `'Not on Super Lite'`).
- Toggling any option re-evaluates all of them, so "tick RedVision -> A/C unlocks" works.

The template already supports all of this. Models that don't set `requires`/`blockedBy`/`delivery` behave exactly as before, so you can't break the other models by adding one.

---

## 4. Step-by-step extraction from a model HTML

For each source HTML (e.g. `kube-example.html`):

1. **Variants.** Read the model cards. Capture each variant `name` and its **ex-factory** base price (the figure labelled "ex-factory", not any drive-away/RRP). Strip delivery if it's baked in.
2. **Included spec.** Copy each variant's spec bullets into `included: []` (plain strings, no HTML tags).
3. **Dealer delivery.** Find the model's delivery figure. Set `delivery:` on the model. If it varies by variant, set `delivery:` on the variant too.
4. **Options.** For every option in the HTML, capture `id`, `label`, exact `price` (the `data-price` value), optional `note`, grouped under the same category headings the HTML uses.
5. **Per-variant differences.** Where an option is standard on a higher variant, set that variant's price to `0` (Included). Where it doesn't apply, set `null`.
6. **Dependencies.** Translate the HTML's JS rules (its `includedOnUltra` array, `refreshOptionStates`, "requires X", "not available on Y") into `requires` / `blockedBy` / `naNote` / `depNote`.
7. **Strip discontinued items** (e.g. any Light version) even if present in the source.
8. **Replace** the matching placeholder object already in `quote-builders.js` (karavan, kube, kruiswagen, kruiser-t, kruiser-s, trekka all exist as placeholders). For **pod**, add a new object (the template's `VIDEO_DEFAULTS` already has a `pod` slot).

### Accessories is different
Accessories is **not** a variant-based configurator. Don't force it into `quoteBuilders`. Confirm with Bart what that page should be (most likely a flat catalogue / add-on list or a simple grid), then build it as its own page, not a `/quote/<slug>` build.

---

## 5. Verify before deploying

```bash
npm run build
# then spot-check the built file:
python -c "h=open('dist/quote/<slug>/index.html',encoding='utf-8').read(); print('ex-factory ok:', '<correct base>' in h); print('no baked-in/RRP number:', '<wrong RRP>' not in h)"
```
Check: correct base prices, delivery line correct, no manufacturer RRP, no Light version, all options priced.

---

## 6. Deploy

The live site auto-builds from the **`develop`** branch.

- Netlify site: **new-seqcampers-website** - ID `ac2238d1-51ef-400d-91e7-e66f3bd2b931`
- Deploy = commit and push to `develop`. Netlify runs `npm run build` and honours `netlify.toml` (security headers + caching).

```bash
git add src/data/quote-builders.js
git commit -m "Add <model> quote data from Bart's verified HTML"
git push origin develop
```

Warning: `netlify status` in this repo defaults to **peakescapes-discovery** (stale global state). If you ever deploy by CLI instead of git, you MUST pass `--site ac2238d1-51ef-400d-91e7-e66f3bd2b931` or you will overwrite the wrong site. Git push is the safe path.

After it goes ready, confirm live:
```bash
python -c "import urllib.request as u; h=u.urlopen(u.Request('https://new-seqcampers-website.netlify.app/quote/<slug>',headers={'User-Agent':'Mozilla/5.0'})).read().decode('utf-8','ignore'); print('<correct base>' in h)"
```

---

## 7. Files touched in the Rover fix (reference)
- `src/data/quote-builders.js` - Rover object rewritten (4 variants, correct ex-factory, deps, `delivery`).
- `src/pages/quote/[slug].astro` - added per-model delivery (`deliveryFor`), the dependency engine in `renderOptionPrices`, `isPresent`, and re-render on option toggle. Backward compatible with all existing models.

## 8. Two open items Bart flagged
- **Sirocco fans**: Rover uses two checkboxes (Fan + "Second Sirocco Fan") to allow up to 2. Bart's HTML used a 0/1/2 dropdown. Swap to a qty control later if he wants exact parity.
- **"Is this right for you" top-5 section**: not in any source HTML yet. Needs writing from scratch per model if wanted.
