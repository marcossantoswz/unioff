"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BeneficioCard from "@/components/BeneficioCard";
import type { EmpresaDetalhesDTO } from "@/lib/types";
import { empresasApi } from "@/lib/api";
import Link from "next/link";

export default function EmpresaDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [empresa, setEmpresa] = useState<EmpresaDetalhesDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    empresasApi
      .buscarPorId(id)
      .then((res) => setEmpresa(res))
      .catch(() => setEmpresa(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="h-64 bg-slate-100 rounded-3xl animate-pulse mb-6" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!empresa) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <p className="text-5xl mb-4">😕</p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Empresa não encontrada</h2>
            <Link href="/empresas" className="text-indigo-600 hover:underline">← Voltar às empresas</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const nomeExibido = empresa.nomeFantasia || empresa.nome;
  const beneficios = empresa.beneficios || [];

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/empresas" className="hover:text-indigo-600">Empresas</Link>
            <span>/</span>
            <span className="text-slate-600">{nomeExibido}</span>
          </div>

          {/* Header */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-8">
            <div className="flex items-start gap-5 flex-wrap">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-indigo-600">
                  {(nomeExibido || "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{nomeExibido}</h1>
                {empresa.nome && empresa.nomeFantasia && (
                  <p className="text-sm text-slate-400 mb-2">{empresa.nome}</p>
                )}
                {empresa.descricao && (
                  <p className="text-slate-500 text-sm leading-relaxed">{empresa.descricao}</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-6 text-sm text-slate-500">
              {empresa.cidade && <span>📍 {empresa.cidade}{empresa.bairro ? `, ${empresa.bairro}` : ""}</span>}
              {empresa.telephoneWhatsapp && <span>📱 {empresa.telephoneWhatsapp}</span>}
              {empresa.site && (
                <a href={empresa.site} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  🌐 Site
                </a>
              )}
              <span>🎁 {beneficios.length} benefício{beneficios.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Benefícios disponíveis</h2>
            {beneficios.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-3">🎁</div>
                <p>Nenhum benefício disponível no momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {beneficios.map((b) => (
                  <BeneficioCard key={b.id} beneficio={b} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
