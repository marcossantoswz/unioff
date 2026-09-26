"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BeneficioTicket } from "@/components/BeneficioTicket";
import { BuscaBeneficios } from "@/components/BuscaBeneficios";
import { EmpresaCard } from "@/components/EmpresaCard";
import { beneficios, empresas } from "@/lib/api";
import type { Beneficio, Empresa } from "@/lib/types";

const passos = ["crie sua conta de estudante", "resgate o cupom no app", "mostre o código no balcão"];

function Secao({ titulo, href, children }: { titulo: string; href: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">{titulo}</h2>
        <Link href={href} className="font-mono text-sm text-aqua hover:underline">ver todos →</Link>
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  const [destaques, setDestaques] = useState<Beneficio[]>([]);
  const [parceiras, setParceiras] = useState<Empresa[]>([]);

  useEffect(() => {
    beneficios.listar({ disponivel: true, tamanho: 4 }).then((p) => setDestaques(p.itens.filter((b) => !b.esgotado))).catch(() => {});
    empresas.listar({ tamanho: 4 }).then((p) => setParceiras(p.itens)).catch(() => {});
  }, []);

  return (
    <>
      <section className="pb-4 pt-6">
        <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          Desconto de estudante nos lugares perto da sua faculdade.
        </h1>
        <div className="mt-8">
          <BuscaBeneficios grande />
        </div>
        <ol className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm text-apagado">
          {passos.map((passo, i) => (
            <li key={passo}>
              <span className="text-laranja">{i + 1}.</span> {passo}
            </li>
          ))}
        </ol>
      </section>

      {destaques.length > 0 && (
        <Secao titulo="Benefícios em destaque" href="/beneficios">
          <div className="grid gap-4 md:grid-cols-2">
            {destaques.map((b) => <BeneficioTicket key={b.id} beneficio={b} />)}
          </div>
        </Secao>
      )}

      {parceiras.length > 0 && (
        <Secao titulo="Empresas parceiras" href="/empresas">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {parceiras.map((e) => <EmpresaCard key={e.id} empresa={e} />)}
          </div>
        </Secao>
      )}
    </>
  );
}
