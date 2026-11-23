import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Resgatar } from "@/components/Resgatar";
import { ValidarCupom } from "@/components/ValidarCupom";
import type { Beneficio } from "@/lib/types";

const mocks = vi.hoisted(() => ({
  resgatar: vi.fn(),
  validar: vi.fn(),
  sessao: vi.fn(),
}));
vi.mock("@/lib/api", () => ({
  beneficios: { resgatar: mocks.resgatar },
  resgates: { validar: mocks.validar },
}));
vi.mock("@/lib/auth", () => ({ useSessao: mocks.sessao }));

const beneficio: Beneficio = {
  id: "beneficio-1", titulo: "Cinema", descricao: "Meia entrada",
  dataInicio: "2026-01-01", dataFim: "2026-12-31",
  quantidadeResgates: 0, quantidadeMaxResgastes: 10,
  quantidadeDisponivel: 10, esgotado: false, ativo: true,
  empresa: { id: "empresa-1", nomeFantasia: "Cine Uni" },
};
const estudante = { id: "1", nome: "Ana", email: "ana@ufmg.br", tipoUsuario: "ESTUDANTE" as const };

describe("Resgatar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.sessao.mockReturnValue({ pronto: true, usuario: estudante });
  });

  it("orienta login e bloqueia outros perfis", () => {
    mocks.sessao.mockReturnValueOnce({ pronto: true, usuario: null });
    const { rerender } = render(<Resgatar beneficio={beneficio} />);
    expect(screen.getByRole("link", { name: /entre para resgatar/i })).toHaveAttribute("href", "/login");
    mocks.sessao.mockReturnValue({ pronto: true, usuario: { ...estudante, tipoUsuario: "EMPRESA" } });
    rerender(<Resgatar beneficio={beneficio} />);
    expect(screen.getByText(/só contas de estudante/i)).toBeInTheDocument();
  });

  it("gera e apresenta o cupom", async () => {
    mocks.resgatar.mockResolvedValue({
      id: "c1", codigo: "UNI-ABC", utilizado: false, expirado: false,
      dataResgate: "2026-01-01", dataUso: null,
      beneficio: { id: "beneficio-1", titulo: "Cinema" },
      empresa: { id: "empresa-1", nomeFantasia: "Cine Uni" },
    });
    const aoResgatar = vi.fn();
    render(<Resgatar beneficio={beneficio} aoResgatar={aoResgatar} />);
    await userEvent.click(screen.getByRole("button", { name: /resgatar benefício/i }));
    expect(await screen.findByText("UNI-ABC")).toBeInTheDocument();
    expect(mocks.resgatar).toHaveBeenCalledWith("beneficio-1");
    expect(aoResgatar).toHaveBeenCalled();
  });

  it("mostra erro e indisponibilidade", async () => {
    mocks.resgatar.mockRejectedValue(new Error("Limite atingido"));
    const { rerender } = render(<Resgatar beneficio={beneficio} />);
    await userEvent.click(screen.getByRole("button", { name: /resgatar benefício/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Limite atingido");
    rerender(<Resgatar beneficio={{ ...beneficio, esgotado: true }} />);
    expect(screen.getByRole("button", { name: "Indisponível" })).toBeDisabled();
  });
});

describe("ValidarCupom", () => {
  beforeEach(() => vi.clearAllMocks());

  it("normaliza e valida o código", async () => {
    mocks.validar.mockResolvedValue({});
    const aoValidar = vi.fn();
    render(<ValidarCupom aoValidar={aoValidar} />);
    await userEvent.type(screen.getByLabelText(/código que/i), " uni-abc ");
    await userEvent.click(screen.getByRole("button", { name: "Validar" }));
    expect(mocks.validar).toHaveBeenCalledWith("UNI-ABC");
    expect(await screen.findByRole("status")).toHaveTextContent("validado");
    expect(aoValidar).toHaveBeenCalled();
  });

  it("apresenta erro da validação", async () => {
    mocks.validar.mockRejectedValue(new Error("Cupom inválido"));
    render(<ValidarCupom aoValidar={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/código que/i), "invalido");
    await userEvent.click(screen.getByRole("button", { name: "Validar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Cupom inválido");
  });
});
