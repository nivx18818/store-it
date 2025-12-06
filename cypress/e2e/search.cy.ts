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

  it("Dashboard Navigation & File Card View", () => {
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
        const allowed = [".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx", ".ppt", ".pptx"];
        names.forEach((name) => {
          const ok = allowed.some((ext) => name.endsWith(ext));
          expect(ok).to.be.true;
        });
      });

    cy.get('a[target="_blank"]')
      .should("have.attr", "href")
      .and(
        "match",
        /https:\/\/syd\.cloud\.appwrite\.io\/v1\/storage\/buckets\/6900ccb70013ab8b7ebd\/files\/[a-zA-Z0-9]+\/view\?project=69021aa30029f66e4c4f/,
      );

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

  it("Sort files by A-Z", () => {
    cy.get('a[href="/documents"]').filter(":visible").first().click();

    cy.get("section.file-list", { timeout: 10000 }).should("be.visible");
    cy.url().should("include", "/documents");

    cy.get("button.sort-select").click();
    cy.contains("Name (A-Z)").click();

    // Kiểm tra A-Z bằng localeCompare
    cy.get("section.file-list a .file-card-details p.subtitle-2.line-clamp-1")
      .should(($els) => {
      const names = [...$els].map((el) =>
        (el.textContent || "").trim().toLowerCase()
      );

      const sorted = [...names].sort((a, b) => a.localeCompare(b, "vi"));

      expect(names).to.deep.equal(sorted);
    });
  });

  it("Special chars and no results", () => {
    cy.get('input[placeholder="Search..."]').type("abcdefghijklmnop!@#$%^&*()");
    cy.wait(2000);
    cy.get("ul.search-result p.empty-result").should(
      "contain.text",
      "No files found",
    );
  });
});
