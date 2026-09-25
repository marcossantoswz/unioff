import type { MetricasEmpresa } from "@/lib/types";

export function Metricas({ metricas }: { metricas: MetricasEmpresa }) {
  const itens = [
    { valor: metricas.totalBeneficiosAtivos, rotulo: `benefícios ativos de ${metricas.totalBeneficios}` },
    { valor: metricas.totalResgates, rotulo: "cupons resgatados por estudantes" },
    { valor: metricas.totalCuponsUtilizados, rotulo: "cupons usados no balcão" },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded-lg border border-linha bg-linha sm:grid-cols-3">
      {itens.map((item) => (
        <div key={item.rotulo} className="flex flex-col-reverse bg-white px-5 py-4">
          <dt className="text-sm text-apagado">{item.rotulo}</dt>
          <dd className="font-display text-4xl font-extrabold text-carimbo">{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
