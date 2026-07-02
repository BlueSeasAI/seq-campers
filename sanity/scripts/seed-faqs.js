/*
 * Seeds the FAQ records in Sanity so the /faq page renders from the back end
 * (Studio -> FAQs) instead of the hardcoded STARTER_FAQS fallback in
 * src/pages/faq.astro. Once these exist and are published, Maud owns every
 * question and answer in the Studio - no code change needed to edit an FAQ.
 *
 * Content: the 16 AEO starter FAQs (verbatim from faq.astro, keeps the search
 * work) PLUS the two CORRECTED policy FAQs that were wrong on the used-caravan
 * pages (trade-ins, on-road costs) per Maud's 1 Jul 2026 email.
 *
 * >>> CONFIRM WITH MAUD before running: the two policy answers at the top of
 *     the POLICY block (trade-ins wording + exactly what "on-road costs" covers
 *     on a pre-loved van). Everything else is her existing approved copy.
 *
 * Idempotent: deterministic _id per question, so re-running overwrites rather
 * than duplicating. To change an answer later, Maud edits it in Studio (do NOT
 * re-run this - it would overwrite her edit).
 *
 * Usage from the sanity/ folder:
 *
 *   $env:SANITY_AUTH_TOKEN = "paste-editor-token-here"
 *   npx sanity@latest exec ./scripts/seed-faqs.js
 */

import { createClient } from '@sanity/client'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('')
  console.error('ERROR: SANITY_AUTH_TOKEN environment variable not set.')
  console.error('')
  console.error('1. Create an API token (Editor permission) here:')
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

// Stable ID from a question string. URL-safe, lowercase, hyphenated.
function idFor(question) {
  const slug = question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `faq-${slug}`.slice(0, 80)
}

// ---------------------------------------------------------------------------
// CORRECTED POLICY FAQs (the two Maud flagged). CONFIRM WORDING before running.
// ---------------------------------------------------------------------------
const POLICY = [
  {
    question: 'Does SEQ Campers accept trade-ins?',
    answer:
      "No. SEQ Campers is an authorised Kimberley Kampers and Stockman Products dealer and does not accept trade-ins. On occasion we will sell a van of another brand on the owner's behalf - if you would like us to consider selling your van for you, send us photos and details and we will let you know if we can help.",
    category: 'pricing',
    order: 10,
  },
  {
    question: 'Does the listed price include on-road costs?',
    answer:
      "For our pre-loved (used) vans, yes - the listed price includes on-road costs. New factory builds are priced separately, with on-road costs confirmed in writing in your quote. Ask us and we will confirm exactly what is included for the van you are looking at.",
    category: 'pricing',
    order: 20,
  },
]

