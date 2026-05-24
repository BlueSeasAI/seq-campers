// Sanity schema: Site Settings (singleton)
//
// One-off document for site-wide content. Created by clicking "Site Settings"
// in the Studio sidebar - there is only ever one of these.
//
// Currently controls:
//   - Hero video URL (the YouTube background loop on the home page)
//   - Shane's Pick reference (the featured used caravan on the home page)
//   - Sale of the week messaging
//   - Workshop opening hours

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

    {
      name: 'workshopHours',
      title: 'Workshop opening hours',
      type: 'string',
      description: 'Shown on the /service page and footer. e.g. "Mon-Fri, 8am-4:30pm AEST"',
      initialValue: 'Mon to Fri, 8am to 4:30pm AEST',
    },

    {
      name: 'showroomHours',
      title: 'Showroom opening hours',
      type: 'string',
      description: 'Shown on /about and /contact. e.g. "Mon-Fri 8am-5pm, Sat 8am-12pm"',
      initialValue: 'Mon to Sat, 8am to 5pm AEST',
    },

    {
      name: 'streetAddress',
      title: 'Street address',
      type: 'string',
      description: 'Full street address for the contact page map and footer. e.g. "6 Bonanza Ct, Marcoola QLD 4564"',
    },
  ],

  preview: {
    prepare() {
      return { title: 'Site Settings', subtitle: 'Hero video, Shane\'s Pick, hours, address' }
    },
  },
}
