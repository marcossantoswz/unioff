"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CadastroEmpresa } from "@/components/CadastroEmpresa";
import { CadastroEstudante } from "@/components/CadastroEstudante";
import { useSessao } from "@/lib/auth";

type Perfil = "estudante" | "empresa";

export default function CadastroPage() {
  const [perfil, setPerfil] = useState<Perfil>("estudante");
  const { entrar } = useSessao();
  const router = useRouter();

  async function entrarAposCadastro(email: string, senha: string) {
    const usuario = await entrar(email, senha);
    router.push(usuario.tipoUsuario === "EMPRESA" ? "/painel" : "/");
  }

  return (
    <section className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl font-bold">Criar conta</h1>

      <div role="tablist" aria-label="Tipo de conta" className="mt-6 grid grid-cols-2 rounded-lg bg-linha/60 p-1">
        {(["estudante", "empresa"] as const).map((opcao) => (
          <button
            key={opcao}
            role="tab"
            aria-selected={perfil === opcao}
            onClick={() => setPerfil(opcao)}
            className="rounded-md py-2 font-semibold text-apagado aria-selected:bg-white aria-selected:text-tinta aria-selected:shadow-sm"
          >
            {opcao === "estudante" ? "Sou estudante" : "Tenho um estabelecimento"}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {perfil === "estudante" ? (
          <CadastroEstudante aoCadastrar={entrarAposCadastro} />
        ) : (
          <CadastroEmpresa aoCadastrar={entrarAposCadastro} />
        )}
      </div>

      <p className="mt-6 text-sm text-apagado">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-carimbo hover:underline">
          Entrar
        </Link>
      </p>
    </section>
  );
}
