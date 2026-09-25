"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { BeneficioResponseDTO } from "@/lib/types";
import { beneficiosApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function BeneficioDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [beneficio, setBeneficio] = useState<BeneficioResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [resgatando, setResgatando] = useState(false);
  const [cupom, setCupom] = useState<string | null>(null);
  const [erroResgate, setErroResgate] = useState("");
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    beneficiosApi
      .buscarPorId(id)
      .then((res) => setBeneficio(res))
      .catch(() => setBeneficio(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleResgatar = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (user?.tipo !== "ESTUDANTE") {
      setErroResgate("Apenas estudantes podem resgatar benefícios.");
      return;
    }
    setResgatando(true);
    setErroResgate("");
    try {
      const res = await beneficiosApi.resgatar(id);
      setCupom(res.codigo);
    } catch (err: unknown) {
      setErroResgate(err instanceof Error ? err.message : "Erro ao resgatar.");
    } finally {
      setResgatando(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="h-80 bg-slate-100 rounded-3xl animate-pulse" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!beneficio) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">😕</p>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Benefício não encontrado</h2>
            <Link href="/beneficios" className="text-indigo-600 hover:underline">← Voltar aos benefícios</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/beneficios" className="hover:text-indigo-600">Benefícios</Link>
            <span>/</span>
            <span className="text-slate-600 line-clamp-1">{beneficio.titulo}</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600" />
            <div className="p-8">
              {/* Status badges */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {beneficio.esgotado && (
                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">Esgotado</span>
                )}
                {beneficio.ativo === false && (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">Inativo</span>
                )}
                {!beneficio.esgotado && beneficio.ativo !== false && (
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">Disponível</span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{beneficio.titulo}</h1>

              {/* Empresa */}
              <Link href={`/empresas/${beneficio.empresaId}`} className="flex items-center gap-2 mb-6 group">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-700 font-bold text-sm">
                    {(beneficio.nomeEmpresa || "?").charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">
                  {beneficio.nomeEmpresa}
                </span>
              </Link>

              {/* Descrição */}
              {beneficio.descricao && (
                <p className="text-slate-600 leading-relaxed mb-6">{beneficio.descricao}</p>
              )}

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {beneficio.dataInicio && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-1">Válido de</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {new Date(beneficio.dataInicio).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
                {beneficio.dataFim && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-1">Válido até</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {new Date(beneficio.dataFim).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
                {beneficio.quantidadeDisponivel !== undefined && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-1">Disponíveis</p>
                    <p className="text-sm font-semibold text-slate-700">{beneficio.quantidadeDisponivel}</p>
                  </div>
                )}
                {beneficio.quantidadeMaxResgastes !== undefined && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-1">Total de vagas</p>
                    <p className="text-sm font-semibold text-slate-700">{beneficio.quantidadeMaxResgastes}</p>
                  </div>
                )}
              </div>

              {/* Cupom */}
              {cupom ? (
                <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center">
                  <p className="text-sm text-indigo-600 font-medium mb-2">🎉 Seu cupom foi gerado!</p>
                  <p className="text-3xl font-bold text-indigo-700 tracking-widest font-mono">{cupom}</p>
                  <p className="text-xs text-slate-500 mt-3">Apresente este código na empresa para obter o benefício.</p>
                  <Link href="/estudante/me/resgates" className="inline-flex mt-3 text-sm text-indigo-600 hover:underline">
                    Ver meus resgates →
                  </Link>
                </div>
              ) : (
                <>
                  {erroResgate && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                      {erroResgate}
                    </div>
                  )}
                  <button
                    onClick={handleResgatar}
                    disabled={resgatando || !!beneficio.esgotado || beneficio.ativo === false}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  >
                    {resgatando ? "Resgatando..." : beneficio.esgotado ? "Benefício esgotado" : !isAuthenticated ? "Entrar para resgatar" : "Resgatar benefício"}
                  </button>
                  {!isAuthenticated && (
                    <p className="text-center text-xs text-slate-400 mt-2">
                      <Link href="/login" className="text-indigo-600 hover:underline">Login</Link>{" "}ou{" "}
                      <Link href="/cadastro" className="text-indigo-600 hover:underline">cadastre-se</Link> para resgatar.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
