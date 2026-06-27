/*
 * One-off data fix (2026-06-27).
 *
 * The "Toowoomba Queensland Outdoor Adventure Expo" show was saved with the
 * expo's WEBSITE URL (https://adventureexpo.com.au) in the `slug` field.
 * A slug containing ":" and "/" cannot become a static path, so `astro build`
 * crashed - which silently froze the WHOLE live site (every Netlify rebuild
 * since had been failing). See sanity.js show-slug hardening + show.js slug
 * validation for the permanent guards.
 *
 * This script:
 *   1. moves that URL into the new `eventWebsiteUrl` field, and
 *   2. gives the page a clean slug (toowoomba-2026), matching brisbane-2026.
 *
 * Run from the sanity/ folder (uses Bart's CLI login, no API token):
 *   npx sanity@latest exec ./scripts/fix-toowoomba-slug.js --with-user-token
 *
 * Idempotent: re-running sets the same values.
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-04-01' })
const ID = 'e9dfd6b7-5d1a-4f43-bfdf-dc17113648b0'

async function run() {
  // This project rejects patch/update mutations ("permission update required")
  // even via the CLI user token - only createOrReplace is allowed. So we fetch
  // the WHOLE doc, change two fields, and write it back in full.
  const doc = await client.getDocument(ID)
  if (!doc) {
    console.error(`Show ${ID} not found - aborting.`)
    process.exit(1)
  }

  const oldSlug = doc.slug?.current
  const recoveredUrl =
    doc.eventWebsiteUrl ||
    (oldSlug && /^https?:\/\//i.test(oldSlug) ? oldSlug : 'https://adventureexpo.com.au')

  const res = await client.createOrReplace({
    ...doc,
    slug: { _type: 'slug', current: 'toowoomba-2026' },
    eventWebsiteUrl: recoveredUrl,
  })

  console.log('OK - Toowoomba show fixed:')
  console.log(`  was slug.current = ${oldSlug}`)
  console.log(`  now slug.current = ${res.slug?.current}`)
  console.log(`  eventWebsiteUrl  = ${res.eventWebsiteUrl}`)
}

run().catch((err) => {
  console.error('FAILED:', err.message)
  process.exit(1)
})
