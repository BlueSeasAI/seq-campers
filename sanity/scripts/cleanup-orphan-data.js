/*
 * One-off Sanity migration:
 *
 *   1. Removes the orphan `showroomHours` + `workshopHours` fields from
 *      the siteSettings singleton (they were dropped from the schema on
 *      30 May 2026 - they live hardcoded in the footer now).
 *
 *   2. Deletes every legacy `video` document. The schema was removed on
 *      1 June 2026 - /videos now reads from videosPageSettings (12 slots),
 *      home page videos from siteSettings. No per-clip records needed.
 *
 * Run from the sanity/ folder:
 *
 *   npx sanity@latest exec ./scripts/cleanup-orphan-data.js --with-user-token
 *
 * Safe to run more than once: each step is idempotent (unset on missing
 * fields is a no-op, delete on no-matches is a no-op).
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-04-01' })

async function unsetOrphanHours() {
  const before = await client.fetch(
    '*[_id == "siteSettings"][0]{ showroomHours, workshopHours }'
  )
  if (!before || (!before.showroomHours && !before.workshopHours)) {
    console.log('[1/2] siteSettings already clean - nothing to unset')
    return
  }
  console.log('[1/2] Found orphan fields on siteSettings:', before)
  await client
    .patch('siteSettings')
    .unset(['showroomHours', 'workshopHours'])
    .commit({ visibility: 'async' })
  console.log('[1/2] Unset showroomHours + workshopHours - OK')
}

async function deleteAllVideos() {
  const videos = await client.fetch('*[_type == "video"]{ _id, title }')
  if (videos.length === 0) {
    console.log('[2/2] No video documents to delete - nothing to do')
    return
  }
  console.log(`[2/2] Deleting ${videos.length} video document(s):`)
  videos.forEach((v) => console.log(`       - ${v._id}  (${v.title || 'untitled'})`))
  // Use a transaction so all deletes happen atomically. If any one fails,
  // Sanity rolls them back - safer than a per-doc loop.
  const tx = client.transaction()
  videos.forEach((v) => tx.delete(v._id))
  await tx.commit({ visibility: 'async' })
  console.log('[2/2] Deleted all video documents - OK')
}

async function main() {
  console.log('Starting cleanup ...')
  await unsetOrphanHours()
  await deleteAllVideos()
  console.log('Done.')
}

main().catch((err) => {
  console.error('Cleanup failed:', err)
  process.exit(1)
})
