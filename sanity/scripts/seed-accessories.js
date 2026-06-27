/*
 * Seeds the two real accessories (Off-Grid Toilets + Optitec Caravan Movers)
 * into Sanity, including uploading their photos.
 *
 * IMPORTANT: CLI writes via --with-user-token are blocked on this project
 * (no create permission). This script needs a WRITE-enabled API token:
 *
 *   1. https://www.sanity.io/manage/project/ttam87n8/api -> Tokens -> Add API
 *      token -> Editor permission. Copy it once.
 *   2. In PowerShell:  $env:SANITY_AUTH_TOKEN = "paste-the-token-here"
 *   3. From the sanity/ folder:  npx sanity@latest exec ./scripts/seed-accessories.js
 *   4. Delete the token in manage afterwards.
 *
 * Re-runnable: uses createOrReplace with fixed _ids (it re-uploads the photos
 * each run). If createOrReplace is rejected but create is allowed, change
 * createOrReplace -> create and drop the _id.
 */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('No SANITY_AUTH_TOKEN set. Create an Editor token in Sanity manage and set $env:SANITY_AUTH_TOKEN first.')
  process.exit(1)
}
const client = createClient({ projectId: 'ttam87n8', dataset: 'production', apiVersion: '2024-04-01', token, useCdn: false })

const TOILET_DIR = 'C:/Users/bartp/OneDrive - Blue Seas AI Consulting/Blue Seas AI Consulting/Clients/SEQ Campers/New potential website/Accessories/off-grid toilets'
const MOVER_DIR = 'C:/Users/bartp/OneDrive - Blue Seas AI Consulting/Blue Seas AI Consulting/Clients/SEQ Campers/New potential website/Accessories/optimiser - caravan movers'

const TOILET_PHOTOS = ['CuddyExplodedX3_2.jpg.avif', 's1_low_angle_regular_lid.jpg.webp', 'S1-inside.webp', 'S1_Sealing_Toilet_-_Heat_seal.webp', 'nirvana-upfitters_2784.jpg.webp']
// 329A5121 = blue-button (2500kg), 329A5151 = red-button (4500kg) per Bart.
// The 2 screenshots are OneDrive "cloud-only" by default - right-click them in
// File Explorer -> "Always keep on this device" to download, THEN re-run, or
// they'll skip. (They upload fine once downloaded.)
const MOVER_PHOTOS = ['329A5121.jpg', '329A5151.jpg', 'Screenshot 2026-06-25 at 6.57.58 pm.png', 'Screenshot 2026-06-25 at 7.15.08 pm.png']

let keyN = 0
const k = () => 'k' + (keyN++)
const withKeys = (arr) => arr.map((o) => ({ _key: k(), ...o }))

async function uploadPhotos(dir, files) {
  const out = []
  for (const f of files) {
    const fp = path.join(dir, f)
    try {
      if (!fs.existsSync(fp)) { console.warn('  MISSING (skipped):', f); continue }
      // readFileSync (not createReadStream) so a missing/cloud-only/locked file
      // throws synchronously here and is CAUGHT - it can no longer crash the
      // whole run and stop the documents being created.
      const buf = fs.readFileSync(fp)
      const asset = await client.assets.upload('image', buf, { filename: f })
      out.push({ _type: 'image', _key: k(), asset: { _type: 'reference', _ref: asset._id } })
      console.log('  uploaded', f)
    } catch (e) {
      console.warn('  SKIPPED', f, '-', e.message)
    }
  }
  return out
}

