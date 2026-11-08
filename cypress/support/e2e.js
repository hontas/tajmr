import { buttons, labels } from '../constants';

const firebaseAuthDatabase = 'firebaseLocalStorageDb';

Cypress.Commands.add('visitSignedOut', () => {
  cy.visit('/', {
    onBeforeLoad: (win) => {
      win.indexedDB.deleteDatabase(firebaseAuthDatabase);
    },
  });
  cy.get('output[aria-label="Laddar appen"]', { timeout: 15000 });
});

Cypress.Commands.add('login', () => {
  cy.contains('label', labels.email).find('input').type('test@example.com');
  cy.contains('label', labels.password).find('input').type('testuser{enter}');

  cy.contains('button', buttons.start).should('be.visible');
  cy.contains('output', 'Laddar intervall').should('not.exist');
});

Cypress.Commands.add('logout', () => {
  cy.get(`button[aria-label="${buttons.openMenu}"]`).click();
  cy.get('dialog[aria-label="Meny"]').should('be.visible');
  cy.contains('dialog button', buttons.logOut).click();
  cy.contains('button', 'Logga in').should('be.visible');
});

Cypress.Commands.add('waitUntilSaved', () => cy.contains('output', 'Sparar').should('not.exist'));

Cypress.Commands.add('intervalList', () => cy.get('ul[aria-label="Dagens intervall"]'));
