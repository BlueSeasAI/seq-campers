import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { toHTML } from '@portabletext/to-html'

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,
  useCdn: true,
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

export async function getForSaleCaravans() {
  return client.fetch(`
    *[_type == "caravan" && status == "for-sale"]
    | order(featured desc, price asc) {
      _id, title, slug, price, status, condition, featured,
      "brand": brand->name,
      "mainImage": photos[0].asset->url,
      specs { sleeps, length, tareWeight }
    }
  `)
}

export async function getCaravan(slug) {
  return client.fetch(
    `
    *[_type == "caravan" && slug.current == $slug][0] {
      _id, title, price, status, condition, description, features,
      "brand": brand->name,
      "photos": photos[].asset->url,
      "videos": videos[],
      specs,
      compliance,
      power,
      tripHistory,
      configurator
    }
  `,
    { slug }
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

export async function getFeaturedCaravans() {
  return client.fetch(`
    *[_type == "caravan" && featured == true && status == "for-sale"][0..2] {
      _id, title, slug, price, condition,
      "brand": brand->name,
      "mainImage": photos[0].asset->url
    }
  `)
}

export async function getAllCaravanPaths() {
  return client.fetch(`
    *[_type == "caravan" && status == "for-sale"] { "slug": slug.current }
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
