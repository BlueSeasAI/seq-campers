import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { TagIcon, ClockIcon, PauseIcon, CheckmarkCircleIcon, StarIcon, OlistIcon } from '@sanity/icons'
import { schemaTypes } from './schemas/index.js'
import { SeqCampersLogo } from './theme.jsx'

export default defineConfig({
  name: 'seq-campers',
  title: 'SEQ Campers',
  projectId: 'ttam87n8',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('SEQ Campers')
          .items([
            S.listItem()
              .title('For Sale')
              .icon(TagIcon)
              .schemaType('caravan')
              .child(
                S.documentList()
                  .title('For Sale')
                  .schemaType('caravan')
                  .filter('_type == "caravan" && status == "for-sale"')
                  .defaultOrdering([{ field: 'price', direction: 'asc' }])
              ),
            S.listItem()
              .title('Coming Soon')
              .icon(ClockIcon)
              .schemaType('caravan')
              .child(
                S.documentList()
                  .title('Coming Soon')
                  .schemaType('caravan')
                  .filter('_type == "caravan" && status == "coming-soon"')
                  .defaultOrdering([{ field: 'title', direction: 'asc' }])
              ),
            S.listItem()
              .title('On Hold')
              .icon(PauseIcon)
              .schemaType('caravan')
              .child(
                S.documentList()
                  .title('On Hold')
                  .schemaType('caravan')
                  .filter('_type == "caravan" && status == "on-hold"')
                  .defaultOrdering([{ field: 'title', direction: 'asc' }])
              ),
            S.listItem()
              .title('Sold')
              .icon(CheckmarkCircleIcon)
              .schemaType('caravan')
              .child(
                S.documentList()
                  .title('Sold')
                  .schemaType('caravan')
                  .filter('_type == "caravan" && status == "sold"')
                  .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
              ),
            S.listItem()
              .title('Featured')
              .icon(StarIcon)
              .schemaType('caravan')
              .child(
                S.documentList()
                  .title('Featured')
                  .schemaType('caravan')
                  .filter('_type == "caravan" && featured == true')
                  .defaultOrdering([{ field: 'price', direction: 'asc' }])
              ),
            S.divider(),
            S.listItem()
              .title('Brands')
              .icon(OlistIcon)
              .schemaType('brand')
              .child(
                S.documentList()
                  .title('Brands')
                  .schemaType('brand')
                  .filter('_type == "brand"')
                  .defaultOrdering([{ field: 'name', direction: 'asc' }])
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  studio: {
    components: {
      logo: SeqCampersLogo,
    },
  },
})
