"use client";

import Link from "next/link";
import { botaoClasse } from "@/components/ui";
import { useSessao } from "@/lib/auth";
import type { TipoUsuario } from "@/lib/types";

// Protege páginas no cliente. A proteção real é do backend (Spring Security);
// aqui só evitamos mostrar uma tela que vai falhar.
export function ExigePerfil({ perfil, children }: { perfil: TipoUsuario; children: React.ReactNode }) {
  const { usuario, pronto } = useSessao();

  if (!pronto) return null;

  if (!usuario) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="font-display text-2xl font-bold">Entre para ver esta página</p>
        <Link href="/login" className={`${botaoClasse()} mt-6`}>
          Entrar
        </Link>
      </div>
    );
  }

  if (usuario.tipoUsuario !== perfil) {
    const conta = perfil === "EMPRESA" ? "empresa" : "estudante";
    return <p className="text-center text-apagado">Esta página é só para contas de {conta}.</p>;
  }

  return <>{children}</>;
}
