// Sanity schema: Brand
//
// Caravans reference a brand. Defining brand as its own document
// lets the receptionist pick from a dropdown rather than retyping
// "Kimberley Kampers" 14 times. Canonical brand names match the
// website: "Kimberley Kampers" and "Stockman Products".

import { TextIcon, LinkIcon, ImageIcon, DocumentTextIcon, EarthGlobeIcon } from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'brand',
  title: 'Brand',
  type: 'document',

  fields: [
    {
      name: 'name',
      title: 'Brand name',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      components: { field: withFieldIcon(LinkIcon) },
      options: { source: 'name' },
    },

    {
      name: 'logo',
      title: 'Brand logo',
      type: 'image',
      components: { field: withFieldIcon(ImageIcon) },
      options: { hotspot: true },
    },

    {
      name: 'description',
      title: 'Brand description',
      type: 'text',
      components: { field: withFieldIcon(DocumentTextIcon) },
      rows: 3,
      description: 'Shown on the brand filter page',
    },

    {
      name: 'website',
      title: 'Brand website (optional)',
      type: 'url',
      components: { field: withFieldIcon(EarthGlobeIcon) },
    },
  ],

  preview: {
    select: { title: 'name', media: 'logo' },
  },
}
