import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import {
  TagIcon, ClockIcon, PauseIcon, CheckmarkCircleIcon, OlistIcon,
  PlayIcon, CogIcon, EditIcon, FilterIcon, CalendarIcon,
  DocumentTextIcon, HelpCircleIcon, HomeIcon, RocketIcon,
  TruckIcon, CaseIcon, SearchIcon, UsersIcon, ImageIcon,
  ComposeIcon, MenuIcon,
} from '@sanity/icons'
// Video doc schema removed 1 June 2026. /videos page now reads from
// videosPageSettings (12 fixed slots), home page videos from siteSettings.
// No per-clip records needed anymore.
import { schemaTypes } from './schemas/index.js'
import { SeqCampersLogo } from './theme.jsx'

// Studio sidebar is structured PAGE-BY-PAGE so Shane and Maud see the
// website as they navigate it, not as data records.
// Per Bart 16 Jun: "make the menu items in Sanity match the pages -
// it'll be a lot simpler to edit".
//
// Structure:
//   1. Caravans (always at top - the most-edited records)
//   2. Pages (one menu item per website page, opening to the editable
//      fields for that page only)
//   3. Blog & FAQs (long-tail content for AI-search visibility)
//   4. AEO Keywords (reference table for SEO/AEO strategy)
//   5. Settings (global Site Settings singleton)

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
              .icon(TruckIcon)
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

            // ─── PAGES (one per website page) ─────────────────────────
            // Per Bart 16 Jun: structure the menu PAGE-BY-PAGE so Shane
            // and Maud navigate the same way they navigate the website.
            // Each item opens the Site Settings singleton at the relevant
            // section.
            S.listItem()
              .title('🏠 Home page')
              .icon(HomeIcon)
              .child(
                S.editor()
                  .id('siteSettings')
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Home page settings')
              ),

            S.listItem()
              .title('🚛 New caravans page')
              .icon(RocketIcon)
              .child(
                S.list()
                  .title('New caravans page')
                  .items([
                    S.listItem()
                      .title('New page video tiles (8 slots)')
                      .icon(PlayIcon)
                      .child(
                        S.editor()
                          .id('siteSettings')
                          .schemaType('siteSettings')
                          .documentId('siteSettings')
                          .title('New page tiles')
                      ),
                    S.listItem()
                      .title('Build pages - intro videos (one per model)')
                      .icon(PlayIcon)
                      .child(
                        S.editor()
                          .id('siteSettings')
                          .schemaType('siteSettings')
                          .documentId('siteSettings')
                          .title('Build page videos')
                      ),
                  ])
              ),

            S.listItem()
              .title('🚐 Stock (used caravans) page')
              .icon(TagIcon)
              .child(
                S.documentList()
                  .title('Used caravans on /stock')
                  .schemaType('caravan')
                  .filter('_type == "caravan" && status == "for-sale" && stockType == "used"')
                  .defaultOrdering([{ field: 'price', direction: 'desc' }])
              ),

            S.listItem()
              .title('🎥 Videos page')
              .icon(PlayIcon)
              .child(
                S.editor()
                  .id('videosPageSettings')
                  .schemaType('videosPageSettings')
                  .documentId('videosPageSettings')
                  .title('Videos page settings')
              ),

            S.listItem()
              .title('🔧 Service & workshop page')
              .icon(CogIcon)
              .child(
                S.editor()
                  .id('siteSettings')
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Service page settings')
              ),

            S.listItem()
              .title('🎪 Shows page')
              .icon(CalendarIcon)
              .child(
                S.list()
                  .title('Shows page')
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
                      .title('Shows page settings (intro + compilation video)')
                      .icon(EditIcon)
                      .child(
                        S.editor()
                          .id('siteSettings')
                          .schemaType('siteSettings')
                          .documentId('siteSettings')
                          .title('Shows page settings')
                      ),
                  ])
              ),

            S.divider(),

            // ─── BLOG + FAQs (long-tail AI-search content) ────────────
            S.listItem()
              .title('📝 Blog posts')
              .icon(DocumentTextIcon)
              .schemaType('blogPost')
              .child(
                S.documentList()
                  .title('Blog posts')
                  .schemaType('blogPost')
                  .filter('_type == "blogPost"')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),

            S.listItem()
              .title('❓ FAQs')
              .icon(HelpCircleIcon)
              .schemaType('faq')
              .child(
                S.documentList()
                  .title('FAQs')
                  .schemaType('faq')
                  .filter('_type == "faq"')
                  .defaultOrdering([{ field: 'category', direction: 'asc' }, { field: 'order', direction: 'asc' }])
              ),

            S.divider(),

            // ─── AEO KEYWORDS (reference strategy table) ──────────────
            S.listItem()
              .title('🎯 AEO Keywords (search strategy)')
              .icon(SearchIcon)
              .child(
                S.list()
                  .title('AEO Keywords')
                  .items([
                    S.listItem()
                      .title('🔥 High priority (Core + Branded)')
                      .icon(SearchIcon)
                      .schemaType('aeoKeyword')
                      .child(
                        S.documentList()
                          .title('High priority keywords')
                          .schemaType('aeoKeyword')
                          .filter('_type == "aeoKeyword" && priority == 3')
                          .defaultOrdering([{ field: 'type', direction: 'asc' }, { field: 'keyword', direction: 'asc' }])
                      ),
                    S.listItem()
                      .title('All keywords (sortable table)')
                      .icon(FilterIcon)
                      .schemaType('aeoKeyword')
                      .child(
                        S.documentList()
                          .title('All AEO keywords')
                          .schemaType('aeoKeyword')
                          .filter('_type == "aeoKeyword"')
                          .defaultOrdering([{ field: 'priority', direction: 'desc' }, { field: 'type', direction: 'asc' }])
                      ),
                    S.listItem()
                      .title('Not yet live on site')
                      .icon(ClockIcon)
                      .schemaType('aeoKeyword')
                      .child(
                        S.documentList()
                          .title('Keywords not yet woven into the site')
                          .schemaType('aeoKeyword')
                          .filter('_type == "aeoKeyword" && liveOnSite != true')
                          .defaultOrdering([{ field: 'priority', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Branded only')
                      .icon(TagIcon)
                      .schemaType('aeoKeyword')
                      .child(
                        S.documentList()
                          .title('Branded keywords')
                          .schemaType('aeoKeyword')
                          .filter('_type == "aeoKeyword" && type == "branded"')
                          .defaultOrdering([{ field: 'priority', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Core only')
                      .icon(TagIcon)
                      .schemaType('aeoKeyword')
                      .child(
                        S.documentList()
                          .title('Core keywords')
                          .schemaType('aeoKeyword')
                          .filter('_type == "aeoKeyword" && type == "core"')
                          .defaultOrdering([{ field: 'priority', direction: 'desc' }])
                      ),
                  ])
              ),

            S.divider(),

            // ─── REFERENCE DATA ──────────────────────────────────────
            S.listItem()
              .title('Brands (Kimberley Kampers, Stockman Products)')
              .icon(OlistIcon)
              .schemaType('brand')
              .child(
                S.documentList()
                  .title('Brands')
                  .schemaType('brand')
                  .filter('_type == "brand"')
                  .defaultOrdering([{ field: 'name', direction: 'asc' }])
              ),

            S.divider(),

            // ─── GLOBAL SETTINGS ─────────────────────────────────────
            S.listItem()
              .title('⚙️ Site Settings (advanced)')
              .icon(CogIcon)
              .child(
                S.editor()
                  .id('siteSettings')
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings (full)')
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
