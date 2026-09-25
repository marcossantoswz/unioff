"use client";

import Link from "next/link";
import { useState } from "react";
import { CupomCodigo } from "@/components/CupomCodigo";
import { Aviso, Botao, botaoClasse } from "@/components/ui";
import { beneficios } from "@/lib/api";
import { useSessao } from "@/lib/auth";
import type { Beneficio, Resgate } from "@/lib/types";

interface Props {
  beneficio: Beneficio;
  aoResgatar?: () => void;
}

export function Resgatar({ beneficio, aoResgatar }: Props) {
  const { usuario, pronto } = useSessao();
  const [cupom, setCupom] = useState<Resgate | null>(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function resgatar() {
    setErro("");
    setEnviando(true);
    try {
      setCupom(await beneficios.resgatar(beneficio.id));
      aoResgatar?.();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível resgatar.");
    } finally {
      setEnviando(false);
    }
  }

  if (!pronto) return null;

  if (cupom) {
    return (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Mostre este código no estabelecimento:</p>
        <CupomCodigo codigo={cupom.codigo} />
        <Link href="/meus-cupons" className="text-sm font-semibold text-carimbo hover:underline">
          Ver todos os meus cupons
        </Link>
      </div>
    );
  }

  if (!usuario) {
    return (
      <Link href="/login" className={botaoClasse()}>
        Entre para resgatar
      </Link>
    );
  }

  if (usuario.tipoUsuario !== "ESTUDANTE") {
    return <p className="text-apagado">Só contas de estudante podem resgatar benefícios.</p>;
  }

  const indisponivel = beneficio.esgotado || !beneficio.ativo;
  return (
    <div className="flex flex-col gap-3">
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <Botao onClick={resgatar} disabled={enviando || indisponivel} className="self-start px-8 text-lg">
        {indisponivel ? "Indisponível" : enviando ? "Gerando cupom…" : "Resgatar benefício"}
      </Botao>
    </div>
  );
}
