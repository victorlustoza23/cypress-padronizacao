describe('Cashback', () => {
  beforeEach(() => {
    cy.visit('/home', {
      onBeforeLoad(win) {
        win.localStorage.setItem('qa', true)
      },
    })
  })

  it('Valida geração do relatório de cashback', { tags: '@generate-report' }, () => {
    cy.downloadingReport()

    cy.contains('span', 'Processando seu relatório...').should('be.visible')
    cy.contains('span', 'Relatório gerado!', { timeout: 30000 }).should('be.visible')
    cy.verifyDownloadedFile('cashback')
  })
})
