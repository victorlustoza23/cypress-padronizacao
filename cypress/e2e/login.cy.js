describe('Login example spec', () => {
	const user = Cypress.env('USER_EMAIL')
	const password = Cypress.env('USER_PASSWORD')
	const options = { cacheSession: false }

	beforeEach(() => {
		cy.gui_setupUserAgent()
	})

	it('Validate login on MadeiraMadeira', { tags: '@login' }, () => {
		cy.gui_login(user, password, options)

		cy.contains('Minha Conta').should('be.visible').click()
		cy.contains('span', 'Sair').should('be.visible')
	})

	it('Validate login on MadeiraMadeira', { tags: '@example-fail' }, () => {
		cy.gui_login(user, password, options)

		cy.contains('Minha Conta').should('be.visible').click()
		cy.contains('span', 'Sairr').should('be.visible')
	})
})
