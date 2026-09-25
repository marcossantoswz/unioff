"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmpresaCard from "@/components/EmpresaCard";
import type { EmpresaListItem, PagedResponse } from "@/lib/types";
import { empresasApi } from "@/lib/api";

function EmpresasContent() {
  const searchParams = useSearchParams();
  const [segmento, setSegmento] = useState(searchParams.get("segmento") || "");
  const [empresas, setEmpresas] = useState<EmpresaListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    empresasApi
      .listar({ segmento: segmento || undefined, page, size: 12 })
      .then((res) => {
        const data = res as PagedResponse<EmpresaListItem>;
        if (data.content) {
          setEmpresas(data.content);
          setTotalPages(data.totalPages || 0);
        } else if (Array.isArray(res)) {
          setEmpresas(res as EmpresaListItem[]);
        }
      })
      .catch(() => setEmpresas([]))
      .finally(() => setLoading(false));
  }, [segmento, page]);

  const filtered = search
    ? empresas.filter((e) =>
        e.nomeFantasia.toLowerCase().includes(search.toLowerCase())
      )
    : empresas;

  return (
    <>
      {/* Search */}
      <div className="relative mb-8">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">🏢</div>
          <p className="font-medium text-lg">Nenhuma empresa encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((e) => (
            <EmpresaCard key={e.id} empresa={e} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:border-indigo-300"
          >
            ← Anterior
          </button>
          <span className="px-4 py-2 text-sm text-slate-500">
            {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:border-indigo-300"
          >
            Próximo →
          </button>
        </div>
      )}
    </>
  );
}

export default function EmpresasPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Empresas Parceiras</h1>
            <p className="text-slate-500">
              Conheça as empresas que oferecem benefícios para estudantes
            </p>
          </div>
          <Suspense fallback={<div>Carregando...</div>}>
            <EmpresasContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
