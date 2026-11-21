import { expect, test } from "@playwright/test";

test("fluxo E2E da empresa: login, consulta, edicao e pagina publica", async ({ page, request }) => {
  await expect(async () => {
    const response = await request.post("/api/auth/login", {
      data: {
        email: "empresa@teste.com",
        senha: "senha123",
      },
    });
    expect(response.status()).toBe(200);
  }).toPass({ timeout: 30_000 });

  await page.goto("/login");

  await page.locator('input[name="email"]').fill("empresa@teste.com");
  await page.locator('input[name="senha"]').fill("senha123");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/empresa\/me$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const nomeInput = page.locator('input[name="nomeFantasia"]');
  const nomeOriginal = await nomeInput.inputValue();
  const novoNome = "Pizzaria Universitária E2E";

  await nomeInput.fill(novoNome);
  await page.getByRole("button", { name: "Salvar dados" }).click();

  await expect(
    page.getByText("Dados salvos. A página pública já mostra as alterações."),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: novoNome })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: novoNome })).toBeVisible();

  await page.getByRole("link", { name: /ver página pública/i }).click();
  await expect(page).toHaveURL(/\/empresas\/.+/);
  await expect(page.getByRole("heading", { level: 1, name: novoNome })).toBeVisible();

  // Restaura o nome original para manter o teste idempotente
  await page.goto("/empresa/me");
  await page.locator('input[name="nomeFantasia"]').fill(nomeOriginal);
  await page.getByRole("button", { name: "Salvar dados" }).click();
  await expect(
    page.getByText("Dados salvos. A página pública já mostra as alterações."),
  ).toBeVisible();
});
