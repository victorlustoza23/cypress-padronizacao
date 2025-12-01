// import { cypressCodegen } from 'cypress-codegen'
import { defineConfig } from 'cypress'
const cypressSplit = require('cypress-split')
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin'

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'reports/html/',
    charts: true,
    embeddedScreenshots: true,
    overwrite: true,
    json: true,
    reportFilename: 'report-generated',
  },
  screenshotsFolder: 'cypress/reports/html/screenshots',
  e2e: {
    env: {
      grepFilterSpecs: true,
      grepOmitFiltered: true,
      hideCredentials: true,
      snapshotOnly: true,
    },
    retries: {
      runMode: 2,
      openMode: 2,
    },
    supportFile: 'cypress/support/e2e.js',
    viewportHeight: 1000,
    viewportWidth: 1280,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)

      // cypressCodegen(on, config)
      cypressSplit(on, config)
      cypressGrepPlugin(config)
      return config
    },
  },
})
