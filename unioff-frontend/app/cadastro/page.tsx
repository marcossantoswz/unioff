"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import type { TipoUsuario } from "@/lib/types";

type Tipo = "estudante" | "empresa";

export default function CadastroPage() {
  const [tipo, setTipo] = useState<Tipo>("estudante");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  // Estudante
  const [nomeEst, setNomeEst] = useState("");
  const [emailEst, setEmailEst] = useState("");
  const [senhaEst, setSenhaEst] = useState("");
  const [matricula, setMatricula] = useState("");
  const [curso, setCurso] = useState("");
  const [instituicao, setInstituicao] = useState("");

  // Empresa
  const [nomeEmp, setNomeEmp] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [emailEmp, setEmailEmp] = useState("");
  const [senhaEmp, setSenhaEmp] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let token: string;
      let usuarioId: string;
      let usuarioNome: string;
      let usuarioEmail: string;
      let usuarioTipo: TipoUsuario;

      if (tipo === "estudante") {
        const res = await authApi.cadastrarEstudante({
          nome: nomeEst, email: emailEst, senha: senhaEst,
          matricula, curso, instituicao,
        }) as {
          usuarioId: string; nome: string; email: string; tipoUsuario: string;
          // O cadastro não retorna token, então fazemos login em seguida
        };
        // Cadastro de estudante não retorna token — fazer login
        const loginRes = await authApi.login({ email: emailEst, senha: senhaEst });
        token = loginRes.accessToken;
        usuarioId = loginRes.usuario.id;
        usuarioNome = loginRes.usuario.nome;
        usuarioEmail = loginRes.usuario.email;
        usuarioTipo = loginRes.usuario.tipoUsuario as TipoUsuario;
      } else {
        const res = await authApi.cadastrarEmpresa({
          nome: nomeEmp, email: emailEmp, senha: senhaEmp,
          nomeFantasia, descricao, cidade,
        }) as {
          usuarioId: string; nome: string; email: string; tipoUsuario: string;
        };
        // Fazer login após cadastro
        const loginRes = await authApi.login({ email: emailEmp, senha: senhaEmp });
        token = loginRes.accessToken;
        usuarioId = loginRes.usuario.id;
        usuarioNome = loginRes.usuario.nome;
        usuarioEmail = loginRes.usuario.email;
        usuarioTipo = loginRes.usuario.tipoUsuario as TipoUsuario;
      }

      login(token, { id: usuarioId, nome: usuarioNome, email: usuarioEmail, tipo: usuarioTipo });
      router.push(usuarioTipo === "EMPRESA" ? "/empresa/me" : "/estudante/me");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 pt-20 min-h-screen">
        <div className="w-full max-w-lg px-4 py-12">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Criar conta</h1>
              <p className="text-slate-500 text-sm mt-1">Junte-se ao Unioff gratuitamente</p>
            </div>

            {/* Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
              {(["estudante", "empresa"] as Tipo[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className={[
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                    tipo === t ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700",
                  ].join(" ")}
                >
                  {t === "estudante" ? "👤 Estudante" : "🏢 Empresa"}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {tipo === "estudante" ? (
                <>
                  <Field label="Nome completo" value={nomeEst} onChange={setNomeEst} placeholder="Seu nome" required />
                  <Field label="E-mail" value={emailEst} onChange={setEmailEst} placeholder="seu@email.com" type="email" required />
                  <Field label="Senha" value={senhaEst} onChange={setSenhaEst} placeholder="Mínimo 6 caracteres" type="password" required />
                  <Field label="Matrícula" value={matricula} onChange={setMatricula} placeholder="Ex: 2024001234" />
                  <Field label="Curso" value={curso} onChange={setCurso} placeholder="Ex: Engenharia de Computação" />
                  <Field label="Instituição" value={instituicao} onChange={setInstituicao} placeholder="Ex: UFRN" />
                </>
              ) : (
                <>
                  <Field label="Razão social" value={nomeEmp} onChange={setNomeEmp} placeholder="Nome legal da empresa" required />
                  <Field label="Nome fantasia" value={nomeFantasia} onChange={setNomeFantasia} placeholder="Nome exibido ao público" required />
                  <Field label="E-mail corporativo" value={emailEmp} onChange={setEmailEmp} placeholder="contato@empresa.com" type="email" required />
                  <Field label="Senha" value={senhaEmp} onChange={setSenhaEmp} placeholder="Mínimo 6 caracteres" type="password" required />
                  <Field label="Cidade" value={cidade} onChange={setCidade} placeholder="Ex: Natal" />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
                    <textarea
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Fale sobre sua empresa..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? "Cadastrando..." : "Criar conta"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Já tem conta?{" "}
              <Link href="/login" className="text-indigo-600 font-medium hover:underline">Entrar</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
