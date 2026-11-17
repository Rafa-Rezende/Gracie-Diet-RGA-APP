(function () {
"use strict";
const R = window.TatameRegras, K = window.TatameCategorias, CATALOGO = window.TatameAlimentos;

/* ---------- utilidades ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hoje = () => iso(new Date());
const addDias = (s, n) => { const [y, m, d] = s.split("-").map(Number); return iso(new Date(y, m - 1, d + n)); };
const DS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const fmtDia = s => { const [y, m, d] = s.split("-").map(Number); const dt = new Date(y, m - 1, d); return `${DS[dt.getDay()]}, ${d} ${MESES[m - 1]}`; };
const kg = n => (n == null ? "—" : String(+(+n).toFixed(1)).replace(".", ","));
const corGrupo = g => `var(--g-${g || "x"})`;
const NOME_GRUPO = { A: "Cozinhados", B: "Amido", C: "Doce", D: "Fruta ácida", E: "Banana", F: "Leite", coalhado: "Iogurte", neutro: "Neutro", evitar: "A evitar", nunca: "Fora", null: "Não reconheço" };
const FAIXAS = ["Branca", "Azul", "Roxa", "Castanha", "Preta"];
const I = {
  hoje: '<path d="M4 7h16v13H4z"/><path d="M4 11h16M9 3v4M15 3v4"/>',
  juntar: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
  competir: '<path d="M7 4h10v5a5 5 0 01-10 0z"/><path d="M12 14v4M8 20h8M17 6h3a3 3 0 01-3 3M7 6H4a3 3 0 003 3"/>',
  metodo: '<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z"/><path d="M5 17a3 3 0 013-3h11"/>',
  perfil: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
};
const svg = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

/* ---------- dados: ficam neste telemóvel ---------- */
const CHAVE = "tatame:v1";
let memoria = null;
function ler() {
  try { const t = localStorage.getItem(CHAVE); if (t) return JSON.parse(t); } catch (_) { /* sem armazenamento */ }
  return memoria || { perfil: null, competidor: { ativo: false }, registos: {}, pesos: [] };
}
let D = ler();
function gravar() { memoria = D; try { localStorage.setItem(CHAVE, JSON.stringify(D)); } catch (_) { toast("Este navegador não deixa guardar. Os dados perdem-se ao fechar."); } }

let toastT;
function toast(m) { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 2600); }

/* ---------- estado do dia ---------- */
const treinoDe = data => { const t = D.perfil && D.perfil.treino; if (!t || !t.hora) return null; const [y, m, d] = data.split("-").map(Number); return t.dias.includes(new Date(y, m - 1, d).getDay()) ? t : null; };
const horas = () => (D.perfil && D.perfil.horas) || R.horasSugeridas(D.perfil && D.perfil.treino && D.perfil.treino.hora, D.perfil && D.perfil.treino && D.perfil.treino.duracao);
const refeicoesDe = data => (D.registos[data] || [[], [], []]);
const estadoRefeicao = nomes => !nomes.length ? "vazia" : R.problemas(nomes).length ? "quebra" : "segue";
function sequencia() {
  let d = hoje(); const okDia = x => refeicoesDe(x).every(n => estadoRefeicao(n) === "segue");
  if (!okDia(d)) d = addDias(d, -1);
  let n = 0; while (n < 400 && okDia(d)) { n++; d = addDias(d, -1); }
  return n;
}
const pesoAtual = () => (D.pesos.length ? D.pesos[D.pesos.length - 1].kg : D.perfil && D.perfil.peso);

/* ---------- ecrãs ---------- */
const VIEWS = [["hoje", "Hoje"], ["juntar", "Posso juntar?"], ["competir", "Competir"], ["metodo", "Método"], ["perfil", "Perfil"]];
let vista = "hoje";
let juntar = [];           // alimentos escolhidos no "posso juntar?"
let alvoPicker = null;     // índice da refeição a registar, ou null

function topo(titulo, sub, extra = "") {
  return `<header class="top cab"><div style="min-width:0"><h1>${titulo}</h1><div class="meta">${esc(fmtDia(hoje()))}</div>${sub ? `<p>${sub}</p>` : ""}<div class="regua"></div></div>${extra}</header>`;
}
const logoAcademia = () => (D.logoAcademia ? `<img class="academia" src="${esc(D.logoAcademia)}" alt="Logo da academia">` : "");
function chip(nome, opts = {}) {
  const g = R.grupo(nome);
  return `<button class="chip ${opts.on ? "on" : ""} ${opts.off ? "off" : ""}" style="--c:${corGrupo(g)}" data-act="${opts.act}" data-nome="${esc(nome)}" ${opts.off ? `data-motivo="${esc(opts.off)}" aria-disabled="true"` : ""} ${opts.i != null ? `data-i="${opts.i}"` : ""} aria-pressed="${!!opts.on}" title="${esc(NOME_GRUPO[g])}"><i></i>${esc(nome)}${opts.x ? '<span class="x" aria-hidden="true">×</span>' : ""}</button>`;
}
function veredito(nomes) {
  if (!nomes.length) return `<div class="verdict vazio"><div><b>Escolhe os alimentos</b><span class="note">Toca nos alimentos da refeição. O veredito aparece aqui.</span></div></div>`;
  const p = R.problemas(nomes);
  if (!p.length) return `<div class="verdict ok"><div><b>Segue o método</b><span class="note">Pode ir para o prato junto.</span></div></div>`;
  return `<div class="verdict bad"><div><b>Não junta</b><ul>${p.map(x => `<li>${esc(x[0].toUpperCase() + x.slice(1))}</li>`).join("")}</ul></div></div>`;
}

function viewHoje() {
  const d = hoje(), t = treinoDe(d), h = horas(), regs = refeicoesDe(d);
  const avisos = t ? R.avisosTreino(h, t.hora, t.duracao) : [];
  const seq = sequencia();
  let html = topo(`Olá${D.perfil.nome ? ", " + esc(D.perfil.nome.split(" ")[0]) : ""}`, t ? `Treino hoje às <b>${esc(t.hora)}</b> (${t.duracao} min).` : "Hoje não tens treino marcado.", logoAcademia());
  const puns = h.reduce((a, _, i) => a + R.problemas(regs[i] || []).length, 0);
  html += `<section class="placar" aria-label="Placar do dia"><div class="col"><span class="lb">Doce</span><span class="hh">${esc(h[0])}</span><span class="lamp ${estadoRefeicao(regs[0] || [])}"></span></div>
    <div class="col"><span class="lb">Cozinhada</span><span class="hh">${esc(h[1])}</span><span class="lamp ${estadoRefeicao(regs[1] || [])}"></span></div>
    <div class="col"><span class="lb">Cozinhada</span><span class="hh">${esc(h[2])}</span><span class="lamp ${estadoRefeicao(regs[2] || [])}"></span></div>
    <div class="col pun ${puns ? "" : "zero"}"><span class="lb">Punições</span><span class="hh">${puns}</span></div>
    <div class="rodape"><span>${t ? `Treino ${esc(t.hora)}` : "Sem treino hoje"}</span><span>Sequência ${seq} ${seq === 1 ? "dia" : "dias"}</span></div></section>`;
  if (D.competidor.ativo) {
    const p = planoComp();
    if (p) html += `<a class="card" href="#competir" style="text-decoration:none;color:inherit"><div class="card-h"><h2>Rumo ao ${esc(p.categoria.nome)}</h2><span class="pill ${p.estado === "dentro" || p.estado === "confortavel" ? "ok" : p.estado === "exigente" ? "warn" : "bad"}">${esc(ESTADO[p.estado].curto)}</span></div><div class="note num">${p.estado === "dentro" ? `Estás dentro da categoria${p.folga != null ? `, com ${kg(p.folga)} kg de folga` : ""}.` : `Faltam ${kg(p.falta)} kg${p.dias != null && p.dias > 0 ? ` em ${p.dias} dias` : ""}.`}</div></a>`;
  }
  h.forEach((hora, i) => {
    const r = R.REFEICOES[i], nomes = regs[i] || [], est = estadoRefeicao(nomes), p = R.problemas(nomes);
    const av = avisos.filter(a => a.refeicao === i);
    if (i > 0) html += `<div class="sep">Entre refeições: só água ou água de coco</div>`;
    html += `<section class="card meal"><div class="meal-h"><span class="hora num">${esc(hora)}</span><span class="tipo">${esc(r.nome)}</span><span class="pill ${est === "segue" ? "ok" : est === "quebra" ? "bad" : ""}">${est === "segue" ? "Segue o método" : est === "quebra" ? "Quebra" : "Por registar"}</span></div><div style="min-width:0">
      <p class="ideia">${esc(r.ideia)}</p>
      ${nomes.length ? `<div class="chips">${nomes.map(n => chip(n, { act: "tirar", i, x: true })).join("")}</div>` : ""}
      ${p.length ? `<ul class="prob">${p.map(x => `<li>${esc(x[0].toUpperCase() + x.slice(1))}</li>`).join("")}</ul>` : ""}
      ${av.map(a => `<p class="note" style="color:var(--warn);margin:8px 0 0">${esc(a.texto)}</p>`).join("")}
      <button class="btn ghost" data-act="registar" data-i="${i}" style="margin-top:6px">+ Registar alimento</button>
      <div class="legenda">${est === "segue" ? "Segue o método." : est === "quebra" ? `${p.length} ${p.length === 1 ? "regra quebrada" : "regras quebradas"}.` : `${esc(r.nome)}, às ${esc(hora)}.`}</div>
    </div></section>`;
  });
  html += `<section class="card"><div class="card-h"><h2>Sequência</h2><span class="big num">${seq}<small> ${seq === 1 ? "dia" : "dias"}</small></span></div><p class="note" style="margin:0">Dias seguidos com as 3 refeições registadas e todas dentro do método.</p></section>`;
  return html;
}

function picker(selecionados, act, tipo) {
  const sel = new Set(selecionados);
  // numa refeição: só os grupos que entram nela; o que quebraria a combinação aparece bloqueado, com o porquê
  const cats = CATALOGO.map(([cat, lista]) => [cat, tipo ? lista.filter(n => (R.GRUPOS_REFEICAO[tipo] || []).includes(R.grupo(n))) : lista]).filter(([, l]) => l.length);
  const item = n => { if (!tipo) return chip(n, { act, on: sel.has(n) }); const v = R.podeEntrar(n, tipo, selecionados); return v.ok ? chip(n, { act, on: sel.has(n) }) : chip(n, { act: "bloqueado", off: v.motivo }); };
  return `<div class="field"><label for="pk-busca">Procurar ou escrever outro alimento</label><div class="row" style="flex-wrap:nowrap"><input id="pk-busca" placeholder="ex.: frango, arroz, melão" autocomplete="off"><button class="btn" data-act="pk-outro" data-alvo="${act}">Juntar</button></div></div>
    <div id="pk-lista">${cats.map(([cat, lista]) => `<div class="grupo-cat" data-cat><h3>${esc(cat)}</h3><div class="chips">${lista.map(item).join("")}</div></div>`).join("")}</div>`;
}

function viewJuntar() {
  return topo("Posso juntar?", "Escolhe o que vais pôr no prato. O app diz se a combinação segue o método.")
    + `<section class="card" style="position:sticky;top:calc(env(safe-area-inset-top,0px) + 8px);z-index:5">${veredito(juntar)}${juntar.length ? `<div class="chips" style="margin-top:10px">${juntar.map(n => chip(n, { act: "j-tirar", x: true })).join("")}</div><button class="btn ghost" data-act="j-limpar" style="margin-top:6px">Limpar</button>` : ""}</section>`
    + `<section class="card">${picker(juntar, "j-pick")}</section>`;
}

const ESTADO = {
  dentro: { curto: "Dentro", titulo: "Já estás na categoria", texto: "Mantém o peso: come as 3 refeições e não cortes nada na semana do campeonato." },
  confortavel: { curto: "Dá com folga", titulo: "Dá, com calma", texto: "O ritmo é seguro (até 0,7 % do peso por semana). Tira um pouco do amido nas refeições cozinhadas e mantém a proteína." },
  exigente: { curto: "Exigente", titulo: "Dá, mas é exigente", texto: "Entre 0,7 e 1 % do peso por semana. Fala com o teu professor; o treino pode perder força." },
  arriscado: { curto: "Arriscado", titulo: "Arriscado", texto: "Mais de 1 % do peso por semana: perdes músculo e rendimento. Pensa na categoria acima." },
  passou: { curto: "Data passou", titulo: "A data já passou", texto: "Atualiza a data do campeonato." },
};
function planoComp() {
  const c = D.competidor, peso = pesoAtual();
  if (!c.ativo || !peso || c.categoria == null) return null;
  return K.plano({ peso, modalidade: c.modalidade, sexo: c.sexo, categoria: c.categoria, data: c.data, hoje: hoje(), kimono: c.kimono });
}
function viewCompetir() {
  const c = D.competidor;
  let html = topo("Competir", "Categorias de peso de adulto da IBJJF e o caminho até ao peso, sem cortes de água.");
  if (!c.ativo) return html + `<section class="card"><p style="margin-top:0">Vais competir? Diz a categoria e a data e o app mostra quanto falta e se o ritmo é seguro.</p><button class="btn primary full" data-act="comp-on">Sou competidor</button></section>`;
  const cats = K.categorias(c.modalidade, c.sexo);
  const p = planoComp(), peso = pesoAtual();
  html += `<section class="card"><div class="fgrid">
    <div class="full"><span class="flabel">Modalidade</span><div class="seg" role="group" aria-label="Modalidade"><button data-act="comp-set" data-k="modalidade" data-v="gi" aria-pressed="${c.modalidade === "gi"}">Gi (kimono)</button><button data-act="comp-set" data-k="modalidade" data-v="nogi" aria-pressed="${c.modalidade === "nogi"}">No-gi</button></div></div>
    <div class="full"><span class="flabel">Divisão</span><div class="seg" role="group" aria-label="Divisão"><button data-act="comp-set" data-k="sexo" data-v="masculino" aria-pressed="${c.sexo === "masculino"}">Masculino</button><button data-act="comp-set" data-k="sexo" data-v="feminino" aria-pressed="${c.sexo === "feminino"}">Feminino</button></div></div>
    <div class="field full"><label for="cp-cat">Categoria alvo</label><select id="cp-cat" data-change="comp-cat">${cats.map(x => `<option value="${x.id}" ${x.id === c.categoria ? "selected" : ""}>${esc(x.nome)} · ${x.limite == null ? "sem limite" : "até " + kg(x.limite) + " kg"}</option>`).join("")}</select></div>
    <div class="field"><label for="cp-data">Data do campeonato</label><input id="cp-data" type="date" value="${esc(c.data || "")}" data-change="comp-data"></div>
    ${c.modalidade === "gi" ? `<div class="field"><label for="cp-kim">Peso do kimono (kg)</label><input id="cp-kim" type="number" inputmode="decimal" step="0.1" min="0.8" max="3.5" value="${c.kimono}" data-change="comp-kim"></div>` : "<div></div>"}
  </div></section>`;
  if (p) {
    const e = ESTADO[p.estado];
    html += `<section class="card"><div class="estado ${p.estado}"><b>${esc(e.titulo)}</b>
      <div class="row num" style="margin:10px 0;gap:18px">
        <div><div class="note">Hoje</div><div class="big">${kg(peso)}<small> kg</small></div></div>
        <div><div class="note">Limite sem roupa</div><div class="big">${p.limite == null ? "—" : kg(p.limite)}<small>${p.limite == null ? "" : " kg"}</small></div></div>
        ${p.falta ? `<div><div class="note">Por semana</div><div class="big">${p.porSemana != null ? kg(p.porSemana) : "—"}<small> kg</small></div></div>` : ""}
      </div><p style="margin:0">${esc(e.texto)}</p></div>
      ${p.atual && p.atual.id !== p.categoria.id ? `<p class="note">Com o peso de hoje caberias no <b>${esc(p.atual.nome)}</b>.</p>` : ""}
      <p class="note">Na IBJJF pesas-te imediatamente antes da primeira luta${c.modalidade === "gi" ? ", com o kimono" : ""}: não há tempo para recuperar água. O peso tem de baixar com tempo.</p></section>`;
  }
  html += `<section class="card"><div class="card-h"><h2>Peso</h2></div>
    <form id="f-peso" class="row" style="flex-wrap:nowrap"><div class="field" style="flex:1"><label for="ps-kg">Peso de hoje, de manhã, sem roupa (kg)</label><input id="ps-kg" type="number" inputmode="decimal" step="0.1" min="30" max="200" required></div><button class="btn primary" type="submit" style="align-self:flex-end">Registar</button></form>
    ${grafico()}
    <p class="note" style="margin-bottom:0">${esc(K.FONTE)}. Confirma o limite com o teu professor antes de te inscreveres.</p></section>
    <button class="btn danger" data-act="comp-off">Deixar o modo competidor</button>`;
  return html;
}
function grafico() {
  const ps = D.pesos.slice(-20);
  if (ps.length < 2) return `<p class="note">Regista o peso alguns dias para ver a linha.</p>`;
  const W = 520, H = 150, L = 34, Rr = 8, T = 10, B = 22, xs = ps.map((_, i) => L + (W - L - Rr) * i / (ps.length - 1));
  const vals = ps.map(p => p.kg), lim = planoComp() && planoComp().limite;
  const all = lim ? [...vals, lim] : vals; const mn = Math.floor(Math.min(...all) - 0.5), mx = Math.ceil(Math.max(...all) + 0.5);
  const y = v => T + (H - T - B) * (1 - (v - mn) / (mx - mn || 1));
  const linha = vals.map((v, i) => `${i ? "L" : "M"}${xs[i].toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return `<div class="spark"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Peso dos últimos registos, de ${kg(vals[0])} a ${kg(vals.at(-1))} kg">
    ${[mn, mx].map(v => `<line x1="${L}" x2="${W - Rr}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${L - 6}" y="${y(v) + 3}" text-anchor="end">${v}</text>`).join("")}
    ${lim ? `<line x1="${L}" x2="${W - Rr}" y1="${y(lim)}" y2="${y(lim)}" stroke="var(--ok)" stroke-dasharray="5 4"/><text x="${W - Rr}" y="${y(lim) - 4}" text-anchor="end" style="fill:var(--ok)">limite ${kg(lim)}</text>` : ""}
    <path d="${linha}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="${xs.at(-1)}" cy="${y(vals.at(-1))}" r="4.5" fill="var(--surface)" stroke="var(--accent)" stroke-width="2.5"/>
    <text x="${L}" y="${H - 5}">${esc(fmtDia(ps[0].data))}</text><text x="${W - Rr}" y="${H - 5}" text-anchor="end">${esc(fmtDia(ps.at(-1).data))}</text>
  </svg></div>`;
}

function viewMetodo() {
  return topo("O método", "As regras do livro de Rorion Gracie, <i>The Gracie Diet</i> (2010), com a tabela de grupos de Carlos Gracie.")
    + `<section class="card"><div class="card-h"><h2>As 3 regras do dia</h2></div><ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px">
      <li><b>3 refeições</b>, com pelo menos <b>4 h 30</b> entre elas.</li><li>Entre refeições, <b>só água ou água de coco</b>.</li><li>Em cada refeição, só se juntam grupos que <b>combinam</b>.</li></ol></section>`
    + `<section class="card"><div class="card-h"><h2>Os grupos</h2></div><table class="grupos"><tbody>${R.GRUPOS.map(g => `<tr><td><span class="gdot" style="--c:${corGrupo(g.grupo)}">${g.grupo.length === 1 ? g.grupo : g.grupo === "neutro" ? "N" : "×"}</span></td><td><b>${esc(g.nome)}</b><br>${esc(g.regra)}<div class="note">${esc(g.exemplos)}</div></td></tr>`).join("")}</tbody></table></section>`
    + `<section class="card"><div class="card-h"><h2>Com honestidade</h2></div><p style="margin-top:0">O livro explica as regras com a digestão e a acidez do sangue. Isso não tem suporte científico: o intestino digere misturas sem problema. O Gracie Diet ajuda a seguir o método, não promete resultados de saúde.</p><p class="note" style="margin-bottom:0">Comida simples, sem álcool, doces nem refrigerantes, a horas certas, faz bem em qualquer dieta. Para competir, o que pesa é o total do que comes e o tempo até à pesagem.</p></section>`;
}

function viewPerfil() {
  const p = D.perfil, t = p.treino || { dias: [], hora: "", duracao: 90 }, h = horas();
  return topo("Perfil", "Os dados ficam só neste telemóvel.")
    + `<section class="card"><div class="card-h"><h2>Estilo</h2></div>
      <div class="seg" role="group" aria-label="Estilo"><button data-act="estilo" data-v="parede" aria-pressed="${estilo() === "parede"}">Parede da academia</button><button data-act="estilo" data-v="placar" aria-pressed="${estilo() === "placar"}">Placar</button></div></section>
    <section class="card"><form id="f-perfil" class="fgrid">
      <div class="field full"><label for="pf-nome">Nome</label><input id="pf-nome" value="${esc(p.nome || "")}" autocomplete="given-name"></div>
      <div class="field"><label for="pf-peso">Peso (kg)</label><input id="pf-peso" type="number" inputmode="decimal" step="0.1" value="${esc(pesoAtual() || "")}"></div>
      <div class="field"><label for="pf-faixa">Faixa</label><select id="pf-faixa">${FAIXAS.map(f => `<option ${f === p.faixa ? "selected" : ""}>${f}</option>`).join("")}</select></div>
      <div class="full"><span class="flabel">Dias de treino</span><div class="days" role="group" aria-label="Dias de treino">${[1, 2, 3, 4, 5, 6, 0].map(d => `<button type="button" data-act="pf-dia" data-d="${d}" aria-pressed="${t.dias.includes(d)}">${DS[d]}</button>`).join("")}</div></div>
      <div class="field"><label for="pf-hora">Hora do treino</label><input id="pf-hora" type="time" value="${esc(t.hora || "")}"></div>
      <div class="field"><label for="pf-dur">Duração (min)</label><input id="pf-dur" type="number" inputmode="numeric" min="30" max="240" step="15" value="${t.duracao || 90}"></div>
      <div class="full"><span class="flabel">Horas das 3 refeições</span><div class="row" style="flex-wrap:nowrap">${h.map((x, i) => `<input type="time" id="pf-h${i}" value="${esc(x)}" aria-label="Refeição ${i + 1}" style="flex:1;border:1px solid var(--line);background:var(--surface-2);border-radius:10px;padding:10px 8px;min-width:0;min-height:44px;font-size:16px">`).join("")}</div>
        <button type="button" class="btn ghost" data-act="pf-sugerir">Sugerir pelas horas do treino</button></div>
      <button class="btn primary full" type="submit">Guardar</button>
    </form></section>
    <section class="card"><div class="card-h"><h2>Logo da tua academia</h2>${logoAcademia()}</div>
      <p class="note" style="margin-top:0">Opcional. Aparece no ecrã Hoje. Usa só uma logo que a academia te deixa usar.</p>
      <div class="row"><label class="btn" for="logo-arq">${D.logoAcademia ? "Trocar logo" : "Escolher imagem"}</label><input id="logo-arq" type="file" accept="image/*" hidden data-change="logo">${D.logoAcademia ? '<button class="btn ghost" data-act="logo-tirar">Tirar logo</button>' : ""}</div></section>
    <section class="card"><div class="card-h"><h2>Cópia dos dados</h2></div><p class="note" style="margin-top:0">Guarda uma cópia para passar para outro telemóvel ou não perder nada.</p>
      <div class="row"><button class="btn" data-act="exportar">Copiar os meus dados</button><label class="btn" for="imp-arq">Importar ficheiro</label><input id="imp-arq" type="file" accept="application/json,.json,.txt" hidden data-change="importar"></div>
      <textarea id="exp-txt" readonly hidden style="width:100%;min-height:90px;margin-top:10px;font-size:12px;border:1px solid var(--line);border-radius:10px;background:var(--surface-2);padding:8px"></textarea></section>
    <button class="btn danger" data-act="apagar">Apagar todos os dados</button>`;
}

function viewInicio() {
  return `<header class="top hero">${LOGO}<div><h1>Gracie Diet</h1><div class="meta">Alimentação para o jiu-jitsu · app não oficial</div></div></header>
    <section class="card"><p style="margin-top:0">O método de alimentação da família Gracie no teu telemóvel: o que podes juntar no prato, as 3 refeições à volta do treino e, se competes, o caminho até à categoria.</p>
    <form id="f-inicio" class="fgrid">
      <div class="field full"><label for="in-nome">Como te chamas?</label><input id="in-nome" autocomplete="given-name" required></div>
      <div class="field"><label for="in-peso">Peso (kg)</label><input id="in-peso" type="number" inputmode="decimal" step="0.1" min="30" max="200" required></div>
      <div class="field"><label for="in-hora">Hora habitual do treino</label><input id="in-hora" type="time" value="19:30"></div>
      <div class="full"><span class="flabel">Dias de treino</span><div class="days" role="group" aria-label="Dias de treino">${[1, 2, 3, 4, 5, 6, 0].map(d => `<button type="button" data-act="in-dia" data-d="${d}" aria-pressed="${[1, 3, 5].includes(d)}">${DS[d]}</button>`).join("")}</div></div>
      <label class="full row" style="gap:10px"><input type="checkbox" id="in-comp" style="width:22px;height:22px"> Vou competir</label>
      <button class="btn primary full" type="submit">Começar</button>
    </form></section>
    <p class="note">Os teus dados ficam só neste telemóvel. App não oficial, baseado no livro <i>The Gracie Diet</i>, de Rorion Gracie (2010). Sem ligação à família Gracie nem a academias.</p>`;
}

const LOGO = `<svg class="logo" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="var(--ink)"/><circle cx="32" cy="32" r="19" fill="var(--surface)"/><path d="M32 32 L32 13 A19 19 0 0 1 48.5 41.5 Z" fill="var(--g-A)"/><path d="M32 32 L48.5 41.5 A19 19 0 0 1 15.5 41.5 Z" fill="var(--g-B)"/><path d="M32 32 L15.5 41.5 A19 19 0 0 1 32 13 Z" fill="var(--g-C)"/><circle cx="32" cy="32" r="19" fill="none" stroke="var(--surface)" stroke-width="3"/><path d="M32 13V32L48.5 41.5M32 32L15.5 41.5" stroke="var(--surface)" stroke-width="3"/></svg>`;

/* ---------- folha de registo ---------- */
function abrirRegisto(i) {
  alvoPicker = i;
  const r = R.REFEICOES[i];
  $("#sheet-root").innerHTML = `<div class="sheet-bg" data-act="fechar"><div class="sheet" role="dialog" aria-modal="true" aria-label="Registar na ${esc(r.nome)}"><div class="sheet-h"><h2>${esc(r.nome)} · ${esc(horas()[i])}</h2><button class="btn" data-act="fechar-btn">Feito</button></div><div id="sheet-ver">${veredito(refeicoesDe(hoje())[i] || [])}</div><p class="note" style="margin:0">Aqui só aparecem os grupos que entram na ${i === 0 ? "refeição doce" : "refeição cozinhada"}. O que quebraria a combinação fica bloqueado.</p><div id="sheet-pk">${picker(refeicoesDe(hoje())[i] || [], "r-pick", r.tipo)}</div></div></div>`;
}
function atualizarSheet() {
  const nomes = refeicoesDe(hoje())[alvoPicker] || [];
  $("#sheet-ver").innerHTML = veredito(nomes);
  const busca = $("#pk-busca") ? $("#pk-busca").value : "";
  $("#sheet-pk").innerHTML = picker(nomes, "r-pick", R.REFEICOES[alvoPicker].tipo);
  if (busca) { $("#pk-busca").value = busca; $("#pk-busca").dispatchEvent(new Event("input", { bubbles: true })); }
}
function fecharSheet() { alvoPicker = null; $("#sheet-root").innerHTML = ""; render(); }
function alternarRegisto(nome) {
  const d = hoje(); const regs = D.registos[d] = refeicoesDe(d).map(x => [...x]);
  const l = regs[alvoPicker]; const k = l.indexOf(nome); if (k >= 0) l.splice(k, 1); else l.push(nome);
  gravar(); atualizarSheet();
}

/* ---------- render ---------- */
const estilo = () => D.estilo || "parede";
function render() {
  document.documentElement.dataset.estilo = estilo();
  const tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.content = estilo() === "placar" ? "#0E1011" : "#ECE5D6";
  if (!D.perfil) { $("#tabs").hidden = true; $("#main").innerHTML = viewInicio(); return; }
  $("#tabs").hidden = false;
  $("#tabs").innerHTML = VIEWS.map(([id, nome]) => `<a href="#${id}" ${vista === id ? 'aria-current="page"' : ""}>${svg(id)}${nome === "Posso juntar?" ? "Juntar" : nome}</a>`).join("");
  $("#main").innerHTML = { hoje: viewHoje, juntar: viewJuntar, competir: viewCompetir, metodo: viewMetodo, perfil: viewPerfil }[vista]();
}
function rota() { const h = location.hash.slice(1); vista = VIEWS.some(v => v[0] === h) ? h : "hoje"; render(); window.scrollTo(0, 0); }
window.addEventListener("hashchange", rota);

/* ---------- ações ---------- */
let armado = null;
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if (!el) return;
  const a = el.dataset.act;
  if (a === "fechar") { if (e.target === el) fecharSheet(); return; }
  if (a !== "apagar" && armado) { armado.classList.remove("armed"); armado.textContent = armado.dataset.label; armado = null; }
  switch (a) {
    case "fechar-btn": fecharSheet(); break;
    case "registar": abrirRegisto(+el.dataset.i); break;
    case "r-pick": alternarRegisto(el.dataset.nome); break;
    case "bloqueado": toast(el.dataset.motivo); break;
    case "estilo": D.estilo = el.dataset.v; gravar(); render(); break;
    case "logo-tirar": delete D.logoAcademia; gravar(); render(); break;
    case "tirar": { const d = hoje(); const regs = D.registos[d] = refeicoesDe(d).map(x => [...x]); regs[+el.dataset.i] = regs[+el.dataset.i].filter(n => n !== el.dataset.nome); gravar(); render(); break; }
    case "j-pick": { const n = el.dataset.nome; juntar = juntar.includes(n) ? juntar.filter(x => x !== n) : [...juntar, n]; render(); break; }
    case "j-tirar": juntar = juntar.filter(x => x !== el.dataset.nome); render(); break;
    case "j-limpar": juntar = []; render(); break;
    case "pk-outro": { const v = ($("#pk-busca").value || "").trim(); if (!v) return; if (el.dataset.alvo === "r-pick") { const ok = R.podeEntrar(v, R.REFEICOES[alvoPicker].tipo, refeicoesDe(hoje())[alvoPicker] || []); if (!ok.ok) { toast(ok.motivo); return; } alternarRegisto(v); $("#pk-busca").value = ""; return; } else { if (!juntar.includes(v)) juntar = [...juntar, v]; render(); } if (!R.grupo(v)) toast(`Não reconheço "${v}": não conta nas regras.`); break; }
    case "in-dia": case "pf-dia": el.setAttribute("aria-pressed", el.getAttribute("aria-pressed") !== "true"); break;
    case "pf-sugerir": { const s = R.horasSugeridas($("#pf-hora").value || null, +$("#pf-dur").value || 90); s.forEach((x, i) => ($(`#pf-h${i}`).value = x)); toast("Horas sugeridas. Toca em Guardar."); break; }
    case "comp-on": ativarCompetidor(); gravar(); render(); break;
    case "comp-off": D.competidor.ativo = false; gravar(); render(); break;
    case "comp-set": { D.competidor[el.dataset.k] = el.dataset.v; const n = K.categorias(D.competidor.modalidade, D.competidor.sexo).length; if (D.competidor.categoria >= n) D.competidor.categoria = n - 1; gravar(); render(); break; }
    case "exportar": { const txt = JSON.stringify(D); const ta = $("#exp-txt"); ta.hidden = false; ta.value = txt; try { navigator.clipboard.writeText(txt).then(() => toast("Dados copiados. Cola-os numa nota ou mensagem."), () => { ta.select(); }); } catch (_) { ta.select(); } break; }
    case "apagar":
      if (armado !== el) { el.dataset.label = el.textContent; el.classList.add("armed"); el.textContent = "Toca de novo para apagar tudo"; armado = el; return; }
      armado = null; D = { perfil: null, competidor: { ativo: false }, registos: {}, pesos: [] }; gravar(); location.hash = ""; render(); break;
  }
});
document.addEventListener("input", e => {
  if (e.target.id !== "pk-busca") return;
  const q = R.normalizar(e.target.value);
  document.querySelectorAll("#pk-lista [data-cat]").forEach(cat => {
    let algum = false;
    cat.querySelectorAll(".chip").forEach(c => { const v = !q || R.normalizar(c.dataset.nome).includes(q); c.hidden = !v; algum = algum || v; });
    cat.hidden = !algum;
  });
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && alvoPicker != null) fecharSheet(); if (e.key === "Enter" && e.target.id === "pk-busca") { e.preventDefault(); const b = document.querySelector('[data-act="pk-outro"]'); if (b) b.click(); } });
document.addEventListener("change", e => {
  const k = e.target.dataset.change; if (!k) return;
  if (k === "comp-cat") D.competidor.categoria = +e.target.value;
  if (k === "comp-data") D.competidor.data = e.target.value;
  if (k === "comp-kim") D.competidor.kimono = Math.min(3.5, Math.max(0.8, +e.target.value || 1.8));
  if (k === "logo") {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    // reduz para 256 px: a logo vive no armazenamento do telemóvel, que é pequeno
    const img = new Image(); const url = URL.createObjectURL(f);
    img.onload = () => { const lado = 256, esc2 = Math.min(1, lado / Math.max(img.width, img.height)); const c = document.createElement("canvas");
      c.width = Math.round(img.width * esc2); c.height = Math.round(img.height * esc2); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      D.logoAcademia = c.toDataURL("image/png"); URL.revokeObjectURL(url); gravar(); toast("Logo guardada."); render(); };
    img.onerror = () => toast("Não consegui ler essa imagem.");
    img.src = url; return;
  }
  if (k === "importar") {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    f.text().then(t => { const novo = JSON.parse(t); if (!novo || typeof novo !== "object" || !("registos" in novo)) throw new Error(); D = novo; gravar(); toast("Dados importados."); render(); }).catch(() => toast("Esse ficheiro não é uma cópia do Gracie Diet."));
    return;
  }
  gravar(); render();
});
document.addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target.id;
  if (f === "f-inicio") {
    const dias = [...document.querySelectorAll('[data-act="in-dia"][aria-pressed="true"]')].map(b => +b.dataset.d);
    const hora = $("#in-hora").value || null;
    D.perfil = { nome: $("#in-nome").value.trim(), peso: +$("#in-peso").value, faixa: "Branca", treino: { dias, hora, duracao: 90 }, horas: R.horasSugeridas(hora, 90) };
    D.pesos = [{ data: hoje(), kg: +$("#in-peso").value }];
    const compete = $("#in-comp").checked;
    if (compete) ativarCompetidor();
    gravar();
    if (compete && location.hash !== "#competir") location.hash = "competir"; else rota();
    return;
  }
  if (f === "f-perfil") {
    const hs = [0, 1, 2].map(i => $(`#pf-h${i}`).value);
    const erro = R.horasValidas(hs); if (erro) { toast(erro); return; }
    const peso = +$("#pf-peso").value;
    D.perfil = { ...D.perfil, nome: $("#pf-nome").value.trim(), faixa: $("#pf-faixa").value, horas: hs,
      treino: { dias: [...document.querySelectorAll('[data-act="pf-dia"][aria-pressed="true"]')].map(b => +b.dataset.d), hora: $("#pf-hora").value || null, duracao: +$("#pf-dur").value || 90 } };
    if (peso && peso !== pesoAtual()) registarPeso(peso);
    gravar(); toast("Perfil guardado."); render();
  }
  if (f === "f-peso") { registarPeso(+$("#ps-kg").value); gravar(); toast("Peso registado."); render(); }
});
function ativarCompetidor() {
  D.competidor = { modalidade: "gi", sexo: "masculino", kimono: 1.8, data: addDias(hoje(), 56), categoria: null, ...D.competidor, ativo: true };
  if (D.competidor.categoria == null) { const c = K.categoriaAtual(pesoAtual() || 70, D.competidor.modalidade, D.competidor.sexo, D.competidor.kimono); D.competidor.categoria = c ? c.id : 0; }
}
function registarPeso(v) { if (!v) return; D.pesos = D.pesos.filter(p => p.data !== hoje()); D.pesos.push({ data: hoje(), kg: v }); D.pesos.sort((a, b) => a.data.localeCompare(b.data)); }

rota();
})();
