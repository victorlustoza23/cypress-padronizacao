describe('Quotation example spec', () => {
	it('Validate quotation for Curitiba', { tags: '@quotation' }, () => {
		const zipcode = '80730350'

		cy.api_quotation(zipcode).then((response) => {
			expect(response.status).to.eq(200)
			expect(response.body.success).to.eq(true)
		})
	})

	it('Validate quotation for Curitiba', { tags: '@outra-tag' }, () => {
		const zipcode = '80730350'

		cy.api_quotation(zipcode).then((response) => {
			expect(response.status).to.eq(201)
			expect(response.body.success).to.eq(true)
		})
	})
})
