/*
 * Seeds the single "About page" record in Sanity so /about reads its marketing
 * copy from one editable spot (Studio -> About page) instead of the hardcoded
 * literals in src/pages/about.astro.
 *
 * Content: the CURRENT copy pulled verbatim from about.astro as of 2 Jul 2026 -
 * hero, intro story, team (Shane + Maud), the four-chapter timeline, the three
 * "why buy from us" cards, and the dark CTA band. Because about.astro keeps the
 * same literals as fallbacks, running this changes nothing visible on the site;
 * it just makes the copy editable in Studio.
 *
 * Note on team photos: the built-in /team/shane.jpg and /team/maud.jpg photos
 * stay in about.astro as fallbacks matched by name. This seed does NOT set a
 * Sanity `photo` (uploading an image needs the asset pipeline) - Maud can add
 * one per member in Studio later; until then the existing photos show.
 *
 * Note on intro paragraphs: seeded as PLAIN text (no <strong> tags) so the
 * Studio textareas stay clean for Maud. The page fallback keeps the original
 * bolded emphasis; once this record exists the intro shows unbolded, which is a
 * deliberate, tiny copy simplification. If exact bold parity matters, leave the
 * introParagraphs field empty in Studio to keep the styled fallback.
 *
 * Idempotent: fixed _id 'aboutPage', createOrReplace. Re-running overwrites
 * rather than duplicating. Do NOT re-run after Maud has edited the record.
 *
 * Usage from the sanity/ folder:
 *
 *   $env:SANITY_AUTH_TOKEN = "paste-editor-token-here"
 *   npx sanity@latest exec ./scripts/seed-about-page.js
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

// Stable _key generator for array items (Sanity requires _key on array objects).
let keyCounter = 0
const key = () => `about-${++keyCounter}`

// CURRENT copy, verbatim from src/pages/about.astro as of 2 Jul 2026.
const doc = {
  _id: 'aboutPage',
  _type: 'aboutPage',

  heroH1: "The Sunshine Coast's home for off-road caravans and off-grid camping.",
  heroSub:
    'Authorised Kimberley Kampers and Stockman Products dealer in Marcoola, Queensland. Over a decade matching adventurers to the right rig - from first-timers to seasoned grey nomads.',

  introParagraphs: [
    "Born from a genuine love of the open road and the great Australian outdoors, SEQ Campers has been the Sunshine Coast's go-to destination for off-road caravans, off-grid hybrids and 4x4 camper vans for over a decade. Founded by a passionate traveller who knows firsthand what it takes to explore this country off-grid, we've built our reputation on honest advice, deep product knowledge and the kind of personalised service that keeps our customers coming back - and sending their mates our way.",
    "We're proud authorised specialists in Kimberley Kampers (Karavan, Kube, Kruiswagen and Kruiser) and Stockman Products (Trekka, Rover and Pod Trailer), and we carry a carefully curated range of new and used off-road caravans Australia needs - from lightweight off-road campers to luxury off-grid full-size caravans.",
    "Whether you're a first-timer figuring out where to start, a young family chasing weekend off-grid camping, or a seasoned grey nomad upgrading to your forever rig, you'll find a team here that genuinely loves this stuff as much as you do.",
    "Come in, have a chat, and let's get you out there - the Sunshine Coast is a great place to start dreaming about your next off-road adventure, and we're here to help make it happen.",
  ],

  teamEyebrow: 'Meet the team',
  teamHeading: 'Shane and Maud',
  teamSub: 'The team behind SEQ Campers since 2019.',
  team: [
    {
      _key: key(),
      name: 'Shane',
      role: 'Owner · SEQ Campers since 2013',
      bio: 'Shane has called SEQ Campers home since 2013 and has been the proud owner since 2019. Deep love of the outdoors, hands-on mechanical background. He connects with customers as a fellow adventurer who knows exactly what you need out on the road.',
    },
    {
      _key: key(),
      name: 'Maud',
      role: 'Co-owner · Customer Care · Operations',
      bio: 'Maud joined Shane in running the business in 2019, bringing a sharp business mind and a passion for ethical, people-first service. She makes sure every customer feels like part of the SEQ Campers family.',
    },
  ],

  timelineEyebrow: 'Our path here',
  timelineHeading: 'Four chapters, one passion.',
  timeline: [
    {
      _key: key(),
      year: '2013',
      title: 'Shane walks through the door',
      body: 'Started as a staff member with a love of the outdoors and an eye for a good rig. Turns out, it was the beginning of something bigger than just a job.',
    },
    {
      _key: key(),
      year: '2019',
      title: 'Shane & Maud take the wheel',
      body: 'Shane purchased SEQ Campers and alongside Maud, wasted no time making it their own - moving to a new location, building out the team and launching the SEQ Campers YouTube channel all in the same year. Same great business, fresh energy, and a whole new chapter underway.',
    },
    {
      _key: key(),
      year: '2020-2021',
      title: "COVID couldn't stop us",
      body: 'When the showroom doors had to close, the cameras stayed rolling. What started as a way to keep connected with customers turned into a real community - and the YouTube channel now boasts 2,000+ subscribers and counting.',
    },
    {
      _key: key(),
      year: '2025',
      title: 'New home, new website, still going strong',
      body: "We packed up and moved to our best location yet - Marcoola, just minutes from the Sunshine Coast Airport and a stone's throw from one of the coast's most beautiful beach towns. We've also just launched this brand spanking new website to match. Easy to find whether you're local or travelling from further afield - and yes, the site looks just as good as the rigs. Come see us.",
    },
  ],

  whyEyebrow: 'Why buy from us',
  whyHeading: 'What you get from us',
  whyCards: [
    {
      _key: key(),
      heading: "Shane doesn't sell what he hasn't used",
      body: "Every model on the floor has been tested, walked through, and inspected. If we wouldn't take it out, you won't see it on the lot.",
    },
    {
      _key: key(),
      heading: 'Buy and service in one place',
      body: 'The workshop that preps your van is the same one that services it for the next 20 years.',
    },
    {
      _key: key(),
      heading: 'No rush to close',
      body: "We're not in a hurry to close a sale. We're in a hurry to make sure you walk out with the right van.",
    },
  ],

  ctaHeading: 'Come and see us in Marcoola.',
  ctaSub: 'Showroom appointments preferred, after-hours always welcome.',
}

async function main() {
  console.log('Seeding About page singleton...')
  await client.createOrReplace(doc)
  console.log('  ✓ aboutPage')
  console.log('\nDone. /about now reads its copy from Studio -> About page.')
  console.log('Edit the hero, intro, team, timeline, why-us cards and CTA there.')
}

main().catch((err) => { console.error(err); process.exit(1) })
