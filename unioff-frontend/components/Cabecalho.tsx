"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSessao } from "@/lib/auth";

const linksPorPerfil = {
  ESTUDANTE: [
    { href: "/", texto: "Benefícios" },
    { href: "/meus-cupons", texto: "Meus cupons" },
  ],
  EMPRESA: [
    { href: "/", texto: "Benefícios" },
    { href: "/painel", texto: "Painel" },
  ],
  ADMIN: [{ href: "/", texto: "Benefícios" }],
} as const;

export function Cabecalho() {
  const { usuario, pronto, sair } = useSessao();
  const caminho = usePathname();
  const router = useRouter();
  const links = usuario ? linksPorPerfil[usuario.tipoUsuario] : linksPorPerfil.ADMIN;

  function aoSair() {
    sair();
    router.push("/");
  }

  return (
    <header className="border-b border-linha bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
          uni<span className="text-carimbo">off</span>
        </Link>

        <nav className="flex flex-1 gap-4 text-sm font-semibold">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={caminho === link.href ? "page" : undefined}
              className="text-apagado hover:text-tinta aria-[current=page]:text-tinta aria-[current=page]:underline aria-[current=page]:decoration-marca aria-[current=page]:decoration-4 aria-[current=page]:underline-offset-8"
            >
              {link.texto}
            </Link>
          ))}
        </nav>

        {pronto && (
          <div className="flex items-center gap-3 text-sm">
            {usuario ? (
              <>
                <span className="hidden text-apagado sm:inline">{usuario.nome}</span>
                <button onClick={aoSair} className="font-semibold text-carimbo hover:underline">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="font-semibold hover:underline">
                  Entrar
                </Link>
                <Link href="/cadastro" className="rounded-md bg-tinta px-3 py-1.5 font-semibold text-white">
                  Criar conta
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
