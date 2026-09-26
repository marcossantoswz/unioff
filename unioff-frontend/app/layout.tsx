import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/figtree";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unioff",
  description: "Descontos para estudantes em estabelecimentos parceiros.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <Cabecalho />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
          <Rodape />
        </AuthProvider>
      </body>
    </html>
  );
}
