const testIds = {
  appInit: 'app-init',
  loginForm: 'login-form',
  workButton: 'work-button',
  userMenuToggle: 'user-menu-toggle',
  userMenu: 'user-menu'
};

context('login', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.getByTestId(testIds.appInit);
  });

  it('should log in and display intervals, then log out', () => {
    // log in
    cy.getByTestId(testIds.loginForm);
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('testuser{enter}');
    cy.getByTestId(testIds.workButton).should('include.text', 'Börja debitera');

    // add intervals

    // filter monthly report

    // remove intervals

    // log out
    cy.getByTestId(testIds.userMenuToggle).click();
    cy.getByTestId(testIds.userMenu)
      .contains('Logga ut')
      .click();
    cy.getByTestId(testIds.loginForm);
  });
});
