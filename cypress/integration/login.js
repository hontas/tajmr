import firebaseApi from '../../client/js/utils/firebaseApi';
import { testIds, animationDuration } from '../constants';

context('login', () => {
  before(() => {
    firebaseApi.logout();
  });

  beforeEach(() => {
    cy.visit('/');
    cy.getByTestId(testIds.appInit, { timeout: 15000 });
  });

  afterEach(() => {
    cy.getByTestId(testIds.userMenuToggle).click();
    cy.wait(animationDuration);
    cy.getByTestId(testIds.userMenu).contains('Logga ut').click();
    cy.getByTestId(testIds.loginForm);
  });

  it('should log in and display intervals, then log out', () => {
    cy.login();

    cy.getByTestId(testIds.workButton).click();
    cy.waitUntilSaved();
    cy.getByTestId(testIds.workButton).should('include.text', 'Ta en fika');

    cy.getByTestId(testIds.workButton).click();
    cy.waitUntilSaved();
    cy.getByTestId(testIds.currentIntervals).children().should('have.length', 1);

    cy.getByTestId(testIds.interval)
      .getByTestId(testIds.intervalFromInput)
      .type('{selectall}09:00');
    cy.getByTestId(testIds.interval)
      .getByTestId(testIds.intervalEndInput)
      .type('{selectall}17:00')
      .blur();
    cy.waitUntilSaved();

    cy.getByTestId(testIds.weekStatItem)
      .children()
      .should('have.length', 2)
      .and('include.text', '08:00');

    cy.getByTestId(testIds.regPrevWorkBtn).click();

    cy.getByTestId(testIds.prevWeekBtn).click();
    cy.wait(animationDuration);
    cy.getByTestId(testIds.weekStatItem).children().should('have.length', 0);
    cy.getByTestId(testIds.nextWeekBtn).click();
    cy.wait(animationDuration);

    cy.getByTestId(testIds.removeIntervalBtn).click();
    cy.waitUntilSaved();
    cy.getByTestId(testIds.currentIntervals).children().should('have.length', 0);
  });
});
