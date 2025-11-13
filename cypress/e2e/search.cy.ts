describe("Search and Sort", () => {
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
  });

  it("Search files by name", () => {
    const imageFile1 = "la2.pdf";
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${imageFile1}`, {
      force: true,
    });
    cy.wait(3000);
    cy.get('input[placeholder="Search..."]').type("la2");
    cy.wait(2000);
    cy.get("li p.subtitle-2.line-clamp-1").should("contain.text", imageFile1);
  });

  it("Sort files by A-Z", () => {
    cy.get('a[href="/documents"]').filter(":visible").first().click();
    cy.get("section.file-list", { timeout: 10000 }).should("be.visible");
    cy.url().should("include", "/documents");

    cy.get("button.sort-select").click();
    cy.contains("Name (A-Z)").click();

    cy.get("section.file-list", { timeout: 10000 }).should("be.visible");
    cy.get("section.file-list")
      .find("a .file-card-details p.subtitle-2.line-clamp-1")
      .then(($els) => {
        const names = $els
          .toArray()
          .map((el) => (el.textContent || "").trim().toLowerCase());
        const sortedNames = [...names].sort();
        expect(names).to.deep.equal(sortedNames);
      });
  });

  it("Empty result", () => {
    cy.get('input[placeholder="Search..."]').type("abcdefghijklmnop");
    cy.wait(2000);
    cy.get("ul.search-result p.empty-result").should(
      "contain.text",
      "No files found",
    );
  });

  it("Special chars", () => {
    cy.get('input[placeholder="Search..."]').type("!@#$%^&*()");
    cy.wait(2000);
    cy.get("ul.search-result p.empty-result").should(
      "contain.text",
      "No files found",
    );
  });
});
