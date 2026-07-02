// Sanity schema: Blog post.
//
// Each post has a cover image, a title, an excerpt (shown on the index
// page tile) and a long body (shown on the detail page). Maud can add,
// edit and unpublish posts from the Sanity Studio sidebar.
//
// Publishing flow: the index page only shows posts where isPublished is
// ticked, ordered by publishedAt descending. Drafts (isPublished off) are
// editable in Studio but never appear on the live site.

import {
  TextIcon,
  LinkIcon,
  CalendarIcon,
  EyeOpenIcon,
  ImageIcon,
  InfoOutlineIcon,
  DocumentTextIcon,
  UserIcon,
} from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The headline of the blog post. Keep under ~70 characters for good SEO.',
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      components: { field: withFieldIcon(LinkIcon) },
      description: 'Auto-generated from the title. Edit if needed - this becomes the URL (/blog/your-slug).',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      components: { field: withFieldIcon(CalendarIcon) },
      description: 'When this post should appear as published on the site.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isPublished',
      title: 'Published?',
      type: 'boolean',
      components: { field: withFieldIcon(EyeOpenIcon) },
      description: 'Tick to make this post live on /blog. Untick to keep it as a draft (only visible inside Studio).',
      initialValue: false,
    },
    {
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      components: { field: withFieldIcon(ImageIcon) },
      description: 'Shown both on the blog index tile and at the top of the post page.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      components: { field: withFieldIcon(InfoOutlineIcon) },
      rows: 3,
      description: 'Short summary shown on the blog index tile (1-2 sentences).',
      validation: (Rule) => Rule.required().max(280),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      components: { field: withFieldIcon(DocumentTextIcon) },
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
      description: 'The full blog post body. Use headings, bullet points, links and images as needed.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      components: { field: withFieldIcon(UserIcon) },
      description: 'Who wrote the post. Default: "Shane & Maud".',
      initialValue: 'Shane & Maud',
    },
  ],

  preview: {
    select: { title: 'title', media: 'coverImage', publishedAt: 'publishedAt', isPublished: 'isPublished' },
    prepare({ title, media, publishedAt, isPublished }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('en-AU') : 'No date'
      const status = isPublished ? 'Live' : 'Draft'
      return { title, media, subtitle: `${status} · ${date}` }
    },
  },

  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Oldest first', name: 'oldest', by: [{ field: 'publishedAt', direction: 'asc' }] },
  ],
}
