"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExigePerfil } from "@/components/ExigePerfil";
import { StatusCupom } from "@/components/StatusCupom";
import { Aviso, Vazio } from "@/components/ui";
import { resgates } from "@/lib/api";
import { formatarDataHora } from "@/lib/format";
import type { CupomConsulta } from "@/lib/types";

function ListaCupons() {
  const [cupons, setCupons] = useState<CupomConsulta[] | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    resgates.meus().then(setCupons).catch((err: Error) => setErro(err.message));
  }, []);

  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!cupons) return <p className="text-apagado">Carregando cupons…</p>;
  if (cupons.length === 0) {
    return (
      <Vazio titulo="Você ainda não resgatou nenhum benefício" acao={{ href: "/", texto: "Ver benefícios" }} />
    );
  }

  return (
    <ul className="divide-y divide-linha rounded-lg border border-linha bg-white">
      {cupons.map((c) => (
        <li key={c.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
          <div className="min-w-0 flex-1">
            <Link href={`/beneficios/${c.beneficioId}`} className="font-display text-lg font-bold hover:text-carimbo">
              {c.beneficioTitulo}
            </Link>
            <p className="text-sm text-apagado">
              {c.empresaNome} · resgatado em {formatarDataHora(c.dataGeracao)}
              {c.dataUso && ` · usado em ${formatarDataHora(c.dataUso)}`}
            </p>
          </div>
          <span className="font-display text-lg font-bold tracking-widest">{c.codigo}</span>
          <StatusCupom status={c.status} />
        </li>
      ))}
    </ul>
  );
}

export default function MeusCuponsPage() {
  return (
    <ExigePerfil perfil="ESTUDANTE">
      <h1 className="mb-6 font-display text-3xl font-bold">Meus cupons</h1>
      <ListaCupons />
    </ExigePerfil>
  );
}
