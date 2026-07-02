// Singleton: Shows page settings.

import { DocumentTextIcon, PlayIcon } from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'showsPageSettings',
  title: 'Shows page',
  type: 'document',

  fields: [
    {
      name: 'showsIndexIntro',
      title: 'Intro paragraph',
      type: 'text',
      components: { field: withFieldIcon(DocumentTextIcon) },
      rows: 4,
      description: 'The intro paragraph shown above the list of upcoming shows on /shows. Plain text. Leave blank to fall back to the default hard-coded copy.',
      validation: (Rule) => Rule.max(600),
    },
    {
      name: 'showsCompilationVideo',
      title: 'Compilation video (top of page)',
      type: 'object',
      components: { field: withFieldIcon(PlayIcon) },
      description: 'A YouTube video shown prominently at the top of /shows. Use it for a "highlights from past shows" compilation.',
      options: { columns: 1 },
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url' },
        { name: 'caption', title: 'Caption under the video (optional)', type: 'string', validation: (Rule) => Rule.max(140) },
      ],
    },
  ],

  preview: { prepare() { return { title: 'Shows page' } } },
}
