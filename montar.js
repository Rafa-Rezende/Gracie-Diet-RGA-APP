// Monta o Gracie Diet a partir de src/:
//   publico/     o site (Vercel): index.html completo, manifesto e ícones
//   index.html   a mesma página para pré-visualizar como artefato do claude.ai
// Uso: node montar.js   ·   node montar.js --verificar (falha se index.html estiver desatualizado)
const fs = require("node:fs");
const path = require("node:path");
const RAIZ = __dirname, SRC = path.join(RAIZ, "src"), PUBLICO = path.join(RAIZ, "publico"), MARCA = path.join(RAIZ, "marca");
const ler = n => fs.readFileSync(path.join(SRC, n), "utf8").replace(/\n$/, "");
const SCRIPTS = ["regras.js", "categorias.js", "alimentos.js", "app.js"];
const scripts = () => SCRIPTS.map(n => `<script>\n${ler(n)}\n</script>\n`).join("");
const montar = () => fs.readFileSync(path.join(SRC, "pagina.html"), "utf8") + scripts();
const COR = "#ECE5D6";
function montarSite() {
  const cabeca = ["<!doctype html>", '<html lang="pt-PT">', "<head>", '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
    '<meta name="description" content="O método de alimentação da família Gracie para quem treina jiu-jitsu: o que juntar no prato, as 3 refeições à volta do treino e a categoria de peso.">',
    `<meta name="theme-color" content="${COR}">`, '<link rel="icon" href="/tatame-icone.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">', '<link rel="manifest" href="/manifest.webmanifest">',
    '<meta name="apple-mobile-web-app-capable" content="yes">', '<meta name="apple-mobile-web-app-title" content="Gracie Diet">',
    "</head>", "<body>"].join("\n");
  return `${cabeca}\n${montar()}</body>\n</html>\n`;
}
const MANIFESTO = { name: "Gracie Diet", short_name: "Gracie Diet", lang: "pt-PT", start_url: "/", scope: "/", display: "standalone",
  background_color: COR, theme_color: COR,
  icons: [{ src: "/tatame-192.png", sizes: "192x192", type: "image/png" }, { src: "/tatame-512.png", sizes: "512x512", type: "image/png" }, { src: "/tatame-icone.svg", sizes: "any", type: "image/svg+xml" }] };
const ICONES = ["tatame-icone.svg", "tatame-192.png", "tatame-512.png", "apple-touch-icon.png"];
if (require.main === module) {
  const html = montar(), saida = path.join(RAIZ, "index.html");
  if (process.argv.includes("--verificar")) {
    if (!fs.existsSync(saida) || fs.readFileSync(saida, "utf8") !== html) { console.error("index.html desatualizado: corre node montar.js"); process.exit(1); }
  } else {
    fs.writeFileSync(saida, html);
    fs.rmSync(PUBLICO, { recursive: true, force: true }); fs.mkdirSync(PUBLICO);
    fs.writeFileSync(path.join(PUBLICO, "index.html"), montarSite());
    fs.writeFileSync(path.join(PUBLICO, "manifest.webmanifest"), JSON.stringify(MANIFESTO, null, 2) + "\n");
    for (const f of ICONES) if (fs.existsSync(path.join(MARCA, f))) fs.copyFileSync(path.join(MARCA, f), path.join(PUBLICO, f));
  }
}
module.exports = { montar, montarSite, MANIFESTO, ICONES };
