"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Abas({ rotulo, abas }: { rotulo: string; abas: { href: string; texto: string }[] }) {
  const caminho = usePathname();

  return (
    <nav aria-label={rotulo} className="mb-8 flex gap-1 overflow-x-auto border-b border-borda">
      {abas.map((aba) => (
        <Link
          key={aba.href}
          href={aba.href}
          aria-current={caminho === aba.href ? "page" : undefined}
          className="-mb-px whitespace-nowrap border-b-2 border-transparent px-3 py-2 font-semibold text-apagado hover:text-texto aria-[current=page]:border-amarelo aria-[current=page]:text-amarelo"
        >
          {aba.texto}
        </Link>
      ))}
    </nav>
  );
}
