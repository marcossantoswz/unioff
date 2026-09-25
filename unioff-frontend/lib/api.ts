import type {
  LoginResponseDTO,
  EmpresaResponseDTO,
  EmpresaDetalhesDTO,
  EmpresaUpdateDTO,
  EmpresaCadastroRequestDTO,
  BeneficioResponseDTO,
  BeneficioRequestDTO,
  BeneficioUpdateDTO,
  ResgateResponseDTO,
  CupomConsultaDTO,
  MetricasEmpresaDTO,
  PagedResponse,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("unioff_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(error.message || `Erro ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json();
}

// ==================
// AUTH
// ==================

export const authApi = {
  login: (data: { email: string; senha: string }) =>
    apiFetch<LoginResponseDTO>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  cadastrarEstudante: (data: {
    nome: string;
    email: string;
    senha: string;
    matricula?: string;
    curso?: string;
    instituicao?: string;
  }) =>
    apiFetch("/api/auth/estudantes", { method: "POST", body: JSON.stringify(data) }),

  cadastrarEmpresa: (data: EmpresaCadastroRequestDTO) =>
    apiFetch("/api/auth/empresas", { method: "POST", body: JSON.stringify(data) }),
};

// ==================
// EMPRESAS
// ==================

export const empresasApi = {
  listar: (params?: { nome?: string; cidade?: string; bairro?: string; page?: number; size?: number }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return apiFetch<PagedResponse<EmpresaResponseDTO>>(`/api/empresas${qs ? `?${qs}` : ""}`);
  },

  buscarPorId: (id: string) => apiFetch<EmpresaDetalhesDTO>(`/api/empresas/${id}`),

  buscarMe: () => apiFetch<EmpresaResponseDTO>("/api/empresas/me"),

  atualizarMe: (data: EmpresaUpdateDTO) =>
    apiFetch<EmpresaResponseDTO>("/api/empresas/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  listarMeusBeneficios: (params?: { ativo?: boolean; esgotado?: boolean; page?: number; size?: number }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return apiFetch<PagedResponse<BeneficioResponseDTO>>(`/api/empresas/me/beneficios${qs ? `?${qs}` : ""}`);
  },

  metricas: () => apiFetch<MetricasEmpresaDTO>("/api/empresas/me/metricas"),
};

// ==================
// BENEFICIOS
// ==================

export const beneficiosApi = {
  listar: (params?: { busca?: string; empresaId?: string; page?: number; size?: number }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      )
    ).toString();
    return apiFetch<PagedResponse<BeneficioResponseDTO>>(`/api/beneficios${qs ? `?${qs}` : ""}`);
  },

  buscarPorId: (id: string) => apiFetch<BeneficioResponseDTO>(`/api/beneficios/${id}`),

  criar: (data: BeneficioRequestDTO) =>
    apiFetch<BeneficioResponseDTO>("/api/beneficios", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  atualizar: (id: string, data: BeneficioUpdateDTO) =>
    apiFetch<BeneficioResponseDTO>(`/api/beneficios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deletar: (id: string) => apiFetch<void>(`/api/beneficios/${id}`, { method: "DELETE" }),

  resgatar: (id: string) =>
    apiFetch<ResgateResponseDTO>(`/api/beneficios/${id}/resgates`, { method: "POST" }),
};

// ==================
// RESGATES
// ==================

export const resgatesApi = {
  listarMe: () => apiFetch<CupomConsultaDTO[]>("/api/resgates/me"),

  listarEmpresa: () => apiFetch<CupomConsultaDTO[]>("/api/resgates/empresa"),

  validarCupom: (codigo: string) =>
    apiFetch<ResgateResponseDTO>("/api/resgates/validacoes", {
      method: "POST",
      body: JSON.stringify({ codigo }),
    }),
};
