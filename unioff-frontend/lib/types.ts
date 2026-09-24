// Espelha os DTOs do backend (unioff-backend/src/main/java/com/unioff/dto).

export type TipoUsuario = "ESTUDANTE" | "EMPRESA" | "ADMIN";
export type StatusCupom = "PENDENTE" | "USADO" | "EXPIRADO";

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

// Spring pode serializar Page direto ou via DTO ({ content, page: {...} }).
export interface Page<T> {
  content: T[];
  totalPages?: number;
  number?: number;
  page?: { totalPages: number; number: number };
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
  empresaId: string;
  nomeEmpresa: string;
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
  usuarioId: string;
  nome: string;
  email: string;
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

export type EmpresaUpdate = Partial<Omit<Empresa, "id" | "usuarioId" | "email">>;

export interface EstudanteCadastro {
  nome: string;
  email: string;
  senha: string;
  instituicao: string;
  curso: string;
  matricula: string;
}

export interface EmpresaCadastro {
  nome: string;
  email: string;
  senha: string;
  nomeFantasia: string;
  cnpj: string;
  descricao: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  telephoneWhatsapp: string;
  site: string;
}

export interface Resgate {
  id: string;
  codigo: string;
  status: StatusCupom;
  dataGeracao: string;
  beneficioId: string;
}

export interface CupomConsulta extends Resgate {
  dataUso: string | null;
  beneficioTitulo: string;
  estudanteId: string;
  estudanteNome: string;
  empresaNome: string;
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
