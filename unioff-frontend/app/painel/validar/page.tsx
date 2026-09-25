"use client";

import { useCallback, useEffect, useState } from "react";
import { StatusCupom } from "@/components/StatusCupom";
import { ValidarCupom } from "@/components/ValidarCupom";
import { Aviso } from "@/components/ui";
import { resgates } from "@/lib/api";
import { formatarDataHora } from "@/lib/format";
import type { CupomConsulta } from "@/lib/types";

export default function ValidarPage() {
  const [cupons, setCupons] = useState<CupomConsulta[] | null>(null);
  const [erro, setErro] = useState("");

  const carregar = useCallback(() => {
    resgates.daEmpresa().then(setCupons).catch((err: Error) => setErro(err.message));
  }, []);

  useEffect(carregar, [carregar]);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="mb-6 font-display text-3xl font-bold">Validar cupom</h1>
        <ValidarCupom aoValidar={carregar} />
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-bold">Cupons resgatados</h2>
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        {cupons && cupons.length === 0 && <p className="text-apagado">Nenhum estudante resgatou seus benefícios ainda.</p>}
        {cupons && cupons.length > 0 && (
          <ul className="divide-y divide-linha rounded-lg border border-linha bg-white">
            {cupons.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-3">
                <span className="font-display font-bold tracking-widest">{c.codigo}</span>
                <span className="min-w-0 flex-1 text-sm">
                  {c.beneficioTitulo} · {c.estudanteNome}
                  <span className="block text-apagado">resgatado em {formatarDataHora(c.dataGeracao)}</span>
                </span>
                <StatusCupom status={c.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
