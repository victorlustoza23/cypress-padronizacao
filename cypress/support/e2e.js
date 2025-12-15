import './api_commands'
import './gui_commands'
import 'cypress-plugin-api'
import 'cypress-mochawesome-reporter/register'

const { register: registerCypressGrep } = require('@cypress/grep')
registerCypressGrep()

import addContext from 'mochawesome/addContext'

Cypress.on('test:after:run', (test, runnable) => {
	if (test.state !== 'failed') return

	// nome do spec, ex: login.cy.js
	const specName = Cypress.spec.name

	// pasta onde você salva as screenshots: reports/html/<specName>/*.png
	const base = `./${specName}`

	// screenshot da última tentativa (a que realmente falhou)
	const lastScreenshot = `${base}/${runnable.parent.title} -- ${test.title} (failed).png`
	addContext({ test }, lastScreenshot)

	// se quiser anexar todas as tentativas:
	for (let attempt = 2; attempt <= test.currentRetry + 1; attempt++) {
		const retryShot = `${base}/${runnable.parent.title} -- ${test.title} (failed) (attempt ${attempt}).png`
		addContext({ test }, retryShot)
	}
})

const app = window.top
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
	const style = app.document.createElement('style')
	style.innerHTML = `
  .command-name-request,
  .command-name-xhr,
  .command-name-page-load,
  .command-name-new-url,
  .command-name-page-load-start,
  .command-name-page-load-end {
  display: none;
  }
  .command-method::before {
  content: none !important;
  background-color: red;
  }
  .command-method {
  background-color: #2196F3;
  color: white;
  border-radius: 3px;
  padding: 3px 5px;
  }
  .command-method span {
  color: white;
  }
  .reporter .command-name-assert .command-state-passed .command-method {
    background-color: #1fa971;
  }
  .reporter .command-name-assert .command-state-passed .command-method span {
  background-color: unset !important;
  color: white !important;
  }
    .reporter .command-name-assert .command-state-failed .command-method {
    background-color: #df092f;
  }
    .reporter .command-name-assert .command-state-failed .command-method span {
    background-color: unset !important;
  color: white !important;
  }
  `
	style.setAttribute('data-hide-command-log-request', '')
	app.document.head.appendChild(style)
}
