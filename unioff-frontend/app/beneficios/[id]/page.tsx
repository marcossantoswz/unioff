"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Resgatar } from "@/components/Resgatar";
import { Aviso, Carregando } from "@/components/ui";
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
  if (!beneficio) return <Carregando texto="carregando benefício…" />;

  const local = [beneficio.empresa.bairro, beneficio.empresa.cidade].filter(Boolean).join(", ");

  return (
    <>
      <Link href="/beneficios" className="font-mono text-sm text-aqua hover:underline">← benefícios</Link>
      <article className="mt-4 overflow-hidden rounded border border-borda bg-superficie">
        <div className="grid md:grid-cols-[1fr_16rem]">
          <div className="flex flex-col gap-5 p-6 sm:p-10">
            <div>
              <Link href={`/empresas/${beneficio.empresa.id}`} className="font-semibold text-aqua hover:underline">
                {beneficio.empresa.nomeFantasia}
              </Link>
              {local && <span className="ml-2 font-mono text-xs text-apagado">{local}</span>}
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight">{beneficio.titulo}</h1>
            <p className="max-w-prose whitespace-pre-line text-lg leading-relaxed">{beneficio.descricao}</p>
            <Resgatar
              beneficio={beneficio}
              aoResgatar={() =>
                setBeneficio({ ...beneficio, quantidadeDisponivel: beneficio.quantidadeDisponivel - 1 })
              }
            />
          </div>

          <dl className="flex flex-col gap-4 border-t-2 border-dashed border-borda p-6 sm:p-10 md:border-l-2 md:border-t-0">
            <div>
              <dt className="text-sm text-apagado">Válido de</dt>
              <dd className="font-mono font-semibold">
                {formatarData(beneficio.dataInicio)} a {formatarData(beneficio.dataFim)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-apagado">Resgates restantes</dt>
              <dd className="font-mono text-3xl font-bold text-amarelo">
                {beneficio.quantidadeDisponivel}
                <span className="text-base text-apagado">/{beneficio.quantidadeMaxResgastes}</span>
              </dd>
            </div>
          </dl>
        </div>
      </article>
    </>
  );
}
