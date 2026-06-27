// Sanity schema: Accessories page settings (singleton)
//
// Page-level bits for /accessories: the intro and the accessories video.
// The accessories themselves are now separate "Accessory" documents (one per
// product/category), each with its own photo gallery + products. Each product
// auto-populates the single order form's dropdown.

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
  ],

  preview: { prepare: () => ({ title: 'Accessories page' }) },
}
