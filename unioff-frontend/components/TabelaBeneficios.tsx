"use client";

import Link from "next/link";
import { formatarData } from "@/lib/format";
import type { Beneficio } from "@/lib/types";

interface Props {
  itens: Beneficio[];
  aoDesativar: (beneficio: Beneficio) => void;
}

export function TabelaBeneficios({ itens, aoDesativar }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-linha bg-white">
      <table className="w-full min-w-[40rem] text-left">
        <thead className="border-b border-linha text-sm text-apagado">
          <tr>
            <th className="px-4 py-3 font-semibold">Benefício</th>
            <th className="px-4 py-3 font-semibold">Validade</th>
            <th className="px-4 py-3 font-semibold">Resgates</th>
            <th className="px-4 py-3 font-semibold">Situação</th>
            <th className="px-4 py-3"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-linha">
          {itens.map((b) => (
            <tr key={b.id}>
              <td className="px-4 py-3 font-semibold">{b.titulo}</td>
              <td className="px-4 py-3 text-sm">até {formatarData(b.dataFim)}</td>
              <td className="px-4 py-3 text-sm">
                {b.quantidadeResgates} de {b.quantidadeMaxResgastes}
              </td>
              <td className="px-4 py-3 text-sm">
                {!b.ativo ? "Inativo" : b.esgotado ? "Esgotado" : "No ar"}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap">
                <Link href={`/painel/beneficios/${b.id}`} className="text-carimbo hover:underline">
                  Editar
                </Link>
                {b.ativo && (
                  <button onClick={() => aoDesativar(b)} className="ml-4 text-erro hover:underline">
                    Desativar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
