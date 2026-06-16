// Singleton: Home page settings.
//
// Per Bart 16 Jun: "when I'm on the home page in Sanity, I don't need to
// see site settings for things like show specials - just what's on this
// page". Split out from the old monolithic siteSettings so each page
// menu item in Studio opens only its own relevant fields.

export default {
  name: 'homePageSettings',
  title: 'Home page',
  type: 'document',

  fields: [
    {
      name: 'heroVideo',
      title: 'Hero video',
      type: 'object',
      description: 'The YouTube video that plays as a looping background in the home page hero. Leave blank to use the default outback illustration.',
      options: { columns: 1 },
      fields: [
        {
          name: 'youtubeUrl',
          title: 'YouTube URL',
          type: 'url',
          description: 'Paste the full link. The site converts it to an autoplay muted loop.',
        },
        {
          name: 'caption',
          title: 'Optional caption',
          type: 'string',
          description: 'Shown briefly when the video starts. Optional.',
        },
      ],
    },

    {
      name: 'shanesPick',
      title: "Shane's Pick (this week's featured caravan)",
      type: 'object',
      description: "Featured used caravan promoted on the home page. The reference field below pulls the caravan; the override fields let you add the special \"Shane's Pick\" framing.",
      options: { columns: 1 },
      fields: [
        {
          name: 'caravan',
          title: 'Caravan to feature',
          type: 'reference',
          to: [{ type: 'caravan' }],
          description: "Pick from existing caravan listings. Leave blank to hide the Shane's Pick block.",
        },
        {
          name: 'originalPrice',
          title: 'Original price (optional)',
          type: 'number',
          description: 'If this is a price drop, enter the original price - the listing price will show with a strike-through above the discounted price.',
          validation: (Rule) => Rule.positive().integer(),
        },
        {
          name: 'shanesQuote',
          title: "Shane's quote about this van",
          type: 'text',
          rows: 3,
          description: 'A few sentences from Shane on why this one is special. Shown as the body copy.',
        },
        {
          name: 'status',
          title: 'Status pill',
          type: 'string',
          description: 'Shown as a small pill near the block. "Coming soon" = the van is being brought in. "Available now" = on the floor. "Hidden" = no pill.',
          options: {
            list: [
              { title: 'Hidden (no pill)', value: 'hidden' },
              { title: 'Coming soon (orange)', value: 'coming-soon' },
              { title: 'Available now (green)', value: 'available-now' },
            ],
            layout: 'radio',
          },
          initialValue: 'hidden',
        },
      ],
    },

    {
      name: 'homepageVideo1',
      title: '1. Watch - pathway video (links to /videos)',
      type: 'object',
      options: { columns: 1, collapsible: true, collapsed: false },
      description: 'The looping video behind the WATCH pathway tile on the home page.',
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url' },
        { name: 'description', title: 'Sub text (one line)', type: 'string', validation: (Rule) => Rule.max(220) },
      ],
    },
    {
      name: 'homepageVideo2',
      title: '2. Visit - pathway video (links to /stock)',
      type: 'object',
      options: { columns: 1, collapsible: true, collapsed: true },
      description: 'The looping video behind the VISIT pathway tile on the home page.',
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url' },
        { name: 'description', title: 'Sub text (one line)', type: 'string', validation: (Rule) => Rule.max(220) },
      ],
    },
    {
      name: 'homepageVideo3',
      title: '3. Adventure - pathway video (links to /service)',
      type: 'object',
      options: { columns: 1, collapsible: true, collapsed: true },
      description: 'The looping video behind the ADVENTURE pathway tile on the home page.',
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url' },
        { name: 'description', title: 'Sub text (one line)', type: 'string', validation: (Rule) => Rule.max(220) },
      ],
    },
  ],

  preview: { prepare() { return { title: 'Home page settings' } } },
}
