import { getGreeting } from '../support/app.po';

describe('helping-hand-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to helping-hand-app!');
  });
});
