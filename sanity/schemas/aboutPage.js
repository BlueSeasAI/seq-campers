// Singleton: About page.
//
// Added 2 Jul 2026. Makes every piece of marketing copy on /about editable in
// Studio - hero, the intro story, the team, the four-chapter timeline, the
// three "why buy from us" cards, and the dark CTA band. Every field keeps the
// current hardcoded literal as a fallback in about.astro so nothing changes on
// the live site until this record is created and published, and nothing breaks
// if Sanity is unreachable at build time.

import {
  EditIcon,
  TextIcon,
  DocumentTextIcon,
  UsersIcon,
  ImageIcon,
  CalendarIcon,
  OlistIcon,
} from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'aboutPage',
  title: 'About page',
  type: 'document',

  fields: [
    // ─── HERO ───────────────────────────────────────────────────────────
    {
      name: 'heroH1',
      title: 'Hero heading (H1)',
      type: 'string',
      components: { field: withFieldIcon(EditIcon) },
      description: 'The big page heading. Default: "The Sunshine Coast\'s home for off-road caravans and off-grid camping."',
      validation: (Rule) => Rule.max(160),
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

    // ─── INTRO STORY ──────────────────────────────────────────────────────
    {
      name: 'introParagraphs',
      title: 'Intro story paragraphs',
      type: 'array',
      components: { field: withFieldIcon(DocumentTextIcon) },
      description: 'The opening story block. One item per paragraph. Leave empty to use the built-in copy.',
      of: [{ type: 'text', rows: 4 }],
    },

    // ─── MEET THE TEAM ────────────────────────────────────────────────────
    {
      name: 'teamEyebrow',
      title: 'Meet the team - eyebrow',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The small coloured label above the team heading. Default: "Meet the team".',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'teamHeading',
      title: 'Meet the team - heading',
      type: 'string',
      components: { field: withFieldIcon(EditIcon) },
      description: 'The team heading. Default: "Shane and Maud".',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'teamSub',
      title: 'Meet the team - sub',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The line under the team heading. Default: "The team behind SEQ Campers since 2019."',
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'team',
      title: 'Team members',
      type: 'array',
      components: { field: withFieldIcon(UsersIcon) },
      description: 'The team cards. Leave empty to use the built-in Shane + Maud cards with their /team/*.jpg photos.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              components: { field: withFieldIcon(UsersIcon) },
              validation: (Rule) => Rule.required().max(80),
            },
            {
              name: 'role',
              title: 'Role',
              type: 'string',
              components: { field: withFieldIcon(TextIcon) },
              description: 'e.g. "Owner · SEQ Campers since 2013".',
              validation: (Rule) => Rule.max(120),
            },
            {
              name: 'bio',
              title: 'Bio',
              type: 'text',
              rows: 4,
              components: { field: withFieldIcon(DocumentTextIcon) },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'photo',
              title: 'Photo (optional)',
              type: 'image',
              components: { field: withFieldIcon(ImageIcon) },
              description: 'Upload a square headshot (600x600 works well). Leave blank to keep the existing /team photo (matched by name for Shane/Maud).',
              options: { hotspot: true },
            },
          ],
          preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
        },
      ],
    },

    // ─── FOUR-CHAPTER TIMELINE ────────────────────────────────────────────
    {
      name: 'timelineEyebrow',
      title: 'Timeline - eyebrow',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The small coloured label above the timeline. Default: "Our path here".',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'timelineHeading',
      title: 'Timeline - heading',
      type: 'string',
      components: { field: withFieldIcon(EditIcon) },
      description: 'The timeline heading. Default: "Four chapters, one passion."',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'timeline',
      title: 'Timeline chapters',
      type: 'array',
      components: { field: withFieldIcon(CalendarIcon) },
      description: 'The chapters shown down the page. Leave empty to use the built-in four chapters.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'year',
              title: 'Year / label',
              type: 'string',
              components: { field: withFieldIcon(CalendarIcon) },
              description: 'e.g. "2013" or "2020-2021".',
              validation: (Rule) => Rule.required().max(40),
            },
            {
              name: 'title',
              title: 'Chapter title',
              type: 'string',
              components: { field: withFieldIcon(EditIcon) },
              validation: (Rule) => Rule.required().max(120),
            },
            {
              name: 'body',
              title: 'Chapter body',
              type: 'text',
              rows: 4,
              components: { field: withFieldIcon(DocumentTextIcon) },
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: { select: { title: 'title', subtitle: 'year' } },
        },
      ],
    },

    // ─── WHY BUY FROM US ──────────────────────────────────────────────────
    {
      name: 'whyEyebrow',
      title: 'Why buy from us - eyebrow',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The small coloured label above the cards. Default: "Why buy from us".',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'whyHeading',
      title: 'Why buy from us - heading',
      type: 'string',
      components: { field: withFieldIcon(EditIcon) },
      description: 'The heading above the cards. Default: "What you get from us".',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'whyCards',
      title: 'Why buy from us - cards',
      type: 'array',
      components: { field: withFieldIcon(OlistIcon) },
      description: 'The three differentiator cards. Leave empty to use the built-in defaults.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Card heading',
              type: 'string',
              components: { field: withFieldIcon(EditIcon) },
              validation: (Rule) => Rule.required().max(120),
            },
            {
              name: 'body',
              title: 'Card body',
              type: 'text',
              rows: 3,
              components: { field: withFieldIcon(DocumentTextIcon) },
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    },

    // ─── DARK CTA BAND ────────────────────────────────────────────────────
    {
      name: 'ctaHeading',
      title: 'CTA band - heading',
      type: 'string',
      components: { field: withFieldIcon(EditIcon) },
      description: 'The heading on the dark band at the bottom. Default: "Come and see us in Marcoola."',
      validation: (Rule) => Rule.max(120),
    },
    {
      name: 'ctaSub',
      title: 'CTA band - sub',
      type: 'string',
      components: { field: withFieldIcon(TextIcon) },
      description: 'The line under the CTA heading. Default: "Showroom appointments preferred, after-hours always welcome."',
      validation: (Rule) => Rule.max(200),
    },
  ],

  preview: { prepare() { return { title: 'About page' } } },
}
