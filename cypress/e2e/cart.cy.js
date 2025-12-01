describe('Cart example spec', () => {
  it('Visit example page cart', { tags: '@cart' }, () => {
    cy.visit('https://example.cypress.io')
    cy.url().should('include', 'cypress.io')
  })

  it('Visit example page cart 2', { tags: '@cart' }, () => {
    cy.visit('https://example.cypress.io')
    cy.url().should('include', 'cypress.io')
  })
})
