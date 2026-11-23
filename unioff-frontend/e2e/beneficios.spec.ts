import { expect, test } from "@playwright/test";

test("E2E: empresa publica, edita e desativa um benefício", async ({ page, request }) => {
  await expect(async () => {
    const response = await request.post("/api/auth/login", {
      data: { email: "empresa@teste.com", senha: "senha123" },
    });
    expect(response.status()).toBe(200);
  }).toPass({ timeout: 30_000 });

  const titulo = `Combo E2E ${Date.now()}`;
  const tituloEditado = `${titulo} (editado)`;
  const dataFim = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  await page.goto("/login");
  await page.getByLabel("E-mail").fill("empresa@teste.com");
  await page.getByLabel("Senha").fill("senha123");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/empresa\/me$/);

  // Cadastro
  await page.goto("/empresa/me/beneficios");
  await page.getByRole("link", { name: "Novo benefício" }).click();
  await expect(page).toHaveURL(/\/empresa\/me\/beneficios\/novo$/);
  await page.getByLabel("Título").fill(titulo);
  await page.getByLabel("Descrição e regras de uso").fill("Válido de segunda a sexta mediante carteirinha.");
  await page.getByLabel("Termina em").fill(dataFim);
  await page.getByLabel("Limite de resgates").fill("25");
  await page.getByRole("button", { name: "Publicar benefício" }).click();

  await expect(page).toHaveURL(/\/empresa\/me\/beneficios$/);
  const linha = page.getByRole("row").filter({ hasText: titulo });
  await expect(linha).toBeVisible();

  // Edição
  await linha.getByRole("link", { name: "Editar" }).click();
  await expect(page.getByRole("heading", { name: "Editar benefício" })).toBeVisible();
  await expect(page.getByLabel("Título")).toHaveValue(titulo);
  await page.getByLabel("Título").fill(tituloEditado);
  await page.getByRole("button", { name: "Salvar alterações" }).click();

  await expect(page).toHaveURL(/\/empresa\/me\/beneficios$/);
  const linhaEditada = page.getByRole("row").filter({ hasText: tituloEditado });
  await expect(linhaEditada).toBeVisible();

  // Desativação (exclusão lógica), confirmando o window.confirm
  page.once("dialog", (dialog) => dialog.accept());
  await linhaEditada.getByRole("button", { name: "Desativar" }).click();
  await expect(linhaEditada.getByRole("button", { name: "Desativar" })).toHaveCount(0);
  await expect(linhaEditada).toBeVisible();
});
