import { buttons, labels } from '../constants';

context('login', () => {
  beforeEach(() => {
    cy.visitSignedOut();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should log in and display intervals, then log out', () => {
    cy.login();

    // start work
    cy.contains('button', buttons.start).click();
    cy.waitUntilSaved();
    cy.contains('button', buttons.stop).should('be.visible');

    // finish interval
    cy.contains('button', buttons.stop).click();
    cy.waitUntilSaved();
    cy.intervalList().children().should('have.length', 1);

    // edit the times
    cy.intervalList().find(`input[aria-label="${labels.start}"]`).type('09:00');
    cy.intervalList().find(`input[aria-label="${labels.end}"]`).type('17:00').blur();
    cy.waitUntilSaved();

    // view interval in week view
    cy.get('[data-testid="week-stats-item"]')
      .children()
      .should('have.length', 2)
      .and('include.text', '08:00');

    // register past intervals
    cy.contains('button', buttons.addPrevious).click();

    // switch to another week
    cy.get(`button[aria-label="${buttons.previousWeek}"]`).click();
    cy.get('[data-testid="week-stats-item"]').children().should('have.length', 0);
    cy.get(`button[aria-label="${buttons.nextWeek}"]`).click();
    cy.get('[data-testid="week-stats-item"]').children().should('have.length', 2);

    // remove intervals
    cy.get(`button[aria-label="${buttons.remove}"]`).click();
    cy.waitUntilSaved();
    cy.intervalList().children().should('have.length', 0);
  });
});
