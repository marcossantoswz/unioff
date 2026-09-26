import type { MetricasEmpresa } from "@/lib/types";

export function Metricas({ metricas }: { metricas: MetricasEmpresa }) {
  const itens = [
    { valor: metricas.totalBeneficiosAtivos, rotulo: `benefícios ativos de ${metricas.totalBeneficios}`, cor: "text-amarelo" },
    { valor: metricas.totalResgates, rotulo: "cupons resgatados por estudantes", cor: "text-aqua" },
    { valor: metricas.totalCuponsUtilizados, rotulo: "cupons usados no balcão", cor: "text-verde" },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded border border-borda bg-borda sm:grid-cols-3">
      {itens.map((item) => (
        <div key={item.rotulo} className="flex flex-col-reverse bg-superficie px-5 py-4">
          <dt className="text-sm text-apagado">{item.rotulo}</dt>
          <dd className={`font-mono text-4xl font-bold ${item.cor}`}>{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
