"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BeneficioForm } from "@/components/BeneficioForm";
import { Aviso, Carregando } from "@/components/ui";
import { beneficios } from "@/lib/api";
import type { Beneficio, BeneficioForm as Dados } from "@/lib/types";

export default function EditarBeneficioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [beneficio, setBeneficio] = useState<Beneficio | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    beneficios.buscar(id).then(setBeneficio).catch((err: Error) => setErro(err.message));
  }, [id]);

  async function salvar(dados: Dados) {
    await beneficios.atualizar(id, dados);
    router.push("/empresa/me/beneficios");
  }

  return (
    <>
      <Link href="/empresa/me/beneficios" className="font-mono text-sm text-aqua hover:underline">
        ← seus benefícios
      </Link>
      <h1 className="mb-6 mt-2 font-display text-3xl font-bold">Editar benefício</h1>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {!beneficio && !erro && <Carregando texto="carregando benefício…" />}
      {beneficio && <BeneficioForm inicial={beneficio} textoBotao="Salvar alterações" aoSalvar={salvar} />}
    </>
  );
}
