// Sanity schema: Caravan
//
// This single file defines the entire admin form a receptionist sees
// when they click "Add caravan" or edit an existing listing.
//
// Change a field here, refresh the studio in the browser, the form
// updates instantly. No database migration. No developer hand-off.

export default {
  name: 'caravan',
  title: 'Caravan',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Caravan name',
      type: 'string',
      description: 'Shown in the listing - e.g. "Stockman Trekka 2024"',
      validation: (Rule) => Rule.required().min(3),
    },

    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description: 'Used in the public web address. Click "Generate" to auto-fill.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      description: 'Pick the manufacturer (Kimberley, Stockman, etc.)',
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'price',
      title: 'Price (AUD)',
      type: 'number',
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
      name: 'condition',
      title: 'Condition rating',
      type: 'string',
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
      description:
        'Drag to reorder. First photo is the main image shown in the listing grid. Drop new files anywhere to add.',
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
      of: [{ type: 'block' }],
      description: 'Use the toolbar for headings and bullet points',
    },

    {
      name: 'specs',
      title: 'Specifications',
      type: 'object',
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
      ],
    },

    {
      name: 'compliance',
      title: 'Compliance and identifiers',
      type: 'object',
      description: 'Helps buyers trust the listing - VIN enables PPSR/NEVDIS lookup.',
      options: { columns: 2 },
      fields: [
        {
          name: 'vin',
          title: 'VIN (17 characters)',
          type: 'string',
          description: 'Vehicle Identification Number, exactly 17 characters.',
          validation: (Rule) =>
            Rule.custom((v) => {
              if (!v) return true
              if (v.length !== 17) return 'Should be exactly 17 characters'
              return true
            }),
        },
        {
          name: 'registrationState',
          title: 'Registration state',
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
      name: 'power',
      title: 'Power system',
      type: 'object',
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
      rows: 4,
      description: 'Tell the story. Notable trips, what conditions it handled, how it performed. Buyers love the story - especially for second-hand vans. Even 2-3 sentences makes a big difference.',
    },

    {
      name: 'features',
      title: 'Key features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'One per line. Shown as a bullet list on the listing page.',
    },

    {
      name: 'videos',
      title: 'Videos (YouTube)',
      type: 'array',
      description:
        'Paste up to 3 YouTube links. The first 3 display in a row on the listing page.',
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
      title: 'Available configurations',
      type: 'array',
      description: 'Optional. Add-on options the customer can pick.',
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

    {
      name: 'featured',
      title: 'Featured on homepage?',
      type: 'boolean',
      initialValue: false,
    },
  ],

  // Controls how each caravan appears in the listing sidebar of the studio
  preview: {
    select: {
      title: 'title',
      price: 'price',
      status: 'status',
      media: 'photos.0',
    },
    prepare({ title, price, status, media }) {
      const statusLabel = {
        'for-sale': 'For Sale',
        'sold': 'SOLD',
        'on-hold': 'On Hold',
        'coming-soon': 'Coming Soon',
      }[status] || status

      const priceStr = price
        ? `$${price.toLocaleString('en-AU')}`
        : 'No price set'

      return {
        title,
        subtitle: `${priceStr}  -  ${statusLabel}`,
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
