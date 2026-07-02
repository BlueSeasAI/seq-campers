// Singleton: Home page settings.
//
// Per Bart 16 Jun: "when I'm on the home page in Sanity, I don't need to
// see site settings for things like show specials - just what's on this
// page". Split out from the old monolithic siteSettings so each page
// menu item in Studio opens only its own relevant fields.

import { PlayIcon, StarIcon, TextIcon, DocumentTextIcon, UsersIcon, EditIcon } from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'homePageSettings',
  title: 'Home page',
  type: 'document',

  fields: [
    {
      name: 'heroVideo',
      title: 'Hero video',
      type: 'object',
      components: { field: withFieldIcon(PlayIcon) },
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
      components: { field: withFieldIcon(StarIcon) },
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
      components: { field: withFieldIcon(PlayIcon) },
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
      components: { field: withFieldIcon(PlayIcon) },
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
      components: { field: withFieldIcon(PlayIcon) },
      options: { columns: 1, collapsible: true, collapsed: true },
      description: 'The looping video behind the ADVENTURE pathway tile on the home page.',
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url' },
        { name: 'description', title: 'Sub text (one line)', type: 'string', validation: (Rule) => Rule.max(220) },
      ],
    },

    // ─── MARKETING COPY (added 2 Jul 2026) ──────────────────────────────
    // Section eyebrows / headings / intros + testimonials + reviews counter.
    // Each has the current hardcoded literal kept as a fallback in index.astro
    // so nothing changes on the live site until these are filled in.

    {
      name: 'pathwayEyebrow',
      title: 'Pathway section - eyebrow',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The small coloured label above the "Three steps" heading. Default: "How it works".',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'pathwayHeading',
      title: 'Pathway section - heading',
      type: 'string',
      components: { field: withFieldIcon(EditIcon) },
      description: 'The big heading for the three pathway tiles. Default: "Three steps to your next off-road adventure."',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'pathwayIntro',
      title: 'Pathway section - intro',
      type: 'text',
      rows: 2,
      components: { field: withFieldIcon(DocumentTextIcon) },
      description: 'The paragraph under the pathway heading.',
      validation: (Rule) => Rule.max(400),
    },

    {
      name: 'reviewsCounter',
      title: 'Reviews counter text',
      type: 'string',
      components: { field: withFieldIcon(StarIcon) },
      description: 'The five-star reviews bar text, e.g. "35+ five-star reviews from SEQ owners". Written as one line - "five-star reviews" is bolded automatically.',
      validation: (Rule) => Rule.max(120),
    },

    {
      name: 'testimonialsEyebrow',
      title: 'Testimonials section - eyebrow',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The small coloured label above the testimonials heading. Default: "In their own words".',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'testimonialsHeading',
      title: 'Testimonials section - heading',
      type: 'string',
      components: { field: withFieldIcon(EditIcon) },
      description: 'The testimonials heading. Default: "Real off-road owners, real trips, real stories".',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'testimonialsIntro',
      title: 'Testimonials section - intro',
      type: 'text',
      rows: 2,
      components: { field: withFieldIcon(DocumentTextIcon) },
      description: 'The paragraph under the testimonials heading.',
      validation: (Rule) => Rule.max(400),
    },
    {
      name: 'testimonials',
      title: 'Testimonials (customer reviews)',
      type: 'array',
      components: { field: withFieldIcon(StarIcon) },
      description: 'The customer review cards shown under the testimonials heading. Leave empty to use the built-in Google reviews.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 5,
              components: { field: withFieldIcon(DocumentTextIcon) },
              description: 'The review text - verbatim. Do not add surrounding quote marks; the site adds them.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'name',
              title: 'Name / attribution',
              type: 'string',
              components: { field: withFieldIcon(UsersIcon) },
              description: 'Who left the review, e.g. "Willie & Cathy" or "David Poole".',
              validation: (Rule) => Rule.required().max(80),
            },
            {
              name: 'source',
              title: 'Source line',
              type: 'string',
              components: { field: withFieldIcon(TextIcon) },
              description: 'Where it came from, e.g. "Google review" or "Catherine Fabris · Google review".',
              validation: (Rule) => Rule.max(120),
            },
            {
              name: 'rating',
              title: 'Stars (1-5)',
              type: 'number',
              components: { field: withFieldIcon(StarIcon) },
              description: 'Number of stars to show. Almost always 5.',
              initialValue: 5,
              validation: (Rule) => Rule.min(1).max(5).integer(),
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'source' },
          },
        },
      ],
    },

    {
      name: 'happeningEyebrow',
      title: "What's Happening section - eyebrow",
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The small coloured label above the news feed heading. Default: "What\'s happening".',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'happeningHeading',
      title: "What's Happening section - heading",
      type: 'string',
      components: { field: withFieldIcon(EditIcon) },
      description: 'The news feed heading. Default: "News from the showroom floor".',
      validation: (Rule) => Rule.max(120),
    },
  ],

  preview: { prepare() { return { title: 'Home page settings' } } },
}
