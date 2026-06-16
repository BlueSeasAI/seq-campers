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
      _id, title, price, status, condition, description, features,
      "brand": brand->name,
      "photos": photos[].asset->url,
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
  return client.fetch(`
    *[_type == "caravan" && status == "sold"]
    | order(_updatedAt desc) {
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
  const raw = await client.fetch(`
    *[_id == "siteSettings"][0] {
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
      showSpecial { headline, endDate, ctaText, ctaUrl },
      reserveCta { enabled, buttonText, stripeUrl, helperText },
      homepageVideo1 { youtubeUrl, description },
      homepageVideo2 { youtubeUrl, description },
      homepageVideo3 { youtubeUrl, description },
      newPageTile1 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile2 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile3 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile4 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile5 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile6 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile7 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      newPageTile8 { youtubeUrl, brandLabel, modelLabel, priceLabel, ctaHref },
      showsIndexIntro,
      showsCompilationVideo { youtubeUrl, caption },
      servicePageVideo1 { youtubeUrl, label },
      servicePageVideo2 { youtubeUrl, label },
      servicePageVideo3 { youtubeUrl, label },
      servicePageVideo4 { youtubeUrl, label },
      servicePageVideo5 { youtubeUrl, label },
      servicePageVideo6 { youtubeUrl, label },
      serviceWorkshopWeekly { youtubeUrl, caption }
    }
  `)
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
// Shows
// ---------------------------------------------------------------------------

const SHOW_PROJECTION = `{
  _id, title, "slug": slug.current, status,
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
  return client.fetch(`
    *[_type == "show"]
    | order(
        select(status == "active" => 0, status == "upcoming" => 1, 2),
        startDate desc
      )
    ${SHOW_PROJECTION}
  `)
}

/** Single show by slug. Returns null when not found. */
export async function getShow(slug) {
  return client.fetch(
    `*[_type == "show" && slug.current == $slug][0] ${SHOW_PROJECTION}`,
    { slug }
  )
}

/** Slug list for /shows/[slug] dynamic route generation. */
export async function getAllShowPaths() {
  return client.fetch(`
    *[_type == "show" && defined(slug.current)] { "slug": slug.current }
  `)
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
