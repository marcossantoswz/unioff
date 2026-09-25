import Link from "next/link";

const campoBase =
  "w-full rounded-md border border-linha bg-white px-3 py-2.5 text-base text-tinta " +
  "placeholder:text-apagado/70 focus:border-carimbo focus:outline-none focus:ring-2 focus:ring-carimbo/25";

interface CampoProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
  dica?: string;
}

export function Campo({ rotulo, dica, id, className, ...props }: CampoProps) {
  const campoId = id ?? props.name;
  return (
    <label htmlFor={campoId} className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-sm font-semibold">{rotulo}</span>
      <input id={campoId} className={campoBase} {...props} />
      {dica && <span className="text-sm text-apagado">{dica}</span>}
    </label>
  );
}

interface AreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rotulo: string;
}

export function AreaTexto({ rotulo, id, ...props }: AreaProps) {
  const campoId = id ?? props.name;
  return (
    <label htmlFor={campoId} className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{rotulo}</span>
      <textarea id={campoId} rows={4} className={campoBase} {...props} />
    </label>
  );
}

type Variante = "primario" | "secundario" | "perigo";

const variantes: Record<Variante, string> = {
  primario: "bg-carimbo text-white hover:bg-carimbo-escuro",
  secundario: "border border-tinta/25 bg-white text-tinta hover:border-tinta",
  perigo: "border border-erro/40 bg-white text-erro hover:bg-erro hover:text-white",
};

export function botaoClasse(variante: Variante = "primario") {
  return (
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 font-semibold " +
    "transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
    variantes[variante]
  );
}

interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

export function Botao({ variante, className, ...props }: BotaoProps) {
  return <button className={`${botaoClasse(variante)} ${className ?? ""}`} {...props} />;
}

export function Aviso({ tipo, children }: { tipo: "erro" | "ok"; children: React.ReactNode }) {
  const cor = tipo === "erro" ? "border-erro bg-erro/5 text-erro" : "border-ok bg-ok/5 text-ok";
  return (
    <p role={tipo === "erro" ? "alert" : "status"} className={`border-l-4 px-4 py-3 ${cor}`}>
      {children}
    </p>
  );
}

export function Vazio({ titulo, children, acao }: { titulo: string; children?: React.ReactNode; acao?: { href: string; texto: string } }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-linha px-6 py-10 text-center">
      <p className="font-display text-xl font-semibold">{titulo}</p>
      {children && <p className="mt-2 text-apagado">{children}</p>}
      {acao && (
        <Link href={acao.href} className={`${botaoClasse()} mt-5`}>
          {acao.texto}
        </Link>
      )}
    </div>
  );
}
