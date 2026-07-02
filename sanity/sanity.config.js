import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { TrashIcon } from '@sanity/icons'
import { schemaTypes } from './schemas/index.js'
import { SeqCampersLogo } from './theme.jsx'

// Studio sidebar is structured PAGE-BY-PAGE so Shane and Maud see the website
// as they navigate it, not as data records.
//
// Per Bart 1 Jul 2026:
//  - ONE icon per menu item, not two. We keep the coloured emoji (visual,
//    friendly) and dropped the grey @sanity/icons SVGs that used to sit
//    alongside them - they were doubling up.
//  - Every item maps to a front-end page and, when opened, the panel title
//    shows the page's URL (e.g. "-> /stock") so it's obvious which page you
//    are editing.
//  - Added a "What's Happening" item (the happening docs had no menu entry, so
//    the /whats-happening news feed was uneditable in practice).
//
// Nothing was removed from the schema - every existing document type and
// singleton is still reachable below.
//
// Groups (top to bottom):
//   1. Caravans (the inventory - most-edited records)
//   2. Pages (one item per website page)
//   3. Blog / FAQs / Handover (long-tail content)
//   4. AEO Keywords + Brands (reference)
//   5. Site-wide settings (banner + Reserve CTA)

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
              .title('🚐 Caravans')
              .child(
                S.list()
                  .title('Caravans')
                  .items([
                    S.listItem()
                      .title('🟢 For Sale')
                      .schemaType('caravan')
                      .child(
                        S.documentList()
                          .title('For Sale')
                          .schemaType('caravan')
                          .filter('_type == "caravan" && status == "for-sale"')
                          .defaultOrdering([{ field: 'price', direction: 'asc' }])
                      ),
                    S.listItem()
                      .title('🕓 Coming Soon')
                      .schemaType('caravan')
                      .child(
                        S.documentList()
                          .title('Coming Soon')
                          .schemaType('caravan')
                          .filter('_type == "caravan" && status == "coming-soon"')
                          .defaultOrdering([{ field: 'title', direction: 'asc' }])
                      ),
                    S.listItem()
                      .title('⏸️ On Hold')
                      .schemaType('caravan')
                      .child(
                        S.documentList()
                          .title('On Hold')
                          .schemaType('caravan')
                          .filter('_type == "caravan" && status == "on-hold"')
                          .defaultOrdering([{ field: 'title', direction: 'asc' }])
                      ),
                    S.listItem()
                      .title('✅ Sold (archive)')
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
                      .title('🗂️ All caravans (any status)')
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
            S.listItem()
              .title('🏠 Home page')
              .child(
                S.editor()
                  .id('homePageSettings')
                  .schemaType('homePageSettings')
                  .documentId('homePageSettings')
                  .title('Home page  →  seqcampers.com.au')
              ),

            S.listItem()
              .title('🚛 New caravans page')
              .child(
                S.list()
                  .title('New caravans page  →  /new')
                  .items([
                    S.listItem()
                      .title('🎬 Tile videos (8 slots)')
                      .child(
                        S.editor()
                          .id('newPageSettings')
                          .schemaType('newPageSettings')
                          .documentId('newPageSettings')
                          .title('New page tiles  →  /new')
                      ),
                    S.listItem()
                      .title('🎥 Build pages (intro videos per model)')
                      .child(
                        S.editor()
                          .id('quotePageSettings')
                          .schemaType('quotePageSettings')
                          .documentId('quotePageSettings')
                          .title('Build pages - intro videos  →  /quote/{model}')
                      ),
                  ])
              ),

            S.listItem()
              .title('💰 Model pricing (Rover, Trekka, Kruiser...)')
              .schemaType('modelPricing')
              .child(
                S.documentList()
                  .title('Model pricing  →  the /new model pages')
                  .schemaType('modelPricing')
                  .filter('_type == "modelPricing"')
                  .defaultOrdering([{ field: 'model', direction: 'asc' }])
              ),

            S.listItem()
              .title('🚐 Stock (used caravans) page')
              .child(
                S.documentList()
                  .title('Used caravans  →  /stock')
                  .schemaType('caravan')
                  .filter('_type == "caravan" && status == "for-sale" && stockType == "used"')
                  .defaultOrdering([{ field: 'price', direction: 'desc' }])
              ),

            S.listItem()
              .title('🧰 Accessories page')
              .child(
                S.list()
                  .title('Accessories page  →  /accessories')
                  .items([
                    S.listItem()
                      .title('🛒 Accessories (one per product/category)')
                      .schemaType('accessory')
                      .child(
                        S.documentList()
                          .title('Accessories  →  /accessories')
                          .schemaType('accessory')
                          .filter('_type == "accessory"')
                          .defaultOrdering([{ field: 'orderRank', direction: 'asc' }])
                      ),
                    S.listItem()
                      .title('⚙️ Page settings (intro + video)')
                      .child(
                        S.editor()
                          .id('accessoriesPageSettings')
                          .schemaType('accessoriesPageSettings')
                          .documentId('accessoriesPageSettings')
                          .title('Accessories page settings  →  /accessories')
                      ),
                  ])
              ),

            S.listItem()
              .title('🎥 Videos page')
              .child(
                S.editor()
                  .id('videosPageSettings')
                  .schemaType('videosPageSettings')
                  .documentId('videosPageSettings')
                  .title('Videos page  →  /videos')
              ),

            S.listItem()
              .title('🔧 Service & workshop page')
              .child(
                S.editor()
                  .id('servicePageSettings')
                  .schemaType('servicePageSettings')
                  .documentId('servicePageSettings')
                  .title('Service & workshop page  →  /service')
              ),

            S.listItem()
              .title('🎪 Shows page')
              .child(
                S.list()
                  .title('Shows page  →  /shows')
                  .items([
                    S.listItem()
                      .title('🎪 Shows (caravan shows + events)')
                      .schemaType('show')
                      .child(
                        S.documentList()
                          .title('Shows  →  /shows')
                          .schemaType('show')
                          .filter('_type == "show"')
                          .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('⚙️ Shows page settings (intro + compilation video)')
                      .child(
                        S.editor()
                          .id('showsPageSettings')
                          .schemaType('showsPageSettings')
                          .documentId('showsPageSettings')
                          .title('Shows page settings  →  /shows')
                      ),
                  ])
              ),

            S.listItem()
              .title("📰 What's Happening page")
              .schemaType('happening')
              .child(
                S.documentList()
                  .title("What's Happening (news items)  →  /whats-happening")
                  .schemaType('happening')
                  .filter('_type == "happening"')
                  .defaultOrdering([{ field: 'date', direction: 'desc' }])
              ),

            S.divider(),

            // ─── BLOG + FAQs + HANDOVER (long-tail content) ───────────
            S.listItem()
              .title('📝 Blog posts')
              .schemaType('blogPost')
              .child(
                S.documentList()
                  .title('Blog posts  →  /blog')
                  .schemaType('blogPost')
                  .filter('_type == "blogPost"')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),

            S.listItem()
              .title('❓ FAQs')
              .schemaType('faq')
              .child(
                S.documentList()
                  .title('FAQs  →  /faq')
                  .schemaType('faq')
                  .filter('_type == "faq"')
                  .defaultOrdering([{ field: 'category', direction: 'asc' }, { field: 'order', direction: 'asc' }])
              ),

            S.listItem()
              .title('🎁 Handover pages (UNLISTED)')
              .schemaType('handoverPage')
              .child(
                S.documentList()
                  .title('Handover pages (UNLISTED - shared by direct URL only)  →  /handover/{slug}')
                  .schemaType('handoverPage')
                  .filter('_type == "handoverPage"')
                  .defaultOrdering([{ field: 'title', direction: 'asc' }])
              ),

            S.divider(),

            // ─── AEO KEYWORDS (reference strategy table) ──────────────
            S.listItem()
              .title('🎯 AEO Keywords (search strategy)')
              .child(
                S.list()
                  .title('AEO Keywords')
                  .items([
                    S.listItem()
                      .title('🔥 High priority (Core + Branded)')
                      .schemaType('aeoKeyword')
                      .child(
                        S.documentList()
                          .title('High priority keywords')
                          .schemaType('aeoKeyword')
                          .filter('_type == "aeoKeyword" && priority == 3')
                          .defaultOrdering([{ field: 'type', direction: 'asc' }, { field: 'keyword', direction: 'asc' }])
                      ),
                    S.listItem()
                      .title('🗂️ All keywords (sortable table)')
                      .schemaType('aeoKeyword')
                      .child(
                        S.documentList()
                          .title('All AEO keywords')
                          .schemaType('aeoKeyword')
                          .filter('_type == "aeoKeyword"')
                          .defaultOrdering([{ field: 'priority', direction: 'desc' }, { field: 'type', direction: 'asc' }])
                      ),
                    S.listItem()
                      .title('🕓 Not yet live on site')
                      .schemaType('aeoKeyword')
                      .child(
                        S.documentList()
                          .title('Keywords not yet woven into the site')
                          .schemaType('aeoKeyword')
                          .filter('_type == "aeoKeyword" && liveOnSite != true')
                          .defaultOrdering([{ field: 'priority', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('🏷️ Branded only')
                      .schemaType('aeoKeyword')
                      .child(
                        S.documentList()
                          .title('Branded keywords')
                          .schemaType('aeoKeyword')
                          .filter('_type == "aeoKeyword" && type == "branded"')
                          .defaultOrdering([{ field: 'priority', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('🏷️ Core only')
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
              .title('🏷️ Brands (Kimberley Kampers, Stockman Products)')
              .schemaType('brand')
              .child(
                S.documentList()
                  .title('Brands')
                  .schemaType('brand')
                  .filter('_type == "brand"')
                  .defaultOrdering([{ field: 'name', direction: 'asc' }])
              ),

            S.divider(),

            // ─── SITE-WIDE SETTINGS (banner + Reserve Stripe CTA) ─────
            S.listItem()
              .title('⚙️ Site-wide settings (banner + Reserve CTA)')
              .child(
                S.editor()
                  .id('siteSettings')
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site-wide settings')
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },

  // Per Bart 18 Jun: make the DELETE action far more prominent on
  // caravan documents - Maud + Shane couldn't find it in the default
  // kebab menu. We wrap the built-in delete action with a clearer
  // label, a trash icon, critical (red) tone, and reorder it to
  // appear right next to Publish so it's the second-most-visible
  // secondary action.
  document: {
    actions: (prev, context) => {
      if (context.schemaType !== 'caravan') return prev

      // Find the delete action and reposition it to second slot (right
      // after publish) with prominent styling.
      const deleteIdx = prev.findIndex((a) => a?.action === 'delete')
      if (deleteIdx === -1) return prev

      const ordered = [...prev]
      const [deleteAction] = ordered.splice(deleteIdx, 1)

      // Wrap the action so we can tweak its label, icon and tone.
      const wrappedDelete = (props) => {
        const original = deleteAction(props)
        if (!original) return null
        return {
          ...original,
          label: original.label === 'Delete' ? 'Delete this listing' : original.label,
          icon: TrashIcon,
          tone: 'critical',
        }
      }
      wrappedDelete.action = 'delete'

      // Place the wrapped delete just after publish (index 1) so it
      // shows up at the very top of the secondary-actions dropdown.
      ordered.splice(1, 0, wrappedDelete)
      return ordered
    },
  },

  studio: {
    components: {
      logo: SeqCampersLogo,
    },
  },
})
