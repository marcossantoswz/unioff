"use client";

import Link from "next/link";
import { formatarData } from "@/lib/format";
import type { Beneficio } from "@/lib/types";

interface Props {
  itens: Beneficio[];
  aoDesativar: (beneficio: Beneficio) => void;
}

function situacao(b: Beneficio): [string, string] {
  if (!b.ativo) return ["inativo", "text-apagado"];
  if (b.esgotado) return ["esgotado", "text-laranja"];
  return ["no ar", "text-verde"];
}

export function TabelaBeneficios({ itens, aoDesativar }: Props) {
  return (
    <div className="overflow-x-auto rounded border border-borda bg-superficie">
      <table className="w-full min-w-[40rem] text-left">
        <thead className="border-b border-borda text-sm text-apagado">
          <tr>
            <th className="px-4 py-3 font-semibold">Benefício</th>
            <th className="px-4 py-3 font-semibold">Validade</th>
            <th className="px-4 py-3 font-semibold">Resgates</th>
            <th className="px-4 py-3 font-semibold">Situação</th>
            <th className="px-4 py-3"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borda">
          {itens.map((b) => {
            const [texto, cor] = situacao(b);
            return (
              <tr key={b.id}>
                <td className="px-4 py-3 font-semibold">{b.titulo}</td>
                <td className="px-4 py-3 text-sm">até {formatarData(b.dataFim)}</td>
                <td className="px-4 py-3 font-mono text-sm">
                  {b.quantidadeResgates}/{b.quantidadeMaxResgastes}
                </td>
                <td className={`px-4 py-3 font-mono text-sm ${cor}`}>{texto}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold">
                  <Link href={`/empresa/me/beneficios/${b.id}`} className="text-aqua hover:underline">
                    Editar
                  </Link>
                  {b.ativo && (
                    <button onClick={() => aoDesativar(b)} className="ml-4 text-vermelho hover:underline">
                      Desativar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
