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

    // Validação manual básica
    const cnpjLimpo = dados.cnpj.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) {
      setErro("O CNPJ deve conter exatamente 14 números.");
      return;
    }
    dados.cnpj = cnpjLimpo;

    if (dados.telephoneWhatsapp) {
      const telefoneLimpo = dados.telephoneWhatsapp.replace(/\D/g, "");
      if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        setErro("O WhatsApp deve conter o DDD e o número (ex: 31999999999).");
        return;
      }
      dados.telephoneWhatsapp = telefoneLimpo;
    }

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
        <Campo rotulo="Nome do estabelecimento" name="nomeFantasia" required minLength={2} />
        <Campo 
          rotulo="CNPJ" 
          name="cnpj" 
          inputMode="numeric" 
          placeholder="00.000.000/0000-00"
          pattern="[\d\.\-\/]{14,18}" 
          title="Digite o CNPJ no formato 00.000.000/0000-00 ou apenas números"
          required 
        />
        <AreaTexto rotulo="O que vocês oferecem" name="descricao" minLength={10} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Cidade" name="cidade" required />
          <Campo rotulo="Bairro" name="bairro" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
          <Campo rotulo="Rua" name="logradouro" required />
          <Campo rotulo="Número" name="numero" required />
        </div>
        <Campo 
          rotulo="WhatsApp" 
          name="telephoneWhatsapp" 
          type="tel" 
          placeholder="(31) 99999-9999"
          pattern="[\d\s\-\(\)]{10,15}"
          title="Digite o telefone com DDD"
        />
        <Campo rotulo="Site ou Instagram" name="site" type="url" placeholder="https://..." />
      </fieldset>
      <Botao type="submit" disabled={enviando}>
        {enviando ? "Criando conta…" : "Criar conta de empresa"}
      </Botao>
    </form>
  );
}
