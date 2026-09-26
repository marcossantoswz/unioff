"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Botao } from "@/components/ui";

// Campo de busca que leva para /beneficios?busca=...
export function BuscaBeneficios({ inicial = "", grande = false }: { inicial?: string; grande?: boolean }) {
  const router = useRouter();
  const [termo, setTermo] = useState(inicial);

  function aoBuscar(e: React.FormEvent) {
    e.preventDefault();
    const q = termo.trim();
    router.push(q ? `/beneficios?busca=${encodeURIComponent(q)}` : "/beneficios");
  }

  return (
    <form onSubmit={aoBuscar} role="search" className="flex max-w-xl gap-2">
      <label htmlFor="busca" className="sr-only">Buscar por estabelecimento ou benefício</label>
      <input
        id="busca"
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="pizzaria, xerox, academia…"
        className={`min-w-0 flex-1 rounded border-2 border-borda bg-fundo-duro px-4 font-mono focus:border-amarelo focus:outline-none ${grande ? "py-3 text-lg" : "py-2"}`}
      />
      <Botao type="submit" className={grande ? "px-6 text-lg" : ""}>Buscar</Botao>
    </form>
  );
}
