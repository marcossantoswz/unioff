"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { TabelaBeneficios } from "@/components/TabelaBeneficios";
import { Aviso, Carregando, Vazio, botaoClasse } from "@/components/ui";
import { beneficios, empresas } from "@/lib/api";
import type { Beneficio } from "@/lib/types";

export default function MeusBeneficiosPage() {
  const [lista, setLista] = useState<Beneficio[] | null>(null);
  const [erro, setErro] = useState("");

  const carregar = useCallback(() => {
    empresas.meusBeneficios().then((p) => setLista(p.itens)).catch((err: Error) => setErro(err.message));
  }, []);

  useEffect(carregar, [carregar]);

  async function desativar(b: Beneficio) {
    if (!window.confirm(`Desativar "${b.titulo}"? Estudantes não vão mais conseguir resgatar.`)) return;
    try {
      await beneficios.desativar(b.id);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível desativar.");
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Seus benefícios</h1>
        <Link href="/empresa/me/beneficios/novo" className={botaoClasse()}>Novo benefício</Link>
      </div>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {!erro && !lista && <Carregando texto="carregando benefícios…" />}
      {lista && lista.length === 0 && (
        <Vazio titulo="Você ainda não publicou benefícios">Crie o primeiro para aparecer para os estudantes.</Vazio>
      )}
      {lista && lista.length > 0 && <TabelaBeneficios itens={lista} aoDesativar={desativar} />}
    </>
  );
}
