// Singleton: Business details (the ONE spot for SEQ Campers' contact info).
//
// Added 2 Jul 2026. Before this, the phone, text number, emails, address, ABN,
// showroom hours and socials were hardcoded in ~8 places across the site
// (contact bar + footer in the layout, the /contact page, /reserve, the
// LocalBusiness / AutoDealer JSON-LD on the home + model pages, terms, privacy).
// Changing a number meant a code edit. Now Maud edits this one document and the
// whole site follows.
//
// The front end reads it via getBusinessDetails() in src/lib/sanity.js. Every
// place that consumes it keeps the current hardcoded value as a FALLBACK, so
// nothing on the live site changes until this record is created, and nothing
// breaks if Sanity is ever unreachable.
//
// Field-icon pattern (matches faq.js / siteSettings.js): each field shows a
// small coloured @sanity/icons SVG to the left of its label via withFieldIcon,
// so the editing form is easy to scan.

import {
  MobileDeviceIcon,
  EnvelopeIcon,
  PinIcon,
  HomeIcon,
  ClockIcon,
  DocumentIcon,
  PlayIcon,
  EarthGlobeIcon,
  LinkIcon,
  SearchIcon,
} from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'businessDetails',
  title: 'Business details',
  type: 'document',

  fields: [
    // ─── PHONE ──────────────────────────────────────────────────────
    {
      name: 'phoneDisplay',
      title: 'Phone number (as shown)',
      type: 'string',
      components: { field: withFieldIcon(MobileDeviceIcon) },
      description: 'The office landline exactly as it should read on the site, e.g. "(07) 5370 7933".',
      validation: (Rule) => Rule.max(40),
    },
    {
      name: 'phoneHref',
      title: 'Phone number (for the "Call" link)',
      type: 'string',
      components: { field: withFieldIcon(MobileDeviceIcon) },
      description: 'The same number in tel: link form - digits only, with country code, no spaces. e.g. "+61753707933".',
      validation: (Rule) => Rule.max(40),
    },

    // ─── TEXT / SMS ─────────────────────────────────────────────────
    {
      name: 'textDisplay',
      title: 'Text (SMS) number (as shown)',
      type: 'string',
      components: { field: withFieldIcon(MobileDeviceIcon) },
      description: 'The mobile number for texting, as shown on the site, e.g. "0422 624 920".',
      validation: (Rule) => Rule.max(40),
    },
    {
      name: 'textHref',
      title: 'Text (SMS) number (for the "Text" link)',
      type: 'string',
      components: { field: withFieldIcon(MobileDeviceIcon) },
      description: 'The same number in sms: link form - digits only, no spaces. e.g. "0422624920".',
      validation: (Rule) => Rule.max(40),
    },

    // ─── EMAIL ──────────────────────────────────────────────────────
    {
      name: 'emailOffice',
      title: 'Office email (general enquiries)',
      type: 'string',
      components: { field: withFieldIcon(EnvelopeIcon) },
      description: 'The main enquiries address, e.g. "sales@seqcampers.com.au".',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'emailAdmin',
      title: 'Admin email (privacy / terms / accounts)',
      type: 'string',
      components: { field: withFieldIcon(EnvelopeIcon) },
      description: 'The admin address used on the Privacy and Terms pages, e.g. "admin@seqcampers.com.au".',
      validation: (Rule) => Rule.max(120),
    },

    // ─── ADDRESS ────────────────────────────────────────────────────
    {
      name: 'addressStreet',
      title: 'Street address',
      type: 'string',
      components: { field: withFieldIcon(HomeIcon) },
      description: 'Street line only, e.g. "3B/6 Bonanza Court".',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'addressSuburb',
      title: 'Suburb',
      type: 'string',
      components: { field: withFieldIcon(PinIcon) },
      description: 'e.g. "Marcoola".',
      validation: (Rule) => Rule.max(80),
    },
    {
      name: 'addressState',
      title: 'State',
      type: 'string',
      components: { field: withFieldIcon(PinIcon) },
      description: 'e.g. "QLD".',
      validation: (Rule) => Rule.max(20),
    },
    {
      name: 'addressPostcode',
      title: 'Postcode',
      type: 'string',
      components: { field: withFieldIcon(PinIcon) },
      description: 'e.g. "4564".',
      validation: (Rule) => Rule.max(10),
    },
    {
      name: 'addressFull',
      title: 'Full address (single line, as shown)',
      type: 'string',
      components: { field: withFieldIcon(PinIcon) },
      description: 'The whole address on one line for display, e.g. "3B/6 Bonanza Court, Marcoola QLD 4564".',
      validation: (Rule) => Rule.max(200),
    },

    // ─── SHOWROOM HOURS ─────────────────────────────────────────────
    {
      name: 'showroomHours',
      title: 'Showroom hours',
      type: 'text',
      rows: 4,
      components: { field: withFieldIcon(ClockIcon) },
      description: 'Opening hours, one line per day. e.g. "Mon - Fri: 8:30am - 3pm\\nSaturday: 8:30am - 12:30pm\\nSunday: Closed".',
      validation: (Rule) => Rule.max(400),
    },

    // ─── ABN ────────────────────────────────────────────────────────
    {
      name: 'abn',
      title: 'ABN',
      type: 'string',
      components: { field: withFieldIcon(DocumentIcon) },
      description: 'Australian Business Number, e.g. "83 631 928 188".',
      validation: (Rule) => Rule.max(40),
    },

    // ─── SOCIALS ────────────────────────────────────────────────────
    {
      name: 'youtubeUrl',
      title: 'YouTube channel URL',
      type: 'url',
      components: { field: withFieldIcon(PlayIcon) },
      description: 'Full URL of the SEQ Campers YouTube channel.',
    },
    {
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      components: { field: withFieldIcon(EarthGlobeIcon) },
      description: 'Full URL of the SEQ Campers Instagram profile.',
    },
    {
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      components: { field: withFieldIcon(LinkIcon) },
      description: 'Full URL of the SEQ Campers Facebook page. Leave blank if there is no Facebook page.',
    },

    // ─── MAP ────────────────────────────────────────────────────────
    {
      name: 'mapQuery',
      title: 'Google Maps search query',
      type: 'string',
      components: { field: withFieldIcon(SearchIcon) },
      description: 'The text used to place the pin in the embedded Google Map on the Contact page, e.g. "SEQ Campers, 3B/6 Bonanza Court, Marcoola QLD 4564, Australia".',
      validation: (Rule) => Rule.max(200),
    },
  ],

  preview: {
    prepare() {
      return { title: 'Business details', subtitle: 'Phone, email, address, hours, socials' }
    },
  },
}
