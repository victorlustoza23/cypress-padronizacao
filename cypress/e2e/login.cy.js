describe("Login example spec", () => {
  it("Visit example page login", { tags: "@login" }, () => {
    cy.visit("https://example.cypress.io");
    cy.url().should("include", "cypress.ios");
  });

  it("Visit example page login", { tags: "@login" }, () => {
    cy.visit("https://example.cypress.io");
    cy.url().should("include", "cypress.io");
  });
});
