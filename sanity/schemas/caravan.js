// Sanity schema: Caravan
//
// This single file defines the entire admin form a receptionist sees
// when they click "Add caravan" or edit an existing listing.
//
// Change a field here, refresh the studio in the browser, the form
// updates instantly. No database migration. No developer hand-off.

import {
  TextIcon,
  TagIcon,
  LinkIcon,
  StarIcon,
  NumberIcon,
  CheckmarkCircleIcon,
  EyeOpenIcon,
  PlayIcon,
  VideoIcon,
  ImagesIcon,
  DocumentTextIcon,
  CogIcon,
  OlistIcon,
  DocumentIcon,
  HelpCircleIcon,
} from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'caravan',
  title: 'Caravan',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Caravan name',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'Shown in the listing - e.g. "Stockman Products Trekka 2024" or "Kimberley Kampers Karavan 2023"',
      validation: (Rule) => Rule.required().min(3),
    },

    {
      name: 'compliance',
      title: 'Stock identifiers',
      type: 'object',
      components: { field: withFieldIcon(TagIcon) },
      description: 'Fill the SEQ stock number here FIRST, then click Generate on the URL slug below - the stock number gets added to the web address so URLs never clash. VIN + registration state are optional.',
      options: { columns: 2 },
      fields: [
        {
          name: 'stockNumber',
          title: 'SEQ stock number',
          type: 'string',
          description: 'The SEQ Campers stock number. Free text - can include letters and numbers (e.g. 1234, K1234, SC-2024-001). Shown on the listing AND added to the end of the URL slug.',
        },
        {
          name: 'vin',
          title: 'VIN (optional, 17 characters)',
          type: 'string',
          description: 'Vehicle Identification Number. Optional - skip for consignment / older stock where VIN is not available. If you do enter one, it must be exactly 17 characters.',
          validation: (Rule) =>
            Rule.custom((v) => {
              if (!v) return true
              if (v.length !== 17) return 'Should be exactly 17 characters'
              return true
            }),
        },
        {
          name: 'registrationState',
          title: 'Registration state (optional)',
          type: 'string',
          options: {
            list: [
              { title: 'QLD - Queensland', value: 'QLD' },
              { title: 'NSW - New South Wales', value: 'NSW' },
              { title: 'VIC - Victoria', value: 'VIC' },
              { title: 'WA - Western Australia', value: 'WA' },
              { title: 'SA - South Australia', value: 'SA' },
              { title: 'TAS - Tasmania', value: 'TAS' },
              { title: 'ACT - Australian Capital Territory', value: 'ACT' },
              { title: 'NT - Northern Territory', value: 'NT' },
            ],
            layout: 'dropdown',
          },
        },
      ],
    },

    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      components: { field: withFieldIcon(LinkIcon) },
      description: 'The web address ending for this caravan. Fill in the SEQ stock number below FIRST, then click the blue Generate button - it auto-builds the URL from the Caravan name PLUS the stock number (e.g. ...kimberley-karavan-7455). The stock number on the end keeps every URL unique and easy to identify. If you type your own, use only lowercase letters, numbers and hyphens.',
      options: {
        // Build the slug from the title + the SEQ stock number, so two vans
        // with the same year/make/model never collide (Kyle, Jun 2026) and the
        // URL is self-identifying. Fill the stock number in first, then Generate.
        source: (doc) => [doc?.title, doc?.compliance?.stockNumber].filter(Boolean).join(' '),
        maxLength: 96,
        slugify: (input) =>
          String(input)
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule) =>
        Rule.required()
          .error('Slug is required - click the blue Generate button to auto-create it from the caravan name.')
          .custom((value) => {
            if (!value?.current) return true
            const slug = value.current
            if (!/^[a-z0-9-]+$/.test(slug)) {
              return 'Slug can only contain lowercase letters, numbers and hyphens. Click the blue Generate button next to this field to auto-fix it.'
            }
            if (slug.startsWith('-') || slug.endsWith('-')) {
              return 'Slug cannot start or end with a hyphen. Click Generate to auto-fix.'
            }
            if (slug.includes('--')) {
              return 'Slug cannot contain double-hyphens. Click Generate to auto-fix.'
            }
            return true
          }),
    },

    {
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      components: { field: withFieldIcon(TagIcon) },
      to: [{ type: 'brand' }],
      description: 'Pick the manufacturer (Kimberley Kampers, Stockman Products, etc.)',
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'price',
      title: 'Price (AUD)',
      type: 'number',
      components: { field: withFieldIcon(NumberIcon) },
      description: 'Whole dollars only, no comma. Most premium off-road vans are $40K-$200K.',
      validation: (Rule) =>
        Rule.required()
          .positive()
          .integer()
          .min(1000)
          .max(500000)
          .warning('Most caravans are $20K-$200K - confirm if outside this range'),
    },

    {
      name: 'status',
      title: 'Status',
      type: 'string',
      components: { field: withFieldIcon(TagIcon) },
      options: {
        list: [
          { title: 'For Sale', value: 'for-sale' },
          { title: 'Sold', value: 'sold' },
          { title: 'On Hold', value: 'on-hold' },
          { title: 'Coming Soon', value: 'coming-soon' },
        ],
        layout: 'radio',
      },
      initialValue: 'for-sale',
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'soldListed',
      title: 'Show in the public Sold archive?',
      type: 'boolean',
      components: { field: withFieldIcon(EyeOpenIcon) },
      description:
        'Only matters once Status is Sold. On = this sold van shows in the public Sold Caravans archive (on /sold). Off = kept in the system but hidden from the website. Tip: keep the most recent handful On and switch older ones Off - nothing is ever deleted.',
      initialValue: true,
      hidden: ({ document }) => document?.status !== 'sold',
    },

    {
      name: 'stockType',
      title: 'New or Used',
      type: 'string',
      components: { field: withFieldIcon(TagIcon) },
      description: 'Select which page this caravan appears on. NEW caravans show on /new (with configurator entry). USED caravans show on /stock.',
      options: {
        list: [
          { title: 'NEW - factory build', value: 'new' },
          { title: 'USED - second-hand / consignment', value: 'used' },
        ],
        layout: 'radio',
      },
      initialValue: 'used',
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'brollVideoFile',
      title: 'B-roll video file (MP4 - plays clean, no YouTube branding)',
      type: 'file',
      components: { field: withFieldIcon(PlayIcon) },
      options: { accept: 'video/mp4' },
      description: 'PREFERRED. Upload the MP4 clip directly - the same export you send to YouTube. It plays with no YouTube logo, title or controls at all. Keep it SHORT (15-30 seconds) and export at 720p - aim for under 8 MB so the page stays fast. If both this and the YouTube URL below are filled in, this file is used.',
    },

    {
      name: 'brollVideoUrl',
      title: 'B-roll YouTube video (backup - YouTube branding will show)',
      type: 'url',
      components: { field: withFieldIcon(PlayIcon) },
      description: 'The short looping video shown in the small tile for this caravan on /new (if NEW) or /stock (if USED) - before the visitor clicks into the full listing. Keep it SHORT (15-30 seconds is ideal). Paste the full YouTube URL. Auto-plays muted, but YouTube adds its own title/logo and a play button on some phones - upload an MP4 above to avoid that. Click the tile - opens the full spec page.',
    },

    {
      name: 'condition',
      title: 'Condition rating',
      type: 'string',
      components: { field: withFieldIcon(StarIcon) },
      description: 'Honest assessment of overall condition. Shown as a badge on the listing.',
      options: {
        list: [
          { title: 'Excellent - as-new', value: 'excellent' },
          { title: 'Very Good', value: 'very-good' },
          { title: 'Good', value: 'good' },
          { title: 'Fair', value: 'fair' },
          { title: 'Project - needs work', value: 'project' },
        ],
        layout: 'dropdown',
      },
    },

    {
      name: 'photos',
      title: 'Photos',
      type: 'array',
      components: { field: withFieldIcon(ImagesIcon) },
      description:
        '⚡ TO UPLOAD MANY PHOTOS AT ONCE: open File Explorer (Windows) or Finder (Mac), select multiple photos (Ctrl+click on Windows / Cmd+click on Mac, or Shift+click for a range), then DRAG the whole selection into the dashed dropzone below. They will all upload in parallel. The "Add item" button only adds one photo at a time - use drag-and-drop for bulk. Drag thumbnails to reorder once uploaded - the first photo is the main image shown in the listing grid.',
      options: { layout: 'grid' },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', title: 'Caption (optional)', type: 'string' },
            { name: 'alt', title: 'Alt text (for SEO)', type: 'string' },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error('Add at least one photo'),
    },

    {
      name: 'description',
      title: 'Description',
      type: 'array',
      components: { field: withFieldIcon(DocumentTextIcon) },
      of: [{ type: 'block' }],
      description: 'Use the toolbar for headings and bullet points',
    },

    {
      name: 'specs',
      title: 'Specifications',
      type: 'object',
      components: { field: withFieldIcon(CogIcon) },
      options: { columns: 2 },
      fields: [
        {
          name: 'year',
          title: 'Year of manufacture',
          type: 'number',
          options: {
            list: Array.from({ length: 27 }, (_, i) => ({ title: String(2026 - i), value: 2026 - i })),
            layout: 'dropdown',
          },
        },
        {
          name: 'sleeps',
          title: 'Sleeps',
          type: 'number',
          description: 'Number of berths (sleeping spots). Most caravans sleep 2-6.',
          validation: (Rule) =>
            Rule.positive()
              .integer()
              .min(1)
              .max(12)
              .warning('Most caravans sleep 2-6 - confirm if more than 8'),
        },
        {
          name: 'length',
          title: 'Length (m)',
          type: 'number',
          description: 'Overall length in metres. Typical off-road caravans are 4-8m.',
          validation: (Rule) =>
            Rule.positive()
              .precision(1)
              .min(2)
              .max(15)
              .warning('Most caravans are 3-10m - confirm if outside this range'),
        },
        {
          name: 'tareWeight',
          title: 'Tare weight (kg)',
          type: 'number',
          description: 'Unloaded weight. Most off-road caravans are 1500-3000kg tare.',
          validation: (Rule) =>
            Rule.positive()
              .integer()
              .min(200)
              .max(6000)
              .warning('Most caravans are 1000-3500kg tare - confirm if outside this range'),
        },
        {
          name: 'payload',
          title: 'Payload (kg)',
          type: 'number',
          description: 'Loading capacity (ATM minus Tare). Typically 300-1000kg.',
          validation: (Rule) =>
            Rule.positive()
              .integer()
              .min(50)
              .max(2500)
              .warning('Most caravan payloads are 300-1200kg - confirm if outside this range'),
        },
        {
          name: 'atm',
          title: 'ATM (Aggregate Trailer Mass, kg)',
          type: 'number',
          description: 'Maximum legal loaded weight. Always greater than Tare. Typically 2000-4000kg.',
          validation: (Rule) =>
            Rule.positive()
              .integer()
              .min(300)
              .max(8000)
              .warning('Most caravans have ATM of 1500-4500kg - confirm if outside this range'),
        },
        {
          name: 'ballWeight',
          title: 'Ball weight (kg)',
          type: 'number',
          description: 'Downward force on tow ball when hitched. Typically 8-12% of tare (i.e. 150-400kg).',
          validation: (Rule) =>
            Rule.positive()
              .integer()
              .min(30)
              .max(800)
              .warning('Most caravans have ball weights of 100-450kg - confirm if outside this range'),
        },
        {
          name: 'waterCapacityL',
          title: 'Water capacity (L)',
          type: 'number',
          description: 'Total fresh-water tank capacity in litres. Off-road caravans typically carry 90-300L.',
          validation: (Rule) =>
            Rule.positive()
              .integer()
              .min(20)
              .max(1000)
              .warning('Most caravans carry 90-300L - confirm if outside this range'),
        },
      ],
    },

    {
      name: 'topFeatures',
      title: 'Top 5 features ("Is this right for you?")',
      type: 'array',
      components: { field: withFieldIcon(StarIcon) },
      of: [{ type: 'string' }],
      description: 'The five biggest selling points of this caravan. Per Shane (16 Jun): "what are the five benefits of this van? Is this right for you?" Each one should be a short, specific benefit (e.g. "Tows behind a mid-size SUV - 1,800kg ATM"). Aim for 5 lines.',
      validation: (Rule) => Rule.max(7).warning('Aim for exactly 5'),
    },

    {
      name: 'power',
      title: 'Power system',
      type: 'object',
      components: { field: withFieldIcon(CogIcon) },
      description: 'Battery, solar and inverter setup. Leave blank what does not apply.',
      options: { columns: 2 },
      fields: [
        {
          name: 'batteryType',
          title: 'Battery type',
          type: 'string',
          description: 'Lithium (LiFePO4) usually commands a premium - worth calling out.',
          options: {
            list: [
              { title: 'Lithium (LiFePO4)', value: 'lithium' },
              { title: 'AGM', value: 'agm' },
              { title: 'Gel', value: 'gel' },
              { title: 'Lead Acid', value: 'lead-acid' },
              { title: 'Mixed', value: 'mixed' },
            ],
            layout: 'dropdown',
          },
        },
        {
          name: 'batteryCapacityAh',
          title: 'Battery capacity (Ah)',
          type: 'number',
          description:
            'Total amp-hour capacity. Common sizes: 80, 100, 120, 150, 200, 250, 300, 400, 500, 600 Ah. Type any value - free input.',
          validation: (Rule) =>
            Rule.positive()
              .integer()
              .min(1)
              .max(2000)
              .warning('Most caravan batteries are 80-600Ah - double check if outside this range'),
        },
        {
          name: 'solarWatts',
          title: 'Solar capacity (Watts)',
          type: 'number',
          description:
            'Total wattage across roof + portable. Common sizes: 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200 W. Type any value - e.g. 320 means 200W roof + 120W portable.',
          validation: (Rule) =>
            Rule.positive()
              .integer()
              .min(10)
              .max(5000)
              .warning('Most caravan solar setups are 100-1200W - double check if outside this range'),
        },
        {
          name: 'inverterWatts',
          title: 'Inverter (Watts)',
          type: 'number',
          description:
            'Pure sine wave inverter output. Common sizes: 300, 600, 1000, 1500, 2000, 3000 W. Type any value. Leave blank if no inverter.',
          validation: (Rule) =>
            Rule.positive()
              .integer()
              .min(50)
              .max(10000)
              .warning('Most caravan inverters are 300-3000W - double check if outside this range'),
        },
      ],
    },

    {
      name: 'tripHistory',
      title: 'Trip / travel history - "Where has this van been?"',
      type: 'text',
      components: { field: withFieldIcon(DocumentTextIcon) },
      rows: 4,
      description: 'Tell the story. Notable trips, what conditions it handled, how it performed. Buyers love the story - especially for second-hand vans. Even 2-3 sentences makes a big difference.',
    },

    {
      name: 'faqs',
      title: 'FAQs for this caravan (optional)',
      type: 'array',
      components: { field: withFieldIcon(HelpCircleIcon) },
      description:
        'Optional. If left empty, the site uses a smart default FAQ set tailored to this caravan (brand, model, specs). Add custom Q&As here when you want to answer something specific - e.g. "Does this van have the optional Cape York pack?" Each Q&A is also exposed as Schema.org FAQPage data so AI search engines can quote the answers directly.',
      of: [
        {
          type: 'object',
          name: 'faq',
          fields: [
            {
              name: 'q',
              title: 'Question',
              type: 'string',
              description: 'Phrase as a natural search query.',
              validation: (Rule) => Rule.required().min(8).max(180),
            },
            {
              name: 'a',
              title: 'Answer',
              type: 'text',
              rows: 3,
              description: 'Direct answer in 40-80 words. First sentence should answer the question outright.',
              validation: (Rule) => Rule.required().min(20).max(800),
            },
          ],
          preview: {
            select: { title: 'q', subtitle: 'a' },
          },
        },
      ],
      validation: (Rule) =>
        Rule.max(8).warning('More than 8 FAQs makes the listing harder to scan - aim for 5-6'),
    },

    {
      name: 'features',
      title: 'Key features',
      type: 'array',
      components: { field: withFieldIcon(OlistIcon) },
      of: [{ type: 'string' }],
      description: 'One per line. Shown as a bullet list on the listing page.',
    },

    {
      name: 'heroVideo',
      title: 'Hero video (top of listing)',
      type: 'url',
      components: { field: withFieldIcon(PlayIcon) },
      description:
        'Optional. A YouTube link shown as the FIRST thing on the listing, ABOVE the photos. Leave it blank and the photos show first as normal. Paste the full YouTube URL, e.g. https://www.youtube.com/watch?v=abc123',
    },

    {
      name: 'videos',
      title: 'Videos (lower down the page)',
      type: 'array',
      components: { field: withFieldIcon(VideoIcon) },
      description:
        'Optional. Paste up to 3 YouTube links shown LOWER DOWN the listing, below the photos. For the video at the very TOP of the listing, use the "Hero video" field above. The first 3 display in a row.',
      of: [
        {
          type: 'object',
          name: 'video',
          fields: [
            {
              name: 'url',
              title: 'YouTube URL',
              type: 'url',
              description: 'Full YouTube link, e.g. https://www.youtube.com/watch?v=abc123',
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ['http', 'https'],
                  allowRelative: false,
                }),
            },
            {
              name: 'label',
              title: 'Short label (optional)',
              type: 'string',
              description: 'e.g. "Off-road walkaround" or "Interior tour"',
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Video',
                subtitle: subtitle || '',
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.max(3).warning('Only the first 3 videos display on the listing page'),
    },

    {
      name: 'configurator',
      title: 'Available configurations (new stock only)',
      type: 'array',
      components: { field: withFieldIcon(DocumentIcon) },
      description: 'Leave blank for consignment / used stock. Only fill this in for NEW caravans where buyers can add upgrades (extra solar, lithium upgrade, etc.). The Brisbane Show "Build your spec" flow now lives on the dedicated /quote/{brand} pages, not on the listing itself.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Option name',
              type: 'string',
              validation: (Rule) => Rule.required().min(2),
            },
            {
              name: 'priceAdd',
              title: 'Add to price (AUD)',
              type: 'number',
              description: 'Whole dollars only. Most add-ons range $200 to $10,000.',
              validation: (Rule) =>
                Rule.required()
                  .positive()
                  .integer()
                  .min(1)
                  .max(50000)
                  .warning('Most add-ons are $200-$10,000 - confirm if outside this range'),
            },
          ],
        },
      ],
    },

  ],

  // Controls how each caravan appears in the listing sidebar of the studio.
  // Per Bart 18 Jun: surface the stock number in the list so Maud + Shane can
  // ID a van at a glance without opening it. Format: title on first line,
  // "$price - Status  ·  #stockNumber" on the second.
  preview: {
    select: {
      title: 'title',
      price: 'price',
      status: 'status',
      stockNumber: 'compliance.stockNumber',
      media: 'photos.0',
    },
    prepare({ title, price, status, stockNumber, media }) {
      const statusLabel = {
        'for-sale': 'For Sale',
        'sold': 'SOLD',
        'on-hold': 'On Hold',
        'coming-soon': 'Coming Soon',
      }[status] || status

      const priceStr = price
        ? `$${price.toLocaleString('en-AU')}`
        : 'No price set'

      const stockSuffix = stockNumber ? `  ·  #${stockNumber}` : ''

      return {
        title,
        subtitle: `${priceStr}  -  ${statusLabel}${stockSuffix}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Status, then price (low to high)',
      name: 'statusPriceAsc',
      by: [
        { field: 'status', direction: 'asc' },
        { field: 'price', direction: 'asc' },
      ],
    },
    {
      title: 'Newest first',
      name: 'newest',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
}
