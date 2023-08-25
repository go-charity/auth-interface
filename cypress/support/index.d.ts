export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by placeholder attribute.
       * @example cy.getByPlaceholder('Enter name')
       */
      getByPlaceholder(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to select DOM elemnt by data-cy attribute.
       * @param value
       * @example cy.getByDataCyAttribute("about")
       */
      getByDataCyAttribute(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to select DOM elemnt by data-cy attribute.
       * @param value
       * @example cy.get("form").findByDataCyAttribute("submit")
       */
      findByDataCyAttribute(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
