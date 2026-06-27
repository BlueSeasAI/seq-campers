// Singleton: New caravans page settings.
//
// Per Bart 16 Jun: each page menu item in Studio opens only its own
// relevant fields. This document holds the 8 video tiles for /new in
// the locked 4x2 grid order:
//   Row 1: tile1 Kruiswagen | tile2 Kruiser
//   Row 2: tile3 Karavan    | tile4 Kube
//   Row 3: tile5 Trekka     | tile6 Rover
//   Row 4: tile7 Pod        | tile8 Accessories
//
// Each slot has its own video URL + brand label + model label + price
// + CTA link override. Leave any field blank to fall back to the coded
// default for that slot.

export default {
  name: 'newPageSettings',
  title: 'New caravans page',
  type: 'document',

  fields: [
    ...[
      { n: 1, t: 'Tile 1: Kruiswagen (Row 1 left, Kimberley Kampers)' },
      { n: 2, t: 'Tile 2: Kruiser (Row 1 right, Kimberley Kampers)' },
      { n: 3, t: 'Tile 3: Karavan (Row 2 left, Kimberley Kampers)' },
      { n: 4, t: 'Tile 4: Kube (Row 2 right, Kimberley Kampers)' },
      { n: 5, t: 'Tile 5: Trekka (Row 3 left, Stockman Products)' },
      { n: 6, t: 'Tile 6: Rover (Row 3 right, Stockman Products)' },
      { n: 7, t: 'Tile 7: Pod (Row 4 left, Stockman Products)' },
      { n: 8, t: 'Tile 8: Accessories (Row 4 right)' },
    ].map(({ n, t }) => ({
      name: `newPageTile${n}`,
      title: t,
      type: 'object',
      options: { columns: 1, collapsible: true, collapsed: true },
      fields: [
        { name: 'youtubeUrl', title: 'YouTube URL', type: 'url', description: 'Paste the full YouTube link. Leave blank to use the default placeholder.' },
        { name: 'brandLabel', title: 'Brand label override', type: 'string' },
        { name: 'modelLabel', title: 'Model label override', type: 'string' },
        { name: 'priceLabel', title: 'Price label override', type: 'string', description: 'e.g. "From $203,350".' },
        { name: 'ctaHref', title: 'Click-through URL override', type: 'string', description: 'Where the tile click takes the visitor. Defaults to /quote/{slug}.' },
      ],
    })),
  ],

  preview: { prepare() { return { title: 'New caravans page', subtitle: '8 video tiles' } } },
}
