describe("File Management", () => {
  beforeEach(() => {
    cy.visit("/sign-in");
    cy.get('input[placeholder="Enter your email"]').type(
      "test@example.com",
    );
    cy.get('button[type="submit"]').click();

    cy.wait(500);
    cy.readFile("cypress/fixtures/otp.json").then((data) => {
      cy.get('input[data-input-otp="true"]').type(data.otp);
      cy.get("button.shad-submit-btn").click();
    });
    cy.wait(500);
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("Upload file", () => {
    const docFile = "la2.pdf";

    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${docFile}`, {
      force: true,
    });
    cy.wait(500);
    cy.get("ul.uploader-preview-list").should("be.visible");
    cy.wait(5000);

    cy.get(".chart-description").should("contain.text", "2GB");

    cy.get(".chart-details .chart-description")
      .invoke("text")
      .then((text) => {
        const used = parseFloat(text.split(" ")[0]);
        expect(used).to.be.greaterThan(0);
      });

    cy.get(".dashboard-recent-files .recent-file-name")
      .first()
      .should("contain.text", docFile);

    cy.get(".dashboard-summary-card")
      .eq(0)
      .find("p.body-1.text-light-200.text-center")
      .invoke("text")
      .should("match", /\d{1,2}:\d{2}(am|pm)/i);

    cy.get("section.dashboard-recent-files").within(() => {
      cy.contains("Recent files uploaded");
      cy.get(".empty-list").should("not.exist");
    });
  });

  it("List by type", () => {
    cy.get('a[href="/documents"]').filter(":visible").first().click();
    cy.wait(3000);
    cy.url().should("include", "/documents");

    cy.get("section.file-list", { timeout: 10000 }).should("be.visible");
    cy.get("section.file-list")
      .find("a .file-card-details p.subtitle-2.line-clamp-1")
      .then(($els) => {
        const names = $els
          .toArray()
          .map((el) => (el.textContent || "").trim().toLowerCase());
        names.forEach((name) => {
          expect(name.endsWith(".pdf")).to.be.true;
        });
      });

    cy.get('a[href="/images"]').filter(":visible").first().click();
    cy.wait(3000);
    cy.url().should("include", "/images");

    cy.get("section.file-list", { timeout: 10000 }).should("be.visible");
    cy.get("section.file-list")
      .find("a .file-card-details p.subtitle-2.line-clamp-1")
      .then(($els) => {
        const names = $els
          .toArray()
          .map((el) => (el.textContent || "").trim().toLowerCase());
        const allowed = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
        names.forEach((name) => {
          const ok = allowed.some((ext) => name.endsWith(ext));
          expect(ok).to.be.true;
        });
      });
  });

  it("View files details", () => {
    cy.get(".dashboard-recent-files ul a .recent-file-name").eq(0).click();
    cy.get('a[target="_blank"]')
      .should("have.attr", "href")
      .and(
        "match",
        /https:\/\/syd\.cloud\.appwrite\.io\/v1\/storage\/buckets\/6900ccb70013ab8b7ebd\/files\/[a-zA-Z0-9]+\/view\?project=69021aa30029f66e4c4f/,
      );
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
