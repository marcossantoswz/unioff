"use client";

import { Abas } from "@/components/Abas";
import { ExigePerfil } from "@/components/ExigePerfil";

const abas = [
  { href: "/empresa/me", texto: "Minha empresa" },
  { href: "/empresa/me/beneficios", texto: "Benefícios" },
  { href: "/empresa/me/resgates", texto: "Validar cupons" },
];

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExigePerfil perfil="EMPRESA">
      <Abas rotulo="Área da empresa" abas={abas} />
      {children}
    </ExigePerfil>
  );
}
