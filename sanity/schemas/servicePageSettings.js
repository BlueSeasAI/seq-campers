// Singleton: Service & workshop page settings.

import { PlayIcon, VideoIcon, EditIcon, TextIcon, DocumentTextIcon, OlistIcon } from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'servicePageSettings',
  title: 'Service & workshop page',
  type: 'document',

  fields: [
    // ─── PAGE COPY (added 2 Jul 2026) ───────────────────────────────────
    // Hero + "Meet the crew" headings + the three service cards. Each keeps
    // the current hardcoded literal as a fallback in service.astro so nothing
    // changes on the live site until these are filled in.
    {
      name: 'heroH1',
      title: 'Hero heading (H1)',
      type: 'string',
      components: { field: withFieldIcon(EditIcon) },
      description: 'The big page heading. Default: "From our Sunshine Coast workshop to your off-grid driveway."',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'heroSub',
      title: 'Hero sub-heading',
      type: 'text',
      rows: 2,
      components: { field: withFieldIcon(DocumentTextIcon) },
      description: 'The paragraph under the hero heading.',
      validation: (Rule) => Rule.max(400),
    },
    {
      name: 'crewEyebrow',
      title: 'Meet the crew - eyebrow',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The small coloured label above the crew video grid. Default: "Meet the crew".',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'crewHeading',
      title: 'Meet the crew - heading',
      type: 'string',
      components: { field: withFieldIcon(EditIcon) },
      description: 'The heading above the crew video grid. Default: "Keeping you moving. In a SEQ."',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'serviceCards',
      title: 'Service cards (what we do)',
      type: 'array',
      components: { field: withFieldIcon(OlistIcon) },
      description: 'The three "what we do" cards near the bottom of the page. Leave empty to use the built-in defaults.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Card title',
              type: 'string',
              components: { field: withFieldIcon(EditIcon) },
              description: 'e.g. "Scheduled service & pre-trip check".',
              validation: (Rule) => Rule.required().max(120),
            },
            {
              name: 'body',
              title: 'Card body',
              type: 'text',
              rows: 3,
              components: { field: withFieldIcon(DocumentTextIcon) },
              description: 'The description under the card title.',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    },

    ...[
      { n: 1, t: 'Meet the team - tile 1' },
      { n: 2, t: 'Meet the team - tile 2' },
      { n: 3, t: 'Meet the team - tile 3' },
      { n: 4, t: '[Unused] Service tile 4' },
      { n: 5, t: '[Unused] Service tile 5' },
      { n: 6, t: '[Unused] Service tile 6' },
    ].map(({ n, t }) => ({
      name: `servicePageVideo${n}`,
      title: t,
      type: 'object',
      components: { field: withFieldIcon(PlayIcon) },
      options: { columns: 1, collapsible: true, collapsed: n > 3 },
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url', description: 'Paste the full YouTube link. Leave blank to hide this tile.' },
        { name: 'label', title: 'Caption under the tile', type: 'string', description: 'e.g. "Meet Grant in the workshop".', validation: (Rule) => Rule.max(80) },
      ],
    })),

    {
      name: 'serviceWorkshopWeekly',
      title: 'This week in the workshop',
      type: 'object',
      components: { field: withFieldIcon(VideoIcon) },
      description: 'A short video showing what is happening in the workshop. Refresh weekly. Leave the URL blank to hide the block.',
      options: { columns: 1 },
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url' },
        { name: 'caption', title: 'Caption under the video', type: 'string', description: 'e.g. "Mike fitting a lithium upgrade on a 2023 Karavan."', validation: (Rule) => Rule.max(160) },
      ],
    },
  ],

  preview: { prepare() { return { title: 'Service & workshop page' } } },
}
