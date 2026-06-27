/*
 * Deletes the two mockup caravans that were created during the build
 * (stockman-trekka-2026 + 2026-stockman-rover-02-ultra) - they appear
 * on /stock with the green dot but are placeholders, not real listings.
 *
 * Idempotent: safe to re-run. Logs which docs were found and deleted.
 *
 * Usage from the sanity/ folder:
 *
 *   $env:SANITY_AUTH_TOKEN = "sk-paste-Editor-token-here"
 *   npx sanity@latest exec ./scripts/delete-mockup-caravans.js
 *
 * Delete the token after the run.
 */

import { createClient } from '@sanity/client'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('ERROR: SANITY_AUTH_TOKEN environment variable not set.')
  console.error('Create one at https://www.sanity.io/manage/project/ttam87n8/api')
  process.exit(1)
}

const client = createClient({
  projectId: 'ttam87n8',
  dataset: 'production',
  apiVersion: '2024-04-01',
  token,
  useCdn: false,
})

// Match by slug. We try both the slug.current value and the slugified
// title in case either form is stored.
const MOCKUP_SLUGS = [
  'stockman-trekka-2026',
  '2026-stockman-rover-02-ultra',
]

async function main() {
  console.log('Looking for mockup caravans...')
  const docs = await client.fetch(
    `*[_type == "caravan" && slug.current in $slugs] { _id, title, "slug": slug.current }`,
    { slugs: MOCKUP_SLUGS }
  )

  if (!docs.length) {
    console.log('  No matches by slug. Trying title match...')
    const titleMatches = await client.fetch(
      `*[_type == "caravan" && (title match "*Stockman Trekka 2026*" || title match "*2026 Stockman Rover 02 Ultra*")] { _id, title, "slug": slug.current }`
    )
    if (!titleMatches.length) {
      console.log('  No matching mockup caravans found - nothing to delete.')
      return
    }
    docs.push(...titleMatches)
  }

  for (const doc of docs) {
    console.log(`  Deleting: ${doc.title} (${doc._id}, slug: ${doc.slug})`)
    // Use delete with both the published _id and the draft _id.
    try {
      await client.delete(doc._id)
    } catch (err) {
      console.warn(`    Warning deleting published: ${err.message}`)
    }
    try {
      await client.delete(`drafts.${doc._id}`)
    } catch (err) {
      // Draft might not exist - silent ignore
    }
  }
  console.log(`\nDone. Deleted ${docs.length} mockup caravan(s).`)
}

main().catch((err) => { console.error(err); process.exit(1) })
