"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { resgatesApi } from "@/lib/api";
import type { ResgateResponseDTO } from "@/lib/types";

export default function EmpresaResgatesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cupom, setCupom] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResgateResponseDTO | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    if (user?.tipo !== "EMPRESA") router.push("/");
  }, [isAuthenticated, user, router, authLoading]);

  const handleValidar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cupom.trim()) return;
    setError("");
    setResultado(null);
    setLoading(true);
    try {
      const res = await resgatesApi.validarCupom(cupom.toUpperCase().trim());
      setResultado(res);
      setCupom("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Cupom inválido ou já utilizado.");
    } finally {
      setLoading(false);
    }
  };

  const statusLabel: Record<string, string> = { PENDENTE: "Pendente", USADO: "Validado ✓", EXPIRADO: "Expirado" };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-8">
            <Link href="/empresa/me" className="text-sm text-slate-400 hover:text-indigo-600 mb-1 block">← Painel</Link>
            <h1 className="text-2xl font-bold text-slate-900">Validar Cupom</h1>
            <p className="text-slate-500 text-sm mt-1">Digite o código do cupom apresentado pelo estudante</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <form onSubmit={handleValidar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Código do cupom</label>
                <input
                  type="text"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value.toUpperCase())}
                  placeholder="Digite o código..."
                  className="w-full px-4 py-4 rounded-xl border border-slate-200 text-lg font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading || !cupom.trim()}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? "Validando..." : "Validar Cupom"}
              </button>
            </form>

            {resultado && (
              <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">✅</span>
                  <h3 className="font-semibold text-green-800">Cupom validado com sucesso!</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Código</span>
                    <span className="font-mono font-bold text-green-800">{resultado.codigo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Status</span>
                    <span className="font-medium text-green-800">{statusLabel[resultado.status]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Gerado em</span>
                    <span className="font-medium text-green-800">
                      {new Date(resultado.dataGeracao).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
            💡 Após validar, o cupom é marcado como utilizado e não pode ser usado novamente.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
