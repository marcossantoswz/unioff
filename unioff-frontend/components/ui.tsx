import Link from "next/link";

const campoBase =
  "w-full rounded border border-borda bg-fundo-duro px-3 py-2.5 text-base text-texto " +
  "placeholder:text-apagado/70 focus:border-amarelo focus:outline-none";

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
  primario: "bg-amarelo text-sobre-destaque hover:brightness-110",
  secundario: "border border-borda text-texto hover:border-apagado hover:bg-superficie",
  perigo: "border border-vermelho/60 text-vermelho hover:bg-vermelho hover:text-sobre-destaque",
};

export function botaoClasse(variante: Variante = "primario") {
  return (
    "inline-flex items-center justify-center gap-2 rounded px-4 py-2.5 font-semibold " +
    "transition disabled:cursor-not-allowed disabled:opacity-50 " +
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
  const cor = tipo === "erro" ? "border-vermelho text-vermelho" : "border-verde text-verde";
  return (
    <p role={tipo === "erro" ? "alert" : "status"} className={`border-l-4 bg-superficie px-4 py-3 ${cor}`}>
      {children}
    </p>
  );
}

interface VazioProps {
  titulo: string;
  children?: React.ReactNode;
  acao?: { href: string; texto: string };
}

export function Vazio({ titulo, children, acao }: VazioProps) {
  return (
    <div className="rounded border-2 border-dashed border-borda px-6 py-10 text-center">
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

export function Carregando({ texto }: { texto: string }) {
  return <p className="font-mono text-sm text-apagado">{texto}</p>;
}

export function LinkTexto({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-aqua hover:underline">
      {children}
    </Link>
  );
}
