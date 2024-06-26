export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom query to select DOM element by placeholder attribute.
       * @example cy.getByPlaceholder('Enter name')
       */
      getByPlaceholder(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom query to select DOM elemnt by data-cy attribute.
       * @param value
       * @example cy.getByDataCyAttribute("about")
       */
      getByDataCyAttribute(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom query to select DOM elemnt by data-cy attribute.
       * @param value
       * @example cy.get("form").findByDataCyAttribute("submit")
       */
      findByDataCyAttribute(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom query to find a child element by it's placeholder
       * @param value
       * @example cy.get("form").findByPlaceholder("Enter name")
       */
      findByPlaceholder(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to submit the form during the orphanage sign up process
       * @example cy.submitOrphanageSignUpForm()
       */
      submitOrphanageSignUpForm(): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to submit the form during the donor sign up process
       * @example cy.submitDonorSignUpForm()
       */
      submitDonorSignUpForm(): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to submit the OTP form during OTP verification
       */
      submitOTPForm(): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to blur a MUI input component
       * @param subject
       * @param outerSubject
       * @example cy.blurMUIInput('[data-cy="name"]', "form")
       */
      blurMUIInput(subject, outerSubject): Chainable<JQuery<HTMLElement>>;
    }
  }
}
