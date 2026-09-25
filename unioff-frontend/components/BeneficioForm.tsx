"use client";

import { useState } from "react";
import { AreaTexto, Aviso, Botao, Campo } from "@/components/ui";
import { hojeIso } from "@/lib/format";
import type { BeneficioForm as Dados } from "@/lib/types";

interface Props {
  inicial?: Dados;
  textoBotao: string;
  aoSalvar: (dados: Dados) => Promise<void>;
}

export function BeneficioForm({ inicial, textoBotao, aoSalvar }: Props) {
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const editando = inicial !== undefined;

  async function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const dados: Dados = {
      titulo: String(form.get("titulo")),
      descricao: String(form.get("descricao")),
      dataInicio: String(form.get("dataInicio")),
      dataFim: String(form.get("dataFim")),
      quantidadeMaxResgastes: Number(form.get("quantidadeMaxResgastes")),
      ...(editando && { ativo: form.get("ativo") === "on" }),
    };
    if (dados.dataFim < dados.dataInicio) {
      setErro("A data de fim precisa ser igual ou depois da data de início.");
      return;
    }
    setErro("");
    setEnviando(true);
    try {
      await aoSalvar(dados);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível salvar.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={aoEnviar} className="flex max-w-xl flex-col gap-4">
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <Campo rotulo="Título" name="titulo" defaultValue={inicial?.titulo} placeholder="20% de desconto no almoço" required />
      <AreaTexto rotulo="Descrição e regras de uso" name="descricao" defaultValue={inicial?.descricao} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Começa em" name="dataInicio" type="date" defaultValue={inicial?.dataInicio ?? hojeIso()} min={editando ? undefined : hojeIso()} required />
        <Campo rotulo="Termina em" name="dataFim" type="date" defaultValue={inicial?.dataFim} min={hojeIso()} required />
      </div>
      <Campo
        rotulo="Limite de resgates"
        name="quantidadeMaxResgastes"
        type="number"
        min={1}
        defaultValue={inicial?.quantidadeMaxResgastes ?? 50}
        dica="Quando o limite for atingido, o benefício aparece como esgotado."
        required
      />
      {editando && (
        <label className="flex items-center gap-3 font-semibold">
          <input type="checkbox" name="ativo" defaultChecked={inicial.ativo} className="size-5 accent-carimbo" />
          Benefício visível para estudantes
        </label>
      )}
      <Botao type="submit" disabled={enviando} className="self-start">
        {enviando ? "Salvando…" : textoBotao}
      </Botao>
    </form>
  );
}
