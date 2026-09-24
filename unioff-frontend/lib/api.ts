import { request } from "./http";
import type {
  Beneficio,
  BeneficioForm,
  CupomConsulta,
  Empresa,
  EmpresaCadastro,
  EmpresaDetalhes,
  EmpresaUpdate,
  EstudanteCadastro,
  LoginResponse,
  MetricasEmpresa,
  Page,
  Resgate,
} from "./types";

const json = (corpo: unknown) => JSON.stringify(corpo);

export const auth = {
  login: (email: string, senha: string) =>
    request<LoginResponse>("/auth/login", { method: "POST", body: json({ email, senha }) }),
  cadastrarEstudante: (dados: EstudanteCadastro) =>
    request("/auth/estudantes", { method: "POST", body: json(dados) }),
  cadastrarEmpresa: (dados: EmpresaCadastro) =>
    request("/auth/empresas", { method: "POST", body: json(dados) }),
};

export const beneficios = {
  feed: (busca: string, pagina: number) => {
    const params = new URLSearchParams({ page: String(pagina), size: "12" });
    if (busca.trim()) params.set("busca", busca.trim());
    return request<Page<Beneficio>>(`/beneficios?${params}`);
  },
  buscar: (id: string) => request<Beneficio>(`/beneficios/${id}`),
  criar: (dados: BeneficioForm) =>
    request<Beneficio>("/beneficios", { method: "POST", body: json(dados) }),
  atualizar: (id: string, dados: Partial<BeneficioForm>) =>
    request<Beneficio>(`/beneficios/${id}`, { method: "PUT", body: json(dados) }),
  desativar: (id: string) => request<void>(`/beneficios/${id}`, { method: "DELETE" }),
  resgatar: (id: string) => request<Resgate>(`/beneficios/${id}/resgates`, { method: "POST" }),
};

export const empresas = {
  detalhes: (id: string) => request<EmpresaDetalhes>(`/empresas/${id}`),
  minha: () => request<Empresa>("/empresas/me"),
  atualizarMinha: (dados: EmpresaUpdate) =>
    request<Empresa>("/empresas/me", { method: "PUT", body: json(dados) }),
  meusBeneficios: () => request<Page<Beneficio>>("/empresas/me/beneficios?size=100"),
  metricas: () => request<MetricasEmpresa>("/empresas/me/metricas"),
};

export const resgates = {
  meus: () => request<CupomConsulta[]>("/resgates/me"),
  daEmpresa: () => request<CupomConsulta[]>("/resgates/empresa"),
  validar: (codigo: string) =>
    request<Resgate>("/resgates/validacoes", { method: "POST", body: json({ codigo }) }),
};

export function totalPaginas(pagina: Page<unknown>): number {
  return pagina.page?.totalPages ?? pagina.totalPages ?? 1;
}
