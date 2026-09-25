import Link from "next/link";
import { formatarData } from "@/lib/format";
import type { Beneficio } from "@/lib/types";

// Cada benefício aparece como um cupom picotado: o canhoto mostra quantos
// resgates restam, o corpo mostra a oferta.
export function BeneficioTicket({ beneficio, mostrarEmpresa = true }: { beneficio: Beneficio; mostrarEmpresa?: boolean }) {
  const indisponivel = beneficio.esgotado || !beneficio.ativo;

  return (
    <Link href={`/beneficios/${beneficio.id}`} className="ticket-sombra group block rounded-lg">
      <article className={`ticket flex min-h-32 ${indisponivel ? "opacity-60" : ""}`}>
        <div className="flex w-(--canhoto) shrink-0 flex-col items-center justify-center px-2 text-center">
          {indisponivel ? (
            <span className="font-display font-bold text-apagado">
              {beneficio.ativo ? "Esgotado" : "Inativo"}
            </span>
          ) : (
            <>
              <span className="font-display text-3xl font-extrabold leading-none text-carimbo">
                {beneficio.quantidadeDisponivel}
              </span>
              <span className="mt-1 text-xs text-apagado">
                {beneficio.quantidadeDisponivel === 1 ? "resgate restante" : "resgates restantes"}
              </span>
            </>
          )}
        </div>

        <div className="picote flex min-w-0 flex-1 flex-col justify-center gap-1 px-5 py-4">
          {mostrarEmpresa && <p className="truncate text-sm font-semibold text-apagado">{beneficio.nomeEmpresa}</p>}
          <h3 className="font-display text-xl font-bold leading-tight group-hover:text-carimbo">{beneficio.titulo}</h3>
          <p className="text-sm text-apagado">Válido até {formatarData(beneficio.dataFim)}</p>
        </div>
      </article>
    </Link>
  );
}
