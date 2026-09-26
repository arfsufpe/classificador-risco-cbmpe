# Classificador de Risco - CBMPE

Página estática que guia o usuário por um questionário para determinar a classificação de risco de incêndio (Risco I, II ou III) de um estabelecimento, conforme o **Decreto Estadual nº 52.005/2021 (atualizado pelo Decreto nº 61.082/2026)**.

## Como usar

Basta abrir o arquivo [`index.html`](index.html) diretamente no navegador (duplo clique ou `Start-Process` no Windows). Não há build, servidor ou dependências — é HTML/CSS/JS puro, funcionando via `file://`.

## Estrutura do projeto

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Markup das etapas do questionário e da tela de resultado |
| `style.css` | Estilos visuais — sem dependências externas, inclusive fontes (usa apenas fontes do sistema) |
| `script.js` | Lógica do questionário, listas de CNAE e regras de classificação |
| `Classificacao de risco - CNAEs consolidados (Decreto 61.082-2026).csv` | Base de dados oficial dos CNAEs, usada para gerar as listas em `script.js` |

O visual segue o **Padrão Digital de Pernambuco** (azul `#0034B7`, amarelo `#FFB60C`, azul médio `#4067C9`), com os níveis de risco mantendo cores semânticas próprias (verde/âmbar/vermelho) para leitura imediata do resultado.

## Como funciona a classificação

1. **Etapa 1 — CNAE:** o usuário informa o(s) código(s) CNAE da empresa.
   - Se algum CNAE constar em `CNAE_ALTO_RISCO`, o resultado é **Risco III** imediatamente, sem passar pelas demais perguntas.
   - Se algum CNAE constar em `CNAE_MEDIO_RISCO`, é aplicado um **piso mínimo de Risco II** — o questionário continua, mas o resultado final nunca fica abaixo disso.
   - CNAEs fora das duas listas (nível I no decreto) não aplicam piso algum.
2. **Etapa 2 — Eventos e casas de festas:** casa de festas fixa, evento temporário com controle de acesso (Art. 6º, XV) ou evento temporário aberto com área montada > 930 m² ou camarotes/arquibancadas para mais de 100 pessoas (Art. 6º, XIV). Basta UMA marcada para o resultado ser Risco III imediatamente. Fica logo após o CNAE para quem organiza evento não precisar responder perguntas sobre edificações fixas.
3. **Etapa 3 — Risco Alto:** situações que classificam o estabelecimento como Risco III (área, andares, público, hospedagem, GLP, inflamáveis, gases combustíveis, produtos perigosos, saúde). Basta UMA para o resultado ser Risco III imediatamente.
   - A área é respondida por um fluxo de perguntas Sim/Não reveladas progressivamente, que aplica a exceção do **Art. 7º, §3º**: unidade exclusivamente no térreo, com até 930 m², dentro de prédio maior, sem compartilhar sistemas preventivos, sem acesso às áreas comuns e com saída direta para a rua não é enquadrada pela área do prédio. Quando a exceção se aplica e o resultado final é Risco II, a justificativa cita o artigo.
4. **Etapa 4 — Bloco A de Risco Baixo:** hipóteses diretas de isenção (domicílio fiscal/digital, atividade em casa, ambulante isolado na via pública, tenda, estrutura técnica). Basta UMA marcada para o resultado ser Risco I.
5. **Etapa 5 — Bloco B de Risco Baixo:** critérios do pequeno estabelecimento físico (≤200 m², térreo, isolado, limites de GLP/inflamáveis). Só é Risco I se **TODOS** os critérios forem marcados; caso contrário, o resultado é **Risco II por exclusão**.
6. **Resultado final:** `Math.max()` entre o risco apurado pelo questionário e o piso definido pelo CNAE (quando houver).

Nas etapas 2 a 5, o botão de avançar só habilita depois de uma escolha explícita: ao menos um item marcado ou a opção **"Nenhuma das alternativas anteriores"**, que é exclusiva (marcá-la desmarca as demais, e vice-versa). Os textos de ajuda ("Como responder") ficam sempre visíveis, sem precisar de clique.

## Atualizando a lista de CNAEs

As listas `CNAE_ALTO_RISCO` e `CNAE_MEDIO_RISCO` em `script.js` foram geradas a partir da coluna **`CBMPE_nivel`** do CSV consolidado (não usar `Nivel_de_risco`, que traz valores ambíguos como "II ou III" para parte das linhas). Para atualizar:

1. Substitua o CSV na raiz do projeto por uma versão mais recente, mantendo as mesmas colunas (`;` como delimitador).
2. Filtre as linhas com `CBMPE_nivel = III` (alto risco) e `CBMPE_nivel = II` (médio risco) e gere os arrays de `CNAE_numerico` correspondentes — CNAEs de nível I não precisam ser listados, pois "baixo" é o piso padrão do código.
3. Um mesmo CNAE não deve constar em mais de uma lista.

## Fonte legal

Decreto Estadual nº 52.005/2021 (Pernambuco), que instituiu as regras e a lógica de classificação de risco de incêndio para fins de licenciamento do Corpo de Bombeiros Militar de Pernambuco. O Decreto nº 61.082/2026 alterou apenas as listas de CNAE dos Anexos I e II, e é dele a versão consolidada usada no CSV e em `script.js`.
