"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSessao } from "@/lib/auth";

const publicos = [
  { href: "/beneficios", texto: "Benefícios" },
  { href: "/empresas", texto: "Empresas" },
];

const porPerfil = {
  ESTUDANTE: [{ href: "/estudante/me", texto: "Minha conta" }],
  EMPRESA: [{ href: "/empresa/me", texto: "Minha empresa" }],
  ADMIN: [],
};

export function Cabecalho() {
  const { usuario, pronto, sair } = useSessao();
  const caminho = usePathname();
  const router = useRouter();
  const links = [...publicos, ...(usuario ? porPerfil[usuario.tipoUsuario] : [])];

  function aoSair() {
    sair();
    router.push("/");
  }

  return (
    <header className="border-b border-borda bg-fundo-duro">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
          uni<span className="text-amarelo">off</span>
        </Link>

        <nav className="flex flex-1 gap-4 text-sm font-semibold">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={caminho.startsWith(link.href) ? "page" : undefined}
              className="text-apagado hover:text-texto aria-[current=page]:text-amarelo"
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
                <button onClick={aoSair} className="font-semibold text-aqua hover:underline">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="font-semibold hover:text-amarelo">
                  Entrar
                </Link>
                <Link href="/cadastro" className="rounded bg-amarelo px-3 py-1.5 font-semibold text-sobre-destaque">
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
