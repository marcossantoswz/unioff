import * as normalizar from "./normalizar";
import { request } from "./http";
import type { BeneficioForm, Empresa, EmpresaUpdate, LoginResponse, MetricasEmpresa } from "./types";
import type { EmpresaCadastro, EstudanteCadastro } from "./types-cadastro";

const json = (corpo: unknown) => JSON.stringify(corpo);

function query(params: Record<string, string | number | boolean | undefined>) {
  const q = new URLSearchParams();
  for (const [chave, valor] of Object.entries(params)) {
    if (valor !== undefined && valor !== "") q.set(chave, String(valor));
  }
  return q.toString();
}

export const auth = {
  login: (email: string, senha: string) =>
    request<LoginResponse>("/auth/login", { method: "POST", body: json({ email, senha }) }),
  cadastrarEstudante: (dados: EstudanteCadastro) =>
    request("/auth/estudantes", { method: "POST", body: json(dados) }),
  cadastrarEmpresa: (dados: EmpresaCadastro) =>
    request("/auth/empresas", { method: "POST", body: json(dados) }),
};

export const beneficios = {
  listar: async (filtro: { busca?: string; disponivel?: boolean; pagina?: number; tamanho?: number }) => {
    const q = query({
      busca: filtro.busca?.trim(),
      disponivel: filtro.disponivel || undefined,
      page: filtro.pagina ?? 0,
      size: filtro.tamanho ?? 12,
    });
    return normalizar.pagina(await request(`/beneficios?${q}`), normalizar.beneficio);
  },
  buscar: async (id: string) => normalizar.beneficio(await request(`/beneficios/${id}`)),
  criar: (dados: BeneficioForm) => request("/beneficios", { method: "POST", body: json(dados) }),
  atualizar: (id: string, dados: BeneficioForm) =>
    request(`/beneficios/${id}`, { method: "PUT", body: json(dados) }),
  desativar: (id: string) => request<void>(`/beneficios/${id}`, { method: "DELETE" }),
  resgatar: async (id: string) =>
    normalizar.cupom(await request(`/beneficios/${id}/resgates`, { method: "POST" })),
};

export const empresas = {
  listar: async (filtro: { nome?: string; cidade?: string; pagina?: number; tamanho?: number }) => {
    const q = query({
      nome: filtro.nome?.trim(),
      cidade: filtro.cidade?.trim(),
      page: filtro.pagina ?? 0,
      size: filtro.tamanho ?? 12,
    });
    return normalizar.pagina<Empresa>(await request(`/empresas?${q}`), (e) => ({ ...e, id: String(e.id) }));
  },
  detalhes: async (id: string) => normalizar.empresaDetalhes(await request(`/empresas/${id}`)),
  minha: () => request<Empresa>("/empresas/me"),
  atualizarMinha: (dados: EmpresaUpdate) =>
    request<Empresa>("/empresas/me", { method: "PUT", body: json(dados) }),
  meusBeneficios: async () =>
    normalizar.pagina(await request("/empresas/me/beneficios?size=100"), normalizar.beneficio),
  metricas: () => request<MetricasEmpresa>("/empresas/me/metricas"),
};

export const resgates = {
  meus: async () => normalizar.pagina(await request("/resgates/me?size=100"), normalizar.cupom).itens,
  daEmpresa: async () => normalizar.pagina(await request("/resgates/empresa"), normalizar.cupom).itens,
  // O backend atual lê "codigo"; a especificação usa "codigoCupom". Enviamos os dois.
  validar: async (codigo: string) =>
    normalizar.cupom(
      await request("/resgates/validacoes", { method: "POST", body: json({ codigo, codigoCupom: codigo }) }),
    ),
};
