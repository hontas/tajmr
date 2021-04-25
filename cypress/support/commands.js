import { testIds, animationDuration } from '../constants';

// ***********************************************
// This example commands.js shows you how to
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
// Cypress.Commands.add("login", (email, password) => { ... })
Cypress.Commands.add('getByTestId', { prevSubject: 'optional' }, (withinSubject, testId) =>
  cy.get(`[data-testid="${testId}"]`, { withinSubject })
);

Cypress.Commands.add('waitUntilSaved', () =>
  cy.getByTestId('saving-intervals-container').should('not.exist')
);

Cypress.Commands.add('login', () => {
  cy.getByTestId(testIds.loginForm);
  cy.get('input[type="email"]').type('test@example.com');
  cy.get('input[type="password"]').type('testuser{enter}');

  cy.getByTestId(testIds.workButton).should('include.text', 'Börja debitera');
  // wait for intervals to load
  cy.getByTestId(testIds.loadingIntervals).should('be.visible');
  cy.getByTestId(testIds.loadingIntervals).should('not.exist');
  cy.wait(animationDuration);
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
