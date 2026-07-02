// Sanity schema: Configurator / quote prices.
//
// Drives the "Build your spec" configurator on /quote/{model} - the pages that
// quote a live driveaway price as the customer ticks options. ONE document per
// model (the `model` field = the URL slug: karavan, kube, kruiswagen, kruiser,
// rover, trekka).
//
// getQuoteBuilder(slug) in src/lib/sanity.js fetches this doc and transforms it
// back into the EXACT object shape src/pages/quote/[slug].astro already imports
// from src/data/quote-builders.js. If no record exists (or Sanity is
// unreachable) the page falls back to that code file - so nothing on the live
// site changes until the seed runs, and the calculator behaves identically.
//
// MONEY-CRITICAL. A wrong number here quotes a customer wrong. The seed script
// (sanity/scripts/seed-quote-builders.js) pulls every value from
// quote-builders.js programmatically - no numbers are hand-typed.
//
// ── Value-type model (why prices are stored as strings) ──────────────────────
// The configurator distinguishes FOUR price meanings, and the reconstruction in
// sanity.js restores each one exactly:
//   • a positive number  -> dollars added when ticked          (e.g. 555)
//   • 0                  -> "Included" (comes with the variant)
//   • a negative number  -> a credit                            (e.g. -890)
//   • "POA"              -> price on application (no dollar figure)
//   • null / not set     -> "N/A" - the option is not available on that variant
//
// A Sanity `number` field cannot hold the string "POA", and it cannot tell
// "the editor typed 0" apart from "the editor left it blank" (both read back as
// undefined-ish). So EVERY price is stored as a `string`:
//   • "" (blank)  -> null (N/A)           • "0" -> 0 (Included)
//   • "POA"       -> "POA"                • "-890" -> -890 (credit)
//   • "555"       -> 555
// The helper coerces numeric strings back to numbers and leaves "POA" as-is, so
// the round-trip is byte-for-byte.
//
// ── priceByVariant is stored as an ARRAY ─────────────────────────────────────
// Sanity cannot store an arbitrary-keyed object like { classic: 555, 'eco-suite': 0 }.
// So a per-variant option stores `priceByVariant` as an ARRAY of { variantId, price }
// and the helper rebuilds the exact { variantId: value } object the page expects.

import {
  TagIcon,
  DocumentTextIcon,
  PackageIcon,
  ComponentIcon,
  ThListIcon,
  DashboardIcon,
  BillIcon,
} from '@sanity/icons'
import { withFieldIcon } from '../components/fieldIcon.jsx'

