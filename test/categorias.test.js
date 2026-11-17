const test = require("node:test");
const assert = require("node:assert/strict");
require("../src/categorias.js");
const K = globalThis.TatameCategorias;

test("cada tabela vai do mais leve ao mais pesado e termina sem limite", () => {
  for (const mod of ["gi", "nogi"]) for (const sexo of ["masculino", "feminino"]) {
    const l = K.TABELA[mod][sexo];
    assert.equal(l.at(-1), null);
    for (let i = 1; i < l.length - 1; i++) assert.ok(l[i] > l[i - 1], `${mod} ${sexo} ${i}`);
  }
});

test("no gi o kimono conta: médio (82,3) com kimono de 1,8 kg pede 80,5 sem roupa", () => {
  const cat = K.categorias("gi", "masculino")[4];
  assert.equal(cat.nome, "Médio");
  assert.equal(K.limiteSemRoupa(cat, "gi", 1.8), 80.5);
});

test("categoria atual: 84 kg no gi masculino cai no meio-pesado", () => {
  assert.equal(K.categoriaAtual(84, "gi", "masculino").nome, "Meio-pesado");
  assert.equal(K.categoriaAtual(130, "gi", "masculino").nome, "Pesadíssimo");
});

test("já dentro da categoria", () => {
  const p = K.plano({ peso: 78, modalidade: "gi", sexo: "masculino", categoria: 4, data: "2026-12-15", hoje: "2026-11-17" });
  assert.equal(p.estado, "dentro");
  assert.equal(p.folga, 2.5);
});

test("84 kg para médio em 8 semanas: 3,5 kg, ~0,44 kg/semana, confortável", () => {
  const p = K.plano({ peso: 84, modalidade: "gi", sexo: "masculino", categoria: 4, data: "2027-01-12", hoje: "2026-11-17" });
  assert.equal(p.falta, 3.5);
  assert.equal(p.semanas, 8);
  assert.equal(p.porSemana, 0.44);
  assert.equal(p.estado, "confortavel");
});

test("84 kg para médio em 2 semanas: arriscado", () => {
  const p = K.plano({ peso: 84, modalidade: "gi", sexo: "masculino", categoria: 4, data: "2026-12-01", hoje: "2026-11-17" });
  assert.equal(p.estado, "arriscado");
  assert.ok(p.porSemanaPct > 1);
});

test("data já passou", () => {
  const p = K.plano({ peso: 84, modalidade: "gi", sexo: "masculino", categoria: 4, data: "2026-11-01", hoje: "2026-11-17" });
  assert.equal(p.estado, "passou");
});

test("no-gi feminino: 60 kg cabe no leve (61,5)", () => {
  const p = K.plano({ peso: 60, modalidade: "nogi", sexo: "feminino", categoria: 3, data: "2026-12-15", hoje: "2026-11-17" });
  assert.equal(p.estado, "dentro");
});
