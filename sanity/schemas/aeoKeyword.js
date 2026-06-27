// Sanity schema: AEO Keyword
//
// Reference table of the keywords SEQ Campers wants to be found for in
// AI-search results (ChatGPT, Perplexity, Google AI Overviews, Bing
// Copilot, Claude search) and traditional Google search.
//
// This is a REFERENCE LIST, not a live wiring - changing a keyword here
// does NOT automatically update the website copy. It exists so Shane and
// Maud can see, sort, prioritise and edit the strategy alongside the
// other content. When a keyword is added or marked high-priority, the
// development team folds it into the relevant page copy on the next
// content pass.
//
// Source: Keyword_Strategy_CorrectFInal.xlsx (Bart 16 Jun 2026).

export default {
  name: 'aeoKeyword',
  title: 'AEO Keyword',
  type: 'document',

  fields: [
    {
      name: 'keyword',
      title: 'Keyword',
      type: 'string',
      description: 'The exact phrase to target (e.g. "off-road caravan Australia").',
      validation: (Rule) => Rule.required().max(140),
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      description: 'The category of keyword. Core + Branded carry the highest weight on page copy. Long-tail and Question keywords go into FAQs and blog posts.',
      options: {
        list: [
          { title: 'Core (primary intent)', value: 'core' },
          { title: 'Branded (model + brand names)', value: 'branded' },
          { title: 'Long-tail (specific multi-word)', value: 'longtail' },
          { title: 'Regional (location-based)', value: 'regional' },
          { title: 'Question (natural questions)', value: 'question' },
          { title: 'Problem (pain-point queries)', value: 'problem' },
          { title: 'Solution (how-to queries)', value: 'solution' },
          { title: 'Content (blog topics)', value: 'content' },
          { title: 'Accessory (accessory queries)', value: 'accessory' },
          { title: 'Comparison (X vs Y)', value: 'comparison' },
          { title: 'Pricing (cost queries)', value: 'pricing' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: '1 (low), 2 (medium), 3 (high). Higher = more important to weave into page copy and headings.',
      options: {
        list: [
          { title: '🔥 3 - High', value: 3 },
          { title: '⭐ 2 - Medium', value: 2 },
          { title: '· 1 - Low', value: 1 },
        ],
        layout: 'dropdown',
      },
      initialValue: 3,
      validation: (Rule) => Rule.required().min(1).max(3),
    },
    {
      name: 'volume',
      title: 'Search volume',
      type: 'string',
      description: 'Rough Google search volume per month.',
      options: {
        list: [
          { title: 'Very High', value: 'very-high' },
          { title: 'High', value: 'high' },
          { title: 'Medium', value: 'medium' },
          { title: 'Low', value: 'low' },
          { title: 'Unknown', value: 'unknown' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'medium',
    },
    {
      name: 'category',
      title: 'Category / Notes',
      type: 'string',
      description: 'Short note - e.g. "Core", "Lifestyle", "Decision", "Feature". From the source spreadsheet.',
      validation: (Rule) => Rule.max(80),
    },
    {
      name: 'targetPages',
      title: 'Pages to target',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Which website pages this keyword should appear on. e.g. "Home", "/new", "/stock", "FAQ", "Blog post 2".',
      options: {
        list: [
          { title: 'Home page', value: 'home' },
          { title: '/new (new caravans)', value: 'new' },
          { title: '/stock (used caravans)', value: 'stock' },
          { title: '/quote (build pages)', value: 'quote' },
          { title: '/service (workshop)', value: 'service' },
          { title: '/shows (events)', value: 'shows' },
          { title: '/videos', value: 'videos' },
          { title: '/about', value: 'about' },
          { title: '/faq', value: 'faq' },
          { title: '/blog (blog posts)', value: 'blog' },
        ],
      },
    },
    {
      name: 'liveOnSite',
      title: 'Already live on site?',
      type: 'boolean',
      description: 'Tick once this keyword is woven into the relevant page copy.',
      initialValue: false,
    },
  ],

  preview: {
    select: { keyword: 'keyword', type: 'type', priority: 'priority', volume: 'volume', liveOnSite: 'liveOnSite' },
    prepare({ keyword, type, priority, volume, liveOnSite }) {
      const fire = priority === 3 ? '🔥 ' : priority === 2 ? '⭐ ' : ''
      const status = liveOnSite ? '✓ live' : 'not live'
      return {
        title: `${fire}${keyword}`,
        subtitle: `${type || ''} · ${volume || ''} · ${status}`,
      }
    },
  },

  orderings: [
    { title: 'Priority (high to low)', name: 'priorityDesc', by: [{ field: 'priority', direction: 'desc' }] },
    { title: 'Type, then priority', name: 'typeThenPriority', by: [{ field: 'type', direction: 'asc' }, { field: 'priority', direction: 'desc' }] },
    { title: 'Not yet live first', name: 'notLive', by: [{ field: 'liveOnSite', direction: 'asc' }, { field: 'priority', direction: 'desc' }] },
  ],
}
