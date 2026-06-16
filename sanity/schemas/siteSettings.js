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
    { name: 'homeVideos', title: 'Home page videos (Watch / Visit / Adventure)' },
    { name: 'newTiles', title: 'New page video tiles (8 slots)' },
    { name: 'banner', title: 'Show Special banner' },
    { name: 'reserve', title: 'Reserve $1,000 CTA' },
    { name: 'shows', title: 'Shows page intro' },
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
        {
          name: 'status',
          title: 'Status pill',
          type: 'string',
          description: 'Shown as a small pill near the Shane\'s Pick block on the home page. "Coming soon" = the van is being brought in but not yet on the floor. "Available now" = on the floor today. "Hidden" = no pill shown.',
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

    // ─── NEW PAGE VIDEO TILES (8 fixed slots) ──────────────────────
    // The 8 tiles on /new in 4 rows of 2. Order is fixed in code:
    //   Row 1: tile1 (Kruiswagen) · tile2 (Kruiser)
    //   Row 2: tile3 (Karavan)     · tile4 (Kube)
    //   Row 3: tile5 (Trekka)      · tile6 (Rover)
    //   Row 4: tile7 (Pod)         · tile8 (Accessories)
    // Each slot has its own video URL + brand label + model label + price
    // + CTA link override. Leave any field blank to fall back to the
    // sensible default coded for that slot.
    ...[
      { n: 1, t: 'Tile 1: Kruiswagen (Row 1 left, Kimberley Campers)' },
      { n: 2, t: 'Tile 2: Kruiser (Row 1 right, Kimberley Campers)' },
      { n: 3, t: 'Tile 3: Karavan (Row 2 left, Kimberley Campers)' },
      { n: 4, t: 'Tile 4: Kube (Row 2 right, Kimberley Campers)' },
      { n: 5, t: 'Tile 5: Trekka (Row 3 left, Stockman Products)' },
      { n: 6, t: 'Tile 6: Rover (Row 3 right, Stockman Products)' },
      { n: 7, t: 'Tile 7: Pod (Row 4 left, Stockman Products)' },
      { n: 8, t: 'Tile 8: Accessories (Row 4 right)' },
    ].map(({ n, t }) => ({
      name: `newPageTile${n}`,
      title: t,
      type: 'object',
      group: 'newTiles',
      options: { columns: 1, collapsible: true, collapsed: true },
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url', description: 'Paste the full YouTube link. Leave blank to use the default placeholder.' },
        { name: 'brandLabel', title: 'Brand label override', type: 'string', description: 'e.g. "Kimberley Campers" or "Stockman Products". Leave blank to use the default for this slot.' },
        { name: 'modelLabel', title: 'Model label override', type: 'string', description: 'e.g. "Kruiswagen". Leave blank to use the default for this slot.' },
        { name: 'priceLabel', title: 'Price label override', type: 'string', description: 'e.g. "From $203,350". Leave blank to use the default for this slot.' },
        { name: 'ctaHref', title: 'Click-through URL override', type: 'string', description: 'Where the tile click takes the visitor. Leave blank to use the default for this slot (usually /quote/{slug}).' },
      ],
    })),

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

    // ─── HOME PAGE PATHWAY VIDEOS (Watch / Visit / Adventure) ───
    // These 3 slots drive the looping B-roll videos behind the home
    // page pathway tiles. The pathway labels ("1. Watch", "2. Visit",
    // "3. Adventure") and link targets (/videos, /stock, /service)
    // are page structure - they stay in code. Maud controls only the
    // video URL and the one-line sub text under each label.
    {
      name: 'homepageVideo1',
      title: '1. Watch - pathway video (links to /videos)',
      type: 'object',
      group: 'homeVideos',
      options: { columns: 1, collapsible: true, collapsed: false },
      description: 'The looping video behind the WATCH pathway tile on the home page. Leave URL blank to fall back to the default.',
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url', description: 'Paste the full YouTube link, e.g. https://www.youtube.com/watch?v=abc123' },
        { name: 'description', title: 'Sub text (one line)', type: 'string', description: 'The short line shown under "1. Watch". Leave blank to keep the default copy.', validation: (Rule) => Rule.max(220) },
      ],
    },
    {
      name: 'homepageVideo2',
      title: '2. Visit - pathway video (links to /stock)',
      type: 'object',
      group: 'homeVideos',
      options: { columns: 1, collapsible: true, collapsed: true },
      description: 'The looping video behind the VISIT pathway tile on the home page. Leave URL blank to fall back to the default.',
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url', description: 'Paste the full YouTube link.' },
        { name: 'description', title: 'Sub text (one line)', type: 'string', description: 'The short line shown under "2. Visit". Leave blank to keep the default copy.', validation: (Rule) => Rule.max(220) },
      ],
    },
    {
      name: 'homepageVideo3',
      title: '3. Adventure - pathway video (links to /service)',
      type: 'object',
      group: 'homeVideos',
      options: { columns: 1, collapsible: true, collapsed: true },
      description: 'The looping video behind the ADVENTURE pathway tile on the home page. Leave URL blank to fall back to the default.',
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url', description: 'Paste the full YouTube link.' },
        { name: 'description', title: 'Sub text (one line)', type: 'string', description: 'The short line shown under "3. Adventure". Leave blank to keep the default copy.', validation: (Rule) => Rule.max(220) },
      ],
    },

    // ─── SHOWS PAGE INTRO + COMPILATION VIDEO ─────────────────────
    {
      name: 'showsIndexIntro',
      title: 'Shows page - intro paragraph',
      type: 'text',
      group: 'shows',
      rows: 4,
      description: 'The intro paragraph shown above the list of upcoming shows on /shows. Plain text. Leave blank to fall back to the default hard-coded copy.',
      validation: (Rule) => Rule.max(600),
    },
    {
      name: 'showsCompilationVideo',
      title: 'Shows page - compilation video (top of page)',
      type: 'object',
      group: 'shows',
      description: 'A YouTube video shown prominently at the top of /shows. Use it for a "highlights from past shows" compilation. Leave the URL blank to hide the video block.',
      options: { columns: 1 },
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url', description: 'Paste the full YouTube link, e.g. https://www.youtube.com/watch?v=abc123. Leave blank to hide the video block.' },
        { name: 'caption', title: 'Caption under the video (optional)', type: 'string', description: 'One-line caption shown below the video. e.g. "Highlights from the Brisbane Show 2026".', validation: (Rule) => Rule.max(140) },
      ],
    },

  ],

  preview: {
    prepare() {
      return { title: 'Site Settings', subtitle: 'Hero, Shane\'s Pick, banner, Reserve CTA, intros' }
    },
  },
}
