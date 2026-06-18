// Sanity schema: Handover page (UNLISTED).
//
// New-owner welcome pages handed to customers when they collect a van.
// One page per brand family (Kimberley Kampers, Stockman Products). Each
// page has one or more model sections; each section has its own intro
// copy + a list of walk-through YouTube videos.
//
// These pages are NOT in the main site navigation. They're shared by
// direct URL (from the printed handover letter or follow-up email).
// noindex meta tag is set on the page so they don't appear in search.

export default {
  name: 'handoverPage',
  title: 'Handover page',
  type: 'document',

  fields: [
    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description: 'The /handover/{slug} URL. Use "kimberley" or "stockman".',
      options: { source: 'title', maxLength: 60 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Page title (brand family)',
      type: 'string',
      description: 'e.g. "Kimberley Kampers" or "Stockman Products". Shown in the page header.',
      validation: (Rule) => Rule.required().max(80),
    },
    {
      name: 'congratulationsHeading',
      title: 'Congratulations heading',
      type: 'string',
      description: 'e.g. "Congratulations on your new Kimberley Kampers". Shown above the model sections.',
      validation: (Rule) => Rule.required().max(140),
    },
    {
      name: 'introBody',
      title: 'Intro paragraph (optional)',
      type: 'text',
      rows: 3,
      description: 'Short welcome paragraph shown under the congratulations heading.',
      validation: (Rule) => Rule.max(500),
    },
    {
      name: 'sections',
      title: 'Model sections',
      type: 'array',
      description: 'Add one section per model on this page. Each section gets its own heading + a grid of YouTube videos.',
      of: [
        {
          type: 'object',
          name: 'modelSection',
          fields: [
            {
              name: 'modelName',
              title: 'Model name',
              type: 'string',
              description: 'e.g. "Kimberley Karavan" or "Stockman Rover 02".',
              validation: (Rule) => Rule.required().max(80),
            },
            {
              name: 'introHeading',
              title: 'Section intro heading',
              type: 'string',
              description: 'e.g. "Please watch these videos before your Kimberley Karavan handover".',
              validation: (Rule) => Rule.max(200),
            },
            {
              name: 'videos',
              title: 'Videos',
              type: 'array',
              description: 'Add as many videos as you like. Drag to reorder.',
              of: [
                {
                  type: 'object',
                  name: 'handoverVideo',
                  fields: [
                    { name: 'title', title: 'Video title', type: 'string', validation: (Rule) => Rule.required().max(140) },
                    { name: 'youtubeUrl', title: 'YouTube URL', type: 'url', validation: (Rule) => Rule.required() },
                    { name: 'description', title: 'Short description (optional)', type: 'string', validation: (Rule) => Rule.max(220) },
                  ],
                  preview: {
                    select: { title: 'title', subtitle: 'youtubeUrl' },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'modelName', videos: 'videos' },
            prepare({ title, videos }) {
              const n = Array.isArray(videos) ? videos.length : 0
              return { title, subtitle: `${n} video${n === 1 ? '' : 's'}` }
            },
          },
        },
      ],
    },
  ],

  preview: {
    select: { title: 'title', sections: 'sections' },
    prepare({ title, sections }) {
      const n = Array.isArray(sections) ? sections.length : 0
      return { title, subtitle: `${n} model section${n === 1 ? '' : 's'}` }
    },
  },
}
