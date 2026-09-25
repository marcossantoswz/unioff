"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import type { TipoUsuario } from "@/lib/types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ email, senha });
      const { accessToken, usuario } = res;
      login(accessToken, {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipoUsuario as TipoUsuario,
      });
      if (usuario.tipoUsuario === "EMPRESA") router.push("/empresa/me");
      else router.push("/estudante/me");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 pt-20 min-h-screen">
        <div className="w-full max-w-md px-4 py-12">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Entrar no Unioff</h1>
              <p className="text-slate-500 text-sm mt-1">Acesse seus benefícios estudantis</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Não tem conta?{" "}
              <Link href="/cadastro" className="text-indigo-600 font-medium hover:underline">
                Cadastrar-se
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
