// ==================
// AUTH TYPES
// ==================

export type TipoUsuario = "ESTUDANTE" | "EMPRESA" | "ADMIN";

export interface UsuarioResumoDTO {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: UsuarioResumoDTO;
}

// ==================
// EMPRESA TYPES
// ==================

export interface EmpresaResponseDTO {
  id: string;
  usuarioId: string;
  nome: string;
  email: string;
  nomeFantasia: string;
  descricao?: string;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  telephoneWhatsapp?: string;
  site?: string;
}

export interface EmpresaDetalhesDTO extends EmpresaResponseDTO {
  beneficios: BeneficioResponseDTO[];
}

export interface EmpresaUpdateDTO {
  nome?: string;
  nomeFantasia?: string;
  descricao?: string;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  telephoneWhatsapp?: string;
  site?: string;
}

export interface EmpresaCadastroRequestDTO {
  nome: string;
  email: string;
  senha: string;
  nomeFantasia: string;
  cnpj?: string;
  descricao?: string;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  telephoneWhatsapp?: string;
  site?: string;
}

export interface EmpresaCadastroResponseDTO {
  id: string;
  usuarioId: string;
  nome: string;
  email: string;
  nomeFantasia: string;
  cnpj?: string;
  descricao?: string;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  telephoneWhatsapp?: string;
  site?: string;
  tipoUsuario: string;
  ativo: boolean;
  dataCriacao: string;
}

// ==================
// BENEFICIO TYPES
// ==================

export interface BeneficioResponseDTO {
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  quantidadeResgates?: number;
  quantidadeMaxResgastes?: number;
  quantidadeDisponivel?: number;
  esgotado?: boolean;
  ativo?: boolean;
  empresaId: string;
  nomeEmpresa: string;
}

export interface BeneficioRequestDTO {
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  quantidadeMaxResgastes: number;
}

export interface BeneficioUpdateDTO {
  titulo?: string;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  quantidadeMaxResgastes?: number;
  ativo?: boolean;
}

// ==================
// RESGATE TYPES
// ==================

export type StatusCupom = "PENDENTE" | "USADO" | "EXPIRADO";

export interface ResgateResponseDTO {
  id: string;
  codigo: string;
  status: StatusCupom;
  dataGeracao: string;
  beneficioId: string;
}

export interface CupomConsultaDTO {
  id: string;
  codigo: string;
  status: StatusCupom;
  dataGeracao: string;
  dataUso?: string;
  beneficioId: string;
  beneficioTitulo?: string;
  estudanteId?: string;
  estudanteNome?: string;
  empresaNome?: string;
}

// ==================
// METRICAS TYPES
// ==================

export interface MetricasBeneficioDTO {
  beneficioId: string;
  titulo: string;
  quantidadeResgates: number;
  quantidadeMaxResgastes: number;
  quantidadeDisponivel: number;
  esgotado: boolean;
  quantidadeCuponsUtilizados: number;
}

export interface MetricasEmpresaDTO {
  empresaId: string;
  nomeFantasia: string;
  totalBeneficios: number;
  totalBeneficiosAtivos: number;
  totalResgates: number;
  totalCuponsUtilizados: number;
  beneficios: MetricasBeneficioDTO[];
}

// ==================
// PAGINATED RESPONSE
// ==================

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ==================
// AUTH USER (local)
// ==================

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
}
