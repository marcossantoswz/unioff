"use client";

import { useState } from "react";

// Código do cupom grifado com marca-texto, pronto para mostrar no balcão.
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
      <span className="bg-marca px-3 py-1 font-display text-3xl font-extrabold tracking-[0.12em] break-all">
        {codigo}
      </span>
      <button onClick={copiar} className="text-sm font-semibold text-carimbo hover:underline">
        {copiado ? "Código copiado" : "Copiar código"}
      </button>
    </div>
  );
}
