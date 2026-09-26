"use client";

import { useEffect, useState } from "react";
import { EmpresaCard } from "@/components/EmpresaCard";
import { Aviso, Botao, Carregando, Vazio } from "@/components/ui";
import { empresas } from "@/lib/api";
import type { Empresa } from "@/lib/types";

const campo =
  "min-w-0 rounded border-2 border-borda bg-fundo-duro px-3 py-2 font-mono focus:border-amarelo focus:outline-none";

export default function EmpresasPage() {
  const [filtro, setFiltro] = useState({ nome: "", cidade: "" });
  const [aplicado, setAplicado] = useState(filtro);
  const [lista, setLista] = useState<Empresa[] | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;
    empresas
      .listar({ ...aplicado, tamanho: 50 })
      .then((r) => !cancelado && (setLista(r.itens), setErro("")))
      .catch((err: Error) => !cancelado && setErro(err.message));
    return () => {
      cancelado = true;
    };
  }, [aplicado]);

  function aoFiltrar(e: React.FormEvent) {
    e.preventDefault();
    setLista(null);
    setAplicado(filtro);
  }

  return (
    <>
      <h1 className="font-display text-3xl font-bold">Empresas parceiras</h1>
      <form onSubmit={aoFiltrar} role="search" className="mb-8 mt-4 flex flex-wrap gap-2">
        <label htmlFor="nome" className="sr-only">Nome da empresa</label>
        <input id="nome" placeholder="nome" value={filtro.nome}
          onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })} className={`${campo} flex-1`} />
        <label htmlFor="cidade" className="sr-only">Cidade</label>
        <input id="cidade" placeholder="cidade" value={filtro.cidade}
          onChange={(e) => setFiltro({ ...filtro, cidade: e.target.value })} className={`${campo} sm:w-48`} />
        <Botao type="submit">Filtrar</Botao>
      </form>

      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {!erro && !lista && <Carregando texto="carregando empresas…" />}
      {lista && lista.length === 0 && (
        <Vazio titulo="Nenhuma empresa encontrada">Tente outro nome ou deixe a cidade em branco.</Vazio>
      )}
      {lista && lista.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((e) => <EmpresaCard key={e.id} empresa={e} />)}
        </div>
      )}
    </>
  );
}
