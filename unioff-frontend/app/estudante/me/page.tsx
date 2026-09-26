"use client";

import { useEffect, useState } from "react";
import { CupomCodigo } from "@/components/CupomCodigo";
import { Aviso, Carregando, LinkTexto } from "@/components/ui";
import { resgates } from "@/lib/api";
import { useSessao } from "@/lib/auth";
import type { Cupom } from "@/lib/types";

export default function EstudantePage() {
  const { usuario } = useSessao();
  const [cupons, setCupons] = useState<Cupom[] | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    resgates.meus().then(setCupons).catch((err: Error) => setErro(err.message));
  }, []);

  const prontos = cupons?.filter((c) => !c.utilizado && !c.expirado) ?? [];
  const usados = cupons?.filter((c) => c.utilizado).length ?? 0;

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-display text-3xl font-bold">{usuario?.nome}</h1>
        <p className="font-mono text-sm text-apagado">{usuario?.email}</p>
        {cupons && (
          <p className="mt-4 font-mono">
            <span className="text-amarelo">{cupons.length}</span> resgates ·{" "}
            <span className="text-verde">{usados}</span> usados ·{" "}
            <span className="text-aqua">{prontos.length}</span> prontos para usar
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-bold">Cupons prontos para usar</h2>
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        {!erro && !cupons && <Carregando texto="carregando cupons…" />}
        {cupons && prontos.length === 0 && (
          <p className="text-apagado">
            Nenhum cupom pendente. <LinkTexto href="/beneficios">Procurar benefícios</LinkTexto>
          </p>
        )}
        <ul className="flex flex-col gap-4">
          {prontos.map((c) => (
            <li key={c.id} className="rounded border border-borda bg-superficie p-5">
              <p className="font-semibold">{c.beneficio.titulo}</p>
              <p className="mb-3 text-sm text-aqua">{c.empresa.nomeFantasia}</p>
              <CupomCodigo codigo={c.codigo} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
