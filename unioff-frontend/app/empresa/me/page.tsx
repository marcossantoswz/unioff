"use client";

import { useEffect, useState } from "react";
import { FormEmpresa } from "@/components/FormEmpresa";
import { Metricas } from "@/components/Metricas";
import { Aviso, Carregando, LinkTexto } from "@/components/ui";
import { empresas } from "@/lib/api";
import type { Empresa, MetricasEmpresa } from "@/lib/types";

export default function MinhaEmpresaPage() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [metricas, setMetricas] = useState<MetricasEmpresa | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([empresas.minha(), empresas.metricas()])
      .then(([e, m]) => {
        setEmpresa(e);
        setMetricas(m);
      })
      .catch((err: Error) => setErro(err.message));
  }, []);

  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!empresa || !metricas) return <Carregando texto="carregando sua empresa…" />;

  return (
    <div className="flex flex-col gap-12">
      <section>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-display text-3xl font-bold">{empresa.nomeFantasia}</h1>
          <LinkTexto href={`/empresas/${empresa.id}`}>ver página pública →</LinkTexto>
        </div>
        <Metricas metricas={metricas} />
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-bold">Dados do estabelecimento</h2>
        <FormEmpresa key={empresa.id} empresa={empresa} aoSalvar={setEmpresa} />
      </section>
    </div>
  );
}
