"use client";

import { useState } from "react";
import { Aviso, Botao, Campo } from "@/components/ui";
import { auth } from "@/lib/api";
import type { EstudanteCadastro } from "@/lib/types-cadastro";

interface Props {
  aoCadastrar: (email: string, senha: string) => Promise<void>;
}

export function CadastroEstudante({ aoCadastrar }: Props) {
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.currentTarget)) as unknown as EstudanteCadastro;
    setErro("");
    setEnviando(true);
    try {
      await auth.cadastrarEstudante(dados);
      await aoCadastrar(dados.email, dados.senha);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível criar a conta.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-4">
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <Campo rotulo="Nome completo" name="nome" autoComplete="name" required />
      <Campo rotulo="E-mail" name="email" type="email" autoComplete="email" required />
      <Campo rotulo="Senha" name="senha" type="password" autoComplete="new-password" minLength={6} required />
      <Campo rotulo="Instituição" name="instituicao" placeholder="UFMG" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Curso" name="curso" required />
        <Campo rotulo="Matrícula" name="matricula" required />
      </div>
      <Botao type="submit" disabled={enviando}>
        {enviando ? "Criando conta…" : "Criar conta de estudante"}
      </Botao>
    </form>
  );
}
