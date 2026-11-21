import { expect, test } from "@playwright/test";

test("E2E: cadastro, login e consulta de resgates do estudante", async ({ page }) => {
  const sufixo = Date.now();
  const email = `estudante-e2e-${sufixo}@teste.com`;

  await page.goto("/cadastro");
  await page.getByLabel("Nome completo").fill("Estudante E2E");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill("senha123");
  await page.getByLabel("Instituição").selectOption({
    label: "Universidade Federal de Minas Gerais",
  });
  await page.getByLabel("Curso").selectOption({
    label: "Ciência da Computação (Bacharelado)",
  });
  await page.getByLabel("Matrícula").fill("E2E1234");
  await page.getByRole("button", { name: "Criar conta de estudante" }).click();

  await expect(page).toHaveURL(/\/beneficios$/);

  await page.goto("/estudante/me/resgates");
  await expect(
    page.getByText("Você ainda não resgatou nenhum benefício"),
  ).toBeVisible();

  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill("senha123");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/beneficios$/);
});
