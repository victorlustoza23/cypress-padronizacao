/**
 * Exemplo de spec de teste E2E para validação de login
 *
 * Demonstra o padrão AAA (Arrange-Act-Assert):
 * - Arrange: prepara dados e configurações (user, password, options)
 * - Act: executa ações (cy.gui_login, cy.contains().click())
 * - Assert: valida resultados (should('be.visible'))
 */
describe('Login example spec', () => {
	// Arrange: obtém credenciais do ambiente
	const user = Cypress.env('USER_EMAIL')
	const password = Cypress.env('USER_PASSWORD')
	// cacheSession: false garante login "fresco" a cada teste (útil para testes isolados)
	const options = { cacheSession: false }

	it('Validate login on MadeiraMadeira', { tags: '@login' }, () => {
		// Act: executa login e navegação
		cy.gui_login(user, password, options)

		// Assert: valida que o usuário está logado (botão "Sair" visível)
		cy.contains('Minha Conta').should('be.visible').click()
		cy.contains('span', 'Sair').should('be.visible')
	})

	// Teste intencionalmente falho para demonstrar retries e screenshots no relatório
	it('Validate login on MadeiraMadeira', { tags: '@example-fail' }, () => {
		cy.gui_login(user, password, options)

		cy.contains('Minha Conta').should('be.visible').click()
		// Assert propositalmente incorreto ('Sairr' ao invés de 'Sair') para demonstrar falha
		cy.contains('span', 'Sairr').should('be.visible')
	})
})
