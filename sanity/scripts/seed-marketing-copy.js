/*
 * Seeds the marketing-copy fields ADDED on 2 Jul 2026 to two EXISTING page
 * singletons so they are editable in Studio instead of hardcoded:
 *
 *   Home page (homePageSettings):
 *     - pathway section eyebrow / heading / intro
 *     - reviews counter text
 *     - testimonials section eyebrow / heading / intro
 *     - testimonials array (the 3 real Google reviews, verbatim)
 *     - What's Happening section eyebrow / heading
 *
 *   Service & workshop page (servicePageSettings):
 *     - hero H1 + sub
 *     - "Meet the crew" eyebrow / heading
 *     - the 3 service cards (title + body)
 *
 * Content is the CURRENT copy pulled verbatim from src/pages/index.astro and
 * src/pages/service.astro. Because both pages keep the same literals as
 * fallbacks, running this changes nothing visible on the site - it just makes
 * the copy editable.
 *
 * IMPORTANT: these singletons already hold video / Shane's Pick data. This
 * script uses a MERGE patch (.set on only the new fields) so it NEVER touches
 * the existing fields. It does NOT use createOrReplace (that would wipe the
 * videos). If the singleton does not exist yet it is created first with
 * createIfNotExists, then patched.
 *
 * Idempotent: patches the same fields on the same fixed _ids each run. Safe to
 * re-run, but do NOT re-run after Maud has edited these fields in Studio - the
 * patch would overwrite her edits (the video fields are always safe).
 *
 * Usage from the sanity/ folder:
 *
 *   $env:SANITY_AUTH_TOKEN = "paste-editor-token-here"
 *   npx sanity@latest exec ./scripts/seed-marketing-copy.js
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

let keyCounter = 0
const key = (p) => `${p}-${++keyCounter}`

// ─── HOME PAGE copy (verbatim from src/pages/index.astro) ─────────────────────
const HOME_FIELDS = {
  pathwayEyebrow: 'How it works',
  pathwayHeading: 'Three steps to your next off-road adventure.',
  pathwayIntro:
    'From browsing off-road caravans and off-grid hybrids to driving away from our Marcoola showroom on the Sunshine Coast - the way SEQ Campers does it.',

  reviewsCounter: '35+ five-star reviews from SEQ owners',

  testimonialsEyebrow: 'In their own words',
  testimonialsHeading: 'Real off-road owners, real trips, real stories',
  testimonialsIntro:
    "From Kimberley Karavan and Kruiser owners exploring the outback to Stockman Trekka and Rover families chasing off-grid camping weekends - here's what they have to say about SEQ Campers.",

  testimonials: [
    {
      _key: key('t'),
      quote:
        "A huge shout out to SEQ Campers. While traveling we found one of our guide rollers kept coming off the track, after inspecting them discovered the others were in bad shape. A phone call to SEQ campers and a conversation with Shane had us diverting to their workshop, where Grant took control and sorted our van out - he and the crew gave it a thorough check over. The service was something we didn't expect at such short notice, but was very much appreciated as it saved us the hassle of doing that fiddly job while on the road. Thanks fellas!",
      name: 'Willie & Cathy',
      source: 'Catherine Fabris · Google review',
      rating: 5,
    },
    {
      _key: key('t'),
      quote:
        "Great customer service. We brought a karavan under consignment from Shane and Maud, which was a great experience. After using the van, we noticed some issues with it and contacted the SEQ campers team. They were very helpful and carried out the repairs required under warranty. Upon picking the van up, workshop manager Grant was very kind and spent the time to explain the repairs they had carried out. This was appreciated, and I wouldn't hesitate to recommend any of my friends or family to this business.",
      name: 'David Poole',
      source: 'Google review',
      rating: 5,
    },
    {
      _key: key('t'),
      quote:
        "We purchased a second hand KK to do WA while waiting for a new build. The knowledge and after-sales support was fantastic. The handover and after-sale support was great - it shortened the learning curve significantly. When we sold the van 6 months later they had potential buyers before I could deliver the van. We received the new van and there were some issues but Maud and the team handled everything necessary to rectify everything. Recently they added a bbq table custom made for my Weber - it is fantastic, one less table to carry on the road. I can only say positive things about the relationship I have with the team at SEQ Campers.",
      name: 'T Ireland',
      source: 'Google Local Guide review',
      rating: 5,
    },
  ],

  happeningEyebrow: "What's happening",
  happeningHeading: 'News from the showroom floor',
}

// ─── SERVICE PAGE copy (verbatim from src/pages/service.astro) ────────────────
const SERVICE_FIELDS = {
  heroH1: 'From our Sunshine Coast workshop to your off-grid driveway.',
  heroSub:
    'Off-road caravan servicing, off-grid system upgrades and authorised Kimberley Kampers and Stockman Products warranty work - all under one roof in Marcoola, Queensland.',
  crewEyebrow: 'Meet the crew',
  crewHeading: 'Keeping you moving. In a SEQ.',
  serviceCards: [
    {
      _key: key('s'),
      title: 'Scheduled service & pre-trip check',
      body: 'Bearings, brakes, lights, hoses, gas, electrics. The full pre-trip check on every off-road caravan and 4x4 camper van before you point it at the outback.',
    },
    {
      _key: key('s'),
      title: 'Authorised warranty work',
      body: 'Authorised warranty service for Kimberley Kampers (Karavan, Kube, Kruiswagen, Kruiser) and Stockman Products (Trekka, Rover, Pod) on the Sunshine Coast.',
    },
    {
      _key: key('s'),
      title: 'Off-grid upgrades & custom mods',
      body: 'Solar upgrades, lithium battery swap-outs, REDARC systems, awnings, bike racks, storage builds. Set your off-grid caravan up your way.',
    },
  ],
}

async function seed(id, type, fields) {
  // Ensure the doc exists (empty shell) without disturbing existing data, then
  // MERGE-set only the new marketing-copy fields.
  await client.createIfNotExists({ _id: id, _type: type })
  await client.patch(id).set(fields).commit()
  console.log(`  ✓ ${id} (${Object.keys(fields).length} fields set, existing video/other fields untouched)`)
}

async function main() {
  console.log('Seeding marketing copy onto existing page singletons...')
  await seed('homePageSettings', 'homePageSettings', HOME_FIELDS)
  await seed('servicePageSettings', 'servicePageSettings', SERVICE_FIELDS)
  console.log('\nDone. Home + Service page copy is now editable in Studio.')
  console.log('Existing hero/pathway videos, Shane\'s Pick and service video tiles were left untouched.')
}

main().catch((err) => { console.error(err); process.exit(1) })
