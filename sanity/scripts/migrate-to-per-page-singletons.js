/*
 * One-shot migration: copy existing fields out of the old monolithic
 * "siteSettings" document into the new per-page singletons.
 *
 * Per Bart 16 Jun: settings split out so each page menu in Studio only
 * shows its own fields. This script preserves everything Maud + Bart
 * have already set (hero video URL, Shane's Pick status pill, etc).
 *
 * IDEMPOTENT: safe to re-run. createOrReplace with fixed _ids.
 *
 * Usage from the sanity/ folder:
 *
 *   $env:SANITY_AUTH_TOKEN = "your-token"
 *   npx sanity@latest exec ./scripts/migrate-to-per-page-singletons.js
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

async function main() {
  console.log('Reading existing siteSettings document...')
  const old = await client.fetch(`*[_id == "siteSettings"][0]`)
  if (!old) {
    console.log('No existing siteSettings found - nothing to migrate. Done.')
    return
  }

  // ─── HOME PAGE ────────────────────────────────────────────────
  const home = {
    _id: 'homePageSettings',
    _type: 'homePageSettings',
    heroVideo: old.heroVideo,
    shanesPick: old.shanesPick,
    homepageVideo1: old.homepageVideo1,
    homepageVideo2: old.homepageVideo2,
    homepageVideo3: old.homepageVideo3,
  }
  await client.createOrReplace(home)
  console.log('  ✓ homePageSettings (hero, Shane\'s Pick, pathway videos)')

  // ─── NEW PAGE ─────────────────────────────────────────────────
  const newPage = {
    _id: 'newPageSettings',
    _type: 'newPageSettings',
  }
  for (let i = 1; i <= 8; i++) {
    if (old[`newPageTile${i}`]) newPage[`newPageTile${i}`] = old[`newPageTile${i}`]
  }
  await client.createOrReplace(newPage)
  console.log('  ✓ newPageSettings (8 tile slots)')

  // ─── SERVICE PAGE ─────────────────────────────────────────────
  const service = {
    _id: 'servicePageSettings',
    _type: 'servicePageSettings',
    serviceWorkshopWeekly: old.serviceWorkshopWeekly,
  }
  for (let i = 1; i <= 6; i++) {
    if (old[`servicePageVideo${i}`]) service[`servicePageVideo${i}`] = old[`servicePageVideo${i}`]
  }
  await client.createOrReplace(service)
  console.log('  ✓ servicePageSettings (3 team tiles + workshop weekly)')

  // ─── SHOWS PAGE ───────────────────────────────────────────────
  const shows = {
    _id: 'showsPageSettings',
    _type: 'showsPageSettings',
    showsIndexIntro: old.showsIndexIntro,
    showsCompilationVideo: old.showsCompilationVideo,
  }
  await client.createOrReplace(shows)
  console.log('  ✓ showsPageSettings (intro + compilation video)')

  // ─── QUOTE / BUILD PAGES ──────────────────────────────────────
  const quote = {
    _id: 'quotePageSettings',
    _type: 'quotePageSettings',
  }
  const slugs = ['kruiswagen', 'kruiser_t', 'kruiser_s', 'karavan', 'kube', 'trekka', 'rover', 'pod']
  for (const slug of slugs) {
    const key = `quoteVideo_${slug}`
    if (old[key]) quote[key] = old[key]
  }
  await client.createOrReplace(quote)
  console.log('  ✓ quotePageSettings (8 build-page intro videos)')

  // ─── SITE-WIDE (trimmed) ──────────────────────────────────────
  // Keep siteSettings as the home for banner + Reserve Stripe CTA.
  // Re-save with only those fields so the old fields stop appearing
  // alongside the new schema once Studio is redeployed.
  const site = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    showSpecial: old.showSpecial,
    reserveCta: old.reserveCta,
  }
  await client.createOrReplace(site)
  console.log('  ✓ siteSettings trimmed to banner + Reserve Stripe CTA only')

  console.log('\nMigration complete. Old per-page fields on siteSettings can now be ignored;')
  console.log('they remain on the document but are no longer in the schema, so Studio hides them.')
}

main().catch((err) => { console.error(err); process.exit(1) })
