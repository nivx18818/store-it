describe('Dashboard', () => {
  it('Load dashboard after login', () => {
    cy.visit('/sign-in');
    cy.get('input[placeholder="Enter your email"]').type('tuongsiunhan1@gmail.com');
    cy.get('button[type="submit"]').click();

    cy.wait(3000);
    cy.readFile('cypress/fixtures/otp.json').then((data) => {
      cy.get('input[data-input-otp="true"]').type(data.otp);
      cy.wait(500);
      cy.get('button.shad-submit-btn').click();
    });
    cy.wait(3000);
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('section.dashboard-recent-files')
      .should('exist');
    cy.get('section.dashboard-recent-files h2')
      .should('have.text', 'Recent files uploaded');
    
    cy.get('.chart-title')
    .should('contain.text', 'Available Storage');
    cy.get('.chart-description')
      .should('contain.text', '2GB');

    cy.get('.dashboard-summary-card').should('have.length', 4);

    cy.get('.dashboard-summary-card').eq(0)
      .find('.summary-type-title').should('have.text', 'Documents');

    cy.get('.dashboard-summary-card').eq(1)
      .find('.summary-type-title').should('have.text', 'Images');

    cy.get('.dashboard-summary-card').eq(2)
      .find('.summary-type-title').should('have.text', 'Media');

    cy.get('.dashboard-summary-card').eq(3)
      .find('.summary-type-title').should('have.text', 'Others');
  });

  it('Summary cards', () => {
    cy.visit('/sign-in');
    cy.get('input[placeholder="Enter your email"]').type('tuongsiunhan1@gmail.com');
    cy.get('button[type="submit"]').click();

    cy.wait(3000);
    cy.readFile('cypress/fixtures/otp.json').then((data) => {
      cy.get('input[data-input-otp="true"]').type(data.otp);
      cy.wait(500);
      cy.get('button.shad-submit-btn').click();
    });
    cy.wait(3000);
    cy.url().should('eq', 'http://localhost:3000/');

    //Upload files
    const imageFile = 'vd1.png';
    const docFile = 'la2.pdf';

    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${imageFile}`, { force: true });
    cy.wait(2000);
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${docFile}`, { force: true });
    cy.wait(2000);

    cy.get('.chart-description')
      .should('contain.text', '2GB');

    cy.get('.chart-details .chart-description').invoke('text')
    .then((text) => {
      const used = parseFloat(text.split(' ')[0]);
      expect(used).to.be.greaterThan(0);
    });

    cy.get('.dashboard-summary-card').should('have.length', 4);

    //Check documents card
    cy.get('.dashboard-summary-card').eq(0)
      .find('.summary-type-title').should('have.text', 'Documents');
    cy.get('.dashboard-summary-card').eq(0)
      .find('.summary-type-size').invoke('text').should((text) => {
        expect(text.trim()).not.to.eq('0 Bytes');
      });
    
    // Check images card
    cy.get('.dashboard-summary-card').eq(1)
      .find('.summary-type-title').should('have.text', 'Images');
    cy.get('.dashboard-summary-card').eq(1)
      .find('.summary-type-size').invoke('text').should((text) => {
        expect(text.trim()).not.to.eq('0 Bytes');
      });

    cy.get('.dashboard-summary-card').eq(0)
      .find('p.body-1.text-light-200.text-center')
      .invoke('text')
      .should('match', /\d{1,2}:\d{2}(am|pm)/i);
    cy.get('.dashboard-summary-card').eq(1)
      .find('p.body-1.text-light-200.text-center')
      .invoke('text')
      .should('match', /\d{1,2}:\d{2}(am|pm)/i);

    cy.get('section.dashboard-recent-files').within(() => {
      cy.contains('Recent files uploaded');
      cy.get('.empty-list').should('not.exist');
    });
  });

  it('Recent uploads', () => {
    cy.visit('/sign-in');
    cy.get('input[placeholder="Enter your email"]').type('tuongsiunhan1@gmail.com');
    cy.get('button[type="submit"]').click();

    cy.wait(3000);
    cy.readFile('cypress/fixtures/otp.json').then((data) => {
      cy.get('input[data-input-otp="true"]').type(data.otp);
      cy.wait(500);
      cy.get('button.shad-submit-btn').click();
    });
    cy.wait(3000);
    cy.url().should('eq', 'http://localhost:3000/');

    const imageFile1 = 'vd1.png';
    const imageFile2 = 'vd2.jpg';
    const docFile = 'la2.pdf';
    const expectedFiles = [imageFile1, imageFile2, docFile];

    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${imageFile1}`, { force: true });
    cy.wait(3000);
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${imageFile2}`, { force: true });
    cy.wait(3000);
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${docFile}`, { force: true });
    cy.wait(3000);

    cy.get('.dashboard-recent-files ul a .recent-file-name').then(($els) => {
      const names = $els.toArray().map((el) => el.textContent?.trim() || '');
      expectedFiles.forEach((f) => {
        expect(names.some((n) => n.includes(f))).to.be.true;
      });
    });

    cy.get('.dashboard-summary-card').eq(0)
      .find('p.body-1.text-light-200.text-center')
      .invoke('text')
      .should('match', /\d{1,2}:\d{2}(am|pm)/i);
    cy.get('.dashboard-summary-card').eq(1)
      .find('p.body-1.text-light-200.text-center')
      .invoke('text')
      .should('match', /\d{1,2}:\d{2}(am|pm)/i);
  });

  it('No recent uploads', () => {
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

    cy.wait(8000);
    cy.url().should('eq', 'http://localhost:3000/');

    cy.get('.dashboard-recent-files .empty-list')
    .should('be.visible')
    .and('contain.text', 'No files uploaded');
  });
});