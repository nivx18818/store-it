describe("File Actions", () => {
  beforeEach(() => {
    cy.visit("/sign-in");
    cy.get('input[placeholder="Enter your email"]').type(
      "test@example.com",
    );
    cy.get('button[type="submit"]').click();

    cy.wait(3000);
    cy.readFile("cypress/fixtures/otp.json").then((data) => {
      cy.get('input[data-input-otp="true"]').type(data.otp);
      cy.wait(500);
      cy.get("button.shad-submit-btn").click();
    });
    cy.wait(3000);
    cy.url().should("eq", "http://localhost:3000/");

    const fileName = "la2.pdf";

    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, {
      force: true,
    });
    cy.wait(500);
    cy.get("ul.uploader-preview-list").should("be.visible");
    cy.wait(5000);
  });

  it("Upload file", () => {
    const fileName = "la2.pdf";

    cy.get(".chart-description").should("contain.text", "2GB");
    cy.get(".chart-details .chart-description")
      .invoke("text")
      .then((text) => {
        const used = parseFloat(text.split(" ")[0]);
        expect(used).to.be.greaterThan(0);
      });

    cy.get(".dashboard-recent-files .recent-file-name")
      .first()
      .should("contain.text", fileName);

    cy.get(".dashboard-summary-card")
      .eq(0)
      .find("p.body-1.text-light-200.text-center")
      .invoke("text")
      .should("match", /\d{1,2}:\d{2}(am|pm)/i);

    cy.get("section.dashboard-recent-files").within(() => {
      cy.contains("Recent files uploaded");
      cy.get(".empty-list").should("not.exist");
    });

    cy.get('a[href="/documents"]').filter(":visible").first().click();
    cy.wait(3000);
    cy.url().should("include", "/documents");

    cy.get("section.file-list", { timeout: 10000 }).should("be.visible");
    cy.get('.total-size-section .h5')
      .should('not.have.text', '0 MB');
  });

  it("Rename file", () => {
    cy.get(".recent-file-details button.shad-no-focus").first().click();
    cy.contains("Rename").click();

    const newFileName = "renamed_la2.pdf";
    cy.get('div[role="dialog"] input[type="text"]').clear().type(newFileName);
    cy.get("button.modal-submit-button").click();
    cy.wait(2000);
    cy.get('div[role="dialog"]').should("not.exist");

    cy.get(".dashboard-recent-files .recent-file-name")
      .first()
      .should("contain.text", newFileName);
  });

  it("Details modal", () => {
    cy.get(".recent-file-details button.shad-no-focus").first().click();
    cy.contains("Details").click();

    cy.get('div[role="dialog"]').within(() => {
      cy.contains(".file-details-label", "Format:")
        .next(".file-details-value")
        .should("have.text", "pdf");
      cy.contains(".file-details-label", "Size:")
        .next(".file-details-value")
        .should("not.have.text", "0 KB");
      cy.contains(".file-details-label", "Last edit:")
        .next(".file-details-value")
        .should("not.be.empty");
    });
  });

  it("Download file", () => {
    cy.get(".recent-file-details button.shad-no-focus").first().click();
    cy.contains("Download").click();

    const downloadsFolder = Cypress.config("downloadsFolder");
    const downloadedFilePath = `${downloadsFolder}/la2.pdf`;
    cy.readFile(downloadedFilePath, { timeout: 15000 }).should("exist");
  });

  it("Share file", () => {
    cy.get(".recent-file-details button.shad-no-focus").first().click();
    cy.contains("Share").click();

    const emailToShare = "test@example.com";
    cy.get('div[role="dialog"] input[type="email"]').clear().type(emailToShare);
    cy.get("button.modal-submit-button").click();

    cy.get('div[role="dialog"]').should("not.exist");
  });

  it("Delete file", () => {
    cy.get(".recent-file-details button.shad-no-focus").first().click();
    cy.contains("Delete").click();

    cy.get('div[role="dialog"] button.modal-submit-button').click();
    cy.wait(2000);
    cy.get('div[role="dialog"]').should("not.exist");
  });

  it("File size > 50MB", () => {
    const largeFile = "video.mp4";

    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${largeFile}`, {
      force: true,
    });
    cy.wait(500);

    cy.get("ol li p.body-2").should(
      "contain.text",
      largeFile + " is too large. Max file size is 50MB.",
    );
  });
});
