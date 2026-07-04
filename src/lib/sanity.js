import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { toHTML } from '@portabletext/to-html'

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,
  // useCdn:false is correct for build-time queries. The Sanity CDN can serve
  // stale data for up to ~60s after a publish. Netlify rebuilds triggered by
  // the Sanity webhook fire within ~2s of publish - so a useCdn:true client
  // would bake the pre-publish data into the static HTML, leaving the site
  // stuck on the old version until the next build. ~100-200ms slower per
  // query, but guaranteed fresh.
  useCdn: false,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

/**
 * Append Sanity image CDN params to a URL.
 * Sanity supports ?w=, ?h=, ?fit=, ?auto=format directly on the asset URL.
 */
export function sanityImage(url, opts = {}) {
  if (!url) return null
  const params = new URLSearchParams()
  if (opts.w) params.set('w', String(opts.w))
  if (opts.h) params.set('h', String(opts.h))
  if (opts.fit) params.set('fit', opts.fit)
  params.set('auto', 'format')
  return `${url}?${params.toString()}`
}

/**
 * Build a srcset string for responsive images.
 * sanitySrcset(url, [320, 640, 960]) -> "url?w=320&auto=format 320w, url?w=640..."
 */
export function sanitySrcset(url, widths) {
  if (!url) return null
  return widths.map((w) => `${sanityImage(url, { w })} ${w}w`).join(', ')
}

/**
 * Render Sanity Portable Text (the array-of-blocks structure used by rich
 * text fields like description) as a clean HTML string. Use with Astro's
 * set:html directive.
 *
 * Handles: paragraphs, headings (h2/h3/h4), bold, italic, links, lists.
 * Returns empty string for null/undefined/empty input so safe to inline.
 */
export function portableTextToHtml(blocks) {
  if (!blocks || (Array.isArray(blocks) && blocks.length === 0)) return ''
  if (typeof blocks === 'string') return blocks
  try {
    return toHTML(blocks, {
      components: {
        block: {
          normal: ({ children }) => `<p>${children}</p>`,
          h1: ({ children }) => `<h2>${children}</h2>`,
          h2: ({ children }) => `<h2>${children}</h2>`,
          h3: ({ children }) => `<h3>${children}</h3>`,
          h4: ({ children }) => `<h4>${children}</h4>`,
          blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
        },
        marks: {
          link: ({ children, value }) => {
            const href = value?.href || '#'
            return `<a href="${href}" rel="noopener" target="_blank">${children}</a>`
          },
        },
      },
    })
  } catch (err) {
    console.warn('portableTextToHtml failed:', err.message)
    return ''
  }
}

/**
 * Human-readable label for a condition rating value.
 */
