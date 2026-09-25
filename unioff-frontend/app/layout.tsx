import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/figtree";
import { Cabecalho } from "@/components/Cabecalho";
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
        </AuthProvider>
      </body>
    </html>
  );
}
