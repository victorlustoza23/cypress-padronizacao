describe('Quotation example spec', () => {
  const zipcode = '80730350'

  it('Validate quotation for Curitiba', { tags: '@quotation' }, () => {
    cy.api_quotation(zipcode).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.success).to.eq(true)
    })
  })

  it('Validate quotation for Curitiba', { tags: '@example-fail' }, () => {
    cy.api_quotation(zipcode).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.success).to.eq(true)
    })
  })
})
