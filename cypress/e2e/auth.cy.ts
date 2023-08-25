describe("Tests responsible for the authentication home-page", () => {
  it("Should redirect to the login endpoint", () => {
    cy.visit("/");
    // Ensure the redirect functionality works as expected
    cy.location("pathname").should("eq", "/login");
  });
});
