Cypress.Commands.add("findByLabelTextFallback", (texto: string) =>
  cy.contains("label", texto).find("input, select, textarea"),
);

declare global {
  // Cypress exposes custom commands through this global namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      findByLabelTextFallback(texto: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};
