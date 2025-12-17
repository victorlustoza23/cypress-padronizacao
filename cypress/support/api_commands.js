/**
 * Comandos customizados para testes de API
 *
 * Centraliza chamadas de API reutilizáveis, facilitando manutenção e padronização.
 * Usa cypress-plugin-api (cy.api) para melhorar logs e ergonomia em relação ao cy.request padrão.
 */

/**
 * Realiza login via API e armazena o token de autenticação no Cypress.env
 *
 * @param {string} user_email - Email do usuário (padrão: Cypress.env('USER_EMAIL'))
 * @param {string} user_password - Senha do usuário (padrão: Cypress.env('USER_PASSWORD'))
 *
 * @example
 * cy.api_login() // Usa credenciais do Cypress.env
 * cy.api_login('user@example.com', 'senha123') // Credenciais explícitas
 *
 * // Após login, o token fica disponível em:
 * // Cypress.env('AUTHORIZATION_TOKEN_STAGING')
 */
Cypress.Commands.add('api_login', (user_email = Cypress.env('USER_EMAIL'), user_password = Cypress.env('USER_PASSWORD')) => {
	cy.api({
		method: 'POST',
		url: `${Cypress.env('PRICING_BFF_STAGING_URL')}/login`,
		body: {
			email: user_email,
			password: user_password,
		},
		headers: {
			'content-type': 'application/json',
		},
		// Permite que o teste controle a validação de status code manualmente
		// Útil para testar cenários de erro (401, 403, etc) sem quebrar o teste
		failOnStatusCode: false,
	}).then((response) => {
		const access_token = response.body.access_token

		// Armazena o token no ambiente do Cypress para uso em testes subsequentes
		// Pode ser acessado via: Cypress.env('AUTHORIZATION_TOKEN_STAGING')
		Cypress.env('AUTHORIZATION_TOKEN_STAGING', access_token)
	})
})

/**
 * Consulta cotação de frete para um CEP específico
 *
 * @param {string} zipcode - CEP no formato '12345678' (sem hífen)
 *
 * @example
 * cy.api_quotation('80730350').then((response) => {
 *   expect(response.status).to.eq(200)
 *   expect(response.body.success).to.eq(true)
 * })
 */
Cypress.Commands.add('api_quotation', (zipcode) => {
	cy.api({
		method: 'GET',
		url: `${Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL')}/api/iguanafix/getAddress/${zipcode}`,
		// Permite validar manualmente status codes diferentes (200, 404, 500, etc)
		failOnStatusCode: false,
	})
})
