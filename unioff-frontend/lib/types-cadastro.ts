import type { Empresa } from "./types";

export interface EstudanteCadastro {
  nome: string;
  email: string;
  senha: string;
  instituicao: string;
  curso: string;
  matricula: string;
}

export type EmpresaCadastro = Omit<Empresa, "id" | "nome" | "email"> & {
  nome: string;
  email: string;
  senha: string;
  cnpj: string;
};
