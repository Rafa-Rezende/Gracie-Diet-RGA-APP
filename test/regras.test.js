// Mesmas respostas que o mycros (tests/test_gracie.py): grupos da tabela do livro e regras das refeições.
const test = require("node:test");
const assert = require("node:assert/strict");
require("../src/regras.js");
const R = globalThis.TatameRegras;

const GRUPOS = [["Peito de frango grelhado", "A"], ["Carne da aba", "A"], ["Azeite virgem extra", "A"], ["Ovos cozidos", "A"], ["Ervilhas", "A"], ["Feijão verde", "A"], ["Pizza média inteira", "A"], ["Fiambre de peru", "A"], ["Arroz branco cozido", "B"], ["Batata-doce assada", "B"], ["Grão-de-bico", "B"], ["Castanhas", "B"], ["Feijão preto", "B"], ["Bolacha de arroz", "B"], ["Queijo fresco magro", "C"], ["Requeijão de vaca", "C"], ["Mel", "C"], ["Maçã gala", "C"], ["Banana assada", "C"], ["Manga", "D"], ["Laranja", "D"], ["Maçã verde", "D"], ["Banana", "E"], ["Leite meio gordo", "F"], ["Whey protein", "F"], ["Iogurte grego natural", "coalhado"], ["Gema de ovo", "neutro"], ["Café", "neutro"], ["Água de coco", "neutro"], ["Bolo de chocolate", "evitar"], ["Fiambre de peru e porco", "nunca"], ["Cerveja", "nunca"], ["Molho XPTO", null]];
for (const [nome, g] of GRUPOS) test(`grupo: ${nome} → ${g}`, () => assert.equal(R.grupo(nome), g));

const REFEICOES = [[["Frango", "Arroz", "Azeite", "Brócolos"], []], [["Massa cozida", "Pão de forma"], []], [["Arroz", "Feijão preto"], ["dois amidos diferentes: arroz e feijão"]], [["Queijo fresco", "Pão integral", "Melão"], []], [["Queijo fresco", "Frango"], ["cozinhados com fruta doce ou queijo fresco"]], [["Melão", "Batata frita"], ["doce com amido frito"]], [["Laranja"], []], [["Laranja", "Kiwi"], ["duas frutas ácidas juntas"]], [["Laranja", "Pão"], ["fruta ácida com outra comida"]], [["Banana", "Frango"], ["banana crua com amido, cozinhados ou fruta seca"]], [["Banana", "Flocos de aveia"], ["banana crua com amido, cozinhados ou fruta seca"]], [["Banana", "Melão"], []], [["Banana", "Leite"], []], [["Melão", "Leite"], ["leite com carne, legumes ou fruta"]], [["Leite", "Flocos de aveia"], []], [["Leite", "Frango"], ["leite com carne, legumes ou fruta"]], [["Iogurte grego"], []], [["Iogurte grego", "Flocos de aveia"], ["iogurte ou kefir com outra comida"]], [["Maçã gala", "Uvas"], ["duas frutas pouco ácidas juntas (ex.: maçã e uva)"]], [["Café", "Frango", "Arroz"], []], [["Cerveja"], ["tem cerveja (fora da dieta)"]]];
for (const [nomes, esperado] of REFEICOES) test(`refeição: ${nomes.join(" + ")}`, () => assert.deepEqual(R.problemas(nomes), esperado));

test("horas: 4 h 30 entre refeições", () => {
  assert.equal(R.horasValidas(["08:00", "13:00", "19:00"]), null);
  assert.match(R.horasValidas(["08:00", "12:00", "19:00"]), /4 h 30/);
  assert.match(R.horasValidas(["8:00", "13:00", "19:00"]), /07:30/);
});

for (const [treino, dur] of [["19:30", 90], ["20:30", 90], ["07:00", 60], ["12:30", 60], [null, 0], ["18:00", 120]]) {
  test(`horas sugeridas para treino às ${treino} cumprem o método e não caem em cima do treino`, () => {
    const h = R.horasSugeridas(treino, dur);
    assert.equal(R.horasValidas(h), null, h.join(" "));
    assert.deepEqual(R.avisosTreino(h, treino, dur), [], h.join(" "));
  });
}

test("aviso quando a refeição fica a menos de 2 h do treino", () => {
  assert.equal(R.avisosTreino(["08:00", "13:00", "18:30"], "19:30", 90).length, 1);
});

test("plurais que o corte do s não resolve: nozes, cereais, frutos vermelhos", () => {
  assert.equal(R.grupo("Nozes"), "A");
  assert.equal(R.grupo("Cereais"), "B");
  assert.equal(R.grupo("Frutos vermelhos"), "D");
});

test("todos os alimentos do catálogo têm grupo", () => {
  require("../src/alimentos.js");
  for (const [, lista] of globalThis.TatameAlimentos) for (const n of lista) assert.ok(R.grupo(n), n);
});
