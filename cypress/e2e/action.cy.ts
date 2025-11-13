describe('File Actions', () => {
    beforeEach(() => {
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

        const fileName = 'la2.pdf';

        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, { force: true });
        cy.wait(500);
        cy.get('ul.uploader-preview-list').should('be.visible');
        cy.wait(5000);
    });

    it('Rename file', () => {
        cy.get('.recent-file-details button.shad-no-focus').first().click();
        cy.contains('Rename').click();

        const newFileName = 'renamed_la2.pdf';
        cy.get('div[role="dialog"] input[type="text"]').clear().type(newFileName);
        cy.get('button.modal-submit-button').click();
        cy.wait(2000);
        cy.get('div[role="dialog"]').should('not.exist');

        cy.get('.dashboard-recent-files .recent-file-name').first().should('contain.text', newFileName);
    });
    
    it('Details modal', () => {
        cy.get('.recent-file-details button.shad-no-focus').first().click();
        cy.contains('Details').click();

        cy.get('div[role="dialog"]').within(() => {
            cy.contains('.file-details-label', 'Format:')
                .next('.file-details-value')
                .should('have.text', 'pdf');
            cy.contains('.file-details-label', 'Size:')
                .next('.file-details-value')
                .should('not.have.text', '0 KB');
            cy.contains('.file-details-label', 'Last edit:')
                .next('.file-details-value')
                .should('not.be.empty');
        });
    });

    it('Download file', () => {
        cy.get('.recent-file-details button.shad-no-focus').first().click();
        cy.contains('Download').click();

        const downloadsFolder = Cypress.config('downloadsFolder');
        const downloadedFilePath = `${downloadsFolder}/la2.pdf`;
        cy.readFile(downloadedFilePath, { timeout: 15000 }).should('exist');
    });

    it('Share file', () => {
        cy.get('.recent-file-details button.shad-no-focus').first().click();
        cy.contains('Share').click();

        const emailToShare = 'test@example.com';
        cy.get('div[role="dialog"] input[type="email"]').clear().type(emailToShare);
        cy.get('button.modal-submit-button').click();

        cy.get('div[role="dialog"]').should('not.exist');
    });

    it('Delete file', () => {
        cy.get('.recent-file-details button.shad-no-focus').first().click();
        cy.contains('Delete').click();
        
        cy.get('div[role="dialog"] button.modal-submit-button').click();
        cy.wait(2000);
        cy.get('div[role="dialog"]').should('not.exist');
    });
});