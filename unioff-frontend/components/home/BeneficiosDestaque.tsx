"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BeneficioCard from "@/components/BeneficioCard";
import type { Beneficio, PagedResponse } from "@/lib/types";
import { beneficiosApi } from "@/lib/api";

export default function BeneficiosDestaque() {
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    beneficiosApi
      .listar({ size: 6, page: 0 })
      .then((res) => {
        const data = res as PagedResponse<Beneficio>;
        setBeneficios(data.content || []);
      })
      .catch(() => setBeneficios([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Benefícios em destaque
            </h2>
            <p className="text-slate-500">
              Aproveite os melhores descontos disponíveis agora
            </p>
          </div>
          <Link
            href="/beneficios"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : beneficios.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-4">🎁</div>
            <p className="font-medium">Nenhum benefício disponível no momento.</p>
            <p className="text-sm mt-1">Em breve teremos novidades!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {beneficios.map((b) => (
              <BeneficioCard key={b.id} beneficio={b} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/beneficios"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Ver todos os benefícios →
          </Link>
        </div>
      </div>
    </section>
  );
}
