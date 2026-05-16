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
      description: 'Whole dollars only, no comma',
      validation: (Rule) => Rule.required().positive(),
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
        { name: 'sleeps', title: 'Sleeps', type: 'number', validation: (Rule) => Rule.min(1).integer() },
        { name: 'length', title: 'Length (m)', type: 'number' },
        { name: 'tareWeight', title: 'Tare weight (kg)', type: 'number' },
        { name: 'payload', title: 'Payload (kg)', type: 'number' },
        { name: 'atm', title: 'ATM (kg)', type: 'number' },
        { name: 'ballWeight', title: 'Ball weight (kg)', type: 'number' },
      ],
    },

    {
      name: 'features',
      title: 'Key features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'One per line. Shown as a bullet list on the listing page.',
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
            { name: 'name', title: 'Option name', type: 'string' },
            { name: 'priceAdd', title: 'Add to price (AUD)', type: 'number' },
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
