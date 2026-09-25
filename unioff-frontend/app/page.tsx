"use client";

import { useEffect, useState } from "react";
import { BeneficioTicket } from "@/components/BeneficioTicket";
import { Aviso, Botao, Vazio } from "@/components/ui";
import { beneficios, totalPaginas } from "@/lib/api";
import type { Beneficio } from "@/lib/types";

export default function FeedPage() {
  const [termo, setTermo] = useState("");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);
  const [itens, setItens] = useState<Beneficio[]>([]);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;
    beneficios
      .feed(busca, pagina)
      .then((resposta) => {
        if (cancelado) return;
        setItens((atuais) => (pagina === 0 ? resposta.content : [...atuais, ...resposta.content]));
        setTemMais(pagina + 1 < totalPaginas(resposta));
        setErro("");
      })
      .catch((err: Error) => !cancelado && setErro(err.message))
      .finally(() => !cancelado && setCarregando(false));
    return () => {
      cancelado = true;
    };
  }, [busca, pagina]);

  function aoBuscar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setPagina(0);
    setBusca(termo);
  }

  function carregarMais() {
    setCarregando(true);
    setPagina((p) => p + 1);
  }

  return (
    <>
      <section className="pb-10 pt-4">
        <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          Desconto de estudante nos lugares perto da sua faculdade.
        </h1>
        <form onSubmit={aoBuscar} role="search" className="mt-8 flex max-w-xl gap-2">
          <label htmlFor="busca" className="sr-only">Buscar por estabelecimento ou benefício</label>
          <input
            id="busca"
            type="search"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Pizzaria, xerox, academia…"
            className="min-w-0 flex-1 rounded-md border-2 border-tinta bg-white px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-marca"
          />
          <Botao type="submit" className="px-6 text-lg">Buscar</Botao>
        </form>
      </section>

      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      {!erro && !carregando && itens.length === 0 && (
        <Vazio titulo={busca ? `Nada encontrado para "${busca}"` : "Nenhum benefício publicado ainda"}>
          {busca ? "Tente o nome do estabelecimento ou outra palavra." : "Assim que os parceiros cadastrarem ofertas, elas aparecem aqui."}
        </Vazio>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {itens.map((b) => (
          <BeneficioTicket key={b.id} beneficio={b} />
        ))}
      </div>

      {carregando && <p className="mt-6 text-apagado">Carregando benefícios…</p>}
      {temMais && !carregando && (
        <div className="mt-8 text-center">
          <Botao variante="secundario" onClick={carregarMais}>Ver mais benefícios</Botao>
        </div>
      )}
    </>
  );
}
