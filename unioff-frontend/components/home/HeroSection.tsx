import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-indigo-200 text-sm font-medium px-4 py-2 rounded-full border border-white/20 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Plataforma de benefícios estudantis
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl mx-auto">
          Benefícios exclusivos{" "}
          <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            para estudantes
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed">
          Conectamos você a descontos e vantagens de empresas parceiras. Tudo em
          um só lugar, gratuito e feito para a vida universitária.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/cadastro"
            className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-base"
          >
            Começar gratuitamente
          </Link>
          <Link
            href="/beneficios"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 transition-colors text-base"
          >
            Ver benefícios →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: "500+", label: "Estudantes" },
            { value: "50+", label: "Empresas" },
            { value: "200+", label: "Benefícios" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-indigo-300 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60H1440V0C1440 0 1200 60 720 60C240 60 0 0 0 0V60Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
