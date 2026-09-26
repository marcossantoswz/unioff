import type { Beneficio, Cupom, EmpresaDetalhes, Pagina } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Bruto = any;

const texto = (v: unknown) => (v === null || v === undefined ? "" : String(v));

// Aceita lista simples ou Page do Spring ({ content, totalPages } ou { content, page: {...} }).
export function pagina<T>(bruto: Bruto, mapear: (item: Bruto) => T): Pagina<T> {
  const lista: Bruto[] = Array.isArray(bruto) ? bruto : (bruto?.content ?? []);
  const total = bruto?.totalPages ?? bruto?.page?.totalPages ?? 1;
  return { itens: lista.map(mapear), totalPaginas: Number(total) || 1 };
}

export function beneficio(b: Bruto): Beneficio {
  const max = Number(b.quantidadeMaxResgastes ?? 0);
  const usados = Number(b.quantidadeResgates ?? 0);
  const disponivel = Number(b.quantidadeDisponivel ?? max - usados);
  return {
    id: texto(b.id),
    titulo: texto(b.titulo),
    descricao: texto(b.descricao),
    dataInicio: texto(b.dataInicio),
    dataFim: texto(b.dataFim),
    quantidadeResgates: usados,
    quantidadeMaxResgastes: max,
    quantidadeDisponivel: disponivel,
    esgotado: Boolean(b.esgotado ?? disponivel <= 0),
    ativo: b.ativo !== false,
    empresa: {
      id: texto(b.empresa?.id ?? b.empresaId),
      nomeFantasia: texto(b.empresa?.nomeFantasia ?? b.nomeEmpresa),
      cidade: b.empresa?.cidade,
      bairro: b.empresa?.bairro,
    },
  };
}

export function empresaDetalhes(e: Bruto): EmpresaDetalhes {
  return {
    ...e,
    id: texto(e.id),
    beneficios: (e.beneficios ?? []).map((b: Bruto) =>
      beneficio({ ...b, empresa: b.empresa ?? { id: e.id, nomeFantasia: e.nomeFantasia } }),
    ),
  };
}

// Backend atual: { codigo, status, dataGeracao, beneficioTitulo, empresaNome }.
// Especificação: { codigoCupom, utilizado, dataResgate, beneficio: {...}, empresa: {...} }.
export function cupom(r: Bruto): Cupom {
  return {
    id: texto(r.id),
    codigo: texto(r.codigoCupom ?? r.codigo),
    utilizado: r.utilizado ?? r.status === "USADO",
    expirado: r.status === "EXPIRADO",
    dataResgate: texto(r.dataResgate ?? r.dataGeracao),
    dataUso: r.dataUso ?? null,
    beneficio: {
      id: texto(r.beneficio?.id ?? r.beneficioId),
      titulo: texto(r.beneficio?.titulo ?? r.beneficioTitulo),
      dataFim: r.beneficio?.dataFim,
    },
    empresa: {
      id: texto(r.empresa?.id ?? r.empresaId),
      nomeFantasia: texto(r.empresa?.nomeFantasia ?? r.empresaNome),
    },
    estudanteNome: r.estudante?.nome ?? r.estudanteNome,
  };
}
