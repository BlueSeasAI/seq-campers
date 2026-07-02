// Sanity schema: Model pricing.
//
// Drives the prices on the model marketing pages (/stockman-rover, /kimberley-
// kruiser, etc.). One record per model. [model].astro overlays these values on
// top of the code defaults in src/data/model-pages.js - so any field left blank
// here falls back to code, and the page never breaks if a record is missing.
//
// This is what makes the recurring "the price changed today" job Maud's, not
// ours: she opens Model pricing, types the new number, hits Publish. Live in ~60s.

import {
  TagIcon,
  EyeOpenIcon,
  NumberIcon,
  InfoOutlineIcon,
  OlistIcon,
  TextIcon,
  DocumentTextIcon,
} from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'modelPricing',
  title: 'Model pricing',
  type: 'document',

  fields: [
    {
      name: 'model',
      title: 'Model',
      type: 'string',
      components: { field: withFieldIcon(TagIcon) },
      description: 'Which model page this pricing controls. Do not change once set.',
      options: {
        list: [
          { title: 'Stockman Rover', value: 'stockman-rover' },
          { title: 'Stockman Trekka', value: 'stockman-trekka' },
          { title: 'Stockman Pod', value: 'stockman-pod' },
          { title: 'Kimberley Kruiser', value: 'kimberley-kruiser' },
          { title: 'Kimberley Karavan', value: 'kimberley-karavan' },
          { title: 'Kimberley Kube', value: 'kimberley-kube' },
          { title: 'Kimberley Kruiswagen', value: 'kimberley-kruiswagen' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'priceOnApplication',
      title: 'Contact for pricing (hide all prices on this page)',
      type: 'boolean',
      components: { field: withFieldIcon(EyeOpenIcon) },
      description: 'Turn ON when a price has changed and you do not yet have the new figure. Every price on this model page is replaced with "Contact us for current pricing" until you turn it off.',
      initialValue: false,
    },
    {
      name: 'heroPriceFrom',
      title: 'Hero "from" price',
      type: 'string',
      components: { field: withFieldIcon(NumberIcon) },
      description: 'The big price at the top of the page, e.g. $59,990. Leave blank to hide it.',
    },
    {
      name: 'heroPriceNote',
      title: 'Hero price note',
      type: 'string',
      components: { field: withFieldIcon(InfoOutlineIcon) },
      description: 'Small text next to the hero price, e.g. "Driveaway pricing & finance available at SEQ Campers".',
    },
    {
      name: 'versions',
      title: 'Version prices',
      type: 'array',
      components: { field: withFieldIcon(OlistIcon) },
      description: 'One row per version card on the page (e.g. Intrepid, Ultra). The name must match the card on the page.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'tag', title: 'Version name', type: 'string', description: 'Must match the version tag shown on the page, e.g. Intrepid, Ultra, S Classic.' },
            { name: 'priceFrom', title: 'Price', type: 'string', description: 'e.g. From $59,990. Leave blank to hide the price on that card.' },
          ],
          preview: { select: { title: 'tag', subtitle: 'priceFrom' } },
        },
      ],
    },
    {
      name: 'pricingHeading',
      title: 'Pricing section heading',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The heading in the "Pricing" section further down the page, e.g. "Priced from $59,990."',
    },
    {
      name: 'pricingBody',
      title: 'Pricing section paragraphs',
      type: 'array',
      components: { field: withFieldIcon(DocumentTextIcon) },
      of: [{ type: 'text', rows: 3 }],
      description: 'The paragraphs under the pricing heading. Add one block per paragraph.',
    },
    {
      name: 'lowPrice',
      title: 'Lowest price (digits only)',
      type: 'string',
      components: { field: withFieldIcon(NumberIcon) },
      description: 'For Google / AI search. Digits only, no $ or commas, e.g. 59990.',
    },
    {
      name: 'highPrice',
      title: 'Highest price (digits only)',
      type: 'string',
      components: { field: withFieldIcon(NumberIcon) },
      description: 'For Google / AI search. Digits only, no $ or commas, e.g. 74990.',
    },
  ],

  preview: {
    select: { title: 'model', poa: 'priceOnApplication', price: 'heroPriceFrom' },
    prepare({ title, poa, price }) {
      return {
        title: title || 'Model pricing',
        subtitle: poa ? 'Contact for pricing (prices hidden)' : (price || 'No hero price set'),
      }
    },
  },

  orderings: [
    { title: 'Model', name: 'model', by: [{ field: 'model', direction: 'asc' }] },
  ],
}
