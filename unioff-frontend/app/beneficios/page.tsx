"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BeneficioCard from "@/components/BeneficioCard";
import type { Beneficio, PagedResponse } from "@/lib/types";
import { beneficiosApi } from "@/lib/api";

const categorias = [
  { id: "", label: "Todas" },
  { id: "ALIMENTACAO", label: "Alimentação" },
  { id: "EDUCACAO", label: "Educação" },
  { id: "SAUDE", label: "Saúde" },
  { id: "TRANSPORTE", label: "Transporte" },
  { id: "LAZER", label: "Lazer" },
  { id: "TECNOLOGIA", label: "Tecnologia" },
  { id: "VESTUARIO", label: "Vestuário" },
  { id: "OUTROS", label: "Outros" },
];

function BeneficiosContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("categoria") || "";

  const [categoria, setCategoria] = useState(initialCat);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    beneficiosApi
      .listar({ categoria: categoria || undefined, page, size: 12 })
      .then((res) => {
        const data = res as PagedResponse<Beneficio>;
        setBeneficios(data.content || []);
        setTotalPages(data.totalPages || 0);
      })
      .catch(() => setBeneficios([]))
      .finally(() => setLoading(false));
  }, [categoria, page]);

  const handleCatChange = (cat: string) => {
    setCategoria(cat);
    setPage(0);
  };

  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCatChange(cat.id)}
            className={[
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              categoria === cat.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600",
            ].join(" ")}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-52 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : beneficios.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium text-lg">Nenhum benefício encontrado</p>
          <p className="text-sm mt-1">Tente outra categoria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {beneficios.map((b) => (
            <BeneficioCard key={b.id} beneficio={b} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            ← Anterior
          </button>
          <span className="px-4 py-2 text-sm text-slate-500">
            {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            Próximo →
          </button>
        </div>
      )}
    </div>
  );
}

export default function BeneficiosPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Benefícios</h1>
            <p className="text-slate-500">
              Explore todos os benefícios disponíveis para estudantes
            </p>
          </div>
          <Suspense fallback={<div>Carregando...</div>}>
            <BeneficiosContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
