import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ttam87n8',
    dataset: 'production',
  },
  deployment: {
    /**
     * Auto-update the deployed Studio when Sanity releases new versions
     * (security fixes, new features). Recommended for production studios.
     */
    autoUpdates: true,
    /**
     * Studio app ID assigned by Sanity on first deploy. Including it here
     * skips the "Select existing studio hostname" prompt on subsequent deploys.
     */
    appId: 's0cpb1igxotqhlivncqh7ql1',
  },
})
