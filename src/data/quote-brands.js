// Brand-specific quote enquiry page data.
//
// Each entry powers one /quote/{slug} page. Pages are intentionally simple
// for Phase 1 (Brisbane Show, June 2026) - structured enquiry forms, not
// full configurators. Phase 2 will replace these with Tesla-style cascading
// configurators per Luke's recommendation in the 2026-05-28 meeting.
//
// All quote enquiry submissions go to sales@seqcampers.com.au via Netlify
// Forms (replaces the previous mailto handover - more reliable on iOS).

// Value-stack inclusions for the show offer (Hormozi pattern: stack value,
// don't discount). These are mirrored from the Brisbane Show page but
// per-brand customised - rover/karavan have their unique factory promos.
const STANDARD_SHOW_INCLUSIONS = [
  { label: 'Full annual service voucher', value: 1450 },
  { label: 'Premium hitch upgrade', value: 1290 },
  { label: '12 months roadside cover', value: 580 },
  { label: 'Stone deflector + rock tamer kit', value: 880 },
  { label: 'Show floor handover pack', value: 540 },
  { label: 'Locked-in 2026 pricing (before July rises)', value: 5000 },
]
function withBrandExtra(brandSpecific) {
  return [...STANDARD_SHOW_INCLUSIONS, ...brandSpecific]
}

