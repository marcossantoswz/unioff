"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { empresasApi, beneficiosApi } from "@/lib/api";
import type { BeneficioResponseDTO, PagedResponse } from "@/lib/types";

export default function EmpresaBeneficiosPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [beneficios, setBeneficios] = useState<BeneficioResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    if (user?.tipo !== "EMPRESA") { router.push("/"); return; }
    fetchBeneficios();
  }, [isAuthenticated, user, router, authLoading]);

  const fetchBeneficios = () => {
    setLoading(true);
    empresasApi
      .listarMeusBeneficios()
      .then((res) => setBeneficios(res.content || []))
      .catch(() => setBeneficios([]))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este benefício?")) return;
    setDeletingId(id);
    try {
      await beneficiosApi.deletar(id);
      setBeneficios((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Erro ao excluir o benefício.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/empresa/me" className="text-sm text-slate-400 hover:text-indigo-600 mb-1 block">← Painel</Link>
              <h1 className="text-2xl font-bold text-slate-900">Meus Benefícios</h1>
            </div>
            <Link
              href="/empresa/me/beneficios/novo"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors"
            >
              + Novo Benefício
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : beneficios.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎁</div>
              <p className="font-medium text-slate-600 mb-2">Nenhum benefício cadastrado</p>
              <Link href="/empresa/me/beneficios/novo" className="inline-flex px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
                Criar primeiro benefício
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {beneficios.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-sm">{b.titulo}</h3>
                      {b.esgotado && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Esgotado</span>}
                      {b.ativo === false && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Inativo</span>}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex gap-3 flex-wrap">
                      {b.quantidadeDisponivel !== undefined && <span>{b.quantidadeDisponivel} disponíveis</span>}
                      {b.dataFim && <span>Até {new Date(b.dataFim).toLocaleDateString("pt-BR")}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/beneficios/${b.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                      Ver
                    </Link>
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deletingId === b.id}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deletingId === b.id ? "..." : "Excluir"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
