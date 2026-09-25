"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { CupomConsultaDTO } from "@/lib/types";
import { resgatesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

type FilterStatus = "todos" | "PENDENTE" | "USADO" | "EXPIRADO";

export default function EstudanteResgatesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cupons, setCupons] = useState<CupomConsultaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("todos");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    if (user?.tipo !== "ESTUDANTE") { router.push("/"); return; }

    resgatesApi
      .listarMe()
      .then((res) => setCupons(res))
      .catch(() => setCupons([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router, authLoading]);

  const filtered = filter === "todos" ? cupons : cupons.filter((c) => c.status === filter);

  const statusLabel: Record<string, string> = { PENDENTE: "Pendente", USADO: "Utilizado", EXPIRADO: "Expirado" };
  const statusColor: Record<string, string> = {
    PENDENTE: "bg-amber-100 text-amber-700",
    USADO: "bg-green-100 text-green-700",
    EXPIRADO: "bg-slate-100 text-slate-500",
  };
  const statusIcon: Record<string, string> = { PENDENTE: "🎟️", USADO: "✅", EXPIRADO: "⏰" };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/estudante/me" className="text-slate-400 hover:text-indigo-600 transition-colors">← Voltar</Link>
            <h1 className="text-2xl font-bold text-slate-900">Meus Resgates</h1>
          </div>

          {/* Filter */}
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 mb-6 gap-1 w-fit flex-wrap">
            {(["todos", "PENDENTE", "USADO", "EXPIRADO"] as FilterStatus[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                  filter === f ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700",
                ].join(" ")}
              >
                {f === "todos" ? "Todos" : statusLabel[f]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎟️</div>
              <p className="font-medium text-slate-600">Nenhum resgate encontrado</p>
              <Link href="/beneficios" className="inline-flex mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
                Explorar benefícios
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-xl">
                    {statusIcon[c.status]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{c.beneficioTitulo || "Benefício"}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {c.empresaNome} · {new Date(c.dataGeracao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono text-sm font-bold text-indigo-700 tracking-wider">{c.codigo}</p>
                    <span className={["text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block", statusColor[c.status]].join(" ")}>
                      {statusLabel[c.status]}
                    </span>
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
