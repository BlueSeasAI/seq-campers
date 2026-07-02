// Sanity schema: Happening (What's Happening news item)
//
// One document per news item shown on the homepage "What's Happening" feed
// and the /whats-happening page - new arrivals, customer handovers, workshop
// specials, new videos, general news. Add one per item and it appears
// automatically, newest first. No code change needed.
//
// NOTE: Caravan shows do NOT need a Happening - upcoming/active Show
// documents are pulled into the same feed automatically (see
// getHappeningsFeed in src/lib/sanity.js), so adding a Show is enough to
// surface it on the homepage and the /whats-happening page.

import { TextIcon, TagIcon, CalendarIcon, DocumentTextIcon, LinkIcon, EyeOpenIcon } from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'happening',
  title: "What's Happening item",
  type: 'document',
  description:
    'A single news item for the homepage feed and the /whats-happening page. Shows are added automatically - use this for arrivals, handovers, workshop specials, videos and general news.',

  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'Short headline, e.g. "Mitchell family handover" or "Winter service special".',
      validation: (Rule) => Rule.required().min(4).max(120),
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      components: { field: withFieldIcon(TagIcon) },
      description: 'Controls the small coloured label on the card.',
      options: {
        list: [
          { title: 'New Arrival', value: 'New Arrival' },
          { title: 'Handover', value: 'Handover' },
          { title: 'Event', value: 'Event' },
          { title: 'New Video', value: 'New Video' },
          { title: 'Workshop', value: 'Workshop' },
          { title: 'News', value: 'News' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'News',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      components: { field: withFieldIcon(CalendarIcon) },
      description: 'The date shown on the card. Newest items appear first.',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'text',
      components: { field: withFieldIcon(DocumentTextIcon) },
      rows: 3,
      description: 'One short paragraph. Plain text.',
      validation: (Rule) => Rule.required().min(10).max(600),
    },
    {
      name: 'link',
      title: 'Link (optional)',
      type: 'string',
      components: { field: withFieldIcon(LinkIcon) },
      description:
        'Optional. A page on this site (e.g. /stock, /service) or a full https:// web address. Adds a "Read more" link to the card. Leave blank for no link.',
      validation: (Rule) =>
        Rule.custom((v) => {
          if (!v) return true
          if (v.startsWith('/') || /^https?:\/\//i.test(v)) return true
          return 'Use a site path starting with "/" (e.g. /stock) or a full https:// web address.'
        }),
    },
    {
      name: 'showOnHomepage',
      title: 'Show on homepage feed?',
      type: 'boolean',
      components: { field: withFieldIcon(EyeOpenIcon) },
      description:
        'On = appears in the short "What\'s Happening" feed on the home page (newest few). Off = only on the full /whats-happening page.',
      initialValue: true,
    },
  ],

  preview: {
    select: { title: 'title', type: 'type', date: 'date' },
    prepare({ title, type, date }) {
      return { title, subtitle: `${type || 'News'} · ${date || 'no date'}` }
    },
  },

  orderings: [
    { title: 'Date (newest first)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
}
