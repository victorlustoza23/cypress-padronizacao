describe('Checkout example spec', () => {
  it('Visit example page checkout', { tags: '@checkout' }, () => {
    cy.visit('https://example.cypress.io')
    cy.url().should('include', 'cypress.io')
  })

  it('Visit example page checkout 2', { tags: '@checkout' }, () => {
    cy.visit('https://example.cypress.io')
    cy.url().should('include', 'cypress.io')
  })
})
