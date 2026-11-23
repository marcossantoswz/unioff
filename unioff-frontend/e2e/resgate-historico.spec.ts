import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const SENHA = "senha123";
const EMPRESA = "empresa@teste.com";

async function token(request: APIRequestContext, email: string) {
  const resposta = await request.post("/api/auth/login", { data: { email, senha: SENHA } });
  expect(resposta.status()).toBe(200);
  return (await resposta.json()).accessToken as string;
}

async function entrar(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(SENHA);
  await page.getByRole("button", { name: "Entrar" }).click();
}

test("E2E: estudante resgata, empresa valida e o histórico mostra o cupom usado", async ({
  page, browser, request, baseURL,
}) => {
  await expect(async () => {
    await token(request, EMPRESA);
  }).toPass({ timeout: 30_000 });

  const sufixo = Date.now();
  const titulo = `Rodízio E2E ${sufixo}`;
  const email = `historico-e2e-${sufixo}@teste.com`;
  const dia = (deslocamento: number) => new Date(Date.now() + deslocamento * 86_400_000).toISOString().slice(0, 10);

  // Preparação pela API: a empresa publica um benefício e um estudante novo cria a conta
  const criado = await request.post("/api/beneficios", {
    headers: { Authorization: `Bearer ${await token(request, EMPRESA)}` },
    data: { titulo, descricao: "Válido no almoço.", dataInicio: dia(0), dataFim: dia(30), quantidadeMaxResgastes: 5 },
  });
  expect(criado.status()).toBe(201);
  const cadastro = await request.post("/api/auth/estudantes", {
    data: { nome: "Histórico E2E", email, senha: SENHA, instituicao: "UFMG", curso: "Sistemas de Informação", matricula: "E2E5678" },
  });
  expect(cadastro.ok()).toBeTruthy();

  // Estudante busca o benefício e resgata
  await entrar(page, email);
  await expect(page).toHaveURL(/\/beneficios$/);
  await page.getByLabel("Buscar por estabelecimento ou benefício").fill(titulo);
  await page.getByRole("button", { name: "Buscar" }).click();
  await page.getByRole("link").filter({ hasText: titulo }).click();
  await page.getByRole("button", { name: "Resgatar benefício" }).click();
  const codigo = (await page.getByText(/^UNI-\w+$/).textContent())!.trim();

  // Histórico: o cupom aparece pendente e ainda não está entre os usados
  await page.getByRole("link", { name: "Ver todos os meus resgates" }).click();
  await expect(page).toHaveURL(/\/estudante\/me\/resgates$/);
  const item = page.getByRole("listitem").filter({ hasText: titulo });
  await expect(item).toContainText(codigo);
  await expect(item).toContainText("pronto para usar");
  await page.getByRole("button", { name: "usados" }).click();
  await expect(page.getByText("Nenhum resgate neste filtro.")).toBeVisible();

  // Empresa valida o código no balcão, em outra sessão do navegador
  const contextoEmpresa = await browser.newContext({ baseURL });
  const balcao = await contextoEmpresa.newPage();
  await entrar(balcao, EMPRESA);
  await expect(balcao).toHaveURL(/\/empresa\/me$/);
  await balcao.goto("/empresa/me/resgates");
  await balcao.getByLabel("Código que o estudante mostrou").fill(codigo.toLowerCase());
  await balcao.getByRole("button", { name: "Validar" }).click();
  await expect(balcao.getByRole("status")).toContainText(`Cupom ${codigo} validado`);
  await expect(balcao.getByRole("listitem").filter({ hasText: codigo })).toContainText("usado");
  await contextoEmpresa.close();

  // De volta ao estudante: o cupom passa para o filtro "usados"
  await page.reload();
  await page.getByRole("button", { name: "usados" }).click();
  await expect(item).toContainText(codigo);
  await expect(item).toContainText(/usado em/);
  await page.getByRole("button", { name: "pendentes" }).click();
  await expect(page.getByText("Nenhum resgate neste filtro.")).toBeVisible();
});
