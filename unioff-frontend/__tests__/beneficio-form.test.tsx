import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BeneficioForm } from "@/components/BeneficioForm";

const existente = {
  titulo: "Meia no cinema",
  descricao: "Apresente a carteirinha.",
  dataInicio: "2026-01-01",
  dataFim: "2026-12-31",
  quantidadeMaxResgastes: 10,
  ativo: true,
};

function preencherDatas(inicio: string, fim: string) {
  fireEvent.change(screen.getByLabelText("Começa em"), { target: { value: inicio } });
  fireEvent.change(screen.getByLabelText("Termina em"), { target: { value: fim } });
}

describe("BeneficioForm", () => {
  it("impede salvar quando a data de fim vem antes do início", () => {
    const aoSalvar = vi.fn();
    render(<BeneficioForm inicial={existente} textoBotao="Salvar" aoSalvar={aoSalvar} />);
    preencherDatas("2026-05-10", "2026-05-01");
    fireEvent.submit(screen.getByRole("button", { name: "Salvar" }));
    expect(screen.getByRole("alert")).toHaveTextContent("data de fim precisa ser igual ou depois");
    expect(aoSalvar).not.toHaveBeenCalled();
  });

  it("envia os dados do novo benefício sem o campo ativo", async () => {
    const aoSalvar = vi.fn().mockResolvedValue(undefined);
    render(<BeneficioForm textoBotao="Publicar benefício" aoSalvar={aoSalvar} />);
    expect(screen.queryByLabelText(/visível para estudantes/i)).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Título"), "Café grátis");
    await userEvent.type(screen.getByLabelText("Descrição e regras de uso"), "Na compra de um pão de queijo.");
    preencherDatas("2099-01-01", "2099-02-01");
    await userEvent.clear(screen.getByLabelText(/limite de resgates/i));
    await userEvent.type(screen.getByLabelText(/limite de resgates/i), "30");
    await userEvent.click(screen.getByRole("button", { name: "Publicar benefício" }));
    expect(aoSalvar).toHaveBeenCalledWith({
      titulo: "Café grátis",
      descricao: "Na compra de um pão de queijo.",
      dataInicio: "2099-01-01",
      dataFim: "2099-02-01",
      quantidadeMaxResgastes: 30,
    });
  });

  it("na edição, carrega os valores e permite ocultar o benefício", async () => {
    const aoSalvar = vi.fn().mockResolvedValue(undefined);
    render(<BeneficioForm inicial={existente} textoBotao="Salvar alterações" aoSalvar={aoSalvar} />);
    expect(screen.getByLabelText("Título")).toHaveValue("Meia no cinema");
    await userEvent.click(screen.getByLabelText(/visível para estudantes/i));
    await userEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));
    expect(aoSalvar).toHaveBeenCalledWith({ ...existente, ativo: false });
  });

  it("mostra o erro da API e libera o botão para tentar de novo", async () => {
    const aoSalvar = vi.fn().mockRejectedValue(new Error("Benefício não encontrado"));
    render(<BeneficioForm inicial={existente} textoBotao="Salvar" aoSalvar={aoSalvar} />);
    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Benefício não encontrado");
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
  });
});
