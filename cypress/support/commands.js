import { testIds, animationDuration } from '../constants';

Cypress.Commands.add('getByTestId', { prevSubject: 'optional' }, (withinSubject, testId) =>
  cy.get(`[data-testid="${testId}"]`, { withinSubject }),
);

Cypress.Commands.add('waitUntilSaved', () =>
  cy.getByTestId('saving-intervals-container').should('not.exist'),
);

Cypress.Commands.add('login', () => {
  cy.getByTestId(testIds.loginForm);
  cy.get('input[type="email"]').type('test@example.com');
  cy.get('input[type="password"]').type('testuser{enter}');

  cy.getByTestId(testIds.workButton).should('include.text', 'Börja debitera');
  cy.getByTestId(testIds.loadingIntervals).should('be.visible');
  cy.getByTestId(testIds.loadingIntervals).should('not.exist');
  cy.wait(animationDuration);
});
