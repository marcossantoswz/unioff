import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CadastroEstudante } from "@/components/CadastroEstudante";
import { CadastroEmpresa } from "@/components/CadastroEmpresa";

const api = vi.hoisted(() => ({
  cadastrarEstudante: vi.fn(),
  cadastrarEmpresa: vi.fn(),
}));
vi.mock("@/lib/api", () => ({ auth: api }));

async function preencherEstudante(matricula = " 1234 ") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nome completo"), "Ana Estudante");
  await user.type(screen.getByLabelText("E-mail"), "ana@ufmg.br");
  await user.type(screen.getByLabelText("Senha"), "segredo");
  await user.selectOptions(screen.getByLabelText("Instituição"), "Universidade Federal de Minas Gerais");
  await user.selectOptions(screen.getByLabelText("Curso"), "Ciência da Computação (Bacharelado)");
  await user.type(screen.getByLabelText("Matrícula"), matricula);
  return user;
}

async function preencherEmpresa(cnpj = "12.345.678/0001-90", whatsapp = "(31) 99999-9999") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nome do responsável"), "Bia");
  await user.type(screen.getByLabelText("E-mail"), "bia@empresa.com");
  await user.type(screen.getByLabelText("Senha"), "segredo");
  await user.type(screen.getByLabelText("Nome do estabelecimento"), "Loja");
  await user.type(screen.getByLabelText("CNPJ"), cnpj);
  await user.type(screen.getByLabelText("O que vocês oferecem"), "Descontos para estudantes");
  await user.type(screen.getByLabelText("Cidade"), "Belo Horizonte");
  await user.type(screen.getByLabelText("Bairro"), "Centro");
  await user.type(screen.getByLabelText("Rua"), "Rua A");
  await user.type(screen.getByLabelText("Número"), "10");
  if (whatsapp) await user.type(screen.getByLabelText("WhatsApp"), whatsapp);
  return user;
}

describe("CadastroEstudante", () => {
  beforeEach(() => vi.clearAllMocks());

  it("valida matrícula curta", async () => {
    render(<CadastroEstudante aoCadastrar={vi.fn()} />);
    await preencherEstudante("123");
    fireEvent.submit(screen.getByRole("button", { name: /criar conta/i }).closest("form")!);
    expect(screen.getByRole("alert")).toHaveTextContent("pelo menos 4");
    expect(api.cadastrarEstudante).not.toHaveBeenCalled();
  });

  it("envia seleções e matrícula normalizada", async () => {
    api.cadastrarEstudante.mockResolvedValue({});
    const aoCadastrar = vi.fn().mockResolvedValue(undefined);
    render(<CadastroEstudante aoCadastrar={aoCadastrar} />);
    await preencherEstudante();
    fireEvent.submit(screen.getByRole("button", { name: /criar conta/i }).closest("form")!);
    expect(api.cadastrarEstudante).toHaveBeenCalledWith(expect.objectContaining({
      instituicao: "Universidade Federal de Minas Gerais",
      curso: "Ciência da Computação (Bacharelado)",
      matricula: "1234",
    }));
    await waitFor(() => expect(aoCadastrar).toHaveBeenCalledWith("ana@ufmg.br", "segredo"));
  });

  it("exibe falha da API", async () => {
    api.cadastrarEstudante.mockRejectedValue(new Error("E-mail já usado"));
    render(<CadastroEstudante aoCadastrar={vi.fn()} />);
    const user = await preencherEstudante();
    await user.click(screen.getByRole("button", { name: /criar conta/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("E-mail já usado");
  });
});

describe("CadastroEmpresa", () => {
  beforeEach(() => vi.clearAllMocks());

  it("valida CNPJ e WhatsApp", async () => {
    const { unmount } = render(<CadastroEmpresa aoCadastrar={vi.fn()} />);
    await preencherEmpresa("1234567890123");
    fireEvent.submit(screen.getByRole("button", { name: /criar conta/i }).closest("form")!);
    expect(screen.getByRole("alert")).toHaveTextContent("14 números");
    unmount();
    render(<CadastroEmpresa aoCadastrar={vi.fn()} />);
    await preencherEmpresa("12345678901234", "31999");
    fireEvent.submit(screen.getByRole("button", { name: /criar conta/i }).closest("form")!);
    expect(screen.getByRole("alert")).toHaveTextContent("DDD");
  });

  it("normaliza os números e conclui o cadastro", async () => {
    api.cadastrarEmpresa.mockResolvedValue({});
    const aoCadastrar = vi.fn().mockResolvedValue(undefined);
    render(<CadastroEmpresa aoCadastrar={aoCadastrar} />);
    const user = await preencherEmpresa();
    await user.click(screen.getByRole("button", { name: /criar conta/i }));
    expect(api.cadastrarEmpresa).toHaveBeenCalledWith(expect.objectContaining({
      cnpj: "12345678000190",
      telephoneWhatsapp: "31999999999",
    }));
    expect(aoCadastrar).toHaveBeenCalledWith("bia@empresa.com", "segredo");
  });
});
