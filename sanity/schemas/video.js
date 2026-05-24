// Sanity schema: Video
//
// One document per YouTube video Maud wants on the site. Used by:
//   /videos (the education library, grouped by category)
//   Home page "Latest from YouTube" (newest 3 across all categories)
//   Per-caravan video embeds (via the videos[] field on the caravan doc,
//     which is separate - those are tied to a specific listing)
//
// Maud workflow: paste the YouTube URL, type a title and short description,
// pick a category, hit Publish. Site refreshes within ~30 seconds.

export default {
  name: 'video',
  title: 'Video (library)',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Video title',
      type: 'string',
      description: 'Shown above the thumbnail. Keep it tight - 8 to 12 words.',
      validation: (Rule) => Rule.required().min(4).max(120),
    },

    {
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Full YouTube link, e.g. https://www.youtube.com/watch?v=abc123 or https://youtu.be/abc123',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['http', 'https'], allowRelative: false }),
    },

    {
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 2,
      description: '1-2 sentences shown under the title. Tell buyers what they\'ll see.',
      validation: (Rule) => Rule.max(220),
    },

    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Where this video lives on the /videos page.',
      options: {
        list: [
          { title: 'Getting Started - intros and overviews', value: 'getting-started' },
          { title: 'Setup & Packing - tutorials', value: 'setup' },
          { title: 'Product Deep-Dives - features and interiors', value: 'deep-dive' },
          { title: 'On the Road - off-road tests + reviews', value: 'on-the-road' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'getting-started',
    },

    {
      name: 'featured',
      title: 'Show on home page "Latest from YouTube"?',
      type: 'boolean',
      description: 'Tick to feature this video in the 3-video strip on the home page.',
      initialValue: false,
    },

    {
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower = shown first within its category. Leave blank to sort by date added.',
      validation: (Rule) => Rule.integer().min(0).max(999),
    },
  ],

  preview: {
    select: { title: 'title', subtitle: 'category', featured: 'featured' },
    prepare({ title, subtitle, featured }) {
      const catLabel = {
        'getting-started': 'Getting Started',
        'setup': 'Setup & Packing',
        'deep-dive': 'Deep-Dive',
        'on-the-road': 'On the Road',
      }[subtitle] || subtitle
      return {
        title,
        subtitle: `${catLabel}${featured ? ' · Featured on home' : ''}`,
      }
    },
  },

  orderings: [
    { title: 'Category then display order', name: 'catOrder', by: [{ field: 'category', direction: 'asc' }, { field: 'order', direction: 'asc' }] },
    { title: 'Newest first', name: 'newest', by: [{ field: '_createdAt', direction: 'desc' }] },
  ],
}
