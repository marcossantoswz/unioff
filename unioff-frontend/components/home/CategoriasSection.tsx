import Link from "next/link";

const categories = [
  {
    id: "ALIMENTACAO",
    label: "Alimentação",
    emoji: "🍕",
    color: "from-orange-400 to-red-400",
    bg: "bg-orange-50",
    border: "border-orange-100",
    text: "text-orange-700",
  },
  {
    id: "EDUCACAO",
    label: "Educação",
    emoji: "📚",
    color: "from-blue-400 to-indigo-400",
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-700",
  },
  {
    id: "SAUDE",
    label: "Saúde",
    emoji: "💊",
    color: "from-green-400 to-emerald-400",
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-700",
  },
  {
    id: "TECNOLOGIA",
    label: "Tecnologia",
    emoji: "💻",
    color: "from-purple-400 to-violet-400",
    bg: "bg-purple-50",
    border: "border-purple-100",
    text: "text-purple-700",
  },
  {
    id: "LAZER",
    label: "Lazer",
    emoji: "🎮",
    color: "from-pink-400 to-rose-400",
    bg: "bg-pink-50",
    border: "border-pink-100",
    text: "text-pink-700",
  },
  {
    id: "TRANSPORTE",
    label: "Transporte",
    emoji: "🚌",
    color: "from-sky-400 to-cyan-400",
    bg: "bg-sky-50",
    border: "border-sky-100",
    text: "text-sky-700",
  },
  {
    id: "VESTUARIO",
    label: "Vestuário",
    emoji: "👕",
    color: "from-yellow-400 to-amber-400",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    text: "text-yellow-700",
  },
  {
    id: "OUTROS",
    label: "Outros",
    emoji: "🎁",
    color: "from-slate-400 to-gray-400",
    bg: "bg-slate-50",
    border: "border-slate-100",
    text: "text-slate-700",
  },
];

export default function CategoriasSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Explore por categoria
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Encontre benefícios em diversas categorias pensadas para a vida
            estudantil
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/beneficios?categoria=${cat.id}`}
              className={[
                "group flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                cat.bg,
                cat.border,
              ].join(" ")}
            >
              <div
                className={[
                  "w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br shadow-sm",
                  cat.color,
                ].join(" ")}
              >
                {cat.emoji}
              </div>
              <span
                className={[
                  "text-sm font-semibold transition-colors",
                  cat.text,
                ].join(" ")}
              >
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
