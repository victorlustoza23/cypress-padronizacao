describe('Login example spec', () => {
	const user = Cypress.env('USER_EMAIL')
	const password = Cypress.env('USER_PASSWORD')
	const options = { cacheSession: false }
	it('Validate login on MadeiraMadeira', { tags: '@login' }, () => {
		cy.gui_login(user, password, options)

		cy.contains('Minha Conta').should('be.visible').click()
		cy.contains('span', 'Sair').should('be.visible')
	})

	it('Validate login on MadeiraMadeira', { tags: '@outra-tag' }, () => {
		cy.gui_login(user, password, options)

		cy.contains('Minha Conta').should('be.visible').click()
		cy.contains('span', 'Sairr').should('be.visible')
	})
})
