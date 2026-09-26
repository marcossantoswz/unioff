"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BeneficioTicket } from "@/components/BeneficioTicket";
import { BuscaBeneficios } from "@/components/BuscaBeneficios";
import { Aviso, Botao, Carregando, Vazio } from "@/components/ui";
import { beneficios } from "@/lib/api";
import type { Beneficio } from "@/lib/types";

// Remonta a lista a cada nova busca, zerando página e filtros.
function ComBusca() {
  const busca = useSearchParams().get("busca") ?? "";
  return <ListaBeneficios key={busca} busca={busca} />;
}

function ListaBeneficios({ busca }: { busca: string }) {
  const [soDisponiveis, setSoDisponiveis] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [itens, setItens] = useState<Beneficio[]>([]);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;
    beneficios
      .listar({ busca, disponivel: soDisponiveis, pagina })
      .then((r) => {
        if (cancelado) return;
        // o backend pode ignorar ?disponivel, então filtramos aqui também
        const novos = soDisponiveis ? r.itens.filter((b) => !b.esgotado) : r.itens;
        setItens((atuais) => (pagina === 0 ? novos : [...atuais, ...novos]));
        setTemMais(pagina + 1 < r.totalPaginas);
        setErro("");
      })
      .catch((err: Error) => !cancelado && setErro(err.message))
      .finally(() => !cancelado && setCarregando(false));
    return () => {
      cancelado = true;
    };
  }, [busca, soDisponiveis, pagina]);

  function alternarDisponiveis() {
    setCarregando(true);
    setPagina(0);
    setSoDisponiveis((v) => !v);
  }

  return (
    <>
      <h1 className="font-display text-3xl font-bold">{busca ? `Resultados para "${busca}"` : "Benefícios"}</h1>
      <div className="mb-8 mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1"><BuscaBeneficios inicial={busca} /></div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={soDisponiveis} onChange={alternarDisponiveis} className="size-4 accent-amarelo" />
          só com resgates disponíveis
        </label>
      </div>

      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {!erro && !carregando && itens.length === 0 && (
        <Vazio titulo={busca ? "Nada encontrado" : "Nenhum benefício publicado ainda"}>
          {busca ? "Tente o nome do estabelecimento ou outra palavra." : "Assim que os parceiros cadastrarem ofertas, elas aparecem aqui."}
        </Vazio>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {itens.map((b) => <BeneficioTicket key={b.id} beneficio={b} />)}
      </div>

      {carregando && <div className="mt-6"><Carregando texto="carregando benefícios…" /></div>}
      {temMais && !carregando && (
        <div className="mt-8 text-center">
          <Botao variante="secundario" onClick={() => { setCarregando(true); setPagina((p) => p + 1); }}>
            Ver mais benefícios
          </Botao>
        </div>
      )}
    </>
  );
}

export default function BeneficiosPage() {
  return (
    <Suspense fallback={<Carregando texto="carregando benefícios…" />}>
      <ComBusca />
    </Suspense>
  );
}
