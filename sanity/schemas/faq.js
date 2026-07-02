// Sanity schema: FAQ entry.
//
// Each FAQ is a question + concise answer. Used for the /faq page AND the
// FAQPage JSON-LD schema we render across the site for AI search engines
// (ChatGPT, Perplexity, Google AI Overviews etc).
//
// Bart's instruction (16 Jun): "we don't wanna use up prominent space for
// FAQs" - so they live on a dedicated /faq page, NOT inline on every page.
// The JSON-LD goes site-wide so the AI engines pick them up regardless of
// which page is being indexed.
//
// PILOT (1 Jul 2026): field-level icons. Each field shows a small coloured
// @sanity/icons SVG to the left of its label via the shared withFieldIcon
// helper, so the editing form is easier to scan. If Bart likes the look we
// roll the same pattern across the other schemas. Backing it out is just
// deleting the two imports + the one `components:` line per field - no data
// impact whatsoever.

import {
  HelpCircleIcon,
  DocumentTextIcon,
  TagIcon,
  OlistIcon,
  CheckmarkCircleIcon,
} from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',

  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      components: { field: withFieldIcon(HelpCircleIcon) },
      description: 'The visitor question - exactly as a customer would ask it. Plain language.',
      validation: (Rule) => Rule.required().max(200),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 5,
      components: { field: withFieldIcon(DocumentTextIcon) },
      description: 'A concise answer (1-3 sentences). AI search engines prefer direct, complete answers near the start.',
      validation: (Rule) => Rule.required().max(800),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      components: { field: withFieldIcon(TagIcon) },
      description: 'Group similar questions together on the /faq page.',
      options: {
        list: [
          { title: 'About SEQ Campers', value: 'about' },
          { title: 'Brands & models', value: 'brands' },
          { title: 'Pricing & ordering', value: 'pricing' },
          { title: 'Servicing & warranty', value: 'service' },
          { title: 'Showroom & visiting', value: 'showroom' },
          { title: 'Used stock', value: 'used' },
          { title: 'Off-road & travel', value: 'travel' },
        ],
      },
      initialValue: 'about',
    },
    {
      name: 'order',
      title: 'Display order',
      type: 'number',
      components: { field: withFieldIcon(OlistIcon) },
      description: 'Lower numbers appear first within the category. Use 10, 20, 30 etc so you can insert new ones between.',
      initialValue: 10,
    },
    {
      name: 'isPublished',
      title: 'Published?',
      type: 'boolean',
      components: { field: withFieldIcon(CheckmarkCircleIcon) },
      description: 'Tick to show this FAQ on the live site.',
      initialValue: true,
    },
  ],

  preview: {
    select: { title: 'question', category: 'category', isPublished: 'isPublished' },
    prepare({ title, category, isPublished }) {
      const status = isPublished ? '' : '[draft] '
      return { title: `${status}${title}`, subtitle: category || '' }
    },
  },

  orderings: [
    { title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Category, then order', name: 'category', by: [{ field: 'category', direction: 'asc' }, { field: 'order', direction: 'asc' }] },
  ],
}
