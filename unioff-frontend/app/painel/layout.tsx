"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExigePerfil } from "@/components/ExigePerfil";

const abas = [
  { href: "/painel", texto: "Resumo" },
  { href: "/painel/validar", texto: "Validar cupom" },
  { href: "/painel/perfil", texto: "Dados do estabelecimento" },
];

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const caminho = usePathname();

  return (
    <ExigePerfil perfil="EMPRESA">
      <nav aria-label="Painel da empresa" className="mb-8 flex gap-1 overflow-x-auto border-b border-linha">
        {abas.map((aba) => (
          <Link
            key={aba.href}
            href={aba.href}
            aria-current={caminho === aba.href ? "page" : undefined}
            className="-mb-px whitespace-nowrap border-b-4 border-transparent px-3 py-2 font-semibold text-apagado hover:text-tinta aria-[current=page]:border-carimbo aria-[current=page]:text-tinta"
          >
            {aba.texto}
          </Link>
        ))}
      </nav>
      {children}
    </ExigePerfil>
  );
}
