import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExigePerfil } from "@/components/ExigePerfil";
import { Metricas } from "@/components/Metricas";

const mocks = vi.hoisted(() => ({ sessao: vi.fn() }));
vi.mock("@/lib/auth", () => ({ useSessao: mocks.sessao }));

const empresa = { id: "1", nome: "João", email: "empresa@teste.com", tipoUsuario: "EMPRESA" as const };

function renderizar() {
  return render(
    <ExigePerfil perfil="EMPRESA">
      <p>Painel da empresa</p>
    </ExigePerfil>,
  );
}

describe("ExigePerfil", () => {
  beforeEach(() => vi.clearAllMocks());

  it("não mostra nada enquanto a sessão carrega", () => {
    mocks.sessao.mockReturnValue({ pronto: false, usuario: null });
    const { container } = renderizar();
    expect(container).toBeEmptyDOMElement();
  });

  it("pede login para visitante", () => {
    mocks.sessao.mockReturnValue({ pronto: true, usuario: null });
    renderizar();
    expect(screen.getByText("Entre para ver esta página")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Entrar" })).toHaveAttribute("href", "/login");
    expect(screen.queryByText("Painel da empresa")).not.toBeInTheDocument();
  });

  it("bloqueia outro perfil", () => {
    mocks.sessao.mockReturnValue({ pronto: true, usuario: { ...empresa, tipoUsuario: "ESTUDANTE" } });
    renderizar();
    expect(screen.getByText("Esta página é só para contas de empresa.")).toBeInTheDocument();
    expect(screen.queryByText("Painel da empresa")).not.toBeInTheDocument();
  });

  it("libera o conteúdo para o perfil certo", () => {
    mocks.sessao.mockReturnValue({ pronto: true, usuario: empresa });
    renderizar();
    expect(screen.getByText("Painel da empresa")).toBeInTheDocument();
  });

  it("nomeia a conta de estudante quando a página é do estudante", () => {
    mocks.sessao.mockReturnValue({ pronto: true, usuario: empresa });
    render(<ExigePerfil perfil="ESTUDANTE"><p>Meus resgates</p></ExigePerfil>);
    expect(screen.getByText("Esta página é só para contas de estudante.")).toBeInTheDocument();
  });
});

describe("Metricas", () => {
  it("mostra benefícios ativos, resgates e cupons usados", () => {
    render(
      <Metricas
        metricas={{ empresaId: "e1", nomeFantasia: "Pizzaria", totalBeneficios: 5, totalBeneficiosAtivos: 3, totalResgates: 42, totalCuponsUtilizados: 17, beneficios: [] }}
      />,
    );
    const valor = (rotulo: string) => screen.getByText(rotulo).nextElementSibling;
    expect(valor("benefícios ativos de 5")).toHaveTextContent("3");
    expect(valor("cupons resgatados por estudantes")).toHaveTextContent("42");
    expect(valor("cupons usados no balcão")).toHaveTextContent("17");
  });
});
