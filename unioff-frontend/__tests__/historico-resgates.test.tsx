import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResgatesEstudantePage from "@/app/estudante/me/resgates/page";
import type { Cupom } from "@/lib/types";

const mocks = vi.hoisted(() => ({ meus: vi.fn() }));
vi.mock("@/lib/api", () => ({ resgates: { meus: mocks.meus } }));

function cupom(id: string, titulo: string, extra: Partial<Cupom> = {}): Cupom {
  return {
    id, codigo: `UNI-${id}`, utilizado: false, expirado: false,
    dataResgate: "2026-11-20T10:00:00", dataUso: null,
    beneficio: { id: `b-${id}`, titulo }, empresa: { id: "e1", nomeFantasia: "Pizzaria Universitária" },
    ...extra,
  };
}

const historico = [
  cupom("PEND", "Pizza em dobro"),
  cupom("USADO", "20% de desconto", { utilizado: true, dataUso: "2026-11-21T12:00:00" }),
  cupom("VENC", "Sobremesa grátis", { expirado: true }),
];

describe("Histórico de resgates do estudante", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lista todos os cupons com código, empresa e status", async () => {
    mocks.meus.mockResolvedValue(historico);
    render(<ResgatesEstudantePage />);
    const itens = await screen.findAllByRole("listitem");
    expect(itens).toHaveLength(3);
    expect(within(itens[0]).getByRole("link", { name: "Pizza em dobro" })).toHaveAttribute("href", "/beneficios/b-PEND");
    expect(within(itens[0]).getByText("pronto para usar")).toBeInTheDocument();
    expect(within(itens[1]).getByText("usado")).toBeInTheDocument();
    expect(within(itens[1]).getByText(/usado em/)).toBeInTheDocument();
    expect(within(itens[2]).getByText("expirado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "todos" })).toHaveAttribute("aria-pressed", "true");
  });

  it("filtra pendentes e usados", async () => {
    mocks.meus.mockResolvedValue(historico);
    render(<ResgatesEstudantePage />);
    await screen.findAllByRole("listitem");

    await userEvent.click(screen.getByRole("button", { name: "pendentes" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("UNI-PEND")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "usados" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("UNI-USADO")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "usados" })).toHaveAttribute("aria-pressed", "true");
  });

  it("avisa quando o filtro não tem resultados", async () => {
    mocks.meus.mockResolvedValue([cupom("PEND", "Pizza em dobro")]);
    render(<ResgatesEstudantePage />);
    await screen.findByText("UNI-PEND");
    await userEvent.click(screen.getByRole("button", { name: "usados" }));
    expect(screen.getByText("Nenhum resgate neste filtro.")).toBeInTheDocument();
  });

  it("convida a ver benefícios quando ainda não há resgates", async () => {
    mocks.meus.mockResolvedValue([]);
    render(<ResgatesEstudantePage />);
    expect(await screen.findByText("Você ainda não resgatou nenhum benefício")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver benefícios" })).toHaveAttribute("href", "/beneficios");
  });

  it("mostra carregando e depois o erro da API", async () => {
    mocks.meus.mockRejectedValue(new Error("Sessão expirada"));
    render(<ResgatesEstudantePage />);
    expect(screen.getByText("carregando resgates…")).toBeInTheDocument();
    expect(await screen.findByRole("alert")).toHaveTextContent("Sessão expirada");
  });
});