export default {
  name: 'quoteBuilder',
  title: 'Configurator / quote prices',
  type: 'document',

  fields: [
    {
      name: 'model',
      title: 'Model',
      type: 'string',
      components: { field: withFieldIcon(TagIcon) },
      description: 'Which /quote/{model} configurator this controls. Do not change once set.',
      options: {
        list: [
          { title: 'Kimberley Karavan', value: 'karavan' },
          { title: 'Kimberley Kube', value: 'kube' },
          { title: 'Kimberley Kruiswagen', value: 'kruiswagen' },
          { title: 'Kimberley Kruiser', value: 'kruiser' },
          { title: 'Stockman Rover', value: 'rover' },
          { title: 'Stockman Trekka', value: 'trekka' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'name',
      title: 'Public model name',
      type: 'string',
      components: { field: withFieldIcon(DocumentTextIcon) },
      description: 'The heading on the build page, e.g. "Kimberley Karavan".',
    },
    {
      name: 'intro',
      title: 'Intro line',
      type: 'text',
      rows: 2,
      components: { field: withFieldIcon(DocumentTextIcon) },
      description: 'The subtitle under the heading.',
    },
    {
      name: 'delivery',
      title: 'Dealer delivery ($)',
      type: 'number',
      components: { field: withFieldIcon(PackageIcon) },
      description: 'Flat dealer-delivery figure added to the total (e.g. 3500). Ignored for the Kruiswagen, which uses the On-road section instead.',
    },

    // ── Variants ──────────────────────────────────────────────────────────
    {
      name: 'variants',
      title: 'Variants',
      type: 'array',
      components: { field: withFieldIcon(ComponentIcon) },
      description: 'The model choices (e.g. Classic, Eco-Suite). The Variant ID must match the IDs used in the option prices below.',
      of: [
        {
          type: 'object',
          name: 'variant',
          fields: [
            { name: 'variantId', title: 'Variant ID', type: 'string', description: 'Machine key, e.g. classic, eco-suite. Must match the per-variant option prices.', validation: (Rule) => Rule.required() },
            { name: 'name', title: 'Variant name', type: 'string', description: 'Public name, e.g. Karavan Classic.' },
            { name: 'basePrice', title: 'Base price ($)', type: 'number', description: 'Ex-factory base price for this variant. MONEY-CRITICAL.' },
            { name: 'tare', title: 'TARE (kg)', type: 'number', description: 'Dry weight - only used by the Kruiswagen payload calculator. Leave blank for other models.' },
            { name: 'included', title: 'Included features', type: 'array', of: [{ type: 'string' }], description: 'The "what comes with it" bullet list.' },
          ],
          preview: {
            select: { title: 'name', subtitle: 'basePrice' },
            prepare({ title, subtitle }) {
              return { title: title || '(unnamed variant)', subtitle: subtitle != null ? `$${Number(subtitle).toLocaleString('en-AU')}` : '' }
            },
          },
        },
      ],
    },

    // ── Categories + options ──────────────────────────────────────────────
    {
      name: 'categories',
      title: 'Option categories',
      type: 'array',
      components: { field: withFieldIcon(ThListIcon) },
      description: 'The collapsible sections of options (Suspension, Wheels, Power...). Each holds a list of options with prices.',
      of: [
        {
          type: 'object',
          name: 'category',
          fields: [
            { name: 'categoryId', title: 'Category ID', type: 'string', description: 'Machine key, e.g. suspension.' },
            { name: 'title', title: 'Category title', type: 'string', description: 'Shown as the section heading, e.g. Suspension & Chassis.' },
            {
              name: 'options',
              title: 'Options',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'option',
                  fields: [
                    { name: 'optionId', title: 'Option ID', type: 'string', description: 'Machine key, e.g. air-susp-plus. Must be unique within the model.', validation: (Rule) => Rule.required() },
                    { name: 'label', title: 'Label', type: 'string', description: 'The option text the customer reads.' },
                    { name: 'note', title: 'Note', type: 'text', rows: 2, description: 'Small helper text under the label (optional).' },
                    {
                      name: 'priceMode',
                      title: 'Price type',
                      type: 'string',
                      description: 'FLAT = one price for every variant. PER VARIANT = a different price per variant (or N/A on some).',
                      options: {
                        list: [
                          { title: 'Flat (same for every variant)', value: 'flat' },
                          { title: 'Per variant', value: 'byVariant' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'flat',
                    },
                    {
                      name: 'price',
                      title: 'Flat price',
                      type: 'string',
                      description: 'Used when Price type = Flat. Type a number (e.g. 555), 0 for Included, a negative for a credit (e.g. -890), or POA. Leave blank for N/A.',
                      hidden: ({ parent }) => parent?.priceMode === 'byVariant',
                    },
                    {
                      name: 'priceByVariant',
                      title: 'Per-variant prices',
                      type: 'array',
                      description: 'Used when Price type = Per variant. One row per variant. Price: a number, 0 for Included, a negative for a credit, POA, or blank for N/A.',
                      hidden: ({ parent }) => parent?.priceMode !== 'byVariant',
                      of: [
                        {
                          type: 'object',
                          name: 'variantPrice',
                          fields: [
                            { name: 'variantId', title: 'Variant ID', type: 'string', description: 'Must match a Variant ID above (e.g. classic).', validation: (Rule) => Rule.required() },
                            { name: 'price', title: 'Price', type: 'string', description: 'A number, 0 for Included, a negative for a credit, POA, or blank for N/A.' },
                          ],
                          preview: {
                            select: { title: 'variantId', subtitle: 'price' },
                            prepare({ title, subtitle }) {
                              const p = subtitle === '' || subtitle == null ? 'N/A' : subtitle
                              return { title: title || '(variant)', subtitle: String(p) }
                            },
                          },
                        },
                      ],
                    },
                    // Dependency / availability fields (mirror quote-builders.js).
                    { name: 'requires', title: 'Requires (option IDs)', type: 'array', of: [{ type: 'string' }], description: 'This option only unlocks once ALL of these option IDs are present.' },
                    { name: 'blockedBy', title: 'Blocked by (option IDs)', type: 'array', of: [{ type: 'string' }], description: 'This option is disabled while any of these option IDs are present (mutually exclusive choices).' },
                    { name: 'depNote', title: 'Dependency note', type: 'string', description: 'Shown in place of the price when a "Requires" prerequisite is missing, e.g. "Add RedVision".' },
                    { name: 'blockedNote', title: 'Blocked note', type: 'string', description: 'Shown when a "Blocked by" option is present.' },
                    { name: 'naNote', title: 'N/A note', type: 'string', description: 'Shown in place of the price when this option is N/A on the chosen variant, e.g. "Not on Eco-Suite".' },
                  ],
                  preview: {
                    select: { title: 'label', mode: 'priceMode', price: 'price' },
                    prepare({ title, mode, price }) {
                      const sub = mode === 'byVariant' ? 'Per variant' : (price === '' || price == null ? 'N/A' : `$${price}`)
                      return { title: title || '(unlabelled option)', subtitle: sub }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'title', options: 'options' },
            prepare({ title, options }) {
              const n = Array.isArray(options) ? options.length : 0
              return { title: title || '(untitled category)', subtitle: `${n} option${n === 1 ? '' : 's'}` }
            },
          },
        },
      ],
    },

    // ── On-road costs (Kruiswagen only) ───────────────────────────────────
    {
      name: 'onRoad',
      title: 'On-road costs (Kruiswagen only)',
      type: 'object',
      components: { field: withFieldIcon(BillIcon) },
      description: 'ONLY for the Kruiswagen (a registered motor vehicle). Leave every field blank for towed models - they use Dealer delivery above instead.',
      fields: [
        { name: 'stampDutyRate', title: 'Stamp duty rate', type: 'number', description: 'As a decimal, e.g. 0.05 for 5%.' },
        { name: 'registration', title: 'Registration / CTP / fees ($)', type: 'number', description: 'Flat rego + CTP + fees, e.g. 1190.' },
        { name: 'dealerDelivery', title: 'Dealer delivery & handover ($)', type: 'number', description: 'e.g. 4500.' },
      ],
    },

    // ── Weight / GVM payload (Kruiswagen only) ────────────────────────────
    {
      name: 'weight',
      title: 'Weight / GVM payload (Kruiswagen only)',
      type: 'object',
      components: { field: withFieldIcon(DashboardIcon) },
      description: 'ONLY for the Kruiswagen payload panel. Leave blank for every other model. Editing these needs care - they drive the legal payload readout.',
      fields: [
        { name: 'baseGvm', title: 'Base GVM (kg)', type: 'number' },
        { name: 'upgradedGvm', title: 'Upgraded GVM (kg)', type: 'number' },
        { name: 'gvmOptionId', title: 'GVM upgrade option ID', type: 'string', description: 'The option ID that lifts the GVM (e.g. gvm).' },
        { name: 'passengers', title: 'Passengers (kg)', type: 'number' },
        { name: 'fuelBase', title: 'Base fuel (kg, full)', type: 'number' },
        { name: 'waterBase', title: 'Base water (kg, full)', type: 'number' },
        {
          name: 'fuelExtra',
          title: 'Extra fuel per option',
          type: 'array',
          description: 'Consumable fuel kg added when a tank option is present.',
          of: [
            {
              type: 'object',
              name: 'consumable',
              fields: [
                { name: 'optId', title: 'Option ID', type: 'string' },
                { name: 'kg', title: 'kg', type: 'number' },
              ],
              preview: { select: { title: 'optId', subtitle: 'kg' } },
            },
          ],
        },
        {
          name: 'waterExtra',
          title: 'Extra water per option',
          type: 'array',
          description: 'Consumable water kg added when a tank option is present.',
          of: [
            {
              type: 'object',
              name: 'consumable',
              fields: [
                { name: 'optId', title: 'Option ID', type: 'string' },
                { name: 'kg', title: 'kg', type: 'number' },
              ],
              preview: { select: { title: 'optId', subtitle: 'kg' } },
            },
          ],
        },
        {
          name: 'weights',
          title: 'Hardware weights per option',
          type: 'array',
          description: 'kg each paid option adds to TARE. Stored as a list of Option ID + kg (the helper turns it back into a lookup).',
          of: [
            {
              type: 'object',
              name: 'optionWeight',
              fields: [
                { name: 'optId', title: 'Option ID', type: 'string' },
                { name: 'kg', title: 'kg', type: 'number' },
              ],
              preview: { select: { title: 'optId', subtitle: 'kg' } },
            },
          ],
        },
      ],
    },
  ],

  preview: {
    select: { title: 'name', model: 'model', variants: 'variants' },
    prepare({ title, model, variants }) {
      const n = Array.isArray(variants) ? variants.length : 0
      return { title: title || model || 'Configurator', subtitle: `${model || ''} · ${n} variant${n === 1 ? '' : 's'}` }
    },
  },

  orderings: [
    { title: 'Model', name: 'model', by: [{ field: 'model', direction: 'asc' }] },
  ],
}
