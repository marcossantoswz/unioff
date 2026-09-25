import type { BeneficioResponseDTO } from "@/lib/types";
import Link from "next/link";

interface BeneficioCardProps {
  beneficio: BeneficioResponseDTO;
}

export default function BeneficioCard({ beneficio }: BeneficioCardProps) {
  const esgotado = beneficio.esgotado;

  return (
    <Link href={`/beneficios/${beneficio.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full">
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600" />
        <div className="p-5">
          {/* Status */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {esgotado && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                Esgotado
              </span>
            )}
            {beneficio.ativo === false && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                Inativo
              </span>
            )}
            {!esgotado && beneficio.ativo !== false && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                Disponível
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-base leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {beneficio.titulo}
          </h3>

          {/* Descrição curta */}
          {beneficio.descricao && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {beneficio.descricao}
            </p>
          )}

          {/* Empresa */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-700 text-xs font-bold">
                {(beneficio.nomeEmpresa || "?").charAt(0)}
              </span>
            </div>
            <span className="text-xs text-slate-500 truncate">{beneficio.nomeEmpresa}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            {beneficio.dataFim && (
              <span className="text-xs text-slate-400">
                até {new Date(beneficio.dataFim).toLocaleDateString("pt-BR")}
              </span>
            )}
            {beneficio.quantidadeDisponivel !== undefined && (
              <span className="text-xs text-slate-400 ml-auto">
                {beneficio.quantidadeDisponivel} disponíveis
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
