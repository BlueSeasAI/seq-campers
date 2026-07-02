/*
 * Seeds a "modelPricing" record per model page (Rover, Trekka, Pod, Karavan,
 * Kube, Kruiswagen, Kruiser) from the CURRENT values in src/data/model-pages.js,
 * so Maud can edit every model's prices in Studio -> Model pricing. The page
 * (src/pages/[model].astro) overlays these over the code defaults, so nothing
 * changes on the site until a record exists, and editing a price in Studio
 * updates the page on the next build (~60s).
 *
 * The Stockman Rover is seeded with "Contact for pricing" ON, because its price
 * changed on 1 Jul 2026 and the code still holds the OLD figure - so the page
 * shows "Contact us for current pricing" until Maud types the new number in
 * Studio and switches the toggle off.
 *
 * Idempotent (createOrReplace on a deterministic _id). Do NOT re-run once Maud
 * has edited prices - it would overwrite her changes.
 *
 * Usage from the sanity/ folder:
 *   $env:SANITY_AUTH_TOKEN = "paste-editor-token"
 *   npx sanity@latest exec ./scripts/seed-model-pricing.js
 */

import { createClient } from '@sanity/client'
import { modelPages } from '../../src/data/model-pages.js'

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

async function main() {
  for (const m of modelPages) {
    const isRover = m.slug === 'stockman-rover'
    const doc = {
      _id: `modelPricing-${m.slug}`,
      _type: 'modelPricing',
      model: m.slug,
      // Rover: hide the old price until Maud enters the new one.
      priceOnApplication: isRover,
      heroPriceFrom: m.hero?.priceFrom || '',
      heroPriceNote: m.hero?.priceNote || '',
      versions: (m.versions?.items || []).map((v, i) => ({
        _key: `v${i}`,
        tag: v.tag || '',
        priceFrom: v.priceFrom || '',
      })),
      pricingHeading: m.pricing?.heading || '',
      pricingBody: Array.isArray(m.pricing?.body) ? m.pricing.body : [],
      lowPrice: m.structured?.product?.lowPrice || '',
      highPrice: m.structured?.product?.highPrice || '',
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${m.slug}${isRover ? '   (Contact-for-pricing ON - enter new price in Studio)' : ''}`)
  }
  console.log(`\nDone. Seeded ${modelPages.length} model pricing records.`)
  console.log('Edit them in Studio -> Model pricing. For the Rover: type the new price and switch OFF "Contact for pricing".')
}

main().catch((err) => { console.error(err); process.exit(1) })
