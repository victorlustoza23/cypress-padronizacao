// Comandos customizados para testes de API
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
		failOnStatusCode: false,
	}).then((response) => {
		const access_token = response.body.access_token

		Cypress.env('AUTHORIZATION_TOKEN_STAGING', access_token)
	})
})

Cypress.Commands.add('api_quotation', (zipcode) => {
	cy.api({
		method: 'GET',
		url: `${Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL')}/api/iguanafix/getAddress/${zipcode}`,
		failOnStatusCode: false,
	})
})
