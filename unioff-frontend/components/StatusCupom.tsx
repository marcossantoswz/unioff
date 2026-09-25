import type { StatusCupom as Status } from "@/lib/types";

const estilos: Record<Status, { texto: string; classe: string }> = {
  PENDENTE: { texto: "Pronto para usar", classe: "bg-marca text-tinta" },
  USADO: { texto: "Usado", classe: "bg-ok/10 text-ok" },
  EXPIRADO: { texto: "Expirado", classe: "bg-linha text-apagado" },
};

export function StatusCupom({ status }: { status: Status }) {
  const { texto, classe } = estilos[status];
  return <span className={`inline-block rounded px-2 py-0.5 text-sm font-semibold ${classe}`}>{texto}</span>;
}
