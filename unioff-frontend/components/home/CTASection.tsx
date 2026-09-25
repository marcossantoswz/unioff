import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
          Você é uma empresa?
        </h2>
        <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
          Alcance milhares de estudantes e fortaleça sua marca. Ofereça
          benefícios exclusivos e acompanhe o impacto em tempo real.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/cadastro"
            className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-base w-full sm:w-auto"
          >
            Cadastrar minha empresa
          </Link>
          <Link
            href="/empresas"
            className="px-8 py-4 bg-white/10 text-white border border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-colors text-base w-full sm:w-auto"
          >
            Ver empresas parceiras
          </Link>
        </div>
      </div>
    </section>
  );
}
