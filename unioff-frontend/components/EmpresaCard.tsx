import type { EmpresaResponseDTO } from "@/lib/types";
import Link from "next/link";

interface EmpresaCardProps {
  empresa: EmpresaResponseDTO;
}

export default function EmpresaCard({ empresa }: EmpresaCardProps) {
  const nome = empresa.nomeFantasia || empresa.nome;

  return (
    <Link href={`/empresas/${empresa.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <span className="text-2xl font-bold text-indigo-600">
            {(nome || "?").charAt(0).toUpperCase()}
          </span>
        </div>

        <h3 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
          {nome}
        </h3>

        {empresa.cidade && (
          <span className="text-xs text-slate-400">📍 {empresa.cidade}</span>
        )}
      </div>
    </Link>
  );
}
