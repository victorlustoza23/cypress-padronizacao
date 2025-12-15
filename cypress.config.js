// import { cypressCodegen } from 'cypress-codegen'
import { defineConfig } from 'cypress'
const cypressSplit = require('cypress-split')
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin'

export default defineConfig({
	reporter: 'cypress-mochawesome-reporter',
	reporterOptions: {
		reportDir: 'reports/html/',
		reportFilename: 'report-generated',
		charts: true,
		embeddedScreenshots: true,
		overwrite: true,
		json: true,
	},
	screenshotsFolder: 'reports/html/',
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
		specPattern: ['cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', 'cypress/api/**/*.cy.{js,jsx,ts,tsx}'],
		supportFile: 'cypress/support/e2e.js',
		viewportHeight: 1000,
		viewportWidth: 1280,
		experimentalRunAllSpecs: true,
		defaultCommandTimeout: 15000,
		setupNodeEvents(on, config) {
			require('cypress-mochawesome-reporter/plugin')(on)

			// cypressCodegen(on, config)
			cypressSplit(on, config)
			cypressGrepPlugin(config)
			return config
		},
	},
})
