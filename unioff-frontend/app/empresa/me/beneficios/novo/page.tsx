"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { beneficiosApi } from "@/lib/api";

export default function NovoBeneficioPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [quantidadeMax, setQuantidadeMax] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    if (user?.tipo !== "EMPRESA") router.push("/");
  }, [isAuthenticated, user, router, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataInicio || !dataFim || !quantidadeMax) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await beneficiosApi.criar({
        titulo,
        descricao,
        dataInicio,
        dataFim,
        quantidadeMaxResgastes: Number(quantidadeMax),
      });
      setSuccess(true);
      setTimeout(() => router.push("/empresa/me/beneficios"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar benefício.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-8">
            <Link href="/empresa/me/beneficios" className="text-sm text-slate-400 hover:text-indigo-600 mb-1 block">← Benefícios</Link>
            <h1 className="text-2xl font-bold text-slate-900">Novo Benefício</h1>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            {success ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🎉</div>
                <p className="text-lg font-semibold text-slate-900">Benefício criado com sucesso!</p>
                <p className="text-slate-400 text-sm mt-1">Redirecionando...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Título *</label>
                    <input
                      type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
                      required placeholder="Ex: 20% de desconto em pizzas"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição *</label>
                    <textarea
                      value={descricao} onChange={(e) => setDescricao(e.target.value)}
                      required placeholder="Descreva o benefício em detalhes..." rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Data início *</label>
                      <input
                        type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Data fim *</label>
                      <input
                        type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantidade máxima de resgates *</label>
                    <input
                      type="number" value={quantidadeMax} onChange={(e) => setQuantidadeMax(e.target.value)}
                      required min={1} placeholder="Ex: 100"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link href="/empresa/me/beneficios" className="flex-1 py-3 text-center border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 text-sm">
                      Cancelar
                    </Link>
                    <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl disabled:opacity-60 text-sm">
                      {loading ? "Criando..." : "Criar Benefício"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
