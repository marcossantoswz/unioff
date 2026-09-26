"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BeneficioForm } from "@/components/BeneficioForm";
import { beneficios } from "@/lib/api";
import type { BeneficioForm as Dados } from "@/lib/types";

export default function NovoBeneficioPage() {
  const router = useRouter();

  async function criar(dados: Dados) {
    await beneficios.criar(dados);
    router.push("/empresa/me/beneficios");
  }

  return (
    <>
      <Link href="/empresa/me/beneficios" className="font-mono text-sm text-aqua hover:underline">
        ← seus benefícios
      </Link>
      <h1 className="mb-6 mt-2 font-display text-3xl font-bold">Novo benefício</h1>
      <BeneficioForm textoBotao="Publicar benefício" aoSalvar={criar} />
    </>
  );
}
