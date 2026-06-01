// Sanity schema: Site Settings (singleton)
//
// One-off document for site-wide content. Created by clicking "Site Settings"
// in the Studio sidebar - there is only ever one of these.
//
// Currently controls:
//   - Hero video URL (the YouTube background loop on the home page)
//   - Shane's Pick reference (the featured used caravan on the home page)
//   - Show Special banner (the site-wide "Get it before [date]" strip)
//   - Reserve $1,000 CTA (button text + Stripe URL shown on /new caravans)
//   - Marketing intros for /about and /shows
//
// Hours and street address are NOT here - they're hardcoded in src/layouts/Site.astro
// footer + src/pages/contact.astro because they almost never change and we don't
// want Maud accidentally publishing a typo'd address.

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton - locked to a single instance in sanity.config.js structure

  groups: [
    { name: 'home', title: 'Home page', default: true },
    { name: 'banner', title: 'Show Special banner' },
    { name: 'reserve', title: 'Reserve $1,000 CTA' },
    { name: 'marketing', title: 'Marketing intros' },
  ],

  fields: [
    // ─── HOME PAGE ────────────────────────────────────────────────
    {
      name: 'heroVideo',
      title: 'Home page hero video',
      type: 'object',
      group: 'home',
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
      group: 'home',
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

    // ─── SHOW SPECIAL BANNER (site-wide) ────────────────────────────
    {
      name: 'showSpecial',
      title: 'Show Special banner (site-wide strip)',
      type: 'object',
      group: 'banner',
      description: 'The thin coloured strip that runs across the top of every page. Use it to push a deadline ("Get it before the Brisbane Caravan Show ends Sun 8 June"). Leave the headline blank to hide the banner entirely.',
      options: { columns: 1 },
      fields: [
        {
          name: 'headline',
          title: 'Banner headline',
          type: 'string',
          description: 'Short, urgency-led. Example: "Get it before the Brisbane Caravan Show ends Sun 8 June". Leave blank to hide.',
          validation: (Rule) => Rule.max(140),
        },
        {
          name: 'endDate',
          title: 'Banner end date',
          type: 'date',
          description: 'Optional. When this date passes the banner auto-hides. Use it so you do not have to remember to switch the banner off after the show.',
          options: { dateFormat: 'YYYY-MM-DD' },
        },
        {
          name: 'ctaText',
          title: 'CTA link text (optional)',
          type: 'string',
          description: 'Optional clickable text shown after the headline, e.g. "See the show offers".',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'ctaUrl',
          title: 'CTA link URL (optional)',
          type: 'string',
          description: 'Where the CTA text links to. Use a relative path like /show-offer or a full URL.',
        },
      ],
    },

    // ─── RESERVE $1,000 CTA ─────────────────────────────────────────
    {
      name: 'reserveCta',
      title: 'Reserve $1,000 CTA (shown on /new)',
      type: 'object',
      group: 'reserve',
      description: 'The "Reserve this van for $1,000" Stripe payment button shown on the New Caravans page. Leave the Stripe URL blank to hide the button.',
      options: { columns: 1 },
      fields: [
        {
          name: 'enabled',
          title: 'Show the Reserve button?',
          type: 'boolean',
          description: 'Tick to show the Reserve button on /new. Untick to hide it everywhere.',
          initialValue: false,
        },
        {
          name: 'buttonText',
          title: 'Button text',
          type: 'string',
          description: 'What the button says. Default: "Reserve for $1,000".',
          initialValue: 'Reserve for $1,000',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'stripeUrl',
          title: 'Stripe payment link URL',
          type: 'url',
          description: 'The Stripe payment-link URL Maud creates in her Stripe dashboard. Format: https://buy.stripe.com/...',
        },
        {
          name: 'helperText',
          title: 'Helper text under the button',
          type: 'string',
          description: 'Short reassurance line. Default: "Fully refundable. Holds your build slot."',
          initialValue: 'Fully refundable. Holds your build slot.',
          validation: (Rule) => Rule.max(120),
        },
      ],
    },

    // ─── MARKETING INTROS ─────────────────────────────────────────
    {
      name: 'aboutPageIntro',
      title: 'About page - intro paragraph',
      type: 'text',
      group: 'marketing',
      rows: 4,
      description: 'The intro paragraph at the top of /about. Plain text. Leave blank to fall back to the default hard-coded copy.',
      validation: (Rule) => Rule.max(600),
    },

    {
      name: 'showsIndexIntro',
      title: 'Shows page - intro paragraph',
      type: 'text',
      group: 'marketing',
      rows: 4,
      description: 'The intro paragraph at the top of the /shows index page. Plain text. Leave blank to fall back to the default hard-coded copy.',
      validation: (Rule) => Rule.max(600),
    },
  ],

  preview: {
    prepare() {
      return { title: 'Site Settings', subtitle: 'Hero, Shane\'s Pick, banner, Reserve CTA, intros' }
    },
  },
}
