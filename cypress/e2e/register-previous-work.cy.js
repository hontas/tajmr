import { buttons, labels } from '../constants';

const fromTime = '10:00';
const toTime = '14:00';
const noteText = 'duly noted';

context('previous work', () => {
  before(() => {
    cy.visitSignedOut();
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it('should show and hide add previous work form', () => {
    cy.get('form[aria-label="Efterregistrera"]').should('not.exist');

    cy.contains('button', buttons.addPrevious).click();
    cy.get('form[aria-label="Efterregistrera"]').should('be.visible');

    cy.contains('button', buttons.cancel).click();
    cy.get('form[aria-label="Efterregistrera"]').should('not.exist');
  });

  it('should register previous work', () => {
    cy.contains('button', buttons.addPrevious).click();
    const form = () => cy.get('form[aria-label="Efterregistrera"]');
    form().should('be.visible');

    form().find(`input[aria-label="${labels.start}"]`).type(fromTime);
    form().find(`input[aria-label="${labels.end}"]`).type(toTime);
    form().find(`input[aria-label="${labels.note}"]`).type(noteText);
    form().contains('label', labels.notWork).find('input').click();
    form().contains('button', buttons.save).click();

    cy.waitUntilSaved();

    form().should('not.exist');
    cy.intervalList().children().should('have.length', 1);
    cy.get(`input[aria-label="${labels.start}"]`).should('have.value', fromTime);
    cy.get(`input[aria-label="${labels.end}"]`).should('have.value', toTime);
    cy.get(`input[aria-label="${labels.note}"]`).should('have.value', noteText);
    cy.contains('label', labels.notWork).find('input').should('be.checked');
  });
});
