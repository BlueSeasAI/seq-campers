import caravan from './caravan.js'
import brand from './brand.js'
import siteSettings from './siteSettings.js'
import videosPageSettings from './videosPageSettings.js'
import show from './show.js'
import blogPost from './blogPost.js'
import faq from './faq.js'
import aeoKeyword from './aeoKeyword.js'

// Per-page singletons (added 16 Jun 2026 per Bart). Each one holds ONLY
// the fields relevant to its page so when Maud clicks "Home page" in
// Studio she sees Home fields, not the show banner / Reserve CTA etc.
import homePageSettings from './homePageSettings.js'
import newPageSettings from './newPageSettings.js'
import servicePageSettings from './servicePageSettings.js'
import showsPageSettings from './showsPageSettings.js'
import quotePageSettings from './quotePageSettings.js'

export const schemaTypes = [
  caravan,
  brand,
  siteSettings,
  videosPageSettings,
  show,
  blogPost,
  faq,
  aeoKeyword,
  homePageSettings,
  newPageSettings,
  servicePageSettings,
  showsPageSettings,
  quotePageSettings,
]
