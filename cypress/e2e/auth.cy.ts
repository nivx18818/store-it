describe('Dashboard', () => {
  it('Signup new user', () => {
    cy.visit('/sign-up');
    cy.get('input[placeholder="Enter your full name"]').type('Test User');
    cy.get('input[placeholder="Enter your email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();

    cy.wait(3000);
    cy.readFile('cypress/fixtures/otp.json').then((data) => {
      cy.get('input[data-input-otp="true"]').type(data.otp);
      cy.wait(500);
      cy.get('button.shad-submit-btn').click();
    });

    cy.wait(3000);
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('Signin existing user', () => {
    cy.visit('/sign-in');
    cy.get('input[placeholder="Enter your email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();

    cy.wait(3000);
    cy.readFile('cypress/fixtures/otp.json').then((data) => {
      cy.get('input[data-input-otp="true"]').should('be.visible').type(data.otp);
      cy.wait(500);
      cy.get('button.shad-submit-btn').click();
    });

    cy.wait(3000);
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('Invalid OTP', () => {
    cy.visit('/sign-in');
    cy.get('input[placeholder="Enter your email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();

    cy.wait(3000);
    cy.get('input[data-input-otp="true"]').type('000000');
    cy.wait(500);
    cy.get('button.shad-submit-btn').click();
  });

  it('Logout user', () => {
    cy.visit('/sign-in');
    cy.get('input[placeholder="Enter your email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();

    cy.wait(3000);
    cy.readFile('cypress/fixtures/otp.json').then((data) => {
      cy.get('input[data-input-otp="true"]').should('be.visible').type(data.otp);
      cy.wait(1000);
      cy.get('button.shad-submit-btn').click();
    });

    cy.wait(3000);
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('button[type=submit]').click();
    cy.wait(3000);
    cy.url().should('eq', 'http://localhost:3000/sign-in');
  });
});

