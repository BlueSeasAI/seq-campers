// Sanity schema: Videos Page Settings (singleton)
//
// Controls the /videos page tile layout: 6 fixed slots under the Kimberley
// Kingdom + 6 fixed slots under the Stockman Convoy. Each slot has its own
// YouTube URL, title and description so Maud can swap a video without
// touching anything else.
//
// This is intentionally distinct from the Video LIBRARY (the per-clip
// records used elsewhere on the site). The /videos page tiles are
// curated by Maud here; the library is the raw archive.
//
// Public-facing names match the website (Bart 16 Jun): the "trees" became
// "Kimberley Kingdom" and "Stockman Convoy". Same on the front end and in
// Studio so it stays consistent.

const slotFields = [
  {
    name: 'youtubeUrl',
    title: 'YouTube URL',
    type: 'url',
    description: 'Paste the full YouTube link. Leave blank to hide this tile entirely.',
  },
  {
    name: 'title',
    title: 'Tile title',
    type: 'string',
    description: 'Shown above the thumbnail. 8 to 12 words is ideal.',
    validation: (Rule) => Rule.max(120),
  },
  {
    name: 'description',
    title: 'Short description',
    type: 'string',
    description: 'One sentence under the title. Tell buyers what they will see.',
    validation: (Rule) => Rule.max(220),
  },
]

function slotObject(slotKey, slotLabel) {
  return {
    name: slotKey,
    title: slotLabel,
    type: 'object',
    options: { columns: 1, collapsible: true, collapsed: true },
    fields: slotFields.map((f) => ({ ...f })),
  }
}

export default {
  name: 'videosPageSettings',
  title: 'Videos page settings',
  type: 'document',

  groups: [
    { name: 'kimberley', title: 'Kimberley Kingdom (6 slots)', default: true },
    { name: 'stockman', title: 'Stockman Convoy (6 slots)' },
  ],

  fields: [
    // ─── KIMBERLEY KINGDOM (6 slots) ─────────────────────────────
    { ...slotObject('kimberley1', 'Kimberley Kingdom - slot 1'), group: 'kimberley' },
    { ...slotObject('kimberley2', 'Kimberley Kingdom - slot 2'), group: 'kimberley' },
    { ...slotObject('kimberley3', 'Kimberley Kingdom - slot 3'), group: 'kimberley' },
    { ...slotObject('kimberley4', 'Kimberley Kingdom - slot 4'), group: 'kimberley' },
    { ...slotObject('kimberley5', 'Kimberley Kingdom - slot 5'), group: 'kimberley' },
    { ...slotObject('kimberley6', 'Kimberley Kingdom - slot 6'), group: 'kimberley' },

    // ─── STOCKMAN CONVOY (6 slots) ───────────────────────────────
    { ...slotObject('stockman1', 'Stockman Convoy - slot 1'), group: 'stockman' },
    { ...slotObject('stockman2', 'Stockman Convoy - slot 2'), group: 'stockman' },
    { ...slotObject('stockman3', 'Stockman Convoy - slot 3'), group: 'stockman' },
    { ...slotObject('stockman4', 'Stockman Convoy - slot 4'), group: 'stockman' },
    { ...slotObject('stockman5', 'Stockman Convoy - slot 5'), group: 'stockman' },
    { ...slotObject('stockman6', 'Stockman Convoy - slot 6'), group: 'stockman' },
  ],

  preview: {
    prepare() {
      return { title: 'Videos page settings', subtitle: '12 fixed slots (6 Kimberley Kingdom + 6 Stockman Convoy)' }
    },
  },
}
