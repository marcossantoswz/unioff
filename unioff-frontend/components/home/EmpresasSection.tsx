"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmpresaCard from "@/components/EmpresaCard";
import type { EmpresaListItem, PagedResponse } from "@/lib/types";
import { empresasApi } from "@/lib/api";

export default function EmpresasSection() {
  const [empresas, setEmpresas] = useState<EmpresaListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    empresasApi
      .listar({ size: 8, page: 0 })
      .then((res) => {
        const data = res as PagedResponse<EmpresaListItem>;
        setEmpresas(data.content || (Array.isArray(res) ? res as EmpresaListItem[] : []));
      })
      .catch(() => setEmpresas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Empresas parceiras
            </h2>
            <p className="text-slate-500">
              Negócios que acreditam no potencial estudantil
            </p>
          </div>
          <Link
            href="/empresas"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : empresas.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-4">🏢</div>
            <p className="font-medium">Nenhuma empresa parceira ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {empresas.map((e) => (
              <EmpresaCard key={e.id} empresa={e} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/empresas"
            className="inline-flex items-center gap-2 px-6 py-3 border border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
          >
            Ver todas as empresas →
          </Link>
        </div>
      </div>
    </section>
  );
}
