// Singleton: Service & workshop page settings.

import { PlayIcon, VideoIcon } from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'servicePageSettings',
  title: 'Service & workshop page',
  type: 'document',

  fields: [
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
