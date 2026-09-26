"use client";

import { useState } from "react";

// Código do cupom em destaque, pronto para mostrar no balcão.
export function CupomCodigo({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // sem permissão de área de transferência: o código continua visível
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="rounded bg-amarelo px-3 py-1 font-mono text-2xl font-bold tracking-widest break-all text-sobre-destaque">
        {codigo}
      </span>
      <button onClick={copiar} className="text-sm font-semibold text-aqua hover:underline">
        {copiado ? "código copiado" : "copiar código"}
      </button>
    </div>
  );
}
