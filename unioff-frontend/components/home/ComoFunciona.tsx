import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Crie sua conta",
    desc: "Cadastre-se com seu e-mail institucional ou pessoal. É rápido e totalmente gratuito.",
    icon: "👤",
  },
  {
    n: "02",
    title: "Explore benefícios",
    desc: "Navegue por categorias e encontre descontos de empresas parceiras próximas a você.",
    icon: "🔍",
  },
  {
    n: "03",
    title: "Resgate seu cupom",
    desc: "Com um clique, gere seu código exclusivo e mostre na empresa para garantir o desconto.",
    icon: "🎟️",
  },
];

export default function ComoFunciona() {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Como funciona
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Em 3 passos simples você acessa benefícios exclusivos para estudantes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.n} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent -translate-y-1/2 z-0" />
              )}

              <div className="relative bg-white rounded-2xl p-7 border border-slate-100 shadow-sm text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm mb-4">
                  {step.n}
                </div>

                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-base"
          >
            Quero começar →
          </Link>
        </div>
      </div>
    </section>
  );
}
