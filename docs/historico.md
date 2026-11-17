# Histórico de decisões

## 2026-11-17

- **Origem.** O Rafael quis um app só da dieta Gracie, focado em jiu-jitsu, para o professor dele (Ralph Gracie Portugal) e talvez apresentar ao grupo RGA (Renzo/Ryan/Ralph, com a Kyra). Público: praticantes, alunos e competidores por igual, chegando direto a cada um (não via academia).
- **Motor de regras reaproveitado do mycros** (`macros/gracie.py`, já com 19 testes e 54 casos). Portado para JS com os mesmos casos; no caminho, corrigidos "nozes", "cereais" e "frutos vermelhos", que o corte do plural não reconhecia (o mycros tem a mesma falha).
- **Sem login na v1**: dados no telemóvel, para o professor abrir e usar já. Contas e painel do professor ficam para depois.
- **Stack**: HTML/JS sem dependências, montado por `montar.js`, no Vercel (igual ao Rota de Estudos).
- **Categorias IBJJF**: fontes públicas concordam nas leves e divergem nas pesadas (ex.: feminino gi, meio-pesado 74 ou 76,1 kg). Ficou uma tabela base, marcada para confirmar.
- **Nome**: começou como "Tatame" (provisório); o utilizador escolheu "Gracie Diet". Marca de terceiros recusada (ver CLAUDE.md).
- **Registo por refeição**: o utilizador reclamou que dava para pôr alimentos errados; passou a mostrar só os grupos da refeição e a bloquear combinações com o porquê (`podeEntrar`, testado).
- **Visual, ronda 1** (skill impeccable; sorteio em modo reduzido por falta de rede): direções "Placar de campeonato" e "Parede da academia"; o utilizador quis comparar as duas e preferiu a Parede, mas achou difícil de ler. Corrigido o contraste (bloqueados estavam 1,9:1), letra 16 px, cartões vs. fundo.
- **Visual, ronda 2**: o utilizador achou a Parede "muito cartoon, não parece app de dieta e fitness". Mostradas 3 linhas do padrão da categoria no ecrã Hoje: 1) Dados (tipo MacroFactor), 2) iPhone Saúde, 3) Atleta escuro (tipo WHOOP). **Escolha pendente.**
