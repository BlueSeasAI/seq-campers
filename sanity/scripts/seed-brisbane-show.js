/*
 * Seeds the "Brisbane Caravan Show 2026" Show document.
 *
 * Purpose:
 *   1. Acts as a live, populated example for Maud when she clicks
 *      "+ Create new" on a future show - she can crib from this one.
 *   2. Renders Brisbane at /shows/brisbane-2026 as a real Sanity-driven
 *      show entry alongside any future shows.
 *
 * Idempotent: uses createOrReplace with a fixed _id, so re-running this
 * script overwrites the doc instead of creating duplicates.
 *
 * Run from the sanity/ folder:
 *
 *   npx sanity@latest exec ./scripts/seed-brisbane-show.js --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-04-01' })

// Deterministic _id so re-running the script overwrites the same doc.
const DOC_ID = 'show-brisbane-2026'

// Tiny key counter - portable text blocks + array items need unique _key
// strings. Stable keys (b1, b2, ...) keep the doc diff-friendly between
// re-seeds.
let k = 0
const key = (prefix = 'k') => `${prefix}${++k}`

// Wrap a single plain-text paragraph in a Sanity portable-text block.
function block(text) {
  return {
    _type: 'block',
    _key: key('b'),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key('s'), text, marks: [] }],
  }
}

const doc = {
  _id: DOC_ID,
  _type: 'show',

  // ─── Basics ──────────────────────────────────────────────
  title: 'Brisbane Caravan Show 2026',
  slug: { _type: 'slug', current: 'brisbane-2026' },
  status: 'active',
  startDate: '2026-06-03',
  endDate: '2026-06-07',
  datesLabel: '3 - 7 June 2026',
  daysLabel: 'Wed - Sun, 5 days',
  venueName: 'Brisbane Showgrounds, Bowen Hills',
  venueAddress: '600 Gregory Tce, Bowen Hills - free trains for ticket holders',
  standNumber: '#2693',
  standArea: 'Main Oval - look for the SEQ Campers banner',
  podiumNumber: '0422 624 920',
  heroEyebrow: 'Brisbane Show 2026',
  heroH1: 'See us at the Brisbane Caravan Show.',
  seoDescription:
    'SEQ Campers at the Brisbane Caravan, Camping & Touring Supershow, 3-7 June 2026. Stand #2693 in the Main Oval. Build your spec for Kimberley Kampers and Stockman caravans, scan the QR codes, and lock in show-only pricing.',

  // ─── Callouts ────────────────────────────────────────────
  calloutBoxes: [
    {
      _type: 'callout',
      _key: key('c'),
      style: 'tip',
      title: 'Free trains to the show',
      body: 'Your Brisbane Caravan Supershow ticket also covers free Queensland Rail travel to Bowen Hills station (right at the Showgrounds gate). Save the parking fee, skip the traffic.',
    },
    {
      _type: 'callout',
      _key: key('c'),
      style: 'warning',
      title: 'Showroom closed Saturday 6 June',
      body: 'The whole SEQ team is at the show floor. Drop in to the stand to see us, or call 0422 624 920 for a text reply during show hours.',
    },
    {
      _type: 'callout',
      _key: key('c'),
      style: 'exclusive',
      badge: 'Show floor exclusive',
      title: 'Stockman demo POD All-Roader - 20% off',
      body: 'Our demo POD All-Roader is on the show floor with the rooftop tent already fitted - and it is 20% off the standard price for any show-week buyer. One unit only. First in, best dressed.',
    },
  ],

  // ─── On the stand ────────────────────────────────────────
  standEyebrow: 'On the stand',
  standHeading: "Caravans we're bringing to Brisbane.",
  standCaravans: [
    { _type: 'standCaravan', _key: key('s'), name: 'Kimberley Kruiswagen', detail: 'Mercedes 4x4 motorhome' },
    { _type: 'standCaravan', _key: key('s'), name: 'Kimberley Karavan Eco Suite', detail: 'with media release' },
    { _type: 'standCaravan', _key: key('s'), name: 'Kimberley Kruiser T Class', detail: 'luxury off-road tourer' },
    { _type: 'standCaravan', _key: key('s'), name: 'Kimberley Kruiser S Class', detail: 'flagship apartment-grade' },
    { _type: 'standCaravan', _key: key('s'), name: 'Stockman Trekka', detail: 'serious off-road camper trailer' },
    { _type: 'standCaravan', _key: key('s'), name: 'Stockman Rover', detail: 'all-rounder family off-grid' },
    { _type: 'standCaravan', _key: key('s'), name: 'Stockman POD All-Roader', detail: 'demo unit - 20% off, rooftop tent included' },
  ],

  // ─── Show offer + inclusions ─────────────────────────────
  offerEnabled: true,
  offerHeading: 'What you get if you buy at the show.',
  offerIntro:
    "Each item below is yours when you order a new caravan during the show. Offer also honoured for one week after the show closes (Sunday 14 June at 11pm) if you can't make it to Brisbane but can get to our Sunshine Coast showroom.",
  offerExpiry: '2026-06-07T23:00:00+10:00',
  vansRemaining: 14,
  holdAmount: 500,
  holdHelperText: 'fully refundable',
  inclusions: [
    { _type: 'inclusion', _key: key('i'), label: 'Full annual service voucher', value: 1450, note: 'Bearings, brakes, gas, electrics. Pre-trip ready.' },
    { _type: 'inclusion', _key: key('i'), label: 'Premium hitch upgrade', value: 1290, note: 'Off-road coupling, full articulation.' },
    { _type: 'inclusion', _key: key('i'), label: '12 months roadside cover', value: 580, note: 'Australia-wide breakdown assistance.' },
    { _type: 'inclusion', _key: key('i'), label: 'Stockman Rover accessory pack', value: 2500, note: '$2,500 of off-grid accessories - lithium, solar, awning, your pick.' },
    { _type: 'inclusion', _key: key('i'), label: 'Stockman Trekka accessory pack', value: 5000, note: '$5,000 of trail-ready accessories. Show-only inclusion.' },
    { _type: 'inclusion', _key: key('i'), label: 'Stockman POD accessory pack', value: 500, note: '$500 of POD accessories to kit your trailer out.' },
    { _type: 'inclusion', _key: key('i'), label: '$3,000 accessory credit (Kimberley)', value: 3000, note: 'Solar, lithium, or whatever upgrade matters most.' },
    { _type: 'inclusion', _key: key('i'), label: 'Stone deflector + rock tamer kit', value: 880, note: 'Save your windows on corrugations.' },
    { _type: 'inclusion', _key: key('i'), label: 'Show floor handover pack', value: 540, note: 'Levellers, sand pegs, hose, mat. Ready to camp.' },
    { _type: 'inclusion', _key: key('i'), label: 'Locked-in 2026 pricing', value: 5000, note: 'Pre-July factory price rises do not apply to show buyers.' },
  ],
  offerFinePrint:
    '$500 hold locks in show pricing and inclusions. Fully refundable if you change your mind by Friday 14 June 2026.',

  // ─── Brand QR cards ─────────────────────────────────────
  brandQrEyebrow: 'Get show-ready',
  brandQrHeading: 'Build your spec before you arrive at the show.',
  brandQrIntro:
    'Pick a model below and lock in what you actually want before you walk onto the stand. On desktop, scan the QR code with your phone to keep building on the go. On mobile, tap the button to start.',
  brandCards: [
    { _type: 'brandCard', _key: key('q'), name: 'Stockman Rover', brand: 'Stockman', quoteSlug: 'rover', tagline: 'The all-rounder. Off-grid ready, family friendly, 90 second setup.', showSpecial: '$2,500 of free accessories included - show only' },
    { _type: 'brandCard', _key: key('q'), name: 'Stockman Trekka', brand: 'Stockman', quoteSlug: 'trekka', tagline: 'The serious off-road camper trailer. Tough, light, made for tracks.', showSpecial: '$5,000 of free accessories included - show only' },
    { _type: 'brandCard', _key: key('q'), name: 'Kimberley Karavan', brand: 'Kimberley', quoteSlug: 'karavan', tagline: 'The iconic Australian-made off-road caravan. 30 years of refinement.', showSpecial: '$3,000 accessory credit (Kimberley factory promotion)' },
    { _type: 'brandCard', _key: key('q'), name: 'Kimberley Kube', brand: 'Kimberley', quoteSlug: 'kube', tagline: 'Compact, capable, premium off-grid living. Couples and small families.', showSpecial: 'Show package - lock in 2026 pricing before July rises' },
    { _type: 'brandCard', _key: key('q'), name: 'Kimberley Kruiswagen', brand: 'Kimberley', quoteSlug: 'kruiswagen', tagline: 'The expedition motorhome. Self-contained, anywhere, any track.', showSpecial: 'Show special - ask Shane on the stand' },
    { _type: 'brandCard', _key: key('q'), name: 'Kimberley Kruiser T Class', brand: 'Kimberley', quoteSlug: 'kruiser-t', tagline: 'The luxury off-road caravan. Touring with everything you need.', showSpecial: 'Show package - lock in 2026 pricing before July rises' },
    { _type: 'brandCard', _key: key('q'), name: 'Kimberley Kruiser S Class', brand: 'Kimberley', quoteSlug: 'kruiser-s', tagline: 'The flagship. Apartment-grade interior in a true off-road shell.', showSpecial: 'Show package - lock in 2026 pricing before July rises' },
  ],

  // ─── Narrative copy ─────────────────────────────────────
  whyComeHeading: 'Why come and see us in person.',
  whyComeBody: [
    block(
      'Online videos and a spec builder are a great way to start. But there is no substitute for opening every cupboard, running your hand along the joinery, and asking the awkward questions face-to-face. The Brisbane Show is the easiest way to do all of that in one place.'
    ),
    block(
      'Shane and the SEQ team will be on the stand for all five days, with a curated lineup of Kimberley Kampers and Stockman stock - including options set up for serious off-grid touring.'
    ),
  ],
  privateSlotCtaHeading: 'Reserve a private 20-minute show slot.',
  privateSlotCtaBody:
    'Show floors get busy. Lock in focused time with Shane to walk through a specific caravan and we will confirm a slot during the show. Heads-up: we will not be checking email at the show floor - send your slot request before Wednesday morning, or text 0422 624 920 during show hours.',
  cantMakeItHeading: "Can't make it to Brisbane?",
  cantMakeItBody: [
    block(
      'No problem. Our Sunshine Coast showroom is open by appointment year-round - drive an hour north and you will get our undivided attention, no show-floor chaos required.'
    ),
  ],

  // ─── FAQs ───────────────────────────────────────────────
  faqs: [
    {
      _type: 'faq',
      _key: key('f'),
      q: 'Where will SEQ Campers be at the Brisbane Show?',
      a: 'Brisbane Showgrounds, Bowen Hills, Main Oval, stand #2693. Doors open Wednesday 3 June and we are on the floor through to Sunday 7 June. Free trains for ticket holders straight to the showgrounds.',
    },
    {
      _type: 'faq',
      _key: key('f'),
      q: 'Can I scan a QR code on this page to start building my quote before the show?',
      a: 'Yes - on a desktop or laptop. Each caravan above has a QR code you can scan with your phone to jump straight into the spec builder. On mobile, tap the "Build your spec" button instead.',
    },
    {
      _type: 'faq',
      _key: key('f'),
      q: 'Which caravans are you bringing to the show?',
      a: 'Kimberley Kruiswagen (Mercedes 4x4 motorhome), Kimberley Karavan Eco Suite (with media release), Kimberley Kruiser T Class and S Class, plus Stockman Trekka and Stockman Rover. A full lineup across the Kimberley and Stockman ranges.',
    },
    {
      _type: 'faq',
      _key: key('f'),
      q: 'Can I book a private chat at the show?',
      a: 'Yes - and we recommend it. Show floors get busy. If you would like a focused 20-minute walk-through of any caravan in our stock, send through the contact form and we will lock in a time during the show.',
    },
    {
      _type: 'faq',
      _key: key('f'),
      q: 'Will there be show pricing?',
      a: 'Yes. Each brand on this page has a show special listed. We hold these back for visitors who come and see us in person - they are not listed elsewhere online.',
    },
    {
      _type: 'faq',
      _key: key('f'),
      q: 'I cannot make it to Brisbane. Can I still get show pricing?',
      a: 'Get in touch before or during the show and we will see what we can do. Show specials are easier to honour for buyers who can visit our Sunshine Coast showroom during the show week.',
    },
  ],
}

async function main() {
  console.log(`Seeding Show document ${DOC_ID} ...`)
  const result = await client.createOrReplace(doc)
  console.log('OK - document written:')
  console.log(`  _id:    ${result._id}`)
  console.log(`  title:  ${result.title}`)
  console.log(`  slug:   /shows/${result.slug.current}`)
  console.log(`  status: ${result.status}`)
  console.log('')
  console.log('Open it in Studio:')
  console.log(`  https://seqcampers.sanity.studio/structure/pagesContent;showsCaravanShowsEvents;${result._id}`)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
