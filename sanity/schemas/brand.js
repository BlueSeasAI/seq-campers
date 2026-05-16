// Sanity schema: Brand
//
// Caravans reference a brand. Defining brand as its own document
// lets the receptionist pick from a dropdown rather than retyping
// "Kimberley" 14 times.

export default {
  name: 'brand',
  title: 'Brand',
  type: 'document',

  fields: [
    {
      name: 'name',
      title: 'Brand name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'name' },
    },

    {
      name: 'logo',
      title: 'Brand logo',
      type: 'image',
      options: { hotspot: true },
    },

    {
      name: 'description',
      title: 'Brand description',
      type: 'text',
      rows: 3,
      description: 'Shown on the brand filter page',
    },

    {
      name: 'website',
      title: 'Brand website (optional)',
      type: 'url',
    },
  ],

  preview: {
    select: { title: 'name', media: 'logo' },
  },
}
