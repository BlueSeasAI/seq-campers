import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

export async function getForSaleCaravans() {
  return client.fetch(`
    *[_type == "caravan" && status == "for-sale"]
    | order(featured desc, price asc) {
      _id, title, slug, price, status, featured,
      "brand": brand->name,
      "mainImage": photos[0].asset->url,
      specs { sleeps, length, tareWeight }
    }
  `)
}

export async function getCaravan(slug) {
  return client.fetch(`
    *[_type == "caravan" && slug.current == $slug][0] {
      _id, title, price, status, description, features,
      "brand": brand->name,
      "photos": photos[].asset->url,
      "videos": videos[],
      specs,
      configurator
    }
  `, { slug })
}

export async function getSoldCaravans() {
  return client.fetch(`
    *[_type == "caravan" && status == "sold"]
    | order(_updatedAt desc) {
      _id, title, price, "brand": brand->name, "mainImage": photos[0].asset->url
    }
  `)
}

export async function getFeaturedCaravans() {
  return client.fetch(`
    *[_type == "caravan" && featured == true && status == "for-sale"][0..2] {
      _id, title, slug, price, "brand": brand->name, "mainImage": photos[0].asset->url
    }
  `)
}

export async function getAllCaravanPaths() {
  return client.fetch(`
    *[_type == "caravan" && status == "for-sale"] { "slug": slug.current }
  `)
}
