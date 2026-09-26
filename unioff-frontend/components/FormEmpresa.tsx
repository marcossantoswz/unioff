"use client";

import { useState } from "react";
import { AreaTexto, Aviso, Botao, Campo } from "@/components/ui";
import { empresas } from "@/lib/api";
import type { Empresa, EmpresaUpdate } from "@/lib/types";

export function FormEmpresa({ empresa, aoSalvar }: { empresa: Empresa; aoSalvar: (e: Empresa) => void }) {
  const [aviso, setAviso] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.currentTarget)) as EmpresaUpdate;
    setEnviando(true);
    setAviso(null);
    try {
      aoSalvar(await empresas.atualizarMinha(dados));
      setAviso({ tipo: "ok", texto: "Dados salvos. A página pública já mostra as alterações." });
    } catch (err) {
      setAviso({ tipo: "erro", texto: err instanceof Error ? err.message : "Não foi possível salvar." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={aoEnviar} className="flex max-w-xl flex-col gap-4">
      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      <Campo rotulo="Nome do responsável" name="nome" defaultValue={empresa.nome} required />
      <Campo rotulo="Nome do estabelecimento" name="nomeFantasia" defaultValue={empresa.nomeFantasia} required />
      <AreaTexto rotulo="O que vocês oferecem" name="descricao" defaultValue={empresa.descricao} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Cidade" name="cidade" defaultValue={empresa.cidade} required />
        <Campo rotulo="Bairro" name="bairro" defaultValue={empresa.bairro} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
        <Campo rotulo="Rua" name="logradouro" defaultValue={empresa.logradouro} required />
        <Campo rotulo="Número" name="numero" defaultValue={empresa.numero} required />
      </div>
      <Campo rotulo="WhatsApp" name="telephoneWhatsapp" type="tel" defaultValue={empresa.telephoneWhatsapp} />
      <Campo rotulo="Site ou Instagram" name="site" defaultValue={empresa.site} />
      <Botao type="submit" disabled={enviando} className="self-start">
        {enviando ? "Salvando…" : "Salvar dados"}
      </Botao>
    </form>
  );
}
