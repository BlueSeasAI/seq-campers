// Sanity schema: Accessory (document type)
//
// One document per accessory or accessory CATEGORY (e.g. "Off-Grid Toilets").
// Each can hold one or more products/options (e.g. the Cuddy + the S1), a photo
// gallery (upload as many as you like), and an optional compare block. Every
// product name automatically becomes a choice in the single Accessories order
// form's dropdown - so SEQ never needs a new form per accessory.

export default {
  name: 'accessory',
  title: 'Accessory',
  type: 'document',

  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'products', title: 'Products / options' },
    { name: 'compare', title: 'Compare block (optional)' },
  ],

  fields: [
    {
      name: 'title',
      title: 'Accessory name / category',
      type: 'string',
      group: 'main',
      description: 'e.g. "Off-Grid Toilets". This heads the section on the Accessories page.',
      validation: (Rule) => Rule.required().max(80),
    },
    {
      name: 'eyebrow',
      title: 'Eyebrow (tiny label above the title)',
      type: 'string',
      group: 'main',
      description: 'Optional, e.g. "Composting & sealing".',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'badges',
      title: 'Badges (small pills)',
      type: 'array',
      group: 'main',
      of: [{ type: 'string' }],
      description: 'e.g. Certified Installer, Waterless, Chemical-free, No dump points.',
      validation: (Rule) => Rule.max(6),
    },
    {
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      group: 'main',
      rows: 3,
      validation: (Rule) => Rule.max(600),
    },
    {
      name: 'products',
      title: 'Products / options',
      type: 'array',
      group: 'products',
      description:
        'One per product. Each product name becomes a choice in the order form dropdown automatically.',
      of: [
        {
          type: 'object',
          name: 'product',
          fields: [
            { name: 'name', title: 'Product name', type: 'string', validation: (Rule) => Rule.required().max(80) },
            {
              name: 'photos',
              title: 'Photos of THIS product',
              type: 'array',
              description: 'Photos of this specific product. The first is the main image; customers can tap any to enlarge. Drag several in at once.',
              options: { layout: 'grid' },
              of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'string' }] }],
            },
            {
              name: 'videoUrl',
              title: 'Video URL (optional)',
              type: 'url',
              description: 'Optional YouTube link for a walkthrough of this product. It shows as a video player on the product card, just under the description.',
            },
            { name: 'brand', title: 'Brand', type: 'string', validation: (Rule) => Rule.max(40) },
            { name: 'type', title: 'Type line', type: 'string', description: 'e.g. "Composting · waterless · smell-free".', validation: (Rule) => Rule.max(80) },
            { name: 'tag', title: 'Tag (small coloured pill)', type: 'string', description: 'Short label shown on the card, e.g. "In stock", "Pre-order", "On-road", "Off-road".', validation: (Rule) => Rule.max(20) },
            {
              name: 'tagColor',
              title: 'Tag colour',
              type: 'string',
              options: {
                list: [
                  { title: 'Green (in stock)', value: 'green' },
                  { title: 'Rust (pre-order / off-road)', value: 'rust' },
                  { title: 'Gold (highlight)', value: 'gold' },
                  { title: 'Olive (on-road)', value: 'olive' },
                  { title: 'Grey', value: 'muted' },
                ],
                layout: 'dropdown',
              },
              initialValue: 'rust',
            },
            { name: 'price', title: 'Price (display text)', type: 'string', description: 'e.g. "$1,795" or "Pre-order". Leave blank to show "Enquire".', validation: (Rule) => Rule.max(40) },
            { name: 'priceNote', title: 'Price note (small print)', type: 'string', description: 'e.g. "Indicative - confirm with SEQ · 24-month warranty".', validation: (Rule) => Rule.max(120) },
            { name: 'pitch', title: 'Pitch (1-2 sentences)', type: 'text', rows: 2, validation: (Rule) => Rule.max(400) },
            { name: 'features', title: 'Feature bullets', type: 'array', of: [{ type: 'string' }], description: 'The tick bullets shown on the product card.', validation: (Rule) => Rule.max(8) },
            { name: 'specs', title: 'Mini specs', type: 'array', of: [{ type: 'string' }], description: 'Short specs shown at the foot of the card, e.g. "9.5kg", "Solids 14.7L".', validation: (Rule) => Rule.max(8) },
          ],
          preview: { select: { title: 'name', subtitle: 'price' } },
        },
      ],
    },
    {
      name: 'compareHeading',
      title: 'Compare section heading',
      type: 'string',
      group: 'compare',
      description: 'Optional. Leave blank to hide the compare block. e.g. "Composting or sealing - which suits you?"',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'compareIntro',
      title: 'Compare section intro',
      type: 'text',
      group: 'compare',
      rows: 2,
      validation: (Rule) => Rule.max(300),
    },
    {
      name: 'compareColumns',
      title: 'Compare columns',
      type: 'array',
      group: 'compare',
      of: [
        {
          type: 'object',
          name: 'compareCol',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.max(60) },
            { name: 'body', title: 'Body', type: 'text', rows: 2, validation: (Rule) => Rule.max(300) },
            { name: 'note', title: 'Note (small)', type: 'text', rows: 2, validation: (Rule) => Rule.max(300) },
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
      validation: (Rule) => Rule.max(4),
    },
    {
      name: 'compareNote',
      title: 'Compare note (full-width, below the columns)',
      type: 'text',
      group: 'compare',
      rows: 3,
      description: 'Optional summary line under the compare columns, e.g. the bracket/pricing explainer.',
      validation: (Rule) => Rule.max(800),
    },
    {
      name: 'orderRank',
      title: 'Display order',
      type: 'number',
      group: 'main',
      description: 'Lower numbers appear first on the Accessories page. Use 10, 20, 30 so you can slot between.',
      initialValue: 10,
    },
  ],

  preview: {
    select: { title: 'title', media: 'products.0.photos.0' },
    prepare({ title, media }) {
      return { title: title || 'Accessory', media }
    },
  },

  orderings: [
    { title: 'Display order', name: 'order', by: [{ field: 'orderRank', direction: 'asc' }] },
  ],
}
