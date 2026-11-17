const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { montar, montarSite, MANIFESTO, ICONES } = require("../montar.js");

test("index.html está igual ao que sai de src/", () => {
  assert.equal(fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8"), montar());
});
test("as regras carregam antes do app", () => {
  const h = montar();
  assert.ok(h.indexOf("raiz.TatameRegras =") < h.indexOf("const R = window.TatameRegras"));
});
test("o site tem manifesto e ícone do iPhone, e todos os ícones existem", () => {
  const h = montarSite();
  assert.match(h, /rel="manifest"/); assert.match(h, /apple-touch-icon/);
  for (const f of ICONES) assert.ok(fs.existsSync(path.join(__dirname, "..", "marca", f)), f);
  for (const i of MANIFESTO.icons) assert.ok(ICONES.includes(i.src.slice(1)), i.src);
});
test("sem alert/confirm/prompt e sem marcas de terceiros no ecrã", () => {
  const app = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
  assert.doesNotMatch(app, /\b(alert|confirm|prompt)\(/);
  assert.doesNotMatch(app, /Ralph|Renzo|RGA/);
});
