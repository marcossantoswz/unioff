"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function EstudanteMePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user && user.tipo !== "ESTUDANTE") {
      router.push("/");
    }
  }, [isAuthenticated, user, router, loading]);

  // Aguarda auth inicializar
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-24 min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  // Sem usuário após carregar → redireciona (useEffect já cuida)
  if (!user) return null;

  const inicialNome = String(user.nome || "?").charAt(0).toUpperCase();
  const primeiroNome = String(user.nome || "").split(" ")[0] || "Estudante";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <span className="text-2xl font-bold">{inicialNome}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Olá, {primeiroNome}! 👋</h1>
                <p className="text-indigo-200 text-sm mt-1">Estudante</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Link
              href="/beneficios"
              className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition-colors">
                🎁
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Explorar benefícios</h3>
                <p className="text-sm text-slate-400">Encontre novos descontos</p>
              </div>
              <svg className="ml-auto w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/estudante/me/resgates"
              className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl group-hover:bg-purple-100 transition-colors">
                🎟️
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Meus resgates</h3>
                <p className="text-sm text-slate-400">Histórico de cupons</p>
              </div>
              <svg className="ml-auto w-5 h-5 text-slate-300 group-hover:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Info card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Informações da conta</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Nome</span>
                <span className="text-sm font-medium text-slate-900">{user.nome || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">ID</span>
                <span className="text-sm font-medium text-slate-900">#{user.id}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-500">Tipo</span>
                <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  Estudante
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
