/*
 * Patch the Brisbane Show 2026 doc with the locked Kimberley show specials
 * (and trim the inclusions value-stack accordingly).
 *
 * What this changes:
 *   1. brandCards: replace the showSpecial line on Karavan / Kube / Kruiswagen
 *      with the new battery/solar deals. Stockman cards untouched.
 *   2. inclusions: drop the old generic "$3,000 accessory credit (Kimberley)"
 *      line and add 4 new Kimberley-specific lines (Karavan battery, Kube
 *      battery, Kruiswagen battery, Kruiswagen solar).
 *
 * What this leaves alone:
 *   - Stockman brand cards (Rover, Trekka) - already correct.
 *   - Stockman inclusions (Rover $2500, Trekka $5000, POD $500) - correct.
 *   - Demo POD 20% off callout - already in calloutBoxes from seed.
 *   - Generic value-stack items (service voucher, hitch upgrade, roadside,
 *     stone deflector, handover pack, locked-in pricing) - kept for all buyers.
 *
 * Auth: needs SANITY_AUTH_TOKEN with Editor permissions (same pattern as
 * the seed script).
 *
 * Run from the sanity/ folder:
 *
 *   $env:SANITY_AUTH_TOKEN = "your-token"
 *   npx sanity@latest exec ./scripts/update-brisbane-show-specials.js
 *
 * Idempotent: safe to run more than once. Uses .set() which replaces both
 * arrays wholesale rather than appending, so re-running just rewrites the
 * same final state.
 */

import { createClient } from '@sanity/client'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('')
  console.error('ERROR: SANITY_AUTH_TOKEN environment variable not set.')
  console.error('')
  console.error('1. Create or reuse an Editor-permission API token at:')
  console.error('   https://www.sanity.io/manage/project/ttam87n8/api')
  console.error('2. In PowerShell:')
  console.error('   $env:SANITY_AUTH_TOKEN = "paste-token-here"')
  console.error('3. Then re-run this command.')
  console.error('')
  process.exit(1)
}

const client = createClient({
  projectId: 'ttam87n8',
  dataset: 'production',
  apiVersion: '2024-04-01',
  token,
  useCdn: false,
})

const DOC_ID = 'show-brisbane-2026'

// Stable keys per array item. Matters because Sanity uses _key to track
// drag-reorder + identify items. Stable keys = idempotent reruns.
const NEW_BRAND_CARDS = [
  { _type: 'brandCard', _key: 'bc-rover',      name: 'Stockman Rover',       brand: 'Stockman',  quoteSlug: 'rover',      tagline: 'The all-rounder. Off-grid ready, family friendly, 90 second setup.',         showSpecial: '$2,500 of free accessories included - show only' },
  { _type: 'brandCard', _key: 'bc-trekka',     name: 'Stockman Trekka',      brand: 'Stockman',  quoteSlug: 'trekka',     tagline: 'The serious off-road camper trailer. Tough, light, made for tracks.',        showSpecial: '$5,000 of free accessories included - show only' },
  { _type: 'brandCard', _key: 'bc-karavan',    name: 'Kimberley Karavan',    brand: 'Kimberley', quoteSlug: 'karavan',    tagline: 'The iconic Australian-made off-road caravan. 30 years of refinement.',       showSpecial: '50% off 2nd battery - save $3,911 (show only)' },
  { _type: 'brandCard', _key: 'bc-kube',       name: 'Kimberley Kube',       brand: 'Kimberley', quoteSlug: 'kube',       tagline: 'Compact, capable, premium off-grid living. Couples and small families.',     showSpecial: '50% off 2nd battery - save $1,750 (show only)' },
  { _type: 'brandCard', _key: 'bc-kruiswagen', name: 'Kimberley Kruiswagen', brand: 'Kimberley', quoteSlug: 'kruiswagen', tagline: 'The expedition motorhome. Self-contained, anywhere, any track.',             showSpecial: 'Double up solar free OR free portable solar ($549), plus 50% off 2nd battery ($3,911) - show only' },
]

