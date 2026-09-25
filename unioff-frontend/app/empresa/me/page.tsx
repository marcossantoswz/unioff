"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { empresasApi } from "@/lib/api";
import type { MetricasEmpresaDTO, BeneficioResponseDTO, PagedResponse } from "@/lib/types";

export default function EmpresaMePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [metricas, setMetricas] = useState<MetricasEmpresaDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    if (user?.tipo !== "EMPRESA") { router.push("/"); return; }
    empresasApi.metricas()
      .then((res) => setMetricas(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router, authLoading]);

  if (authLoading || !user) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-24 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white mb-8">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold">🏢</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{metricas?.nomeFantasia || user.nome}</h1>
                <p className="text-indigo-200 text-sm mt-1">Painel da Empresa</p>
              </div>
            </div>
          </div>

          {/* Métricas */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : metricas && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Benefícios", value: metricas.totalBeneficios, icon: "🎁" },
                { label: "Ativos", value: metricas.totalBeneficiosAtivos, icon: "✅" },
                { label: "Resgates", value: metricas.totalResgates, icon: "🎟️" },
                { label: "Cupons usados", value: metricas.totalCuponsUtilizados, icon: "📊" },
              ].map((m) => (
                <div key={m.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                  <div className="text-2xl mb-2">{m.icon}</div>
                  <div className="text-2xl font-bold text-slate-900">{m.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/empresa/me/beneficios", icon: "🎁", title: "Gerenciar Benefícios", desc: "Criar e editar benefícios" },
              { href: "/empresa/me/beneficios/novo", icon: "➕", title: "Novo Benefício", desc: "Adicionar oferta para estudantes" },
              { href: "/empresa/me/resgates", icon: "🎟️", title: "Validar Cupons", desc: "Verificar e validar resgates" },
            ].map((a) => (
              <Link
                key={a.href} href={a.href}
                className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition-colors">
                  {a.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{a.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                </div>
                <svg className="ml-auto w-4 h-4 text-slate-300 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
