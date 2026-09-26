"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Aviso, Botao, Campo } from "@/components/ui";
import { useSessao } from "@/lib/auth";

export default function LoginPage() {
  const { entrar } = useSessao();
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    setErro("");
    setEnviando(true);
    try {
      const usuario = await entrar(String(dados.get("email")), String(dados.get("senha")));
      router.push(usuario.tipoUsuario === "EMPRESA" ? "/empresa/me" : "/beneficios");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível entrar.");
      setEnviando(false);
    }
  }

  return (
    <section className="mx-auto max-w-sm">
      <h1 className="font-display text-3xl font-bold">Entrar</h1>
      <p className="mt-2 text-apagado">Use o e-mail e a senha da sua conta de estudante ou de empresa.</p>

      <form onSubmit={aoEnviar} className="mt-8 flex flex-col gap-4">
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        <Campo rotulo="E-mail" name="email" type="email" autoComplete="email" required />
        <Campo rotulo="Senha" name="senha" type="password" autoComplete="current-password" required />
        <Botao type="submit" disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </Botao>
      </form>

      <p className="mt-6 text-sm text-apagado">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-aqua hover:underline">
          Criar conta
        </Link>
      </p>
    </section>
  );
}
