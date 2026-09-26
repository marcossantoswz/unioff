const TOKEN_KEY = "unioff.token";
export const LOGOUT_EVENT = "unioff:logout";
const BACKEND_FORA = "Sem resposta do backend. Confira se ele está rodando na porta 8080.";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // armazenamento indisponível: a sessão dura só enquanto a aba estiver aberta
  }
}

function mensagemPadrao(status: number): string {
  if (status === 401) return "Sua sessão expirou. Entre de novo para continuar.";
  if (status === 403) return "Sua conta não tem permissão para fazer isso.";
  if (status === 404) return "Não encontramos o que você procurou.";
  return "O servidor não conseguiu concluir a operação. Tente de novo.";
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`/api${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, BACKEND_FORA);
  }

  if (!res.ok) {
    if (res.status === 401 && token) {
      setToken(null);
      window.dispatchEvent(new Event(LOGOUT_EVENT));
    }
    let mensagem = mensagemPadrao(res.status);
    try {
      const corpo = await res.json();
      if (corpo?.message) mensagem = corpo.message;
    } catch {
      // 500 sem JSON vem do proxy do Next quando o backend está fora do ar
      if (res.status >= 500) mensagem = BACKEND_FORA;
    }
    throw new ApiError(res.status, mensagem);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
