import type { Cupom } from "@/lib/types";

export function StatusCupom({ cupom }: { cupom: Cupom }) {
  const [texto, classe] = cupom.utilizado
    ? ["usado", "border-verde text-verde"]
    : cupom.expirado
      ? ["expirado", "border-borda text-apagado"]
      : ["pronto para usar", "border-amarelo text-amarelo"];

  return <span className={`inline-block rounded border px-2 py-0.5 font-mono text-xs ${classe}`}>{texto}</span>;
}
