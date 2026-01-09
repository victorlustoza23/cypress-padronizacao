describe('Login2 - Validate cacheAcrossSpecs - login-session-2.cy.js', () => {
  const user = Cypress.env('USER_EMAIL')
  const password = Cypress.env('USER_PASSWORD')
  const options = { cacheSession: true }

  beforeEach(() => {
    cy.gui_setupUserAgent()
  })

  it(
    'Validate session is reused from login.cy.js (cacheAcrossSpecs)',
    { tags: '@login' },
    () => {
      cy.gui_login(user, password, options)
      cy.visit(Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL'), { timeout: 7000 })

      cy.gui_loginValidation()
    },
  )

  it(
    'Validate error message login on MadeiraMadeira',
    { tags: '@example-fail' },
    () => {
      cy.gui_login(user, password, options)
      cy.visit(Cypress.env('MADEIRAMADEIRA_PRODUCTION_URL'), { timeout: 7000 })

      cy.contains('Minha Conta').should('be.visible').click()
      cy.contains('span', 'Sairr').should('be.visible')
    },
  )
})
