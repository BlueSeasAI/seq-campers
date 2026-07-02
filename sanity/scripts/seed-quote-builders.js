/*
 * Seeds one "quoteBuilder" record per model (karavan, kube, kruiswagen, kruiser,
 * rover, trekka) from the CURRENT values in src/data/quote-builders.js, so Maud
 * can edit the /quote/{model} configurator prices in Studio -> Configurator /
 * quote prices.
 *
 * The build page (src/pages/quote/[slug].astro) prefers the Sanity record and
 * falls back to the code file when none exists - so nothing on the site changes
 * until this runs, and editing a price in Studio updates the running-total
 * calculator on the next build (~60s).
 *
 * MONEY-CRITICAL. Every number is pulled PROGRAMMATICALLY from quote-builders.js
 * (the transform is the exact inverse of getQuoteBuilder() in src/lib/sanity.js).
 * No prices are hand-typed here.
 *
 * ── Value round-trip ────────────────────────────────────────────────────────
 * Prices are stored as STRINGS so a single field can hold a number, 0, a
 * negative, or "POA", and so blank can mean N/A:
 *   null      -> ""        (N/A)
 *   'POA'     -> "POA"
 *   0         -> "0"       (Included)
 *   -890      -> "-890"    (credit)
 *   555       -> "555"
 * The helper reverses this exactly. priceByVariant objects are flattened to an
 * ARRAY of { variantId, price } in source key order; the weight{} `weights`
 * lookup is flattened to an ARRAY of { optId, kg }.
 *
 * Idempotent (createOrReplace on a deterministic _id). Do NOT re-run once Maud
 * has edited prices in Studio - it would overwrite her changes.
 *
 * Usage from the sanity/ folder:
 *   $env:SANITY_AUTH_TOKEN = "paste-editor-token"
 *   npx sanity@latest exec ./scripts/seed-quote-builders.js
 */

import { createClient } from '@sanity/client'
import { quoteBuilders } from '../../src/data/quote-builders.js'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('ERROR: SANITY_AUTH_TOKEN not set. Create an Editor token at')
  console.error('https://www.sanity.io/manage/project/ttam87n8/api and set it:')
  console.error('  $env:SANITY_AUTH_TOKEN = "paste-token"')
  process.exit(1)
}

const client = createClient({
  projectId: 'ttam87n8',
  dataset: 'production',
  apiVersion: '2024-04-01',
  token,
  useCdn: false,
})

// Convert a source price VALUE into the string the schema stores. Inverse of
// coerceQuotePrice() in src/lib/sanity.js.
//   null/undefined -> ""      'POA' -> "POA"      0 -> "0"      -890 -> "-890"
function priceToString(p) {
  if (p === null || p === undefined) return ''
  if (p === 'POA') return 'POA'
  return String(p) // numbers (incl. 0 and negatives) stringify exactly
}

function seedDoc(b) {
  const variants = b.variants.map((v, i) => {
    const row = {
      _key: `variant-${v.id}`,
      variantId: v.id,
      name: v.name,
      basePrice: v.basePrice,
      included: Array.isArray(v.included) ? v.included : [],
    }
    if (typeof v.tare === 'number') row.tare = v.tare
    return row
  })

  const categories = b.categories.map((c, ci) => ({
    _key: `cat-${c.id || ci}`,
    categoryId: c.id,
    title: c.title,
    options: c.options.map((o, oi) => {
      const opt = {
        _key: `opt-${o.id || oi}`,
        optionId: o.id,
        label: o.label,
      }
      if (o.note) opt.note = o.note

      if (o.priceByVariant) {
        opt.priceMode = 'byVariant'
        // Preserve source key order (Object.keys keeps insertion order for
        // string keys) so the reconstructed object stringifies identically.
        opt.priceByVariant = Object.keys(o.priceByVariant).map((vid) => ({
          _key: `pv-${vid}`,
          variantId: vid,
          price: priceToString(o.priceByVariant[vid]),
        }))
      } else {
        opt.priceMode = 'flat'
        opt.price = priceToString(o.price)
      }

      if (Array.isArray(o.requires) && o.requires.length) opt.requires = o.requires
      if (Array.isArray(o.blockedBy) && o.blockedBy.length) opt.blockedBy = o.blockedBy
      if (o.depNote) opt.depNote = o.depNote
      if (o.blockedNote) opt.blockedNote = o.blockedNote
      if (o.naNote) opt.naNote = o.naNote
      return opt
    }),
  }))

  const doc = {
    _id: `quoteBuilder-${b.slug}`,
    _type: 'quoteBuilder',
    model: b.slug,
    name: b.name,
    intro: b.intro,
    delivery: typeof b.delivery === 'number' ? b.delivery : undefined,
    variants,
    categories,
  }

  // On-road costs (Kruiswagen only).
  if (b.onRoad) {
    doc.onRoad = {
      stampDutyRate: b.onRoad.stampDutyRate,
      registration: b.onRoad.registration,
      dealerDelivery: b.onRoad.dealerDelivery,
    }
  }

  // Weight / GVM payload (Kruiswagen only). Flatten the weights{} lookup and
  // the consumable arrays into keyed arrays.
  if (b.weight) {
    const w = b.weight
    doc.weight = {
      baseGvm: w.baseGvm,
      upgradedGvm: w.upgradedGvm,
      gvmOptionId: w.gvmOptionId,
      passengers: w.passengers,
      fuelBase: w.fuelBase,
      waterBase: w.waterBase,
      fuelExtra: (w.fuelExtra || []).map((f, i) => ({ _key: `fuel-${f.optId || i}`, optId: f.optId, kg: f.kg })),
      waterExtra: (w.waterExtra || []).map((x, i) => ({ _key: `water-${x.optId || i}`, optId: x.optId, kg: x.kg })),
      weights: Object.keys(w.weights || {}).map((optId) => ({ _key: `wt-${optId}`, optId, kg: w.weights[optId] })),
    }
  }

  return doc
}

async function main() {
  for (const b of quoteBuilders) {
    const doc = seedDoc(b)
    await client.createOrReplace(doc)
    const nOpts = b.categories.reduce((n, c) => n + c.options.length, 0)
    console.log(`  ✓ ${b.slug}  (${b.variants.length} variants, ${b.categories.length} categories, ${nOpts} options)`)
  }
  console.log(`\nDone. Seeded ${quoteBuilders.length} configurator records.`)
  console.log('Edit them in Studio -> Configurator / quote prices. Preview /quote/{model} to confirm before publishing widely.')
}

main().catch((err) => { console.error(err); process.exit(1) })
