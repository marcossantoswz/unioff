"use client";

import { useEffect, useState } from "react";
import { ListaCupons } from "@/components/ListaCupons";
import { Aviso, Carregando, Vazio } from "@/components/ui";
import { resgates } from "@/lib/api";
import type { Cupom } from "@/lib/types";

const filtros = {
  todos: () => true,
  pendentes: (c: Cupom) => !c.utilizado && !c.expirado,
  usados: (c: Cupom) => c.utilizado,
};

type Filtro = keyof typeof filtros;

export default function ResgatesEstudantePage() {
  const [cupons, setCupons] = useState<Cupom[] | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [erro, setErro] = useState("");

  useEffect(() => {
    resgates.meus().then(setCupons).catch((err: Error) => setErro(err.message));
  }, []);

  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!cupons) return <Carregando texto="carregando resgates…" />;
  if (cupons.length === 0) {
    return <Vazio titulo="Você ainda não resgatou nenhum benefício" acao={{ href: "/beneficios", texto: "Ver benefícios" }} />;
  }

  const visiveis = cupons.filter(filtros[filtro]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Meus resgates</h1>
        <div role="group" aria-label="Filtrar resgates" className="flex gap-1 font-mono text-sm">
          {(Object.keys(filtros) as Filtro[]).map((f) => (
            <button key={f} onClick={() => setFiltro(f)} aria-pressed={filtro === f}
              className="rounded border border-borda px-3 py-1 aria-pressed:border-amarelo aria-pressed:text-amarelo">
              {f}
            </button>
          ))}
        </div>
      </div>
      {visiveis.length === 0 ? <p className="text-apagado">Nenhum resgate neste filtro.</p> : <ListaCupons cupons={visiveis} />}
    </>
  );
}
