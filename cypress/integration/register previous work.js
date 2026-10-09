import firebaseApi from '../../client/js/utils/firebaseApi';
import { testIds, animationDuration } from '../constants';

const fromTime = '10:00';
const toTime = '14:00';
const noteText = 'duly noted';

context('previous work', () => {
  before(() => {
    firebaseApi.logout();
    cy.visit('/');
    cy.getByTestId(testIds.appInit, { timeout: 15000 });
    cy.login();
  });

  after(() => {
    cy.getByTestId(testIds.userMenuToggle).click();
    cy.wait(animationDuration);
    cy.getByTestId(testIds.userMenu).contains('Logga ut').click();
    cy.getByTestId(testIds.loginForm);
  });

  it('should show and hide add previous work form', () => {
    cy.getByTestId(testIds.addPrevIntervalForm).should('not.exist');

    cy.getByTestId(testIds.regPrevWorkBtn).click();
    cy.getByTestId(testIds.addPrevIntervalForm).should('be.visible');

    cy.getByTestId(testIds.cancelPrevWorkBtn).click();
    cy.getByTestId(testIds.addPrevIntervalForm).should('not.exist');
  });

  it('should register previous work', () => {
    cy.getByTestId(testIds.regPrevWorkBtn).click();
    cy.getByTestId(testIds.addPrevIntervalForm).should('be.visible');

    cy.getByTestId(testIds.interval)
      .getByTestId(testIds.intervalFromInput)
      .type(`{selectall}${fromTime}`);
    cy.getByTestId(testIds.interval)
      .getByTestId(testIds.intervalEndInput)
      .type(`{selectall}${toTime}`);
    cy.getByTestId(testIds.interval).getByTestId(testIds.intervalNoteInput).type(noteText);
    cy.getByTestId(testIds.interval).getByTestId(testIds.intervalNotWorkCheckbox).click();
    cy.getByTestId(testIds.savePrevWorkBtn).click();

    cy.waitUntilSaved();

    // when saved
    cy.getByTestId(testIds.addPrevIntervalForm).should('not.exist');
    cy.getByTestId(testIds.currentIntervals).children().should('have.length', 1);
    cy.getByTestId(testIds.intervalFromInput).should('have.value', fromTime);
    cy.getByTestId(testIds.intervalEndInput).should('have.value', toTime);
    cy.getByTestId(testIds.intervalNoteInput).should('have.value', noteText);
    cy.getByTestId(testIds.intervalNotWorkCheckbox).should('be.checked');
  });
});
