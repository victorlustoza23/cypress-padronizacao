// Comandos customizados para testes de API

Cypress.Commands.add('downloadingReport', () => {
  cy.contains('[type="button"]', 'Cashback').click()
  cy.contains('span', 'Relatório de cashbacks').click()
})