const NEW_INCLUSIONS = [
  // Generic / all-buyer items (kept from original)
  { _type: 'inclusion', _key: 'inc-service',       label: 'Full annual service voucher',           value: 1450, note: 'Bearings, brakes, gas, electrics. Pre-trip ready.' },
  { _type: 'inclusion', _key: 'inc-hitch',         label: 'Premium hitch upgrade',                 value: 1290, note: 'Off-road coupling, full articulation.' },
  { _type: 'inclusion', _key: 'inc-roadside',      label: '12 months roadside cover',              value: 580,  note: 'Australia-wide breakdown assistance.' },
  { _type: 'inclusion', _key: 'inc-stone',         label: 'Stone deflector + rock tamer kit',     value: 880,  note: 'Save your windows on corrugations.' },
  { _type: 'inclusion', _key: 'inc-handover',      label: 'Show floor handover pack',             value: 540,  note: 'Levellers, sand pegs, hose, mat. Ready to camp.' },
  { _type: 'inclusion', _key: 'inc-pricing',       label: 'Locked-in 2026 pricing',               value: 5000, note: 'Pre-July factory price rises do not apply to show buyers.' },

  // Stockman-specific
  { _type: 'inclusion', _key: 'inc-rover',         label: 'Stockman Rover accessory pack',         value: 2500, note: '$2,500 of off-grid accessories - lithium, solar, awning, your pick.' },
  { _type: 'inclusion', _key: 'inc-trekka',        label: 'Stockman Trekka accessory pack',        value: 5000, note: '$5,000 of trail-ready accessories. Show-only inclusion.' },
  { _type: 'inclusion', _key: 'inc-pod',           label: 'Stockman POD accessory pack',           value: 500,  note: '$500 of POD accessories to kit your trailer out.' },

  // Kimberley-specific (NEW - replaces the old "$3,000 accessory credit" line)
  { _type: 'inclusion', _key: 'inc-karavan-batt',  label: 'Kimberley Karavan - 50% off 2nd battery', value: 3911, note: 'Show-only deal. Doubles your usable amp-hours for half the spend.' },
  { _type: 'inclusion', _key: 'inc-kube-batt',     label: 'Kimberley Kube - 50% off 2nd battery',    value: 1750, note: 'Show-only deal on the second battery upgrade.' },
  { _type: 'inclusion', _key: 'inc-krsw-batt',     label: 'Kimberley Kruiswagen - 50% off 2nd battery', value: 3911, note: 'Show-only. Combine with the solar deal below for full off-grid spec.' },
  { _type: 'inclusion', _key: 'inc-krsw-solar',    label: 'Kimberley Kruiswagen - double-up solar OR free portable solar', value: 549, note: 'Show-only. Take the doubled roof solar OR the portable kit - your call.' },
]

async function main() {
  console.log(`Patching Show doc ${DOC_ID} ...`)

  // Show what's about to change so the operator sees the diff in the terminal.
  const before = await client.fetch(
    `*[_id == $id][0]{
      "brandCount": count(brandCards),
      "brandNames": brandCards[].name,
      "incCount": count(inclusions),
      "incLabels": inclusions[].label
    }`,
    { id: DOC_ID }
  )
  console.log('Before:')
  console.log(`  brandCards: ${before?.brandCount ?? 0} items`)
  if (before?.brandNames) before.brandNames.forEach((n) => console.log(`    - ${n}`))
  console.log(`  inclusions: ${before?.incCount ?? 0} items`)
  if (before?.incLabels) before.incLabels.forEach((l) => console.log(`    - ${l}`))
  console.log('')

  await client
    .patch(DOC_ID)
    .set({
      brandCards: NEW_BRAND_CARDS,
      inclusions: NEW_INCLUSIONS,
    })
    .commit({ visibility: 'async' })

  const after = await client.fetch(
    `*[_id == $id][0]{
      "brandCount": count(brandCards),
      "brandNames": brandCards[].name,
      "incCount": count(inclusions),
      "incLabels": inclusions[].label
    }`,
    { id: DOC_ID }
  )
  console.log('After:')
  console.log(`  brandCards: ${after.brandCount} items`)
  after.brandNames.forEach((n) => console.log(`    - ${n}`))
  console.log(`  inclusions: ${after.incCount} items`)
  after.incLabels.forEach((l) => console.log(`    - ${l}`))
  console.log('')
  console.log('OK. Sanity webhook fires automatically - site rebuilds in ~30-60s.')
  console.log('Verify at: https://new-seqcampers-website.netlify.app/shows/brisbane-2026/')
}

main().catch((err) => {
  console.error('Patch failed:', err)
  process.exit(1)
})