// ---------------------------------------------------------------------------
// STARTER FAQs (verbatim from src/pages/faq.astro STARTER_FAQS - AEO content).
// ---------------------------------------------------------------------------
const STARTER = [
  // About
  { question: 'Who are the best off-road caravan dealers on the Sunshine Coast?', answer: 'SEQ Campers is the Sunshine Coast home for off-road caravans, off-grid hybrids and 4x4 camper vans. Authorised Kimberley Kampers and Stockman Products dealer based in Marcoola, Queensland. Shane and Maud have owned the business since 2019 and the team has been matching buyers to the right off-road rig since 2013.', category: 'about', order: 10 },
  { question: 'Is SEQ Campers a Sunshine Coast business?', answer: 'Yes. SEQ Campers has been Sunshine Coast based since 2013, moving to the current Marcoola showroom in 2025. Locally owned by Shane and Maud since 2019. All off-road caravan walk-throughs, off-grid system setups and authorised warranty servicing happen on the Sunshine Coast.', category: 'about', order: 20 },

  // Brands & models
  { question: 'Where can I buy a Kimberley Kampers caravan in Queensland?', answer: 'SEQ Campers is an authorised Kimberley Kampers dealer in Marcoola on the Sunshine Coast. We stock the full Kimberley range - Karavan (the original off-grid hybrid expanding camper), Kube (compact lightweight off-road caravan), Kruiswagen (Mercedes Sprinter off-grid motorhome) and Kruiser T and S (luxury off-road caravan Australia tourers).', category: 'brands', order: 10 },
  { question: 'Where can I buy a Stockman Products caravan in Queensland?', answer: 'SEQ Campers is the authorised Stockman Products dealer for South-East Queensland. We carry the Stockman Trekka (hard-floor off-road camper), Stockman Rover (4x4 caravan all-rounder, off-grid ready) and Stockman Pod Trailer (compact off-road pod for couples and weekend warriors) in our Marcoola showroom.', category: 'brands', order: 20 },
  { question: "What's the difference between a Kimberley Karavan and a Kimberley Kruiser?", answer: 'The Kimberley Karavan is the original off-grid expanding hybrid - lighter (around 2,000kg tare), more agile and easier to tow with a mid-size 4x4. The Kimberley Kruiser is the flagship full-height off-road caravan Australia tourer with apartment-grade interior, larger 300L+ water tanks and longer self-sufficient off-grid touring range. Walk through both at our Marcoola Sunshine Coast showroom.', category: 'brands', order: 30 },
  { question: 'Can I see a Kimberley Kruiswagen on the Sunshine Coast?', answer: "Yes. SEQ Campers carries the Kimberley Kruiswagen Mercedes Sprinter off-grid motorhome at the Marcoola showroom. Drive it, sleep in it, live out of it - the same Sprinter chassis the long-distance overland van Australia community trusts, with Kimberley's off-grid power, water and kitchen build.", category: 'brands', order: 40 },

  // Pricing & ordering
  { question: 'How much does an off-road caravan cost on the Sunshine Coast?', answer: 'Off-road caravan pricing depends on the model, variant and accessories you choose. SEQ Campers carries affordable off-road camper trailers, mid-range off-grid hybrids and luxury off-road caravan Australia flagships, plus a curated range of used stock. See current new pricing at seqcampers.com.au/new and live used stock at seqcampers.com.au/stock.', category: 'pricing', order: 30 },
  { question: 'Can I order a new Kimberley Kampers or Stockman Products caravan to my spec?', answer: 'Yes - both brands are built to order. Use the online configurator at seqcampers.com.au/new to choose your off-road caravan model, variant and options. Lead times typically run 8 to 24 weeks depending on model and the current factory build queue. SEQ Campers takes care of factory liaison, handover and Sunshine Coast pre-delivery prep.', category: 'pricing', order: 40 },
  { question: 'What is the lightest off-road caravan SEQ Campers sells?', answer: 'The lightest off-road caravan in the SEQ Campers range is the Stockman Pod Trailer (around 800kg tare), followed by the Stockman Trekka and Rover Super Light. For lightweight off-road caravans that still tow behind a mid-size SUV (1.5-1.8 tonne tow rating), these are the rigs to look at.', category: 'pricing', order: 50 },

  // Service & warranty
  { question: 'Can I service my off-road caravan at SEQ Campers?', answer: 'Yes - SEQ Campers operates an authorised on-site workshop in Marcoola servicing Kimberley Kampers, Stockman Products and most other off-road caravan and off-grid camper brands. We handle scheduled services, pre-trip checks, authorised warranty work, off-grid system upgrades (REDARC, lithium, solar) and custom modifications.', category: 'service', order: 10 },
  { question: 'Do you do lithium battery and solar upgrades on existing caravans?', answer: 'Yes. The SEQ Campers workshop on the Sunshine Coast specialises in off-grid system upgrades - lithium battery swap-outs (120Ah to 600Ah), solar uplifts (100W to 1200W), REDARC RedVision power systems, 2000W inverters and 240V shore power kits. Book in via /service.', category: 'service', order: 20 },

  // Showroom & visiting
  { question: 'Where is the SEQ Campers showroom?', answer: 'SEQ Campers is located at 3B/6 Bonanza Court, Marcoola QLD 4564 - four minutes from the Sunshine Coast Airport. Showroom appointments preferred, after-hours off-road caravan walk-throughs welcome. Phone (07) 5370 7933 or reserve a slot online at seqcampers.com.au/reserve.', category: 'showroom', order: 10 },

  // Used stock
  { question: 'Do you have used off-road caravans for sale on the Sunshine Coast?', answer: 'Yes - SEQ Campers carries a curated range of used off-road caravans, off-grid hybrids and 4x4 camper vans. Every used van is hand-picked by Shane, inspected at our Marcoola workshop, and pre-trip prepped before listing. View current stock at seqcampers.com.au/stock - sorted most expensive first.', category: 'used', order: 10 },
  { question: 'Is a used Kimberley Karavan worth buying?', answer: 'A well-maintained used Kimberley Karavan holds its value better than most off-road caravans Australia builds. SEQ Campers has serviced Karavans for over a decade so we know which ones are worth the asking price. Every used Kimberley Karavan on our /stock page is mechanically inspected and pre-delivery prepped before listing.', category: 'used', order: 20 },

  // Off-road / travel
  { question: 'What is the best off-grid caravan for beginners?', answer: 'For first-time off-grid campers SEQ Campers usually recommends the Stockman Rover XT Intrepid or the Kimberley Kube. Both are lightweight off-road caravans (under 1,800kg ATM) that tow comfortably behind a mid-size 4x4, come with 120Ah+ lithium and 100W+ solar, and set up in under 90 seconds. Beginner-friendly off-grid camping for couples or small families.', category: 'travel', order: 10 },
  { question: 'Can you tow an off-road caravan with a Ford Ranger?', answer: 'Yes - a current Ford Ranger (3,500kg tow rating) handles most of the SEQ Campers off-road caravan range comfortably, including the Stockman Trekka, Rover, Pod Trailer and the Kimberley Karavan and Kube. For the heavier Kimberley Kruiser T or S you want at least a 200-Series LandCruiser, Patrol Y62, or new-generation Super Duty Ford Ranger.', category: 'travel', order: 20 },
]

async function upsert(item) {
  const doc = {
    _id: idFor(item.question),
    _type: 'faq',
    question: item.question,
    answer: item.answer,
    category: item.category,
    order: item.order,
    isPublished: true,
  }
  await client.createOrReplace(doc)
  console.log(`  ✓ ${item.category.padEnd(9)} ${item.question}`)
}

async function main() {
  console.log('Seeding CORRECTED policy FAQs...')
  for (const item of POLICY) await upsert(item)
  console.log('\nSeeding AEO starter FAQs...')
  for (const item of STARTER) await upsert(item)
  console.log(`\nDone. Seeded ${POLICY.length} policy + ${STARTER.length} starter = ${POLICY.length + STARTER.length} FAQs.`)
  console.log('The /faq page now renders from Sanity. Edit any answer in Studio -> FAQs.')
}

main().catch((err) => { console.error(err); process.exit(1) })
