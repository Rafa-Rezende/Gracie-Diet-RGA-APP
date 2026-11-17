/* Tatame: categorias de peso de adulto da IBJJF e o plano para chegar a uma delas. Função pura.

TABELA BASE, A CONFIRMAR com a tabela oficial (ibjjf.com) antes de usar a sério. Compilada de guias públicos
(FloGrappling, Find Your Gi, SubmissionShark, BJJ Spot) que concordam nas categorias leves e divergem nas pesadas.
- Gi: o limite inclui o kimono. No-gi: pesa-se com o equipamento de no-gi.
- Na IBJJF a pesagem é imediatamente antes da primeira luta: não há tempo para reidratar. Por isso nada de cortes
  de água: o peso tem de baixar com tempo, comendo.
Ritmo seguro de perda: cerca de 0,5 a 1 % do peso por semana preserva a massa magra e o rendimento
(Garthe et al. 2011, IJSNEM 21:97; Helms et al. 2014, JISSN 11:20).
*/
(function (raiz) {
"use strict";

const NOMES = ["Galo", "Pluma", "Pena", "Leve", "Médio", "Meio-pesado", "Pesado", "Super-pesado", "Pesadíssimo"];
// limites em kg; null = sem limite
const TABELA = {
  gi: {
    masculino: [57.5, 64, 70, 76, 82.3, 88.3, 94.3, 100.5, null],
    feminino: [48.5, 53.5, 58.5, 64, 69, 74, 79.3, null],
  },
  nogi: {
    masculino: [55.5, 61.5, 67.5, 73.5, 79.5, 85.5, 91.5, 97.5, null],
    feminino: [46.5, 51.5, 56.5, 61.5, 66.5, 71.5, 76.5, null],
  },
};
const FONTE = "Tabela base de guias públicos; confirmar em ibjjf.com";

function categorias(modalidade, sexo) {
  const lista = (TABELA[modalidade] || {})[sexo] || [];
  return lista.map((limite, i) => ({ id: i, nome: NOMES[i], limite }));
}

/** Peso no dia, sem roupa, que cabe na categoria: no gi, o limite menos o kimono. */
function limiteSemRoupa(cat, modalidade, kimono) {
  if (cat.limite == null) return null;
  return +(cat.limite - (modalidade === "gi" ? kimono : 0.3)).toFixed(1);
}

/** A categoria mais leve em que o peso de hoje já cabe, com 1 % de folga para o dia (água, comida). */
function categoriaAtual(peso, modalidade, sexo, kimono = 1.8) {
  return categorias(modalidade, sexo).find(c => c.limite == null || peso * 1.01 <= limiteSemRoupa(c, modalidade, kimono));
}

const dias = (de, ate) => Math.round((Date.UTC(...ate.split("-").map((n, i) => i === 1 ? n - 1 : +n)) - Date.UTC(...de.split("-").map((n, i) => i === 1 ? n - 1 : +n))) / 864e5);

/**
 * O plano até ao campeonato.
 * @returns {{estado: "dentro"|"confortavel"|"exigente"|"arriscado"|"passou", porSemana, porSemanaPct, falta, semanas, limite, atual}}
 */
function plano({ peso, modalidade, sexo, categoria, data, hoje, kimono = 1.8 }) {
  const cats = categorias(modalidade, sexo);
  const cat = cats[categoria];
  if (!cat || !peso) return null;
  const limite = limiteSemRoupa(cat, modalidade, kimono);
  const atual = categoriaAtual(peso, modalidade, sexo, kimono);
  const d = data && hoje ? dias(hoje, data) : null;
  const base = { categoria: cat, limite, atual, dias: d };
  if (limite == null || peso <= limite) return { ...base, estado: "dentro", falta: 0, folga: limite == null ? null : +(limite - peso).toFixed(1) };
  const falta = +(peso - limite).toFixed(1);
  if (d == null || d <= 0) return { ...base, estado: "passou", falta };
  const semanas = d / 7;
  const porSemana = falta / semanas;
  const porSemanaPct = porSemana / peso * 100;
  const estado = porSemanaPct <= 0.7 ? "confortavel" : porSemanaPct <= 1 ? "exigente" : "arriscado";
  return { ...base, estado, falta, semanas: +semanas.toFixed(1), porSemana: +porSemana.toFixed(2), porSemanaPct: +porSemanaPct.toFixed(2) };
}

raiz.TatameCategorias = { TABELA, NOMES, FONTE, categorias, limiteSemRoupa, categoriaAtual, plano };
})(typeof window !== "undefined" ? window : globalThis);
