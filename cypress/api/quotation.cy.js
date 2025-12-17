/**
 * Exemplo de spec de teste de API para validação de cotação
 *
 * Demonstra o padrão AAA (Arrange-Act-Assert) em testes de API:
 * - Arrange: prepara dados de entrada (zipcode)
 * - Act: executa chamada de API (cy.api_quotation)
 * - Assert: valida resposta (status code e body)
 */
describe('Quotation example spec', () => {
	it('Validate quotation for Curitiba', { tags: '@quotation' }, () => {
		// Arrange: define CEP para consulta
		const zipcode = '80730350'

		// Act: executa chamada de API
		cy.api_quotation(zipcode).then((response) => {
			// Assert: valida status code e estrutura da resposta
			expect(response.status).to.eq(200)
			expect(response.body.success).to.eq(true)
		})
	})

	// Teste intencionalmente falho para demonstrar retries e validação de status code incorreto
	it('Validate quotation for Curitiba', { tags: '@example-fail' }, () => {
		const zipcode = '80730350'

		cy.api_quotation(zipcode).then((response) => {
			// Assert propositalmente incorreto (espera 201 ao invés de 200) para demonstrar falha
			expect(response.status).to.eq(201)
			expect(response.body.success).to.eq(true)
		})
	})
})
