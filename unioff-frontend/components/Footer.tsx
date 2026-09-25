import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="font-bold text-xl text-white">Unioff</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Conectamos estudantes a benefícios exclusivos de empresas
              parceiras, tornando a vida universitária mais acessível.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Plataforma
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/beneficios" className="hover:text-indigo-400 transition-colors">
                  Benefícios
                </Link>
              </li>
              <li>
                <Link href="/empresas" className="hover:text-indigo-400 transition-colors">
                  Empresas
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-indigo-400 transition-colors">
                  Cadastrar
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-400 transition-colors">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Para empresas */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Para Empresas
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cadastro" className="hover:text-indigo-400 transition-colors">
                  Seja parceira
                </Link>
              </li>
              <li>
                <Link href="/empresa/me/beneficios/novo" className="hover:text-indigo-400 transition-colors">
                  Criar benefício
                </Link>
              </li>
              <li>
                <Link href="/empresa/me/resgates" className="hover:text-indigo-400 transition-colors">
                  Validar cupons
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Unioff. Todos os direitos reservados.
          </p>
          <p className="text-xs text-slate-500">
            Feito com ❤️ para estudantes
          </p>
        </div>
      </div>
    </footer>
  );
}
