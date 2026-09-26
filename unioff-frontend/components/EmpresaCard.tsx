import Link from "next/link";
import type { Empresa } from "@/lib/types";

export function EmpresaCard({ empresa }: { empresa: Empresa }) {
  const local = [empresa.bairro, empresa.cidade].filter(Boolean).join(", ");

  return (
    <Link
      href={`/empresas/${empresa.id}`}
      className="group flex flex-col gap-2 rounded border border-borda bg-superficie p-5 hover:border-amarelo"
    >
      <h3 className="font-display text-xl font-bold leading-tight group-hover:text-amarelo">
        {empresa.nomeFantasia}
      </h3>
      {local && <p className="font-mono text-xs text-aqua">{local}</p>}
      {empresa.descricao && <p className="line-clamp-2 text-sm text-apagado">{empresa.descricao}</p>}
    </Link>
  );
}
