import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://seqcampers.com.au',
  integrations: [
    react(),
    sitemap({
      // Per Bart 18 Jun: handover pages are UNLISTED - shared only via the
      // printed handover letter / follow-up email. Keep them out of the
      // sitemap so they don't appear in search engines.
      filter: (page) => !/\/handover\//.test(page) && !/\/user-guide\//.test(page),
      // Add a <lastmod> to every URL (the sitemap previously had none, which
      // gave AI search + Google zero freshness signal). The whole static site
      // is regenerated on every Sanity publish (webhook -> Netlify) and on the
      // daily scheduled build, so the build timestamp is an honest "last
      // regenerated" date for each page.
      serialize(item) {
        item.lastmod = new Date().toISOString()
        return item
      },
    }),
  ],
  output: 'static',
  server: { port: 4400 },
})
