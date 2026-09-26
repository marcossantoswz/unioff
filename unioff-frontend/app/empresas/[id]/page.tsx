"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BeneficioTicket } from "@/components/BeneficioTicket";
import { Aviso, Carregando, Vazio } from "@/components/ui";
import { empresas } from "@/lib/api";
import { linkSite, linkWhatsapp } from "@/lib/format";
import type { EmpresaDetalhes } from "@/lib/types";

export default function EmpresaPage() {
  const { id } = useParams<{ id: string }>();
  const [empresa, setEmpresa] = useState<EmpresaDetalhes | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    empresas.detalhes(id).then(setEmpresa).catch((err: Error) => setErro(err.message));
  }, [id]);

  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!empresa) return <Carregando texto="carregando estabelecimento…" />;

  const whatsapp = empresa.telephoneWhatsapp ? linkWhatsapp(empresa.telephoneWhatsapp) : null;
  const endereco = [
    [empresa.logradouro, empresa.numero].filter(Boolean).join(", "),
    empresa.bairro,
    empresa.cidade,
  ].filter(Boolean).join(" · ");
  const ativos = empresa.beneficios.filter((b) => b.ativo);

  return (
    <>
      <Link href="/empresas" className="font-mono text-sm text-aqua hover:underline">← empresas</Link>
      <header className="mt-4 grid gap-8 border-b border-borda pb-8 md:grid-cols-[1fr_18rem]">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight">{empresa.nomeFantasia}</h1>
          {empresa.descricao && <p className="mt-3 max-w-prose text-lg leading-relaxed">{empresa.descricao}</p>}
        </div>
        <dl className="flex flex-col gap-3 text-sm">
          {endereco && (
            <div>
              <dt className="text-apagado">Endereço</dt>
              <dd className="font-mono">{endereco}</dd>
            </div>
          )}
          {whatsapp && (
            <div>
              <dt className="text-apagado">WhatsApp</dt>
              <dd>
                <a href={whatsapp} target="_blank" rel="noreferrer" className="font-semibold text-aqua hover:underline">
                  {empresa.telephoneWhatsapp}
                </a>
              </dd>
            </div>
          )}
          {empresa.site && (
            <div>
              <dt className="text-apagado">Site</dt>
              <dd>
                <a href={linkSite(empresa.site)} target="_blank" rel="noreferrer" className="font-semibold text-aqua hover:underline">
                  {empresa.site}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </header>

      <h2 className="mb-4 mt-8 font-display text-2xl font-bold">Benefícios</h2>
      {ativos.length === 0 ? (
        <Vazio titulo="Nenhum benefício ativo no momento" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ativos.map((b) => (
            <BeneficioTicket key={b.id} beneficio={b} mostrarEmpresa={false} />
          ))}
        </div>
      )}
    </>
  );
}
