describe('Login example spec - login-session-1.cy.js', () => {
	const user = Cypress.env('USER_EMAIL')
	const password = Cypress.env('USER_PASSWORD')
	const options = { cacheSession: false }

	it.skip('Validate login on MadeiraMadeira', { tags: '@login' }, () => {
		cy.gui_login(user, password, options)
		cy.contains('Minha Conta').should('be.visible').click()
		cy.contains('span', 'Sair').should('be.visible')
	})

	it.skip('Validate session cache is working', { tags: '@login' }, () => {
		const sessionOptions = { cacheSession: true }
		cy.gui_login(user, password, sessionOptions)
		cy.visit(Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL'))
		cy.contains('Minha Conta').should('be.visible').click()
		cy.contains('span', 'Sair').should('be.visible')
	})
})
