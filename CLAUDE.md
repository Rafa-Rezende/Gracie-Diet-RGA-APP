# Gracie Diet

App web de telemóvel com o método de alimentação da família Gracie para quem treina jiu-jitsu: "posso juntar?", as 3 refeições à volta do treino com registo, e modo competidor com as categorias de peso da IBJJF. Do Rafael (treina na Ralph Gracie Portugal; quer mostrar ao professor e talvez propor ao grupo RGA). Produto e utilizadores: [PRODUCT.md](PRODUCT.md). Decisões e porquês: [docs/historico.md](docs/historico.md). Estado e próximos passos: [docs/pendentes.md](docs/pendentes.md).

## Onde está

- Repositório: `Rafa-Rezende/Gracie-Diet-RGA-APP` (pasta local costuma ser `tatame`, o nome provisório antigo).
- Site: Vercel, publica sozinho a cada push no `main` (o utilizador ainda não partilhou o endereço; perguntar e registar aqui).
- Pré-visualização privada: https://claude.ai/artifact/GkH3zRjjvCobJBAxt4R4AY (republicar com a ferramenta Artifact, `file_path` = `index.html`).

## Estrutura

- `src/regras.js`: grupos dos alimentos e regras das refeições (`grupo`, `problemas`, `podeEntrar`, horas). **Portado do mycros** (`macros/gracie.py`), com os mesmos casos de teste: mudar uma regra = mudar também lá ou registar a divergência.
- `src/categorias.js`: tabela IBJJF de adulto (gi/no-gi, masc./fem.) e `plano()` até ao peso. **Tabela base a confirmar** com a oficial (o ibjjf.com está bloqueado na rede destas sessões).
- `src/alimentos.js`: catálogo para escolher. `src/app.js`: ecrãs. `src/pagina.html`: CSS e estrutura.
- `montar.js`: gera `publico/` (site, ignorado no git) e `index.html` (pré-visualização). `marca/`: ícones.
- `test/`: `node --test` (79 testes), sem dependências.

## Comandos

- `npm test` · `node montar.js` (sempre depois de mudar `src/`; o teste de montagem falha se o `index.html` ficar para trás).

## Regras

- Ecrã em **português de Portugal**, por "tu".
- Nome **Gracie Diet**, sempre como "app não oficial, baseado no livro *The Gracie Diet*, de Rorion Gracie (2010)". **Nunca** pôr logos ou marcas da família Gracie, Ralph Gracie, Renzo Gracie ou RGA no código (o utilizador pediu a logo da RGA; recusado: parecia oficial sem autorização). Há um campo para cada pessoa pôr a logo da sua academia.
- Honestidade: as justificações do livro não têm suporte científico; o app segue o método, não promete saúde. Competidor: nada de cortes de água (na IBJJF a pesagem é antes da luta), ritmo seguro até ~1 % do peso por semana.
- Dados só no telemóvel (`localStorage`, chave `tatame:v1`; não mudar a chave sem migrar). Sem contas, sem servidor.
- Registar numa refeição só mostra os grupos dessa refeição e bloqueia o que quebraria a combinação (`podeEntrar`). O "Posso juntar?" é livre.
- Visual: ver o estado em `docs/pendentes.md` antes de mexer. Usar a skill `impeccable` (as regras mínimas proíbem etiqueta pequena por cima de títulos).
