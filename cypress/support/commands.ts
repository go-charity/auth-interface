/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.addQuery("getByPlaceholder" as any, function (placeholder) {
  const getFn = cy.now("get", `[placeholder="${placeholder}"]`);

  return (subject) => {
    return (getFn as any)(subject);
  };
});

Cypress.Commands.addQuery(
  "getByDataCyAttribute" as any,
  function (dataAttribute) {
    const getFn = cy.now("get", `[data-cy="${dataAttribute}"]`);

    return (sub) => {
      return (getFn as any)(sub);
    };
  }
);

Cypress.Commands.addQuery(
  "findByDataCyAttribute" as any,
  function (dataAttribute) {
    const getFn = cy.now("find", `[data-cy="${dataAttribute}"]`);

    return (sub) => {
      return (getFn as any)(sub);
    };
  }
);

Cypress.Commands.addQuery("findByPlaceholder" as any, function (placeholder) {
  const getFn = cy.now("find", `[placeholder="${placeholder}"]`);

  return (subject) => {
    return (getFn as any)(subject);
  };
});

Cypress.Commands.add("submitOrphanageSignUpForm" as any, () => {
  cy.visit("/register");

  // Get the 'sign in as an orphanage' options and the 'next' button, and click on them
  cy.getByDataCyAttribute("orphanage_signup").as("orphanage_signup").click();
  cy.getByDataCyAttribute("next_process").as("next_process").click();

  // Type valid parameters into the input fields
  cy.getByPlaceholder("Enter government issued ID")
    .as("governmentID")
    .type("kk0uy7g1bHi8AS");
  cy.getByPlaceholder("Enter email address")
    .as("email")
    .type("onukwilip@gmail.com");
  cy.getByPlaceholder("Enter password").as("password").type("1234567");
  cy.getByPlaceholder("Confirm entered password")
    .as("confirmPassword")
    .type("1234567");

  // Submit the form
  cy.getByDataCyAttribute("submit").contains("Next").as("submit").click();
});

Cypress.Commands.add("submitDonorSignUpForm" as any, () => {
  cy.visit("/register");

  // Get the 'sign in as an orphanage' options and the 'next' button, and click on them
  cy.getByDataCyAttribute("donor_signup").as("donor_signup").click();
  cy.getByDataCyAttribute("next_process").as("next_process").click();

  // Type valid parameters into the input fields
  cy.getByPlaceholder("Enter email address")
    .as("email")
    .type("onukwilip@gmail.com");
  cy.getByPlaceholder("Enter password").as("password").type("1234567");
  cy.getByPlaceholder("Confirm entered password")
    .as("confirmPassword")
    .type("1234567");

  // Submit the form
  cy.getByDataCyAttribute("submit").contains("Next").as("submit").click();
});

Cypress.Commands.add("submitOTPForm" as any, () => {
  cy.getByPlaceholder("Enter OTP").type("981082");
  cy.getByDataCyAttribute("verify_otp").contains("Verify").click();
});

Cypress.Commands.add(
  "blurMUIInput" as any,
  function (subject, outerSubject?: any) {
    cy.get(subject as string)
      .parent()
      .click({ force: true });
    cy.get(outerSubject || "body").click({ force: true });
  }
);
