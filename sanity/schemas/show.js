// Sanity schema: Show
//
// One document per caravan show or event (Brisbane Caravan Show, etc).
// Mirrors every section of the original hard-coded brisbane-show-2026 page
// so Maud can run any future show end-to-end without code changes.
//
// Fields are grouped into tabs so the form is not overwhelming. Most are
// optional - only the basics (title, slug, dates, venue, stand) are
// required. Empty sections auto-hide on the rendered page.
//
// Existing /brisbane-show-2026 URL stays as a separate hardcoded page
// for the 2026 event. Future shows (2027 onwards) live here in Sanity
// and render at /shows/{slug}.

export default {
  name: 'show',
  title: 'Show',
  type: 'document',

  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'callouts', title: 'Page callouts' },
    { name: 'stand', title: 'On the stand' },
    { name: 'offer', title: 'Show offer + inclusions' },
    { name: 'brands', title: 'Brand QR cards' },
    { name: 'narrative', title: 'Narrative copy' },
    { name: 'faq', title: 'FAQ' },
  ],

  fields: [
    // ─── BASICS ──────────────────────────────────────────────────
    {
      name: 'title',
      title: 'Show title',
      type: 'string',
      group: 'basics',
      description: 'Short title shown on page header, e.g. "Brisbane Caravan Show 2027".',
      validation: (Rule) => Rule.required().min(4).max(120),
    },
    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'basics',
      description: 'The /shows/{slug} URL ending. Click Generate to auto-fill from the title.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basics',
      description: 'Upcoming = on the /shows index. Active = highlighted now. Archived = below the fold.',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Active (happening now)', value: 'active' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'startDate',
      title: 'Start date',
      type: 'date',
      group: 'basics',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'endDate',
      title: 'End date',
      type: 'date',
      group: 'basics',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'datesLabel',
      title: 'Dates label (display)',
      type: 'string',
      group: 'basics',
      description: 'Human-friendly version shown on the page, e.g. "3 - 7 June 2026".',
      validation: (Rule) => Rule.required().max(80),
    },
    {
      name: 'daysLabel',
      title: 'Days label (display)',
      type: 'string',
      group: 'basics',
      description: 'Short days summary, e.g. "Wed - Sun, 5 days".',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'venueName',
      title: 'Venue name',
      type: 'string',
      group: 'basics',
      description: 'e.g. "Brisbane Showgrounds, Bowen Hills".',
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: 'venueAddress',
      title: 'Venue address line',
      type: 'string',
      group: 'basics',
      description: 'Short address shown under the venue card, e.g. "600 Gregory Tce, Bowen Hills - free trains for ticket holders".',
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'standNumber',
      title: 'Stand number',
      type: 'string',
      group: 'basics',
      description: 'e.g. "#2693".',
      validation: (Rule) => Rule.max(20),
    },
    {
      name: 'standArea',
      title: 'Stand area',
      type: 'string',
      group: 'basics',
      description: 'e.g. "Main Oval · look for the SEQ Campers banner".',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'podiumNumber',
      title: 'Show floor contact number',
      type: 'string',
      group: 'basics',
      description: 'Phone or mobile staffed during show hours, e.g. "0422 624 920".',
      validation: (Rule) => Rule.max(30),
    },
    {
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      group: 'basics',
      description: 'Tiny label shown above the page H1, e.g. "Brisbane Show 2026".',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'heroH1',
      title: 'Hero headline (H1)',
      type: 'string',
      group: 'basics',
      description: 'Big page heading, e.g. "See us at the Brisbane Caravan Show.".',
      validation: (Rule) => Rule.required().max(140),
    },
    {
      name: 'seoDescription',
      title: 'SEO meta description',
      type: 'text',
      group: 'basics',
      rows: 2,
      description: '120-180 chars. Shown in Google + AI search results. Plain text.',
      validation: (Rule) => Rule.max(220),
    },

    // ─── CALLOUTS (array of typed callouts) ────────────────────
    {
      name: 'calloutBoxes',
      title: 'Callout boxes (tips / warnings / exclusives)',
      type: 'array',
      group: 'callouts',
      description: 'Coloured callout strips shown under the When/Where cards. Add as many as you like. Reorder by dragging.',
      of: [
        {
          type: 'object',
          name: 'callout',
          fields: [
            {
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Tip (green)', value: 'tip' },
                  { title: 'Warning (rust/orange)', value: 'warning' },
                  { title: 'Show exclusive (yellow gradient)', value: 'exclusive' },
                ],
                layout: 'radio',
              },
              initialValue: 'tip',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'badge',
              title: 'Badge text (optional)',
              type: 'string',
              description: 'Tiny pill shown above the title, e.g. "Show floor exclusive". Optional.',
              validation: (Rule) => Rule.max(40),
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Bolded lead-in line.',
              validation: (Rule) => Rule.required().max(120),
            },
            {
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 3,
              description: 'Plain text. One short paragraph.',
              validation: (Rule) => Rule.required().max(600),
            },
          ],
          preview: { select: { title: 'title', subtitle: 'style' } },
        },
      ],
    },

    // ─── ON THE STAND ────────────────────────────────────────────
    {
      name: 'standEyebrow',
      title: 'Stand section eyebrow',
      type: 'string',
      group: 'stand',
      initialValue: 'On the stand',
      description: 'Tiny label above the "Caravans we\'re bringing" heading.',
      validation: (Rule) => Rule.max(40),
    },
    {
      name: 'standHeading',
      title: 'Stand section heading',
      type: 'string',
      group: 'stand',
      description: 'Section title, e.g. "Caravans we\'re bringing to Brisbane.". Leave blank to hide the whole section.',
      validation: (Rule) => Rule.max(140),
    },
    {
      name: 'standCaravans',
      title: 'Caravans on the stand',
      type: 'array',
      group: 'stand',
      description: 'One row per caravan being brought to the show floor.',
      of: [
        {
          type: 'object',
          name: 'standCaravan',
          fields: [
            { name: 'name', title: 'Caravan name', type: 'string', validation: (Rule) => Rule.required().max(120) },
            { name: 'detail', title: 'Short detail', type: 'string', description: 'e.g. "Mercedes 4x4 motorhome".', validation: (Rule) => Rule.max(160) },
          ],
          preview: { select: { title: 'name', subtitle: 'detail' } },
        },
      ],
    },

    // ─── SHOW OFFER + INCLUSIONS ─────────────────────────────────
    {
      name: 'offerEnabled',
      title: 'Show the Show Offer block?',
      type: 'boolean',
      group: 'offer',
      description: 'Tick to enable. The Show Offer block (countdown + value stack) only renders when this is on.',
      initialValue: false,
    },
    {
      name: 'offerHeading',
      title: 'Offer section heading',
      type: 'string',
      group: 'offer',
      initialValue: 'What you get if you buy at the show.',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'offerIntro',
      title: 'Offer section intro paragraph',
      type: 'text',
      group: 'offer',
      rows: 3,
      description: 'Shown under the offer heading.',
      validation: (Rule) => Rule.max(500),
    },
    {
      name: 'offerExpiry',
      title: 'Offer countdown expiry (date + time)',
      type: 'datetime',
      group: 'offer',
      description: 'Powers the live countdown ticker, e.g. show closes Sunday 11pm.',
    },
    {
      name: 'vansRemaining',
      title: 'Show vans available (scarcity number)',
      type: 'number',
      group: 'offer',
      description: 'Shown in the scarcity stat. Update manually as vans get held / sold.',
      validation: (Rule) => Rule.integer().min(0).max(999),
    },
    {
      name: 'holdAmount',
      title: 'Reserve / hold amount (AUD)',
      type: 'number',
      group: 'offer',
      description: 'Dollar amount to lock in show pricing. Whole dollars.',
      validation: (Rule) => Rule.integer().min(1).max(10000),
    },
    {
      name: 'holdHelperText',
      title: 'Hold helper text',
      type: 'string',
      group: 'offer',
      description: 'Small print under the hold stat, e.g. "fully refundable".',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'inclusions',
      title: 'Inclusions (value stack rows)',
      type: 'array',
      group: 'offer',
      description: 'Each tick row in the value stack. Reorder by dragging.',
      of: [
        {
          type: 'object',
          name: 'inclusion',
          fields: [
            { name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required().max(120) },
            { name: 'value', title: 'Value (AUD)', type: 'number', description: 'Indicative dollar value shown on the right.', validation: (Rule) => Rule.required().positive().integer() },
            { name: 'note', title: 'Note (small print)', type: 'string', description: 'One-line description shown under the label.', validation: (Rule) => Rule.max(220) },
          ],
          preview: { select: { title: 'label', value: 'value' }, prepare({ title, value }) { return { title, subtitle: value ? `$${value.toLocaleString('en-AU')}` : '' } } },
        },
      ],
    },
    {
      name: 'offerFinePrint',
      title: 'Offer fine print (under the value stack)',
      type: 'string',
      group: 'offer',
      description: 'One line shown at the bottom of the value stack, e.g. "$500 hold locks in show pricing and inclusions...".',
      validation: (Rule) => Rule.max(300),
    },

    // ─── BRAND QR CARDS ─────────────────────────────────────────
    {
      name: 'brandQrEyebrow',
      title: 'QR section eyebrow',
      type: 'string',
      group: 'brands',
      initialValue: 'Get show-ready',
      validation: (Rule) => Rule.max(40),
    },
    {
      name: 'brandQrHeading',
      title: 'QR section heading',
      type: 'string',
      group: 'brands',
      initialValue: 'Build your spec before you arrive at the show.',
      description: 'Leave blank to hide the whole QR section.',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'brandQrIntro',
      title: 'QR section intro paragraph',
      type: 'text',
      group: 'brands',
      rows: 3,
      validation: (Rule) => Rule.max(600),
    },
    {
      name: 'brandCards',
      title: 'Brand QR cards',
      type: 'array',
      group: 'brands',
      description: 'One card per brand. The QR code auto-generates from the quote URL.',
      of: [
        {
          type: 'object',
          name: 'brandCard',
          fields: [
            { name: 'name', title: 'Caravan name', type: 'string', validation: (Rule) => Rule.required().max(120) },
            { name: 'brand', title: 'Brand family label', type: 'string', description: 'e.g. "Stockman" or "Kimberley".', validation: (Rule) => Rule.required().max(60) },
            { name: 'quoteSlug', title: 'Quote builder slug', type: 'string', description: 'The /quote/{slug} URL ending, e.g. "rover" or "kruiser-s". Must already exist in /quote.', validation: (Rule) => Rule.required().regex(/^[a-z0-9-]+$/, { name: 'lowercase-hyphens-only' }) },
            { name: 'tagline', title: 'Tagline', type: 'string', validation: (Rule) => Rule.required().max(240) },
            { name: 'showSpecial', title: 'Show special line', type: 'string', description: 'e.g. "$2,500 of free accessories included - show only".', validation: (Rule) => Rule.max(200) },
          ],
          preview: { select: { title: 'name', subtitle: 'brand' } },
        },
      ],
    },

    // ─── NARRATIVE COPY ─────────────────────────────────────────
    {
      name: 'whyComeHeading',
      title: 'Why-come section heading',
      type: 'string',
      group: 'narrative',
      initialValue: 'Why come and see us in person.',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'whyComeBody',
      title: 'Why-come section body',
      type: 'array',
      group: 'narrative',
      of: [{ type: 'block' }],
      description: 'Rich text. Use paragraphs - bullet lists also supported. Leave blank to hide the section.',
    },
    {
      name: 'privateSlotCtaHeading',
      title: 'Private slot CTA - heading',
      type: 'string',
      group: 'narrative',
      initialValue: 'Reserve a private 20-minute show slot.',
      description: 'Leave blank to hide the dark CTA block.',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'privateSlotCtaBody',
      title: 'Private slot CTA - body',
      type: 'text',
      group: 'narrative',
      rows: 4,
      description: 'Plain text. Shown inside the dark CTA block.',
      validation: (Rule) => Rule.max(800),
    },
    {
      name: 'cantMakeItHeading',
      title: 'Can\'t-make-it section heading',
      type: 'string',
      group: 'narrative',
      initialValue: 'Can\'t make it?',
      validation: (Rule) => Rule.max(140),
    },
    {
      name: 'cantMakeItBody',
      title: 'Can\'t-make-it body',
      type: 'array',
      group: 'narrative',
      of: [{ type: 'block' }],
      description: 'Rich text. Leave blank to hide.',
    },

    // ─── FAQ ──────────────────────────────────────────────────
    {
      name: 'faqs',
      title: 'FAQs (Q&A pairs)',
      type: 'array',
      group: 'faq',
      description: 'Shown in the page FAQ accordion + emitted as Schema.org FAQPage JSON-LD for AI search.',
      of: [
        {
          type: 'object',
          name: 'faq',
          fields: [
            { name: 'q', title: 'Question', type: 'string', validation: (Rule) => Rule.required().min(8).max(180) },
            { name: 'a', title: 'Answer', type: 'text', rows: 3, description: 'First sentence should answer the question directly. 40-80 words ideal.', validation: (Rule) => Rule.required().min(20).max(800) },
          ],
          preview: { select: { title: 'q' } },
        },
      ],
      validation: (Rule) => Rule.max(12).warning('More than 12 FAQs makes the page hard to scan'),
    },
  ],

  preview: {
    select: { title: 'title', status: 'status', datesLabel: 'datesLabel' },
    prepare({ title, status, datesLabel }) {
      const statusLabel = {
        upcoming: 'Upcoming',
        active: 'ACTIVE NOW',
        archived: 'Archived',
      }[status] || status
      return {
        title,
        subtitle: `${statusLabel} · ${datesLabel || 'no dates'}`,
      }
    },
  },

  orderings: [
    { title: 'Start date (newest first)', name: 'startDateDesc', by: [{ field: 'startDate', direction: 'desc' }] },
    { title: 'Status, then start date', name: 'statusDate', by: [{ field: 'status', direction: 'asc' }, { field: 'startDate', direction: 'desc' }] },
  ],
}
