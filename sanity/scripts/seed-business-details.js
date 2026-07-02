/*
 * Seeds the single "Business details" record in Sanity so the whole site reads
 * its contact info from one editable spot (Studio -> Business details) instead
 * of the hardcoded literals scattered across the layout + pages.
 *
 * Content: the CURRENT values pulled verbatim from the code (contact bar,
 * footer, /contact, /reserve, the JSON-LD blocks, terms + privacy). After this
 * record exists, Maud owns every one of these values in Studio - no code change
 * needed. Because every front-end consumer keeps the same literal as a fallback,
 * running this changes nothing visible on the site; it just makes the values
 * editable.
 *
 * Idempotent: fixed _id 'businessDetails', createOrReplace. Re-running overwrites
 * rather than duplicating. Do NOT re-run after Maud has edited the record in
 * Studio - it would overwrite her edits.
 *
 * Usage from the sanity/ folder:
 *
 *   $env:SANITY_AUTH_TOKEN = "paste-editor-token-here"
 *   npx sanity@latest exec ./scripts/seed-business-details.js
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

// CURRENT values, verbatim from the code as of 2 Jul 2026.
const doc = {
  _id: 'businessDetails',
  _type: 'businessDetails',
  phoneDisplay: '(07) 5370 7933',
  phoneHref: '+61753707933',
  textDisplay: '0422 624 920',
  textHref: '0422624920',
  emailOffice: 'sales@seqcampers.com.au',
  emailAdmin: 'admin@seqcampers.com.au',
  addressStreet: '3B/6 Bonanza Court',
  addressSuburb: 'Marcoola',
  addressState: 'QLD',
  addressPostcode: '4564',
  addressFull: '3B/6 Bonanza Court, Marcoola QLD 4564',
  showroomHours: 'Mon - Fri: 8:30am - 3pm\nSaturday: 8:30am - 12:30pm\nSunday: Closed',
  abn: '83 631 928 188',
  youtubeUrl: 'https://www.youtube.com/@seqcampers9450',
  instagramUrl: 'https://www.instagram.com/seq_campers/',
  facebookUrl: '',
  mapQuery: 'SEQ Campers, 3B/6 Bonanza Court, Marcoola QLD 4564, Australia',
}

async function main() {
  console.log('Seeding Business details singleton...')
  await client.createOrReplace(doc)
  console.log('  ✓ businessDetails')
  console.log('\nDone. The site now reads contact details from Studio -> Business details.')
  console.log('Edit any value there - phone, text, email, address, hours, ABN, socials, map.')
}

main().catch((err) => { console.error(err); process.exit(1) })
