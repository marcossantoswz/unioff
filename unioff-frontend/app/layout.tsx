import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unioff – Benefícios Estudantis",
  description:
    "Plataforma de benefícios estudantis que conecta estudantes a empresas parceiras.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