async function run() {
  console.log('Uploading Off-Grid Toilets photos...')
  const toiletPhotos = await uploadPhotos(TOILET_DIR, TOILET_PHOTOS)
  console.log('Uploading Optitec Movers photos...')
  const moverPhotos = await uploadPhotos(MOVER_DIR, MOVER_PHOTOS)

  const toilets = {
    _id: 'accessory-off-grid-toilets',
    _type: 'accessory',
    orderRank: 10,
    title: 'Off-Grid Toilets',
    eyebrow: 'Composting & sealing',
    badges: ['Certified Installer', 'Waterless', 'Chemical-free', 'No dump points'],
    intro: 'SEQ Campers is a certified installer of CompoCloset off-grid toilets. Two ways to ditch the chemical cassette: the Cuddy composting toilet (in stock now) and the new S1 dry-flush sealing toilet (pre-order). Come and see both at our Marcoola showroom, or order below.',
    photos: toiletPhotos,
    products: withKeys([
      { name: 'Cuddy Composting Toilet', brand: 'CompoCloset', type: 'Composting · waterless · smell-free', tag: 'In stock', tagColor: 'green', price: '$1,795', priceNote: 'Indicative - confirm with SEQ · 24-month warranty', pitch: 'The best-value true composting toilet on the market. Separates liquids and solids, composts with a natural bulking agent, and stays odour-free with a carbon filter and fan.', features: ['No water, chemicals or dump points', '"Pee Full" LED level indicator', 'Manual agitator + carbon filter', 'Portable or wall-mount installable'], specs: ['422×385×432mm', '9.5kg', 'Solids 14.7L', 'Liquids 6.5L'] },
      { name: 'S1 Dry Flush Sealing Toilet', brand: 'CompoCloset', type: 'Sealing · waterless · push-button', tag: 'Pre-order', tagColor: 'rust', price: 'Pre-order', priceNote: 'On display at our showroom - see it, then pre-order', pitch: "The world's first separating sealing toilet. Push a button and solids are automatically heat-sealed in a bag - no composting, no layering, no smell. Urine diverts separately.", features: ['Automatic battery heat-seal - 50+ per charge', 'Built-in urine diversion, LED indicator', '~25 uses per liner roll · backup mode', 'On display at SEQ Campers to view before you pre-order'], specs: ['432×386×419mm', '13.2kg', 'Solids 15.7L', 'Urine 6.4L'] },
    ]),
    compareHeading: 'Composting or sealing - which suits you?',
    compareIntro: 'Both are waterless, chemical-free and divert urine separately. The difference is what happens to the solids.',
    compareColumns: withKeys([
      { heading: 'Cuddy - Composting', body: 'Solids drop onto a natural bulking agent and break down over time. A front crank agitator mixes it; a carbon filter and fan keep it fresh.', note: 'Empty the solids bin roughly every 2-3 weeks for two. No power, no consumables, lowest running cost. In stock now.' },
      { heading: 'S1 - Sealing', body: 'Each solid use is hermetically heat-sealed in a bag at the push of a button - nothing to compost, nothing to see or smell.', note: 'Battery sealer (50+ seals/charge), ~25 uses per liner roll, with a backup diverting mode if you run out. Pre-order - with one on display at SEQ Campers to view first.' },
    ]),
  }

  const movers = {
    _id: 'accessory-optitec-movers',
    _type: 'accessory',
    orderRank: 20,
    title: 'Optitec Caravan Movers',
    eyebrow: 'Remote-control movers',
    badges: ['Remote control', 'Fully portable', 'Free shipping', 'No underbody install'],
    intro: "Reverse your van into any spot at the push of a button - no yelling, no stress, no expensive underbody install. Three Optitec movers: the wheeled Optimover V3 for hard surfaces, and the tracked All-Terrain 2500 and 4500 for grass, gravel and off-road. Not sure which? Use the quick guide below, or order online and we'll confirm the right fit.",
    photos: moverPhotos,
    products: withKeys([
      { name: 'Optimover V3', brand: 'Optitec', type: 'Wheeled remote jockey wheel', tag: 'On-road', tagColor: 'olive', price: '$2,625', priceNote: 'Moves up to 3,500kg · hard surfaces · + clamp from $180', pitch: "The original remote-control jockey wheel - drives your van's own wheels to reverse and park it anywhere on firm ground.", features: ['12V DC, 50A high-torque motor', 'Single or double axle · tow-ball to 350kg', '3-year motor & transmission warranty', 'Clamp $180: OW14 (100-130mm) or OW15 (150mm)', 'Optional carry & storage bag - $140'], specs: ['22kg', 'Remote + cables incl.'] },
      { name: 'All Terrain 2500', brand: 'Optitec', type: 'Tracked off-road mover', tag: 'Off-road', tagColor: 'rust', price: '$4,500-$4,550', priceNote: 'Up to 2,500kg off-road · price depends on bracket', pitch: 'Track tyres built to go off-road. Ready for challenging sites with small to medium vans and trailers.', features: ['2 motors (288W each)', 'Moves 10m per minute under load', 'Fast-charging long-life battery as standard', 'Standard bracket (50mm) $4,500, or Universal $4,550'], specs: ['34kg', '540×470×210mm', '2yr warranty'] },
      { name: 'All Terrain 4500', brand: 'Optitec', type: 'Tracked off-road mover', tag: 'Off-road · HD', tagColor: 'gold', price: '$5,400-$5,450', priceNote: 'Up to 4,500kg off-road · price depends on bracket', pitch: 'The most powerful Optitec. Four motors and rubber tracks for the heaviest vans in the most challenging scenarios.', features: ['4 motors (288W each)', 'Moves 7m per minute under load', 'Fast-charging long-life battery as standard', 'Standard bracket (50mm) $5,400, or Universal $5,450'], specs: ['42kg', '540×470×210mm', '2yr warranty'] },
    ]),
    compareHeading: 'Which mover do I need?',
    compareIntro: "Two quick questions sort it - what you'll drive it on, and how heavy your rig is.",
    compareColumns: withKeys([
      { heading: '1. What surface?', body: 'Hard & paved (concrete, bitumen, pavers, firm ground): the Optimover V3.', note: 'Grass, gravel, dirt, sand or inclines: a tracked All-Terrain mover.' },
      { heading: '2. How heavy is your rig?', body: 'Up to 3,500kg on firm ground: Optimover V3. Up to 2,500kg off-road: All Terrain 2500.', note: 'Up to 4,500kg / heaviest vans: All Terrain 4500.' },
    ]),
    compareNote: "The short version: the V3 is a wheeled remote jockey wheel for hard ground; the All-Terrain 2500 and 4500 are tracked units that clamp to the drawbar and grip off-road. All three are remote-controlled and fully portable. The V3 takes an OW14 (100-130mm) or OW15 (150mm) clamp ($180), with an optional carry & storage bag ($140). The All-Terrain movers include a Standard (50mm) or Universal (50/75/100/130mm, +$50) bracket - that's the only reason for their price range. Still unsure? Tell us your van and we'll match it.",
  }

  for (const doc of [toilets, movers]) {
    const res = await client.createOrReplace(doc)
    console.log('Wrote', res._id, '-', res.title)
  }
  console.log('Done. The sample placeholders on /accessories will now drop off automatically on the next site build.')
}

run().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
