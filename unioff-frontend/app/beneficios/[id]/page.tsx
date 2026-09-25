"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Resgatar } from "@/components/Resgatar";
import { Aviso } from "@/components/ui";
import { beneficios } from "@/lib/api";
import { formatarData } from "@/lib/format";
import type { Beneficio } from "@/lib/types";

export default function BeneficioPage() {
  const { id } = useParams<{ id: string }>();
  const [beneficio, setBeneficio] = useState<Beneficio | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    beneficios.buscar(id).then(setBeneficio).catch((err: Error) => setErro(err.message));
  }, [id]);

  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!beneficio) return <p className="text-apagado">Carregando benefício…</p>;

  return (
    <article className="overflow-hidden rounded-xl border border-linha bg-white">
      <div className="grid md:grid-cols-[1fr_16rem]">
        <div className="flex flex-col gap-5 p-6 sm:p-10">
          <Link href={`/empresas/${beneficio.empresaId}`} className="font-semibold text-carimbo hover:underline">
            {beneficio.nomeEmpresa}
          </Link>
          <h1 className="font-display text-4xl font-extrabold leading-tight">{beneficio.titulo}</h1>
          <p className="max-w-prose whitespace-pre-line text-lg leading-relaxed">{beneficio.descricao}</p>
          <Resgatar
            beneficio={beneficio}
            aoResgatar={() =>
              setBeneficio({ ...beneficio, quantidadeDisponivel: beneficio.quantidadeDisponivel - 1 })
            }
          />
        </div>

        <dl className="flex flex-col gap-4 border-t-2 border-dashed border-linha p-6 sm:p-10 md:border-l-2 md:border-t-0">
          <div>
            <dt className="text-sm text-apagado">Válido de</dt>
            <dd className="font-semibold">
              {formatarData(beneficio.dataInicio)} a {formatarData(beneficio.dataFim)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-apagado">Resgates restantes</dt>
            <dd className="font-display text-3xl font-extrabold text-carimbo">
              {beneficio.quantidadeDisponivel}
              <span className="text-base font-semibold text-apagado"> de {beneficio.quantidadeMaxResgastes}</span>
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
