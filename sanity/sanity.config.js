import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import {
  TagIcon, ClockIcon, PauseIcon, CheckmarkCircleIcon, OlistIcon,
  PlayIcon, CogIcon, EditIcon, FilterIcon, CalendarIcon,
} from '@sanity/icons'
// Video doc schema removed 1 June 2026. /videos page now reads from
// videosPageSettings (12 fixed slots), home page videos from siteSettings.
// No per-clip records needed anymore.
import { schemaTypes } from './schemas/index.js'
import { SeqCampersLogo } from './theme.jsx'

// Studio menu is grouped into three folders so Maud sees the most-used items
// (caravans) first, then page content, then global settings. Inside each
// caravan list the items are filtered to one status so she does not have to
// scroll past sold/on-hold to find what is for sale.

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
            // ─── CARAVANS ─────────────────────────────────────────────
            S.listItem()
              .title('Caravans')
              .icon(TagIcon)
              .child(
                S.list()
                  .title('Caravans')
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
                      .title('Sold (archive)')
                      .icon(CheckmarkCircleIcon)
                      .schemaType('caravan')
                      .child(
                        S.documentList()
                          .title('Sold (archive)')
                          .schemaType('caravan')
                          .filter('_type == "caravan" && status == "sold"')
                          .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
                      ),
                    S.divider(),
                    S.listItem()
                      .title('All caravans (any status)')
                      .icon(FilterIcon)
                      .schemaType('caravan')
                      .child(
                        S.documentList()
                          .title('All caravans')
                          .schemaType('caravan')
                          .filter('_type == "caravan"')
                          .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
                      ),
                  ])
              ),

            S.divider(),

            // ─── PAGES & CONTENT ──────────────────────────────────────
            S.listItem()
              .title('Pages & content')
              .icon(EditIcon)
              .child(
                S.list()
                  .title('Pages & content')
                  .items([
                    S.listItem()
                      .title('Shows (caravan shows + events)')
                      .icon(CalendarIcon)
                      .schemaType('show')
                      .child(
                        S.documentList()
                          .title('Shows')
                          .schemaType('show')
                          .filter('_type == "show"')
                          .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Videos page (12 fixed slots)')
                      .icon(PlayIcon)
                      .child(
                        S.editor()
                          .id('videosPageSettings')
                          .schemaType('videosPageSettings')
                          .documentId('videosPageSettings')
                      ),
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
                  ])
              ),

            S.divider(),

            // ─── SETTINGS ────────────────────────────────────────────
            S.listItem()
              .title('Site settings (hero, Shane\'s Pick, banners)')
              .icon(CogIcon)
              .child(
                S.editor()
                  .id('siteSettings')
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
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
