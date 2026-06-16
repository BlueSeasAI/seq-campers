// Singleton: Build-your-spec page (/quote/{slug}) videos.
//
// One intro video per model, shown above the configurator on each
// /quote/{slug} page. Leave the URL blank to fall back to the coded
// per-model default.

export default {
  name: 'quotePageSettings',
  title: 'Build-your-spec pages',
  type: 'document',

  fields: [
    ...[
      { slug: 'kruiswagen', t: 'Kruiswagen - intro video' },
      { slug: 'kruiser-t',  t: 'Kruiser T - intro video' },
      { slug: 'kruiser-s',  t: 'Kruiser S - intro video' },
      { slug: 'karavan',    t: 'Karavan - intro video' },
      { slug: 'kube',       t: 'Kube - intro video' },
      { slug: 'trekka',     t: 'Trekka - intro video' },
      { slug: 'rover',      t: 'Rover - intro video' },
      { slug: 'pod',        t: 'Pod - intro video' },
    ].map(({ slug, t }) => ({
      name: `quoteVideo_${slug.replace(/-/g, '_')}`,
      title: t,
      type: 'object',
      options: { columns: 1, collapsible: true, collapsed: true },
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url' },
        { name: 'caption', title: 'Caption under the video', type: 'string', validation: (Rule) => Rule.max(160) },
      ],
    })),
  ],

  preview: { prepare() { return { title: 'Build-your-spec page videos', subtitle: 'One per model' } } },
}
