describe('Login2 - Validate cacheAcrossSpecs - login-session-2.cy.js', () => {
	const user = Cypress.env('USER_EMAIL')
	const password = Cypress.env('USER_PASSWORD')
	const options = { cacheSession: true }

	it.skip('Validate session is reused from login.cy.js (cacheAcrossSpecs)', { tags: '@login' }, () => {
		cy.gui_login(user, password, options)
		cy.visit(Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL'))
		cy.contains('Minha Conta').should('be.visible').click()
		cy.contains('span', 'Sair').should('be.visible')
	})
})