export const quoteBrands = [
  {
    slug: 'rover',
    brandFamily: 'Stockman',
    name: 'Stockman Rover',
    headline: 'Off-grid ready, family friendly, 90-second setup.',
    intro:
      'The all-rounder. Built tough enough for serious tracks, simple enough that anyone can use it. Lift the roof, drop the bed, kettle on - 90 seconds from arrival to camp.',
    showSpecial: 'Free 2000W inverter upgrade (worth $1,900) - show only',
    indicativePrice: 'From $63,490',
    inclusions: withBrandExtra([
      { label: 'Free 2000W inverter upgrade (Rover only)', value: 1900 },
    ]),
    keyChoices: [
      { id: 'power', label: 'Power system', options: ['Standard (200Ah lithium + 300W solar)', 'Plus (300Ah + 600W solar)', 'Max (400Ah + 1000W solar + 2000W inverter)'] },
      { id: 'beds', label: 'Bed layout', options: ['Couple (king)', 'Family (queen + bunks)', 'Solo travel'] },
      { id: 'awning', label: 'Awning + annex', options: ['Standard roll-out', 'Premium with walls', 'No awning'] },
      { id: 'heater', label: 'Heating', options: ['Diesel heater', 'Gas heater', 'No heater'] },
      { id: 'tow', label: 'Tow vehicle', options: ['Dual-cab ute (Ranger/HiLux/Triton)', 'Wagon (Prado/200-Series/Patrol)', 'Something else - happy to discuss'] },
    ],
  },
  {
    slug: 'trekka',
    brandFamily: 'Stockman',
    name: 'Stockman Trekka',
    headline: 'The serious off-road camper trailer. Tough, light, made for tracks.',
    intro:
      'The hard-floor camper trailer Shane personally recommends to anyone tackling remote tracks. Lower, lighter, tougher. Australian-built galvanised chassis, independent suspension, hot-dip everywhere.',
    showSpecial: 'Show pricing available on the stand',
    indicativePrice: 'From $65,500',
    inclusions: STANDARD_SHOW_INCLUSIONS,
    keyChoices: [
      { id: 'power', label: 'Power system', options: ['Standard (150Ah AGM + 200W solar)', 'Plus (200Ah lithium + 400W solar)', 'Max (300Ah lithium + 600W solar)'] },
      { id: 'kitchen', label: 'Kitchen setup', options: ['Slide-out with sink + cooker', 'Slide-out with sink + cooker + fridge', 'Internal kitchen only'] },
      { id: 'awning', label: 'Awning + annex', options: ['Standard roll-out', 'Premium with walls and floor', 'No awning'] },
      { id: 'tow', label: 'Tow vehicle', options: ['Dual-cab ute', 'Wagon (Prado/Patrol/etc.)', 'Smaller 4WD'] },
      { id: 'usage', label: 'Mostly used for', options: ['Weekend trips close to home', 'Long off-grid adventures', 'Mix of both'] },
    ],
  },
  {
    slug: 'karavan',
    brandFamily: 'Kimberley',
    name: 'Kimberley Karavan',
    headline: 'The iconic Australian-made off-road caravan. 30 years of refinement.',
    intro:
      'Kimberley\'s flagship caravan. Hand-built in Australia from a galvanised chassis up. Apartment-grade interior in an off-road-capable shell. The kind of van that does a lap of Oz and comes back with stories.',
    showSpecial: '$3,000 accessory credit on every Karavan ordered at the show',
    indicativePrice: 'From $129,385',
    inclusions: withBrandExtra([
      { label: '$3,000 accessory credit (Kimberley factory)', value: 3000 },
    ]),
    keyChoices: [
      { id: 'layout', label: 'Layout', options: ['Couple (front bedroom + rear ensuite)', 'Family (bunks)', 'Open plan'] },
      { id: 'power', label: 'Power package', options: ['Standard (Kimberley factory)', 'Plus (extra solar + lithium)', 'Maximum (full off-grid spec)'] },
      { id: 'kitchen', label: 'Kitchen setup', options: ['Standard internal', 'Internal + external slide-out', 'Premium upgrade (Corian benchtops, full appliance suite)'] },
      { id: 'climate', label: 'Climate control', options: ['Rooftop reverse-cycle AC', 'Diesel heater', 'Both AC + heater'] },
      { id: 'tow', label: 'Tow vehicle', options: ['Ute (3500kg tow rating)', 'Wagon (200-Series/Patrol/Ranger 4WD)', 'Truck/Iveco/heavier'] },
    ],
  },
  {
    slug: 'kube',
    brandFamily: 'Kimberley',
    name: 'Kimberley Kube',
    headline: 'Compact, capable, premium off-grid living. Couples and small families.',
    intro:
      'A more compact off-road caravan that doesn\'t compromise on build quality. Easier to tow, easier to manoeuvre into tight bush camps. Same Kimberley build standard as the Karavan in a friendlier footprint.',
    showSpecial: 'Show package - lock in 2026 pricing before July rise',
    indicativePrice: 'From $80,365',
    inclusions: withBrandExtra([
      { label: '$3,000 accessory credit (Kimberley factory)', value: 3000 },
    ]),
    keyChoices: [
      { id: 'layout', label: 'Bed layout', options: ['Queen across', 'Queen east-west', 'Family with bunks'] },
      { id: 'power', label: 'Power package', options: ['Standard', 'Off-grid spec (extra lithium + solar)'] },
      { id: 'kitchen', label: 'Kitchen', options: ['Internal only', 'Internal + external slide-out'] },
      { id: 'climate', label: 'Climate control', options: ['AC + heater', 'AC only', 'Heater only'] },
      { id: 'tow', label: 'Tow vehicle', options: ['Mid-size 4WD', 'Full-size 4WD/ute', 'Smaller wagon'] },
    ],
  },
  {
    slug: 'kruiswagen',
    brandFamily: 'Kimberley',
    name: 'Kimberley Kruiswagen',
    headline: 'The expedition motorhome. Self-contained, anywhere, any track.',
    intro:
      'Not a caravan - the Kruiswagen is a motorhome built on a serious 4WD chassis. Drive it, sleep in it, live out of it. The closest thing to a Unimog camper available in Australia today.',
    showSpecial: 'Show special - ask Shane on the stand',
    indicativePrice: 'From $203,350',
    inclusions: STANDARD_SHOW_INCLUSIONS,
    keyChoices: [
      { id: 'chassis', label: 'Base chassis', options: ['Iveco Daily 4x4', 'Mercedes Sprinter 4x4', 'Other (discuss with Shane)'] },
      { id: 'layout', label: 'Interior layout', options: ['Couple (rear bed + ensuite)', 'Family (bunks)', 'Custom layout'] },
      { id: 'power', label: 'Power package', options: ['Standard expedition', 'Off-grid plus', 'Maximum self-sufficiency'] },
      { id: 'use', label: 'Primary use', options: ['Full-time travel', 'Long trips (1-3 months)', 'Weekends + holidays'] },
      { id: 'license', label: 'Driver license', options: ['Standard car license', 'Light rigid (LR)', 'Medium rigid (MR)'] },
    ],
  },
  {
    slug: 'kruiser-t',
    brandFamily: 'Kimberley',
    name: 'Kimberley Kruiser T Class',
    headline: 'The luxury off-road caravan. Touring with everything you need.',
    intro:
      'The T Class steps the Kruiser range into luxury territory. Long-haul touring spec with everything you would expect from a premium caravan - and the off-road capability to take it anywhere.',
    showSpecial: 'Show package - lock in 2026 pricing before July rise',
    indicativePrice: 'From $223,600',
    inclusions: withBrandExtra([
      { label: '$3,000 accessory credit (Kimberley factory)', value: 3000 },
    ]),
    keyChoices: [
      { id: 'layout', label: 'Layout', options: ['Couple (front bed + rear ensuite)', 'Open plan with island bed', 'Custom'] },
      { id: 'finish', label: 'Interior finish', options: ['Standard Kruiser T', 'Premium upgrade', 'Custom finish (discuss with Shane)'] },
      { id: 'power', label: 'Power package', options: ['Standard', 'Off-grid plus', 'Maximum'] },
      { id: 'climate', label: 'Climate control', options: ['AC + diesel heater', 'AC + ducted heating', 'Custom'] },
      { id: 'tow', label: 'Tow vehicle', options: ['200-Series LandCruiser', '300-Series LandCruiser', 'Nissan Patrol', 'Other'] },
    ],
  },
  {
    slug: 'kruiser-s',
    brandFamily: 'Kimberley',
    name: 'Kimberley Kruiser S Class',
    headline: 'The flagship. Apartment-grade interior in a true off-road shell.',
    intro:
      'The S Class is the most premium caravan in the Kimberley range. Custom-built per order. Apartment-grade interior, expedition-grade chassis, and a build process that takes around 8 months from order to delivery.',
    showSpecial: 'Show order - secure your 2026 build slot before they sell out',
    indicativePrice: 'From $139,300',
    inclusions: withBrandExtra([
      { label: '$3,000 accessory credit (Kimberley factory)', value: 3000 },
      { label: 'Priority 2026 build slot', value: 0, note: 'Skip the queue - 8 month build instead of 12+.' },
    ]),
    keyChoices: [
      { id: 'layout', label: 'Layout', options: ['Couple (front bed + rear ensuite)', 'Family with bunks', 'Custom layout'] },
      { id: 'finish', label: 'Interior finish', options: ['S Class standard', 'Premium upgrade', 'Bespoke custom build'] },
      { id: 'power', label: 'Power package', options: ['Standard S Class', 'Off-grid plus', 'Maximum self-sufficiency'] },
      { id: 'climate', label: 'Climate control', options: ['AC + diesel heater', 'Ducted heating + AC', 'Full climate package'] },
      { id: 'timeline', label: 'When do you want it?', options: ['ASAP - happy to take stock if available', '6-12 months', '12 months+'] },
    ],
  },
]

export function getQuoteBrand(slug) {
  return quoteBrands.find((b) => b.slug === slug) ?? null
}
