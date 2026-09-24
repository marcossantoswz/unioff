"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { auth } from "./api";
import { LOGOUT_EVENT, getToken, setToken } from "./http";
import type { UsuarioResumo } from "./types";

const USUARIO_KEY = "unioff.usuario";
const MUDOU_EVENT = "unioff:auth";

function lerUsuario(): string | null {
  try {
    return getToken() ? localStorage.getItem(USUARIO_KEY) : null;
  } catch {
    return null;
  }
}

function assinar(avisar: () => void) {
  window.addEventListener(MUDOU_EVENT, avisar);
  window.addEventListener(LOGOUT_EVENT, avisar);
  window.addEventListener("storage", avisar);
  return () => {
    window.removeEventListener(MUDOU_EVENT, avisar);
    window.removeEventListener(LOGOUT_EVENT, avisar);
    window.removeEventListener("storage", avisar);
  };
}

interface Sessao {
  usuario: UsuarioResumo | null;
  // false durante a renderização no servidor, antes de ler o localStorage
  pronto: boolean;
  entrar: (email: string, senha: string) => Promise<UsuarioResumo>;
  sair: () => void;
}

const SessaoContext = createContext<Sessao | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const bruto = useSyncExternalStore(assinar, lerUsuario, () => undefined);
  const pronto = bruto !== undefined;
  const usuario = useMemo<UsuarioResumo | null>(() => (bruto ? JSON.parse(bruto) : null), [bruto]);

  const entrar = useCallback(async (email: string, senha: string) => {
    const resposta = await auth.login(email, senha);
    setToken(resposta.accessToken);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(resposta.usuario));
    window.dispatchEvent(new Event(MUDOU_EVENT));
    return resposta.usuario;
  }, []);

  const sair = useCallback(() => {
    setToken(null);
    localStorage.removeItem(USUARIO_KEY);
    window.dispatchEvent(new Event(MUDOU_EVENT));
  }, []);

  return (
    <SessaoContext.Provider value={{ usuario, pronto, entrar, sair }}>
      {children}
    </SessaoContext.Provider>
  );
}

export function useSessao(): Sessao {
  const sessao = useContext(SessaoContext);
  if (!sessao) throw new Error("useSessao precisa estar dentro de <AuthProvider>");
  return sessao;
}
