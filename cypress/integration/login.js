import firebaseApi from '../../client/js/utils/firebaseApi';

const testIds = {
  appInit: 'app-init',
  loginForm: 'login-form',
  workButton: 'work-button',
  userMenuToggle: 'user-menu-toggle',
  userMenu: 'user-menu',
  loadingIntervals: 'loading-intervals-container',
  currentIntervals: 'current-intervals-list',
  interval: 'interval-item',
  intervalFromInput: 'interval-from-input',
  intervalEndInput: 'interval-end-input',
  weekStatItem: 'week-stats-item',
  removeIntervalBtn: 'remove-interval',
  prevWeekBtn: 'prev-week-btn',
  nextWeekBtn: 'next-week-btn'
};
const animationDuration = 500;

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
    cy.getByTestId(testIds.userMenu)
      .contains('Logga ut')
      .click();
    cy.getByTestId(testIds.loginForm);
  });

  it('should log in and display intervals, then log out', () => {
    // log in
    cy.getByTestId(testIds.loginForm);
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('testuser{enter}');
    cy.getByTestId(testIds.workButton).should('include.text', 'Börja debitera');

    // wait for intervals to load
    cy.getByTestId(testIds.loadingIntervals);
    cy.getByTestId(testIds.loadingIntervals).should('not.be.visible');
    cy.wait(animationDuration);

    // add intervals
    cy.getByTestId(testIds.workButton).click();
    cy.waitUntilSaved();
    cy.getByTestId(testIds.workButton).should('include.text', 'Ta en fika');

    // finish interval
    cy.getByTestId(testIds.workButton).click();
    cy.waitUntilSaved();
    cy.getByTestId(testIds.currentIntervals)
      .children()
      .should('have.length', 1);

    // edit time in input
    cy.getByTestId(testIds.interval)
      .getByTestId(testIds.intervalFromInput)
      .type('{selectall}09:00');
    cy.getByTestId(testIds.interval)
      .getByTestId(testIds.intervalEndInput)
      .type('{selectall}17:00')
      .blur();
    cy.waitUntilSaved();

    // view interval in week view
    cy.getByTestId(testIds.weekStatItem)
      .children()
      .should('have.length', 2)
      .and('include.text', '08:00');

    // switch to another week
    cy.getByTestId(testIds.prevWeekBtn).click();
    cy.wait(animationDuration);
    cy.getByTestId(testIds.weekStatItem)
      .children()
      .should('have.length', 0);
    cy.getByTestId(testIds.nextWeekBtn).click();
    cy.wait(animationDuration);

    // filter monthly report

    // remove intervals
    cy.getByTestId(testIds.removeIntervalBtn).click();
    cy.waitUntilSaved();
    cy.getByTestId(testIds.currentIntervals)
      .children()
      .should('have.length', 0);
  });
});
