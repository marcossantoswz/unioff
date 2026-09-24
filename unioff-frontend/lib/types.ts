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
