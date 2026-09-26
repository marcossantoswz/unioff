// Modelo usado pelas telas. As respostas da API passam por lib/normalizar.ts,
// que aceita tanto o formato atual do backend quanto o da especificação.

export type TipoUsuario = "ESTUDANTE" | "EMPRESA" | "ADMIN";

export interface UsuarioResumo {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: TipoUsuario;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: UsuarioResumo;
}

export interface EmpresaResumo {
  id: string;
  nomeFantasia: string;
  cidade?: string;
  bairro?: string;
}

export interface Beneficio {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  quantidadeResgates: number;
  quantidadeMaxResgastes: number;
  quantidadeDisponivel: number;
  esgotado: boolean;
  ativo: boolean;
  empresa: EmpresaResumo;
}

export interface BeneficioForm {
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  quantidadeMaxResgastes: number;
  ativo?: boolean;
}

export interface Empresa {
  id: string;
  nome?: string;
  email?: string;
  nomeFantasia: string;
  descricao: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  telephoneWhatsapp: string;
  site: string;
}

export interface EmpresaDetalhes extends Empresa {
  beneficios: Beneficio[];
}

export type EmpresaUpdate = Partial<Omit<Empresa, "id" | "email">>;

export interface Cupom {
  id: string;
  codigo: string;
  utilizado: boolean;
  expirado: boolean;
  dataResgate: string;
  dataUso: string | null;
  beneficio: { id: string; titulo: string; dataFim?: string };
  empresa: { id: string; nomeFantasia: string };
  estudanteNome?: string;
}

export interface MetricasBeneficio {
  beneficioId: string;
  titulo: string;
  quantidadeResgates: number;
  quantidadeMaxResgastes: number;
  quantidadeDisponivel: number;
  esgotado: boolean;
  quantidadeCuponsUtilizados: number;
}

export interface MetricasEmpresa {
  empresaId: string;
  nomeFantasia: string;
  totalBeneficios: number;
  totalBeneficiosAtivos: number;
  totalResgates: number;
  totalCuponsUtilizados: number;
  beneficios: MetricasBeneficio[];
}

export interface Pagina<T> {
  itens: T[];
  totalPaginas: number;
}
