// Sanity schema: Site Settings (singleton)
//
// One-off document for site-wide content. Created by clicking "Site Settings"
// in the Studio sidebar - there is only ever one of these.
//
// Currently controls:
//   - Hero video URL (the YouTube background loop on the home page)
//   - Shane's Pick reference (the featured used caravan on the home page)
//
// Hours and street address are NOT here - they're hardcoded in src/layouts/Site.astro
// footer + src/pages/contact.astro because they almost never change and we don't
// want Maud accidentally publishing a typo'd address.

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton - we'll lock to a single instance in sanity.config.js structure

  fields: [
    {
      name: 'heroVideo',
      title: 'Home page hero video',
      type: 'object',
      description: 'The YouTube video that plays as a loop in the home page hero. When set, replaces the default SVG outback illustration.',
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
      title: 'Shane\'s Pick (this week\'s featured caravan)',
      type: 'object',
      description: 'Featured used caravan promoted on the home page. The reference field below pulls the caravan; the override fields below let you add the special "Shane\'s Pick" framing.',
      options: { columns: 1 },
      fields: [
        {
          name: 'caravan',
          title: 'Caravan to feature',
          type: 'reference',
          to: [{ type: 'caravan' }],
          description: 'Pick from existing caravan listings. Leave blank to hide the Shane\'s Pick block.',
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
          title: 'Shane\'s quote about this van',
          type: 'text',
          rows: 3,
          description: 'A few sentences from Shane on why this one is special. Shown as the body copy.',
        },
      ],
    },

  ],

  preview: {
    prepare() {
      return { title: 'Site Settings', subtitle: 'Hero video and Shane\'s Pick' }
    },
  },
}
