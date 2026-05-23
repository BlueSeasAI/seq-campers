import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://seqcampers.com.au',
  integrations: [react(), sitemap()],
  output: 'static',
  server: { port: 4400 },
})
