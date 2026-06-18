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
      filter: (page) => !/\/handover\//.test(page),
    }),
  ],
  output: 'static',
  server: { port: 4400 },
})