export function conditionLabel(value) {
  return {
    'excellent': 'Excellent',
    'very-good': 'Very Good',
    'good': 'Good',
    'fair': 'Fair',
    'project': 'Project',
  }[value] || null
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getForSaleCaravans(stockType = null) {
  // For 'used' we include caravans with stockType undefined too - existing
  // Sanity records pre-date the field and default to used (the common case).
  // For 'new' we require explicit stockType=="new".
  let filter
  if (stockType === 'used') {
    filter = `*[_type == "caravan" && status == "for-sale" && (stockType == "used" || !defined(stockType))]`
  } else if (stockType === 'new') {
    filter = `*[_type == "caravan" && status == "for-sale" && stockType == "new"]`
  } else {
    filter = `*[_type == "caravan" && status == "for-sale"]`
  }
  const raw = await client.fetch(`
    ${filter}
    | order(price asc) {
      _id, title, slug, price, status, condition, stockType, brollVideoUrl,
      "brollVideoFileUrl": brollVideoFile.asset->url,
      "brand": brand->name,
      "mainImage": photos[0].asset->url,
      specs { sleeps, length, tareWeight, year },
      compliance { stockNumber }
    }
  `)
  // Normalise slug to the same safe form getAllCaravanPaths produces so
  // card href links point at URLs that actually exist in the build output.
  return raw.map((c) => ({
    ...c,
    slug: { current: safeSlug(c.slug?.current) || safeSlug(c.title) },
  }))
}

export async function getUsedCaravans() {
  return getForSaleCaravans('used')
}

export async function getNewCaravans() {
  return getForSaleCaravans('new')
}

export async function getCaravan(slug) {
  // First fetch all caravans (cheap - just title/slug/_id) so we can
  // match the safe-slugified version against the cleaned slug requested.
  // Editor-entered slugs may contain spaces/capitals/# that we have
  // already cleaned in getAllCaravanPaths.
  const all = await client.fetch(`
    *[_type == "caravan" && status == "for-sale"] {
      _id, title, "slug": slug.current
    }
  `)
  const match = all.find((c) => {
    const fromSlug = safeSlug(c.slug)
    const fromTitle = safeSlug(c.title)
    return fromSlug === slug || fromTitle === slug
  })
  if (!match) return null

  return client.fetch(
    `
    *[_id == $id][0] {
      _id, title, price, status, condition, description, features, topFeatures,
      "brand": brand->name,
      "photos": photos[].asset->url,
      heroVideo,
      "videos": videos[],
      specs,
      compliance,
      power,
      tripHistory,
      faqs,
      configurator
    }
  `,
    { id: match._id }
  )
}

export async function getSoldCaravans() {
  // Show at most the 6 most recently sold vans that are still "Listed"
  // (soldListed). The [0...6] slice is the hard cap - it can NEVER show more
  // than 6, no matter how many sold records exist. As new vans sell, the
  // oldest drops off automatically. Maud can also switch a specific one to
  // Unlisted to hide it early; records pre-dating the field default to listed
  // (undefined != false), so nothing vanishes from the data. To change the
  // count later, edit the 6 in [0...6].
  return client.fetch(`
    *[_type == "caravan" && status == "sold" && soldListed != false]
    | order(_updatedAt desc) [0...6] {
      _id, title, price, condition,
      "brand": brand->name,
      "mainImage": photos[0].asset->url
    }
  `)
}

/**
 * Defensive slug cleaner. Sanity editors sometimes leave the URL slug field
 * with raw title text (spaces, capitals, # characters, double-spaces). Those
 * break Astro's static build cleanup step because filesystem paths cannot
 * contain certain encoded characters. This function turns any input into a
 * safe lowercase-letters-numbers-and-hyphens slug.
 */
export function safeSlug(input) {
  if (!input) return null
  const s = String(input)
    .toLowerCase()
    .normalize('NFKD')                  // strip accents
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')       // drop everything except letters/numbers/space/hyphen
    .trim()
    .replace(/\s+/g, '-')               // spaces -> single hyphen
    .replace(/-+/g, '-')                // collapse multiple hyphens
    .slice(0, 96)
  return s || null
}

export async function getAllCaravanPaths() {
  const raw = await client.fetch(`
    *[_type == "caravan" && status == "for-sale"] {
      _id, title, "slug": slug.current
    }
  `)
  // Auto-clean any slug that has spaces, capitals or invalid characters.
  // Skip any caravan whose slug AND title both fail to produce something
  // usable - those entries need editor attention in Sanity.
  const cleaned = []
  for (const c of raw) {
    const fromSlug = safeSlug(c.slug)
    const fromTitle = safeSlug(c.title)
    const slug = fromSlug || fromTitle
    if (slug) cleaned.push({ slug, _id: c._id, originalSlug: c.slug })
    else console.warn(`Caravan ${c._id} skipped: cannot produce a valid slug from "${c.slug}" or "${c.title}"`)
  }
  // Dedupe in case two caravans collide on the cleaned slug
  const seen = new Set()
  const unique = []
  for (const c of cleaned) {
    if (seen.has(c.slug)) {
      console.warn(`Caravan ${c._id} skipped: slug "${c.slug}" already used by another caravan`)
      continue
    }
    seen.add(c.slug)
    unique.push(c)
  }
  return unique
}

/**
 * Extract the YouTube video ID from any of the standard URL formats.
 * Returns null for invalid / non-YouTube URLs.
 */
export function youtubeId(url) {
  if (!url) return null
  const m = String(url).match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

/** YouTube thumbnail URL (high quality JPEG, publicly accessible). */
export function youtubeThumb(url) {
  const id = youtubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

/** YouTube embed URL (autoplay + muted ready for hero loops). */
export function youtubeEmbedUrl(url, opts = {}) {
  const id = youtubeId(url)
  if (!id) return null
  const params = new URLSearchParams()
  if (opts.autoplay) { params.set('autoplay', '1'); params.set('mute', '1') }
  if (opts.loop) { params.set('loop', '1'); params.set('playlist', id) }
  if (opts.controls === false) params.set('controls', '0')
  const qs = params.toString()
  return `https://www.youtube.com/embed/${id}${qs ? '?' + qs : ''}`
}

// ---------------------------------------------------------------------------
// Site Settings singleton
// ---------------------------------------------------------------------------

export async function getSiteSettings() {
  // Per Bart 16 Jun: settings are now split across per-page singletons so
  // Maud sees only relevant fields when she opens a page in Studio. Here
  // we fetch them all in parallel and stitch them into the shape the rest
  // of the site already consumes - so no template changes needed.
  const [site, home, newPage, service, shows, quote] = await Promise.all([
    client.fetch(`*[_id == "siteSettings"][0] {
      showSpecial { headline, endDate, ctaText, ctaUrl },
      reserveCta { enabled, buttonText, stripeUrl, helperText }
    }`),
    client.fetch(`*[_id == "homePageSettings"][0] {
      heroVideo,
      "shanesPick": shanesPick {
        originalPrice,
        shanesQuote,
        status,
        "caravan": caravan->{
          _id, title, slug, price, status, condition,
          "brand": brand->name,
          "mainImage": photos[0].asset->url,
          specs { sleeps, length, tareWeight }
        }
      },
      homepageVideo1 { youtubeUrl, description },
      homepageVideo2 { youtubeUrl, description },
      homepageVideo3 { youtubeUrl, description },
      pathwayEyebrow, pathwayHeading, pathwayIntro,
      reviewsCounter,
      testimonialsEyebrow, testimonialsHeading, testimonialsIntro,
      testimonials[]{ quote, name, source, rating },
      happeningEyebrow, happeningHeading
    }`),
    client.fetch(`*[_id == "newPageSettings"][0] {
      newPageTile1 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile2 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile3 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile4 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile5 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile6 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile7 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile8 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref }
    }`),
    client.fetch(`*[_id == "servicePageSettings"][0] {
      servicePageVideo1 { youtubeUrl, label },
      servicePageVideo2 { youtubeUrl, label },
      servicePageVideo3 { youtubeUrl, label },
      servicePageVideo4 { youtubeUrl, label },
      servicePageVideo5 { youtubeUrl, label },
      servicePageVideo6 { youtubeUrl, label },
      serviceWorkshopWeekly { youtubeUrl, caption },
      heroH1, heroSub, crewEyebrow, crewHeading,
      serviceCards[]{ title, body }
    }`),
    client.fetch(`*[_id == "showsPageSettings"][0] {
      showsIndexIntro,
      showsCompilationVideo { youtubeUrl, caption }
    }`),
    client.fetch(`*[_id == "quotePageSettings"][0] {
      quoteVideo_kruiswagen { youtubeUrl, caption },
      quoteVideo_kruiser_t { youtubeUrl, caption },
      quoteVideo_kruiser_s { youtubeUrl, caption },
      quoteVideo_karavan { youtubeUrl, caption },
      quoteVideo_kube { youtubeUrl, caption },
      quoteVideo_trekka { youtubeUrl, caption },
      quoteVideo_rover { youtubeUrl, caption },
      quoteVideo_pod { youtubeUrl, caption }
    }`),
  ])
  const raw = { ...(site || {}), ...(home || {}), ...(newPage || {}), ...(service || {}), ...(shows || {}), ...(quote || {}) }
  if (raw?.shanesPick?.caravan) {
    raw.shanesPick.caravan.slug = {
      current: safeSlug(raw.shanesPick.caravan.slug?.current) || safeSlug(raw.shanesPick.caravan.title),
    }
  }
  // Auto-hide the show-special banner once its end date has passed. Comparison
  // is done on the YYYY-MM-DD date string in UTC - good enough for a marketing
  // banner; Maud can still hide it manually by clearing the headline.
  if (raw?.showSpecial?.endDate) {
    const today = new Date().toISOString().slice(0, 10)
    if (raw.showSpecial.endDate < today) {
      raw.showSpecial = null
    }
  }
  return raw
}

// ---------------------------------------------------------------------------
// Business details singleton (phone, email, address, hours, ABN, socials, map)
// ---------------------------------------------------------------------------

/**
 * The single "Business details" record (Studio -> Business details). One spot
 * for the contact info that used to be hardcoded in ~8 places (contact bar +
 * footer in the layout, /contact, /reserve, the LocalBusiness / AutoDealer
 * JSON-LD on the home + model pages, terms, privacy).
 *
 * Returns null on any error (or if the record does not exist yet) so every
 * caller can fall back to its current hardcoded literal - nothing on the live
 * site changes until Maud creates the record, and nothing breaks if Sanity is
 * unreachable at build time.
 */
export async function getBusinessDetails() {
  try {
    return await client.fetch(`*[_id == "businessDetails"][0]{
      phoneDisplay, phoneHref,
      textDisplay, textHref,
      emailOffice, emailAdmin,
      addressStreet, addressSuburb, addressState, addressPostcode, addressFull,
      showroomHours,
      abn,
      youtubeUrl, instagramUrl, facebookUrl,
      mapQuery
    }`)
  } catch (err) {
    console.warn('getBusinessDetails: Sanity unreachable:', err.message)
    return null
  }
}

// ---------------------------------------------------------------------------
// About page singleton (hero, intro story, team, timeline, why-us cards, CTA)
// ---------------------------------------------------------------------------

/**
 * The single "About page" record (Studio -> About page). Holds every piece of
 * marketing copy on /about so Maud can edit it without a code change.
 *
 * Returns null on any error (or if the record does not exist yet) so about.astro
 * can fall back to its current hardcoded literals - nothing on the live site
 * changes until the record is created and never breaks if Sanity is unreachable
 * at build time.
 */
export async function getAboutPage() {
  try {
    return await client.fetch(`*[_id == "aboutPage"][0]{
      heroH1, heroSub,
      introParagraphs,
      teamEyebrow, teamHeading, teamSub,
      team[]{ name, role, bio, "photo": photo.asset->url },
      timelineEyebrow, timelineHeading,
      timeline[]{ year, title, body },
      whyEyebrow, whyHeading,
      whyCards[]{ heading, body },
      ctaHeading, ctaSub
    }`)
  } catch (err) {
    console.warn('getAboutPage: Sanity unreachable:', err.message)
    return null
  }
}

/**
 * Videos page settings singleton - 12 curated slots (6 Kimberley + 6 Stockman).
 * Returns null if the document does not exist yet.
 */
export async function getVideosPageSettings() {
  return client.fetch(`
    *[_id == "videosPageSettings"][0] {
      kimberley1, kimberley2, kimberley3, kimberley4, kimberley5, kimberley6,
      stockman1, stockman2, stockman3, stockman4, stockman5, stockman6
    }
  `)
}

/**
 * Flatten the videosPageSettings singleton into two arrays of tile objects,
 * filtering out any slot that has no YouTube URL set. Used by /videos to
 * render the Kimberley and Stockman tiles in order.
 *
 * Each tile shape: { _id, title, youtubeUrl, description, brandFamily }
 * to match the existing VideoCard component.
 */
export function flattenVideosPage(settings) {
  if (!settings) return { kimberley: [], stockman: [] }
  const pull = (prefix, family) => {
    const out = []
    for (let i = 1; i <= 6; i++) {
      const s = settings[`${prefix}${i}`]
      if (!s || !s.youtubeUrl) continue
      out.push({
        _id: `${prefix}${i}`,
        title: s.title || `${family === 'kimberley' ? 'Kimberley' : 'Stockman'} video ${i}`,
        youtubeUrl: s.youtubeUrl,
        description: s.description || '',
        brandFamily: family,
        category: 'deep-dive',
      })
    }
    return out
  }
  return {
    kimberley: pull('kimberley', 'kimberley'),
    stockman: pull('stockman', 'stockman'),
  }
}

// ---------------------------------------------------------------------------
// Accessories page
// ---------------------------------------------------------------------------

/**
 * Accessories page singleton: intro, the moved-over accessories video, and the
 * list of accessory items (photo + name + description, optional price).
 * Returns null if the document does not exist yet.
 */
export async function getAccessoriesPage() {
  return client.fetch(`
    *[_id == "accessoriesPageSettings"][0] {
      intro,
      heroVideo
    }
  `)
}

/**
 * All accessory documents (one per product/category), ordered. Each has a
 * photo gallery + products. Used by /accessories and to build the order form's
 * product dropdown.
 */
export async function getAccessories() {
  return client.fetch(`
    *[_type == "accessory"] | order(orderRank asc, title asc) {
      _id, title, navLabel, eyebrow, badges, intro, orderRank,
      products[]{
        name, brand, type, tag, tagColor, price, priceNote, pitch, features, specs, videoUrl,
        "photos": photos[]{ "url": asset->url, alt }
      },
      compareHeading, compareIntro,
      compareColumns[]{ heading, body, note },
      compareNote
    }
  `)
}

// ---------------------------------------------------------------------------
// Shows
// ---------------------------------------------------------------------------

/** Brisbane (AEST = UTC+10, no daylight saving) date as YYYY-MM-DD. */
export function brisbaneToday() {
  const nowBrisbane = new Date(Date.now() + 10 * 60 * 60 * 1000)
  return nowBrisbane.toISOString().slice(0, 10)
}

/**
 * Work out a show's phase from its dates so the "On now / Upcoming / Past"
 * label changes itself - nobody has to flip a status field. Falls back to the
 * manual `status` field only when dates are missing.
 * Returns 'active' | 'upcoming' | 'past'.
 *
 * NOTE: the site is static, so this is evaluated at BUILD time. It's correct
 * as of the last build; a daily scheduled rebuild keeps it fresh between
 * content edits (otherwise a show won't flip to "past" until the next deploy).
 */
export function showPhase(show, today = brisbaneToday()) {
  const start = show?.startDate
  const end = show?.endDate
  if (end && today > end) return 'past'
  if (start && today < start) return 'upcoming'
  if (start && end && today >= start && today <= end) return 'active'
  // No usable dates - fall back to the manual status field.
  if (show?.status === 'active') return 'active'
  if (show?.status === 'archived') return 'past'
  return 'upcoming'
}

const SHOW_PROJECTION = `{
  _id, title, "slug": slug.current, status, eventWebsiteUrl,
  startDate, endDate, datesLabel, daysLabel,
  venueName, venueAddress, standNumber, standArea, podiumNumber,
  heroEyebrow, heroH1, seoDescription,
  calloutBoxes,
  standEyebrow, standHeading, standCaravans,
  offerEnabled, offerHeading, offerIntro, offerExpiry,
  vansRemaining, holdAmount, holdHelperText, inclusions, offerFinePrint,
  brandQrEyebrow, brandQrHeading, brandQrIntro, brandCards,
  whyComeHeading, whyComeBody,
  privateSlotCtaHeading, privateSlotCtaBody,
  cantMakeItHeading, cantMakeItBody,
  faqs
}`

/**
 * Every show ordered with upcoming/active first, then archived. Used by /shows index.
 */
export async function getShows() {
  const raw = await client.fetch(`
    *[_type == "show"]
    | order(
        select(status == "active" => 0, status == "upcoming" => 1, 2),
        startDate desc
      )
    ${SHOW_PROJECTION}
  `)
  // Normalise slug to the same safe form getAllShowPaths produces so the
  // /shows index cards link to URLs that actually exist in the build output,
  // and attach the date-derived phase so the pill is automatic.
  return (raw || []).map((s) => ({
    ...s,
    slug: safeSlug(s.slug) || safeSlug(s.title),
    phase: showPhase(s),
  }))
}

/** Single show by slug. Returns null when not found. */
export async function getShow(slug) {
  // Match against the safe-slugified form so an editor-entered slug with
  // spaces/capitals/URL characters still resolves to the right document
  // (mirrors getCaravan - shows used to assume a clean slug, which let a
  // pasted website URL in the slug field crash the whole static build).
  const all = await client.fetch(`
    *[_type == "show"] { _id, title, "slug": slug.current }
  `)
  const match = (all || []).find((s) => {
    const fromSlug = safeSlug(s.slug)
    const fromTitle = safeSlug(s.title)
    return fromSlug === slug || fromTitle === slug
  })
  if (!match) return null

  return client.fetch(`*[_id == $id][0] ${SHOW_PROJECTION}`, { id: match._id })
}

/** Slug list for /shows/[slug] dynamic route generation. */
export async function getAllShowPaths() {
  const raw = await client.fetch(`
    *[_type == "show" && defined(slug.current)] { _id, title, "slug": slug.current }
  `)
  // Auto-clean any slug that has spaces, capitals or invalid characters (e.g.
  // a website URL pasted into the slug field). Skip any show whose slug AND
  // title both fail to produce something usable so one bad doc can never take
  // down the build - it just drops that single page.
  const seen = new Set()
  const unique = []
  for (const s of raw) {
    const slug = safeSlug(s.slug) || safeSlug(s.title)
    if (!slug) {
      console.warn(`Show ${s._id} skipped: cannot produce a valid slug from "${s.slug}" or "${s.title}"`)
      continue
    }
    if (seen.has(slug)) {
      console.warn(`Show ${s._id} skipped: slug "${slug}" already used by another show`)
      continue
    }
    seen.add(slug)
    unique.push({ slug, _id: s._id })
  }
  return unique
}

/**
 * Distinct brand names of for-sale caravans (used by the stock page filter bar).
 */
export async function getDistinctBrands() {
  return client.fetch(`
    array::unique(*[_type == "caravan" && status == "for-sale" && defined(brand)].brand->name)
    | order(@ asc)
  `)
}

// ---------------------------------------------------------------------------
// What's Happening feed (homepage + /whats-happening)
// ---------------------------------------------------------------------------

/**
 * Format a YYYY-MM-DD date string as a short "D MMM" label (e.g. "10 May").
 * Parses the ISO string directly (no Date object) to avoid timezone drift.
 */
export function shortDate(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = String(isoDate).split('-').map(Number)
  if (!y || !m || !d) return String(isoDate)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d} ${months[m - 1]}`
}

/**
 * The unified "What's Happening" feed. Merges editor-managed `happening`
 * documents with upcoming/active `show` documents (so adding a show surfaces
 * it on the homepage + /whats-happening automatically - no duplicate doc).
 *
 * Each item: { _id, date, type, title, body, link, showOnHomepage, source }.
 * Sorted newest first by date. Returns [] if Sanity is unreachable.
 */
export async function getHappeningsFeed() {
  let happenings = []
  let shows = []
  try {
    ;[happenings, shows] = await Promise.all([
      client.fetch(`
        *[_type == "happening" && defined(date)] | order(date desc) {
          _id, title, type, date, body, link, showOnHomepage
        }
      `),
      client.fetch(`
        *[_type == "show" && defined(startDate)] {
          _id, title, "slug": slug.current, startDate, endDate, status, datesLabel, venueName, seoDescription
        }
      `),
    ])
  } catch (err) {
    console.warn('getHappeningsFeed: Sanity unreachable:', err.message)
    return []
  }

  // Only current/upcoming shows belong in the feed - past shows drop off
  // automatically (they live in the /shows "Past shows" archive).
  const showItems = (shows || []).filter((s) => showPhase(s) !== 'past').map((s) => {
    const slug = safeSlug(s.slug) || safeSlug(s.title)
    return {
      _id: s._id,
      date: s.startDate,
      type: 'Event',
      title: s.title,
      body: s.seoDescription || [s.datesLabel, s.venueName].filter(Boolean).join(' · '),
      link: slug ? `/shows/${slug}` : '/shows',
      showOnHomepage: true,
      source: 'show',
    }
  })

  const newsItems = (happenings || []).map((h) => ({
    _id: h._id,
    date: h.date,
    type: h.type || 'News',
    title: h.title,
    body: h.body,
    link: h.link || null,
    showOnHomepage: h.showOnHomepage !== false,
    source: 'happening',
  }))

  return [...showItems, ...newsItems]
    .filter((i) => i.date && i.title)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

/**
 * All published blog posts, newest first. Used on /blog index.
 */
export async function getPublishedBlogPosts() {
  return client.fetch(`
    *[_type == "blogPost" && isPublished == true && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      author,
      "coverImage": coverImage.asset->url
    }
  `)
}

/**
 * Single blog post by slug. Used on /blog/[slug].
 */
export async function getBlogPostBySlug(slug) {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug && isPublished == true][0] {
      _id, title, "slug": slug.current, publishedAt, "updatedAt": _updatedAt, excerpt, author, body,
      "coverImage": coverImage.asset->url
    }`,
    { slug }
  )
}

/**
 * All slugs of published posts - used by getStaticPaths on /blog/[slug].
 */
export async function getAllBlogSlugs() {
  return client.fetch(
    `*[_type == "blogPost" && isPublished == true && defined(slug.current)] { "slug": slug.current }`
  )
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

/**
 * All published FAQs, grouped by category. Used on /faq AND for the
 * FAQPage JSON-LD schema injected site-wide.
 */
export async function getPublishedFaqs() {
  return client.fetch(`
    *[_type == "faq" && isPublished == true] | order(category asc, order asc) {
      _id, question, answer, category, order
    }
  `)
}

// ---------------------------------------------------------------------------
// Model pricing (drives the /[model] marketing pages - Rover, Trekka, etc.)
// ---------------------------------------------------------------------------

/**
 * Editable pricing for one model marketing page, matched by the page slug
 * (e.g. "stockman-rover"). Returns null if none set, in which case
 * [model].astro falls back to the hardcoded defaults in src/data/model-pages.js
 * - so the page never breaks if Sanity is unreachable or no record exists yet.
 */
export async function getModelPricing(model) {
  return client.fetch(
    `*[_type == "modelPricing" && model == $model][0]{
      model, priceOnApplication, heroPriceFrom, heroPriceNote,
      versions[]{ tag, priceFrom }, pricingHeading, pricingBody, lowPrice, highPrice
    }`,
    { model }
  )
}

/**
 * All model pricing records (just the fields the /new tiles need), so the tile
 * price on /new matches the model page. Returns [] if none / Sanity unreachable.
 */
export async function getAllModelPricing() {
  return client.fetch(
    `*[_type == "modelPricing"]{ model, priceOnApplication, heroPriceFrom }`
  )
}

// ---------------------------------------------------------------------------
// Configurator / quote prices (drives the /quote/{model} "Build your spec"
// configurator - the money-critical running-total pages).
// ---------------------------------------------------------------------------

/**
 * Brand family is deterministic per model slug and never edited, so we derive
 * it rather than storing it. quote/[slug].astro uses it only to pick the
 * ex-factory location (Kimberley -> Ballina NSW, Stockman -> Melbourne).
 */
const QUOTE_BRAND_FAMILY = {
  karavan: 'Kimberley',
  kube: 'Kimberley',
  kruiswagen: 'Kimberley',
  kruiser: 'Kimberley',
  rover: 'Stockman',
  trekka: 'Stockman',
}

/**
 * Coerce a stored price STRING back to the exact value the configurator expects.
 * The four meanings the calculator distinguishes:
 *   "" / null / undefined -> null    (N/A - option unavailable on this variant)
 *   "POA" (any case)       -> 'POA'   (price on application, no dollar figure)
 *   "0"                    -> 0       (Included)
 *   "-890"                 -> -890    (a credit)
 *   "555"                  -> 555     (dollars added)
 * Anything that is not blank, not POA, and not a finite number is treated as
 * N/A (null) rather than silently poisoning the total with NaN.
 */
function coerceQuotePrice(raw) {
  if (raw === null || raw === undefined) return null
  const s = String(raw).trim()
  if (s === '') return null
  if (s.toUpperCase() === 'POA') return 'POA'
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/**
 * Fetch the editable configurator prices for one model and transform the Sanity
 * document back into the EXACT object shape src/pages/quote/[slug].astro imports
 * from src/data/quote-builders.js. Reconstructs:
 *   - flat options       -> { ...opt, price: <number|'POA'|null> }
 *   - per-variant options -> { ...opt, priceByVariant: { <variantId>: value, ... } }
 * preserving 0 (Included), negatives (credits), 'POA', and null (N/A), and
 * keeping variant-key order so the server-rendered data-price-by-variant JSON is
 * byte-identical to the code-driven output.
 *
 * Returns null on any error or when no record exists, so the page falls straight
 * back to the code file - the live site is unchanged until the record is seeded.
 */
export async function getQuoteBuilder(slug) {
  try {
    const doc = await client.fetch(
      `*[_type == "quoteBuilder" && model == $slug][0]{
        model, name, intro, delivery,
        variants[]{ variantId, name, basePrice, tare, included },
        categories[]{
          categoryId, title,
          options[]{
            optionId, label, note, priceMode, price,
            priceByVariant[]{ variantId, price },
            requires, blockedBy, depNote, blockedNote, naNote
          }
        },
        onRoad{ stampDutyRate, registration, dealerDelivery },
        weight{
          baseGvm, upgradedGvm, gvmOptionId, passengers, fuelBase, waterBase,
          fuelExtra[]{ optId, kg },
          waterExtra[]{ optId, kg },
          weights[]{ optId, kg }
        }
      }`,
      { slug }
    )
    if (!doc) return null

    // ── Variants ──────────────────────────────────────────────────────────
    const variants = (doc.variants || []).map((v) => {
      const out = {
        id: v.variantId,
        name: v.name,
        basePrice: v.basePrice,
        included: Array.isArray(v.included) ? v.included : [],
      }
      // `tare` only exists on the Kruiswagen variants; keep it off the others
      // so the shape matches the source exactly.
      if (typeof v.tare === 'number') out.tare = v.tare
      return out
    })

    // ── Categories + options ─────────────────────────────────────────────
    const categories = (doc.categories || []).map((c) => ({
      id: c.categoryId,
      title: c.title,
      options: (c.options || []).map((o) => {
        const opt = { id: o.optionId, label: o.label }
        // `note` is optional in the source - only attach it when present so we
        // don't introduce a `note: undefined` key that isn't in the original.
        if (o.note) opt.note = o.note

        if (o.priceMode === 'byVariant') {
          // Rebuild the { variantId: value } object in row order so the
          // stringified JSON key order matches the source declaration order.
          const map = {}
          for (const row of o.priceByVariant || []) {
            map[row.variantId] = coerceQuotePrice(row.price)
          }
          opt.priceByVariant = map
        } else {
          // Flat price - the same value for every variant.
          opt.price = coerceQuotePrice(o.price)
        }

        // Dependency / availability metadata - only attach when present so the
        // reconstructed option carries exactly the same keys as the source.
        if (Array.isArray(o.requires) && o.requires.length) opt.requires = o.requires
        if (Array.isArray(o.blockedBy) && o.blockedBy.length) opt.blockedBy = o.blockedBy
        if (o.depNote) opt.depNote = o.depNote
        if (o.blockedNote) opt.blockedNote = o.blockedNote
        if (o.naNote) opt.naNote = o.naNote
        return opt
      }),
    }))

    const brand = {
      slug: doc.model,
      brandFamily: QUOTE_BRAND_FAMILY[doc.model] || null,
      name: doc.name,
      intro: doc.intro,
      delivery: doc.delivery,
      variants,
      categories,
    }

    // ── On-road (Kruiswagen only) ────────────────────────────────────────
    // Only attach when a rate is actually set - a towed model must NOT carry an
    // onRoad{} object or the page swaps to the on-road delivery line.
    if (doc.onRoad && typeof doc.onRoad.stampDutyRate === 'number') {
      brand.onRoad = {
        stampDutyRate: doc.onRoad.stampDutyRate,
        registration: doc.onRoad.registration,
        dealerDelivery: doc.onRoad.dealerDelivery,
      }
    }

    // ── Weight / GVM payload (Kruiswagen only) ───────────────────────────
    // Only attach when a base GVM is set - otherwise the weight panel must stay
    // hidden (towed models have no weight{} in the source).
    if (doc.weight && typeof doc.weight.baseGvm === 'number') {
      const w = doc.weight
      brand.weight = {
        baseGvm: w.baseGvm,
        upgradedGvm: w.upgradedGvm,
        gvmOptionId: w.gvmOptionId,
        passengers: w.passengers,
        fuelBase: w.fuelBase,
        waterBase: w.waterBase,
        fuelExtra: (w.fuelExtra || []).map((f) => ({ optId: f.optId, kg: f.kg })),
        waterExtra: (w.waterExtra || []).map((x) => ({ optId: x.optId, kg: x.kg })),
        // The source `weights` is a { optId: kg } lookup; rebuild it from the
        // stored array so renderWeight() reads it exactly as before.
        weights: (w.weights || []).reduce((acc, row) => {
          acc[row.optId] = row.kg
          return acc
        }, {}),
      }
    }

    return brand
  } catch (err) {
    console.warn('getQuoteBuilder: Sanity unreachable or transform failed:', err.message)
    return null
  }
}
