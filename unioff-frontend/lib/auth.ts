const TOKEN_KEY = "unioff_token";
const USUARIO_KEY = "unioff_usuario";

export type UsuarioResumo = {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: "ESTUDANTE" | "EMPRESA" | "ADMIN";
};

export function salvarSessao(token: string, usuario: UsuarioResumo) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsuario(): UsuarioResumo | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USUARIO_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
}
