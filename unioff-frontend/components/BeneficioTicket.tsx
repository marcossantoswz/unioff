import Link from "next/link";
import { formatarData } from "@/lib/format";
import type { Beneficio } from "@/lib/types";

// Cada benefício é um cupom picotado: o canhoto mostra quantos resgates
// restam, o corpo mostra a oferta.
export function BeneficioTicket({ beneficio, mostrarEmpresa = true }: { beneficio: Beneficio; mostrarEmpresa?: boolean }) {
  const indisponivel = beneficio.esgotado || !beneficio.ativo;

  return (
    <Link href={`/beneficios/${beneficio.id}`} className="group block rounded">
      <article className={`ticket flex min-h-32 ${indisponivel ? "opacity-55" : ""}`}>
        <div className="flex w-(--canhoto) shrink-0 flex-col items-center justify-center px-2 text-center">
          {indisponivel ? (
            <span className="font-mono text-sm font-bold text-apagado">
              {beneficio.ativo ? "esgotado" : "inativo"}
            </span>
          ) : (
            <>
              <span className="font-mono text-3xl font-bold leading-none text-amarelo">
                {beneficio.quantidadeDisponivel}
              </span>
              <span className="mt-1 text-xs text-apagado">
                {beneficio.quantidadeDisponivel === 1 ? "resgate restante" : "resgates restantes"}
              </span>
            </>
          )}
        </div>

        <div className="picote flex min-w-0 flex-1 flex-col justify-center gap-1 px-5 py-4">
          {mostrarEmpresa && (
            <p className="truncate text-sm font-semibold text-aqua">{beneficio.empresa.nomeFantasia}</p>
          )}
          <h3 className="font-display text-xl font-bold leading-tight group-hover:text-amarelo">
            {beneficio.titulo}
          </h3>
          <p className="text-sm text-apagado">válido até {formatarData(beneficio.dataFim)}</p>
        </div>
      </article>
    </Link>
  );
}
