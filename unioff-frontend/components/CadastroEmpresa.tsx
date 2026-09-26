"use client";

import { useState } from "react";
import { AreaTexto, Aviso, Botao, Campo } from "@/components/ui";
import { auth } from "@/lib/api";
import type { EmpresaCadastro } from "@/lib/types-cadastro";

interface Props {
  aoCadastrar: (email: string, senha: string) => Promise<void>;
}

export function CadastroEmpresa({ aoCadastrar }: Props) {
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.currentTarget)) as unknown as EmpresaCadastro;
    setErro("");
    setEnviando(true);
    try {
      await auth.cadastrarEmpresa(dados);
      await aoCadastrar(dados.email, dados.senha);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível criar a conta.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-4">
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 font-display text-lg font-semibold">Acesso</legend>
        <Campo rotulo="Nome do responsável" name="nome" autoComplete="name" required />
        <Campo rotulo="E-mail" name="email" type="email" autoComplete="email" required />
        <Campo rotulo="Senha" name="senha" type="password" autoComplete="new-password" minLength={6} required />
      </fieldset>
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 mt-4 font-display text-lg font-semibold">Estabelecimento</legend>
        <Campo rotulo="Nome do estabelecimento" name="nomeFantasia" required />
        <Campo rotulo="CNPJ" name="cnpj" inputMode="numeric" required />
        <AreaTexto rotulo="O que vocês oferecem" name="descricao" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Cidade" name="cidade" required />
          <Campo rotulo="Bairro" name="bairro" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
          <Campo rotulo="Rua" name="logradouro" required />
          <Campo rotulo="Número" name="numero" required />
        </div>
        <Campo rotulo="WhatsApp" name="telephoneWhatsapp" type="tel" placeholder="(31) 99999-9999" />
        <Campo rotulo="Site ou Instagram" name="site" />
      </fieldset>
      <Botao type="submit" disabled={enviando}>
        {enviando ? "Criando conta…" : "Criar conta de empresa"}
      </Botao>
    </form>
  );
}
