"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Metricas } from "@/components/Metricas";
import { TabelaBeneficios } from "@/components/TabelaBeneficios";
import { Aviso, Vazio, botaoClasse } from "@/components/ui";
import { beneficios, empresas } from "@/lib/api";
import type { Beneficio, MetricasEmpresa } from "@/lib/types";

export default function PainelPage() {
  const [metricas, setMetricas] = useState<MetricasEmpresa | null>(null);
  const [lista, setLista] = useState<Beneficio[] | null>(null);
  const [erro, setErro] = useState("");

  const carregar = useCallback(() => {
    Promise.all([empresas.metricas(), empresas.meusBeneficios()])
      .then(([m, pagina]) => {
        setMetricas(m);
        setLista(pagina.content);
      })
      .catch((err: Error) => setErro(err.message));
  }, []);

  useEffect(carregar, [carregar]);

  async function desativar(beneficio: Beneficio) {
    if (!window.confirm(`Desativar "${beneficio.titulo}"? Estudantes não vão mais conseguir resgatar.`)) return;
    try {
      await beneficios.desativar(beneficio.id);
      carregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível desativar.");
    }
  }

  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!metricas || !lista) return <p className="text-apagado">Carregando painel…</p>;

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="mb-4 font-display text-3xl font-bold">{metricas.nomeFantasia}</h1>
        <Metricas metricas={metricas} />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold">Seus benefícios</h2>
          <Link href="/painel/beneficios/novo" className={botaoClasse()}>
            Novo benefício
          </Link>
        </div>
        {lista.length === 0 ? (
          <Vazio titulo="Você ainda não publicou benefícios">
            Crie o primeiro para aparecer no feed dos estudantes.
          </Vazio>
        ) : (
          <TabelaBeneficios itens={lista} aoDesativar={desativar} />
        )}
      </section>
    </div>
  );
}
