/* Tatame: as regras do método Gracie de alimentação. Função pura, sem ecrã nem dados guardados.

Fonte: Rorion Gracie, "The Gracie Diet" (Gracie Publications, 2010; ISBN 978-1-4507-8785-7): tabela de grupos de
Carlos Gracie (pp. 31-34) e "Tips and Reminders" (pp. 46-48). Portado do mycros (macros/gracie.py), com os mesmos testes.
- A: legumes, carne, peixe, marisco, ovos, gorduras, frutos oleaginosos. Juntam-se entre si e com UM amido (B).
- B: amidos. Nunca dois diferentes na mesma refeição (massa com pão sim: ambos trigo; arroz com feijão não).
- C: fruta doce, queijo fresco, mel, açúcar. Entre si e com um B sem gordura. A com C nunca.
- D: fruta ácida. Sozinha, nem com outra ácida; no máximo 2 vezes por semana.
- E: banana crua. Com fruta doce, queijo fresco e leite; nunca com A, B, mel, açúcar ou fruta seca.
- F: leite. Com amidos, banana, gema, manteiga e queijo; nunca com A nem fruta. Iogurte e kefir, sozinhos.
- Neutros: gema, água de coco, levedura, café, chás. Fora: porco, álcool; a evitar: doces, refrigerantes, vinagre, pimenta.
- 3 refeições por dia, pelo menos 4 h 30 entre elas, só água ou água de coco pelo meio.
As justificações do livro (fermentação, pH do sangue) não têm suporte científico: o app segue o método, não promete saúde.
*/
(function (raiz) {
"use strict";
const FRASES = [["fruto vermelho", "D"], ["frutos vermelho", "D"], ["agua de coco", "neutro"], ["levedura de cerveja", "neutro"], ["fiambre de peru", "A"], ["fiambre de frango", "A"], ["feijao verde", "A"], ["milho doce", "A"], ["farinha de milho", "B"], ["tortilha de milho", "B"], ["ervilha seca", "B"], ["soja seca", "B"], ["batata doce", "B"], ["bolacha de arroz", "B"], ["tortita de arroz", "B"], ["banana seca", "C"], ["banana assada", "C"], ["banana cozida", "C"], ["banana frita", "A"], ["maca verde", "D"], ["uva acida", "D"], ["pera acida", "D"], ["ameixa acida", "D"], ["tomate acido", "D"], ["ameixa seca", "C"], ["coco ralado", "A"], ["coco seco", "A"], ["leite de coco", "A"], ["leite de amendoa", "A"], ["manteiga de amendoim", "A"], ["queijo derretido", "A"], ["queijo gratinado", "A"], ["queijo creme", "C"], ["proteina em po", "F"], ["sumo de pacote", "evitar"], ["pao de lo", "evitar"], ["castanha de caju", "A"], ["castanha do para", "A"], ["castanha do brasil", "A"]];
const NUNCA = new Set(["alcool", "bacon", "cerveja", "chourico", "enchido", "entremeada", "espumante", "febra", "fiambre", "gin", "licor", "linguica", "mortadela", "porco", "presunto", "rum", "salpicao", "salsicha", "sangria", "toucinho", "vinho", "vodka", "whisky"]);
const NUNCA_SEMPRE = new Set(["alcool", "bacon", "cerveja", "chourico", "entremeada", "espumante", "febra", "gin", "licor", "mortadela", "porco", "presunto", "rum", "salpicao", "sangria", "toucinho", "vinho", "vodka", "whisky"]);
const EVITAR = new Set(["biscoito", "bolacha", "bolo", "calda", "canela", "chocolate", "cola", "compota", "cravinho", "croissant", "donut", "gelado", "ketchup", "maionese", "marmelada", "mostarda", "nectar", "nutella", "pastel", "pickle", "pimenta", "refrigerante", "vinagre"]);
const COALHADO = new Set(["coalhada", "iogurte", "kefir", "skyr"]);
const F = new Set(["leite", "nata", "proteina", "whey"]);
const E = new Set(["banana"]);
const NEUTRO = new Set(["agua", "cafe", "cha", "gema", "infusao"]);
const AMIDOS = {"pao": "trigo", "tosta": "trigo", "torrada": "trigo", "massa": "trigo", "esparguete": "trigo", "macarrao": "trigo", "lasanha": "trigo", "cuscuz": "trigo", "bulgur": "trigo", "wrap": "trigo", "tortilha": "trigo", "bagel": "trigo", "panqueca": "trigo", "noodle": "trigo", "gnocchi": "trigo", "seitan": "trigo", "trigo": "trigo", "farinha": "trigo", "crepe": "trigo", "arroz": "arroz", "batata": "batata", "aveia": "aveia", "floco": "aveia", "cereal": "cereais", "granola": "cereais", "muesli": "cereais", "feijao": "feijão", "grao": "grão", "lentilha": "lentilhas", "broa": "milho", "pipoca": "milho", "tapioca": "mandioca", "mandioca": "mandioca", "inhame": "inhame", "cevada": "cevada", "centeio": "centeio", "castanha": "castanha", "quinoa": "quinoa"};
const FAMILIA_FRASE = {"farinha de milho": "milho", "tortilha de milho": "milho", "ervilha seca": "ervilha", "soja seca": "soja", "batata doce": "batata-doce", "bolacha de arroz": "arroz", "tortita de arroz": "arroz"};
const A = new Set(["aba", "abacate", "abobora", "agriao", "aipo", "alcachofra", "alface", "alho", "ameijoa", "amendoa", "amendoim", "atum", "avela", "azeite", "azeitona", "bacalhau", "beringela", "beterraba", "bife", "borrego", "brocolo", "cabrito", "cacau", "caju", "camarao", "caranguejo", "carne", "cebola", "cenoura", "chia", "choco", "clara", "coelho", "coentro", "cogumelo", "couve", "curgete", "dourada", "edamame", "endivia", "ervilha", "espargo", "espinafre", "frango", "gamba", "gengibre", "germen", "gordura", "hamburguer", "lagosta", "legume", "linhaca", "louro", "lula", "manjericao", "manteiga", "margarina", "marisco", "mexilhao", "milho", "nabo", "novilho", "noz", "oleo", "oregao", "ostra", "ova", "ovo", "palmito", "pato", "peixe", "pepino", "peru", "pescada", "picanha", "pimento", "pinhao", "pistacho", "pizza", "polvo", "quiabo", "rabanete", "robalo", "rucula", "salada", "salmao", "salsa", "sapateira", "sardinha", "semente", "sesamo", "sopa", "tomate", "vaca", "vitela"]);
const C = new Set(["acai", "acucar", "ameixa", "anona", "cana", "coco", "cottage", "diospiro", "figo", "goiaba", "jaca", "lichia", "maca", "mamao", "mel", "melancia", "melao", "meloa", "papaia", "passa", "pera", "queijo", "requeijao", "ricota", "tamara", "uva"]);
const D = new Set(["amora", "anana", "cereja", "damasco", "framboesa", "groselha", "kiwi", "laranja", "lima", "limao", "manga", "maracuja", "marmelo", "mirtilo", "morango", "nectarina", "pessego", "roma", "tangerina", "toranja"]);
const QUEIJOS_C = new Set(["cottage", "queijo", "requeijao", "ricota"]);
const SUB_ACIDAS = new Set(["ameixa", "anona", "goiaba", "maca", "uva"]);
const SECOS_DOCES = new Set(["passa", "seca", "seco", "tamara"]);
// plurais que o corte do "s" final não resolve (nozes → noze, cereais → cereai)
A.add("noze"); AMIDOS.cereai = "cereais";
const B = new Set(Object.keys(AMIDOS));
// ordem de decisão do livro: "requeijão de vaca" é queijo (C) antes de ser carne (A)
const ORDEM = [["nunca", NUNCA], ["evitar", EVITAR], ["coalhado", COALHADO], ["F", F], ["E", E], ["neutro", NEUTRO],
  ["B", B], ["C", QUEIJOS_C], ["A", A], ["C", C], ["D", D]];

const GRUPOS = [{"grupo": "A", "nome": "Cozinhados", "regra": "Juntam-se entre si e com um só amido. Nunca com o grupo C.", "exemplos": "Frango, carne, peixe, marisco, ovos, legumes, verduras, azeite, manteiga, abacate, frutos secos, queijo derretido"}, {"grupo": "B", "nome": "Amidos", "regra": "Um só por refeição: arroz com feijão não; massa com pão sim (ambos trigo).", "exemplos": "Arroz, massa, pão, batata, batata-doce, aveia, cereais, feijão, grão, lentilhas, quinoa, castanhas"}, {"grupo": "C", "nome": "Doces", "regra": "Entre si e com um amido sem gordura. Nunca com o grupo A.", "exemplos": "Melão, melancia, papaia, maçã vermelha, pera, uvas, figos, tâmaras, passas, mel, queijo fresco, requeijão"}, {"grupo": "D", "nome": "Fruta ácida", "regra": "Sozinha, nem com outra ácida. No máximo 2 vezes por semana, de manhã.", "exemplos": "Laranja, tangerina, kiwi, ananás, morango, frutos vermelhos, manga, pêssego, maçã verde, limão"}, {"grupo": "E", "nome": "Banana crua", "regra": "Com fruta doce, queijo fresco ou leite. Nunca com amidos nem com o grupo A.", "exemplos": "Banana (cozida, assada ou seca passa a doce, grupo C)"}, {"grupo": "F", "nome": "Leite", "regra": "Com amidos, banana e queijo. Nunca com carne, legumes ou fruta. Iogurte e kefir, sozinhos.", "exemplos": "Leite, natas, whey e proteína em pó; à parte: iogurte, kefir, coalhada"}, {"grupo": "neutro", "nome": "Neutros", "regra": "Com tudo.", "exemplos": "Gema de ovo, água de coco, café, chás, levedura de cerveja"}, {"grupo": "nunca", "nome": "Fora", "regra": "Porco nunca. Álcool, doces e refrigerantes não fazem parte da dieta.", "exemplos": "Porco, fiambre, chouriço, bacon, álcool, bolos, chocolate, gelados, refrigerantes, vinagre, pimenta, canela"}];

const normalizar = s => String(s || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().match(/[a-z0-9]+/g)?.join(" ") || "";
const raizPalavra = p => (p.length > 3 && p.endsWith("s") ? p.slice(0, -1) : p);
const texto = nome => normalizar(nome).split(" ").filter(Boolean).map(raizPalavra).join(" ");
const palavras = nome => new Set(texto(nome).split(" ").filter(Boolean));
const cruza = (a, b) => [...a].some(x => b.has(x));

/** Grupo de um alimento pelo nome: A, B, C, D, E, F, coalhado, neutro, evitar, nunca, ou null. */
function grupo(nome) {
  const t = ` ${texto(nome)} `;
  const ps = palavras(nome);
  if (cruza(ps, NUNCA_SEMPRE)) return "nunca";
  for (const [frase, g] of FRASES) if (t.includes(` ${frase} `)) return g;
  for (const [g, conjunto] of ORDEM) if (cruza(ps, conjunto)) return g;
  return null;
}

/** Família do amido ("um só amido" é uma família: pão e massa são ambos trigo). */
function familiaAmido(nome) {
  const t = ` ${texto(nome)} `;
  for (const [frase, f] of Object.entries(FAMILIA_FRASE)) if (t.includes(` ${frase} `)) return f;
  for (const p of t.trim().split(" ")) if (AMIDOS[p]) return AMIDOS[p];
  return null;
}

/** O que quebra as regras numa refeição, dada a lista de nomes dos alimentos. Vazio = segue o método. */
function problemas(nomes) {
  const unicos = [...new Set(nomes)];
  const itens = unicos.map(n => ({ n, g: grupo(n), p: palavras(n) })).filter(i => i.g !== "neutro");
  const tem = g => itens.filter(i => i.g === g).length;
  const nomesDe = g => itens.filter(i => i.g === g).map(i => i.n.toLowerCase());
  const frutasC = itens.filter(i => i.g === "C" && !cruza(i.p, QUEIJOS_C)).map(i => i.p);
  const saida = [];
  if (tem("nunca")) saida.push(`tem ${nomesDe("nunca").slice(0, 2).join(", ")} (fora da dieta)`);
  if (tem("evitar")) saida.push(`tem ${nomesDe("evitar").slice(0, 2).join(", ")} (a evitar)`);
  const familias = [...new Set(itens.filter(i => i.g === "B").map(i => familiaAmido(i.n) || i.n.toLowerCase()))].sort();
  if (familias.length > 1) saida.push(`dois amidos diferentes: ${familias[0]} e ${familias[1]}`);
  if (tem("A") && tem("C")) saida.push("cozinhados com fruta doce ou queijo fresco");
  if (tem("C") && itens.some(i => i.g === "B" && texto(i.n).includes("frit"))) saida.push("doce com amido frito");
  if (tem("D")) {
    if (itens.length > tem("D")) saida.push("fruta ácida com outra comida");
    else if (tem("D") > 1) saida.push("duas frutas ácidas juntas");
  }
  const doceSeco = new Set(["mel", "acucar", ...SECOS_DOCES]);
  if (tem("E") && (tem("A") || tem("B") || frutasC.some(p => cruza(p, doceSeco)))) saida.push("banana crua com amido, cozinhados ou fruta seca");
  if (tem("F") && (tem("A") || frutasC.length || tem("D"))) saida.push("leite com carne, legumes ou fruta");
  if (tem("coalhado") && itens.length > tem("coalhado")) saida.push("iogurte ou kefir com outra comida");
  const sub = new Set(); for (const i of itens) if (i.g === "C") for (const w of i.p) if (SUB_ACIDAS.has(w)) sub.add(w);
  if (sub.size > 1) saida.push("duas frutas pouco ácidas juntas (ex.: maçã e uva)");
  return saida;
}

// ---------------------------------------------------------------- as 3 refeições
const INTERVALO_MIN = 270;      // 4 h 30
const minutos = hm => { const [h, m] = hm.split(":").map(Number); return h * 60 + m; };
const hm = m => `${String(Math.floor(((m % 1440) + 1440) % 1440 / 60)).padStart(2, "0")}:${String((((m % 1440) + 1440) % 1440) % 60).padStart(2, "0")}`;

/** Erro em português se as 3 horas não respeitarem o livro; null se estão certas. */
function horasValidas(horas) {
  if (!Array.isArray(horas) || horas.length !== 3) return "Põe 3 horas, uma por refeição.";
  if (!horas.every(h => /^([01]\d|2[0-3]):[0-5]\d$/.test(h))) return "Escreve as horas assim: 07:30.";
  const m = horas.map(minutos);
  for (let i = 1; i < 3; i++) if (m[i] - m[i - 1] < INTERVALO_MIN) return "O método pede pelo menos 4 h 30 entre refeições.";
  return null;
}

/**
 * Avisos das 3 refeições em volta de um treino (hora "HH:MM", duração em min).
 * Comer em cima do treino pesa no tatame: deixa ~2 h entre a refeição e o treino
 * (recomendação habitual para refeições grandes antes de exercício intenso).
 */
function avisosTreino(horas, treino, duracao = 90) {
  if (!treino) return [];
  const t = minutos(treino), fim = t + duracao, out = [];
  horas.forEach((h, i) => {
    const m = minutos(h);
    if (m <= t && t - m < 120) out.push({ refeicao: i, texto: `Refeição às ${h} e treino às ${treino}: menos de 2 h. Come mais cedo ou mais leve.` });
    if (m > t && m < fim) out.push({ refeicao: i, texto: `Refeição às ${h} cai durante o treino.` });
  });
  return out;
}

/** Sugere 3 horas com 4 h 30 entre elas: a última refeição a seguir ao treino da noite, ou o padrão 08:00, 13:00, 19:00. */
function horasSugeridas(treino, duracao = 90) {
  if (!treino) return ["08:00", "13:00", "19:00"];
  const t = minutos(treino);
  if (t >= 17 * 60) {   // treino ao fim do dia: jantar depois do treino, almoço pelo menos 2 h antes
    const jantar = Math.min(t + duracao + 30, 23 * 60);
    const almoco = Math.min(t - 120, jantar - INTERVALO_MIN);
    return [hm(Math.min(almoco - INTERVALO_MIN, 9 * 60)), hm(almoco), hm(jantar)];
  }
  if (t <= 9 * 60) {     // treino de manhã: primeira refeição depois do treino
    const p = t + duracao + 30;
    return [hm(p), hm(p + INTERVALO_MIN), hm(p + 2 * INTERVALO_MIN)];
  }
  const antes = t - 150;  // treino a meio do dia
  return [hm(Math.min(antes, 8 * 60)), hm(Math.max(t + duracao + 30, Math.min(antes, 8 * 60) + INTERVALO_MIN)), hm(Math.max(t + duracao + 30, Math.min(antes, 8 * 60) + INTERVALO_MIN) + INTERVALO_MIN)];
}

const REFEICOES = [{ tipo: "C", nome: "Refeição doce", ideia: "Fruta doce, queijo fresco e pão ou aveia (sem gordura)." },
  { tipo: "A", nome: "Refeição cozinhada", ideia: "Proteína, legumes e azeite com um só amido (arroz, batata ou massa)." },
  { tipo: "A", nome: "Refeição cozinhada", ideia: "Proteína, legumes e azeite com um só amido." }];

raiz.TatameRegras = { grupo, familiaAmido, problemas, normalizar, GRUPOS, REFEICOES, horasValidas, horasSugeridas, avisosTreino, minutos, hm, INTERVALO_MIN };
})(typeof window !== "undefined" ? window : globalThis);
