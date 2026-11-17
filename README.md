# Tatame

O método de alimentação da família Gracie para quem treina jiu-jitsu, no telemóvel.

- **Posso juntar?** escolhe os alimentos do prato e vê se a combinação segue o método, e porquê.
- **Hoje:** as 3 refeições (com 4 h 30 entre elas) encaixadas à volta do treino, com registo e aviso quando uma refeição quebra as regras.
- **Competir:** categorias de peso de adulto da IBJJF (gi e no-gi, masculino e feminino), quanto falta até ao limite e se o ritmo até à data do campeonato é seguro (até ~1 % do peso por semana). Sem cortes de água: na IBJJF a pesagem é antes da luta.
- **Método:** os grupos do livro, as regras e o que a ciência diz sobre elas.

Os dados ficam no telemóvel de cada pessoa (com cópia para exportar e importar). Sem contas, sem servidor.

Fonte das regras: Rorion Gracie, *The Gracie Diet* (Gracie Publications, 2010). App independente, sem ligação à família Gracie nem a academias. As categorias de peso são uma **tabela base, a confirmar** com a tabela oficial em ibjjf.com (`src/categorias.js`).

## Código

| | |
|---|---|
| `src/regras.js` | grupos dos alimentos e regras das refeições (portado do mycros, com os mesmos casos de teste) |
| `src/categorias.js` | tabela de categorias e o plano até ao peso |
| `src/alimentos.js` | alimentos para escolher depressa |
| `src/app.js`, `src/pagina.html` | ecrãs e visual |
| `montar.js` | gera `publico/` (o site) e `index.html` (pré-visualização) |
| `test/` | `node --test`, sem dependências |

```bash
npm test
```

No Vercel: importar o repositório e fazer Deploy (o `vercel.json` já diz como montar).
