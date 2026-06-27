/*
 * Seeds the AEO Keywords reference table in Sanity from the canonical
 * Keyword_Strategy_CorrectFInal.xlsx source.
 *
 * Source: Bart's "Keyword_Strategy_CorrectFInal.xlsx" (16 Jun 2026).
 * Imports the high-priority Core + Branded keywords as starter content
 * so Shane and Maud can see and tweak the strategy in Studio. Lower-
 * priority types (long-tail, regional, etc.) can be added later or
 * imported via a second seed pass when needed.
 *
 * Idempotent: deterministic _id per keyword so re-running overwrites
 * the existing doc rather than creating duplicates.
 *
 * Usage from the sanity/ folder:
 *
 *   $env:SANITY_AUTH_TOKEN = "paste-token-here"
 *   npx sanity@latest exec ./scripts/seed-aeo-keywords.js
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

// Stable ID from a keyword string. URL-safe, lowercase, hyphenated.
function idFor(keyword) {
  const slug = keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `aeokw-${slug}`.slice(0, 80)
}

const CORE = [
  { keyword: 'off-grid camping',                      volume: 'very-high', category: 'Primary',     pages: ['home', 'about', 'blog'] },
  { keyword: 'off-grid camping Australia',            volume: 'very-high', category: 'Primary',     pages: ['home', 'about', 'blog'] },
  { keyword: 'off-road caravan',                      volume: 'very-high', category: 'Primary',     pages: ['home', 'new', 'stock'] },
  { keyword: 'off-road caravan Australia',            volume: 'very-high', category: 'Primary',     pages: ['home', 'new', 'stock', 'about'] },
  { keyword: 'off-road camping Australia',            volume: 'high',      category: 'Core',        pages: ['home', 'blog'] },
  { keyword: 'off-grid caravan',                      volume: 'high',      category: 'Core',        pages: ['new', 'stock'] },
  { keyword: 'camper van Australia',                  volume: 'very-high', category: 'Broad',       pages: ['home', 'about'] },
  { keyword: '4x4 caravan',                           volume: 'high',      category: 'Core',        pages: ['new', 'stock'] },
  { keyword: '4x4 caravan Australia',                 volume: 'high',      category: 'Core',        pages: ['new', 'stock'] },
  { keyword: 'overland van Australia',                volume: 'high',      category: 'Core',        pages: ['new'] },
  { keyword: 'adventure caravan',                     volume: 'medium',    category: 'Core',        pages: ['new', 'stock'] },
  { keyword: 'free camping Australia',                volume: 'high',      category: 'Lifestyle',   pages: ['blog'] },
  { keyword: 'best off-grid camper',                  volume: 'high',      category: 'Decision',    pages: ['home', 'faq'] },
  { keyword: 'best off-road caravan',                 volume: 'high',      category: 'Decision',    pages: ['home', 'faq'] },
  { keyword: 'affordable off-road caravan',           volume: 'medium',    category: 'Budget',      pages: ['stock', 'faq'] },
  { keyword: 'lightweight off-road caravan',          volume: 'high',      category: 'Feature',     pages: ['new', 'stock'] },
  { keyword: 'durable off-road caravan',              volume: 'medium',    category: 'Feature',     pages: ['new'] },
  { keyword: 'luxury off-road caravan',               volume: 'medium',    category: 'Premium',     pages: ['new'] },
  { keyword: 'budget off-grid camper',                volume: 'medium',    category: 'Budget',      pages: ['stock'] },
  { keyword: 'caravan camper van',                    volume: 'high',      category: 'Core',        pages: ['home'] },
  { keyword: 'off-grid motorhome',                    volume: 'medium',    category: 'Core',        pages: ['new'] },
  { keyword: 'self-contained caravan',                volume: 'medium',    category: 'Feature',     pages: ['new', 'stock'] },
  { keyword: 'fully equipped caravan',                volume: 'medium',    category: 'Feature',     pages: ['stock'] },
  { keyword: 'small off-grid caravan',                volume: 'medium',    category: 'Feature',     pages: ['stock'] },
  { keyword: 'compact off-road van',                  volume: 'medium',    category: 'Feature',     pages: ['stock'] },
  { keyword: 'off-grid camping tips',                 volume: 'medium',    category: 'Advice',      pages: ['blog'] },
  { keyword: 'Australian off road camping',           volume: 'medium',    category: 'Lifestyle',   pages: ['blog'] },
  { keyword: 'family off-grid camping',               volume: 'medium',    category: 'Use Case',    pages: ['blog', 'faq'] },
  { keyword: 'beginner off-grid camping',             volume: 'high',      category: 'Use Case',    pages: ['blog', 'faq'] },
  { keyword: 'pod trailer Australia',                 volume: 'medium',    category: 'Product Type', pages: ['new'] },
]

const BRANDED = [
  { keyword: 'Stockman Caravan',                      volume: 'high', category: 'Core',     pages: ['home', 'new'] },
  { keyword: 'Stockman Caravan Australia',            volume: 'high', category: 'Core',     pages: ['home', 'new'] },
  { keyword: 'Stockman Trekka',                       volume: 'high', category: 'Core',     pages: ['new', 'quote'] },
  { keyword: 'Stockman Rover',                        volume: 'high', category: 'Core',     pages: ['new', 'quote'] },
  { keyword: 'Stockman Pod Trailer',                  volume: 'high', category: 'Core',     pages: ['new', 'quote'] },
  { keyword: 'Kimberley Karavan',                     volume: 'high', category: 'K-unique', pages: ['new', 'quote'] },
  { keyword: 'Kimberley Karavan Australia',           volume: 'high', category: 'K-unique', pages: ['new', 'quote'] },
  { keyword: 'Kimberley Kube',                        volume: 'high', category: 'K-unique', pages: ['new', 'quote'] },
  { keyword: 'Kimberley Kube Australia',              volume: 'high', category: 'K-unique', pages: ['new', 'quote'] },
  { keyword: 'Kimberley Kruiswagen',                  volume: 'high', category: 'K-unique', pages: ['new', 'quote'] },
  { keyword: 'Kimberley Kruiswagen Australia',        volume: 'high', category: 'K-unique', pages: ['new', 'quote'] },
  { keyword: 'Kimberley Kruiser',                     volume: 'high', category: 'Core',     pages: ['new', 'quote'] },
  { keyword: 'Kimberley Caravan',                     volume: 'high', category: 'Core',     pages: ['home', 'new'] },
  { keyword: 'Kimberley Caravan Australia',           volume: 'high', category: 'Core',     pages: ['home', 'new'] },
  { keyword: 'Kimberley Sprinter Motorhome',          volume: 'high', category: 'Core',     pages: ['new'] },
  { keyword: 'Kimberley Mercedes Sprinter',           volume: 'high', category: 'Core',     pages: ['new'] },
  { keyword: 'Off Grid Full size Caravan',            volume: 'high', category: 'Core',     pages: ['new', 'stock'] },
  { keyword: 'Off Grid Caravan Australia',            volume: 'high', category: 'Core',     pages: ['home', 'new', 'stock'] },
  { keyword: 'Off Grid Sprinter Motorhome',           volume: 'high', category: 'Core',     pages: ['new'] },
  { keyword: 'Off Grid Mercedes Sprinter',            volume: 'high', category: 'Core',     pages: ['new'] },
  { keyword: 'Off Grid Pod',                          volume: 'high', category: 'Core',     pages: ['new'] },
  { keyword: 'Off Grid Hybrid',                       volume: 'high', category: 'Core',     pages: ['new'] },
]

async function upsert(item, type) {
  const doc = {
    _id: idFor(item.keyword),
    _type: 'aeoKeyword',
    keyword: item.keyword,
    type,
    priority: 3,
    volume: item.volume || 'medium',
    category: item.category || '',
    targetPages: item.pages || [],
    liveOnSite: false,
  }
  await client.createOrReplace(doc)
  console.log(`  ✓ ${type.padEnd(8)}  ${item.keyword}`)
}

async function main() {
  console.log('Seeding Core keywords...')
  for (const item of CORE) await upsert(item, 'core')
  console.log(`\nSeeding Branded keywords...`)
  for (const item of BRANDED) await upsert(item, 'branded')
  console.log(`\nDone. Seeded ${CORE.length} core + ${BRANDED.length} branded = ${CORE.length + BRANDED.length} keywords.`)
}

main().catch((err) => { console.error(err); process.exit(1) })
