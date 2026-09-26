import Link from "next/link";
import { StatusCupom } from "@/components/StatusCupom";
import { formatarDataHora } from "@/lib/format";
import type { Cupom } from "@/lib/types";

export function ListaCupons({ cupons }: { cupons: Cupom[] }) {
  return (
    <ul className="divide-y divide-borda rounded border border-borda bg-superficie">
      {cupons.map((c) => (
        <li key={c.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
          <div className="min-w-0 flex-1">
            <Link href={`/beneficios/${c.beneficio.id}`} className="font-display text-lg font-bold hover:text-amarelo">
              {c.beneficio.titulo}
            </Link>
            <p className="text-sm text-apagado">
              {c.empresa.nomeFantasia} · resgatado em {formatarDataHora(c.dataResgate)}
              {c.dataUso && ` · usado em ${formatarDataHora(c.dataUso)}`}
            </p>
          </div>
          <span className="font-mono text-lg font-bold tracking-widest">{c.codigo}</span>
          <StatusCupom cupom={c} />
        </li>
      ))}
    </ul>
  );
}
