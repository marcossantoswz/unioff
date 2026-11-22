describe("Cadastro de estudante", () => {
  it("seleciona instituição e curso, cria a conta e entra", () => {
    cy.intercept("POST", "/api/auth/estudantes", { statusCode: 201, body: {} }).as("cadastro");
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        accessToken: "token-e2e",
        tokenType: "Bearer",
        expiresIn: 3600,
        usuario: {
          id: "estudante-1",
          nome: "Ana Estudante",
          email: "ana@ufmg.br",
          tipoUsuario: "ESTUDANTE",
        },
      },
    }).as("login");
    cy.intercept("GET", "/api/beneficios*", {
      statusCode: 200,
      body: { content: [], totalPages: 1 },
    });

    cy.visit("/cadastro");
    cy.findByLabelTextFallback("Nome completo").type("Ana Estudante");
    cy.findByLabelTextFallback("E-mail").type("ana@ufmg.br");
    cy.findByLabelTextFallback("Senha").type("segredo");
    cy.findByLabelTextFallback("Instituição").select("Universidade Federal de Minas Gerais");
    cy.findByLabelTextFallback("Curso").select("Ciência da Computação (Bacharelado)");
    cy.findByLabelTextFallback("Matrícula").type("20260001");
    cy.contains("button", "Criar conta de estudante").click();

    cy.wait("@cadastro").its("request.body").should("deep.include", {
      instituicao: "Universidade Federal de Minas Gerais",
      curso: "Ciência da Computação (Bacharelado)",
      matricula: "20260001",
    });
    cy.wait("@login");
    cy.url().should("include", "/beneficios");
  });
});
