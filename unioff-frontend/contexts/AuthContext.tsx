"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { AuthUser, TipoUsuario } from "@/lib/types";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("unioff_token");
      const storedUser = localStorage.getItem("unioff_user");
      if (storedToken && storedUser) {
        const parsed = JSON.parse(storedUser) as AuthUser;
        if (parsed?.id && parsed?.nome && parsed?.tipo) {
          setToken(storedToken);
          setUser(parsed);
        } else {
          localStorage.removeItem("unioff_token");
          localStorage.removeItem("unioff_user");
        }
      }
    } catch {
      localStorage.removeItem("unioff_token");
      localStorage.removeItem("unioff_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem("unioff_token", newToken);
    localStorage.setItem("unioff_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("unioff_token");
    localStorage.removeItem("unioff_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
