"use client";

import { Abas } from "@/components/Abas";
import { ExigePerfil } from "@/components/ExigePerfil";

const abas = [
  { href: "/estudante/me", texto: "Minha conta" },
  { href: "/estudante/me/resgates", texto: "Meus resgates" },
];

export default function EstudanteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExigePerfil perfil="ESTUDANTE">
      <Abas rotulo="Área do estudante" abas={abas} />
      {children}
    </ExigePerfil>
  );
}
