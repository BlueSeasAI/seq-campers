// Singleton: Site-wide settings (banner + Reserve Stripe CTA only).
//
// Per Bart 16 Jun: each page in Studio now has its own per-page singleton.
// This document only holds the truly site-wide things that don't belong
// to one page:
//   - Show Special banner (thin strip across the top of every page)
//   - Reserve $1,000 Stripe CTA (button + URL shown on /new caravans)
//
// Page-specific singletons live in:
//   homePageSettings    - hero, Shane's Pick, pathway videos
//   newPageSettings     - 8 new-page video tiles
//   servicePageSettings - 3 team videos + workshop weekly
//   showsPageSettings   - intro + compilation video
//   quotePageSettings   - 8 model intro videos
//   videosPageSettings  - 12 video library tiles (Kingdom + Convoy)

import { PinIcon, TokenIcon } from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'siteSettings',
  title: 'Site-wide settings',
  type: 'document',

  fields: [
    // ─── SHOW SPECIAL BANNER (site-wide) ────────────────────────────
    {
      name: 'showSpecial',
      title: 'Show Special banner (site-wide strip)',
      type: 'object',
      components: { field: withFieldIcon(PinIcon) },
      description: 'The thin coloured strip that runs across the top of every page. Use it to push a deadline ("Get it before the Brisbane Caravan Show ends Sun 8 June"). Leave the headline blank to hide the banner entirely.',
      options: { columns: 1 },
      fields: [
        {
          name: 'headline',
          title: 'Banner headline',
          type: 'string',
          description: 'Short, urgency-led. Leave blank to hide the banner.',
          validation: (Rule) => Rule.max(140),
        },
        {
          name: 'endDate',
          title: 'Banner end date',
          type: 'date',
          description: 'Optional. When this date passes the banner auto-hides.',
          options: { dateFormat: 'YYYY-MM-DD' },
        },
        {
          name: 'ctaText',
          title: 'CTA link text (optional)',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'ctaUrl',
          title: 'CTA link URL (optional)',
          type: 'string',
        },
      ],
    },

    // ─── RESERVE $1,000 STRIPE CTA (shown on /new) ──────────────────
    {
      name: 'reserveCta',
      title: 'Reserve $1,000 CTA (shown on /new)',
      type: 'object',
      components: { field: withFieldIcon(TokenIcon) },
      description: 'The "Reserve this van for $1,000" Stripe payment button shown on the New Caravans page. Leave the Stripe URL blank to hide the button.',
      options: { columns: 1 },
      fields: [
        {
          name: 'enabled',
          title: 'Show the Reserve button?',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'buttonText',
          title: 'Button text',
          type: 'string',
          initialValue: 'Reserve for $1,000',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'stripeUrl',
          title: 'Stripe payment link URL',
          type: 'url',
          description: 'The Stripe payment-link URL Maud creates in her Stripe dashboard.',
        },
        {
          name: 'helperText',
          title: 'Helper text under the button',
          type: 'string',
          initialValue: 'Fully refundable. Holds your build slot.',
          validation: (Rule) => Rule.max(120),
        },
      ],
    },
  ],

  preview: {
    prepare() {
      return { title: 'Site-wide settings', subtitle: 'Banner + Reserve Stripe CTA' }
    },
  },
}
