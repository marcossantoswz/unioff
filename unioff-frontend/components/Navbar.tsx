"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const dashboardLink =
    user?.tipo === "EMPRESA" ? "/empresa/me" : "/estudante/me";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">
              Unioff
            </span>
          </Link>

          {/* Nav links – desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/beneficios"
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors text-sm"
            >
              Benefícios
            </Link>
            <Link
              href="/empresas"
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors text-sm"
            >
              Empresas
            </Link>
            {isAuthenticated && (
              <Link
                href={dashboardLink}
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors text-sm"
              >
                Minha Conta
              </Link>
            )}
          </div>

          {/* Auth buttons – desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.nome?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.nome?.split(" ")[0]}
                  </span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1">
                    <Link
                      href={dashboardLink}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Minha Conta
                    </Link>
                    {user?.tipo === "ESTUDANTE" && (
                      <Link
                        href="/estudante/me/resgates"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Meus Resgates
                      </Link>
                    )}
                    {user?.tipo === "EMPRESA" && (
                      <>
                        <Link
                          href="/empresa/me/beneficios"
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Meus Benefícios
                        </Link>
                        <Link
                          href="/empresa/me/resgates"
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Resgates
                        </Link>
                      </>
                    )}
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1">
          <Link href="/beneficios" className="block py-2 text-slate-700 font-medium hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
            Benefícios
          </Link>
          <Link href="/empresas" className="block py-2 text-slate-700 font-medium hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
            Empresas
          </Link>
          {isAuthenticated ? (
            <>
              <Link href={dashboardLink} className="block py-2 text-slate-700 font-medium hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                Minha Conta
              </Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600 font-medium">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-slate-700 font-medium hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                Entrar
              </Link>
              <Link href="/cadastro" className="block py-2 mt-1 text-center text-white bg-indigo-600 rounded-lg font-medium" onClick={() => setMenuOpen(false)}>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
