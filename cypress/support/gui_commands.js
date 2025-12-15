// Comandos customizados para testes de interface gráfica
Cypress.Commands.add('gui_login', (user = Cypress.env('USER_EMAIL'), password = Cypress.env('USER_PASSWORD'), { cacheSession = true } = {}) => {
	const login = () => {
		cy.visit(`${Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL')}/verificar`)

		cy.get('[type="text"]').type(user, { log: false })
		cy.contains('Continuar').click()
		cy.get('[type="password"]').type(password, { log: false })
		cy.contains('Continuar').click()
	}

	const validate = () => {
		cy.visit(`${Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL')}/verificar`)
		cy.location('pathname', { timeout: 1000 }).should('not.eq', Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL'))
	}

	const options = {
		cacheAcrossSpecs: true,
		validate,
	}

	if (cacheSession) {
		if (!sessionId) {
			sessionId = `${user}-${new Date().getTime()}`
			cy.session(sessionId, login, options)
		} else {
			cy.session(sessionId, login, options)
		}
	} else {
		login()
	}
})
