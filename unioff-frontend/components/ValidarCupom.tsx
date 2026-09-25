"use client";

import { useState } from "react";
import { Aviso, Botao } from "@/components/ui";
import { resgates } from "@/lib/api";

export function ValidarCupom({ aoValidar }: { aoValidar: () => void }) {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    const limpo = codigo.trim().toUpperCase();
    if (!limpo) return;
    setEnviando(true);
    setResultado(null);
    try {
      await resgates.validar(limpo);
      setResultado({ tipo: "ok", texto: `Cupom ${limpo} validado. Pode aplicar o desconto.` });
      setCodigo("");
      aoValidar();
    } catch (err) {
      setResultado({ tipo: "erro", texto: err instanceof Error ? err.message : "Cupom não validado." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={aoEnviar} className="flex max-w-lg flex-col gap-4">
      <label htmlFor="codigo" className="font-semibold">
        Código que o estudante mostrou
      </label>
      <div className="flex gap-2">
        <input
          id="codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          className="min-w-0 flex-1 rounded-md border-2 border-tinta bg-white px-4 py-3 font-display text-2xl font-bold uppercase tracking-[0.12em] focus:outline-none focus:ring-4 focus:ring-marca"
        />
        <Botao type="submit" disabled={enviando || !codigo.trim()} className="px-6">
          {enviando ? "Validando…" : "Validar"}
        </Botao>
      </div>
      {resultado && <Aviso tipo={resultado.tipo}>{resultado.texto}</Aviso>}
    </form>
  );
}
