// Sanity schema: Accessories page (singleton)
//
// Drives the /accessories page. Maud adds 5-6 accessory items (photo + name +
// description). No buying flow yet - each item shows an "Enquire" button and
// the page has one enquiry form that emails SEQ. Stripe pricing can be added
// later (leave priceLabel blank for now).

export default {
  name: 'accessoriesPageSettings',
  title: 'Accessories page',
  type: 'document',

  fields: [
    {
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 3,
      description: 'Short intro shown under the page heading, e.g. "Genuine off-road accessories we fit and ship Australia-wide."',
      validation: (Rule) => Rule.max(400),
    },
    {
      name: 'heroVideo',
      title: 'Accessories video (YouTube)',
      type: 'object',
      description: 'The accessories video that used to sit on the New page. Paste a YouTube URL.',
      fields: [
        {
          name: 'youtubeUrl',
          title: 'YouTube URL',
          type: 'url',
          validation: (Rule) => Rule.uri({ scheme: ['http', 'https'], allowRelative: false }),
        },
        { name: 'caption', title: 'Caption (optional)', type: 'string', validation: (Rule) => Rule.max(160) },
      ],
    },
    {
      name: 'items',
      title: 'Accessories (add 5-6)',
      type: 'array',
      description: 'One box per accessory. Drag to reorder. Each needs a photo, a name and a short description.',
      of: [
        {
          type: 'object',
          name: 'accessory',
          fields: [
            {
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', title: 'Alt text (for SEO)', type: 'string' }],
            },
            { name: 'title', title: 'Name', type: 'string', validation: (Rule) => Rule.required().max(80) },
            { name: 'description', title: 'Description', type: 'text', rows: 3, validation: (Rule) => Rule.max(400) },
            {
              name: 'priceLabel',
              title: 'Price (optional)',
              type: 'string',
              description: 'Leave blank for now - the box shows an Enquire button. Add later if you want a price displayed.',
              validation: (Rule) => Rule.max(40),
            },
          ],
          preview: { select: { title: 'title', subtitle: 'priceLabel', media: 'image' } },
        },
      ],
      validation: (Rule) => Rule.max(12).warning('Aim for 5-6 accessories'),
    },
  ],

  preview: { prepare: () => ({ title: 'Accessories page' }) },
}
