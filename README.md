# Classificador de Risco - CBMPE

Página estática que guia o usuário por um questionário para determinar a classificação de risco de incêndio (Risco I, II ou III) de um estabelecimento, conforme o **Decreto Estadual 61.082/2026**.

## Como usar

Basta abrir o arquivo [`classificador_cbmpe_v4.html`](classificador_cbmpe_v4.html) diretamente no navegador (duplo clique ou `Start-Process` no Windows). Não há build, servidor ou dependências — é HTML/CSS/JS puro, funcionando via `file://`.

## Estrutura do projeto

| Arquivo | Conteúdo |
|---|---|
| `classificador_cbmpe_v4.html` | Markup das etapas do questionário e da tela de resultado |
| `style.css` | Estilos visuais |
| `script.js` | Lógica do questionário, listas de CNAE e regras de classificação |
| `Classificacao de risco - CNAEs consolidados (Decreto 61.082-2026).csv` | Base de dados oficial dos CNAEs, usada para gerar as listas em `script.js` |

## Como funciona a classificação

1. **Etapa 1 — CNAE:** o usuário informa o(s) código(s) CNAE da empresa.
   - Se algum CNAE constar em `CNAE_ALTO_RISCO`, o resultado é **Risco III** imediatamente, sem passar pelas demais perguntas.
   - Se algum CNAE constar em `CNAE_MEDIO_RISCO`, é aplicado um **piso mínimo de Risco II** — o questionário continua, mas o resultado final nunca fica abaixo disso.
   - CNAEs fora das duas listas (nível I no decreto) não aplicam piso algum.
2. **Etapas seguintes:** perguntas sobre natureza da atividade, presença de materiais/situações de alto risco, localização (imóvel isolado ou dentro de estrutura maior), dimensões do imóvel e casos especiais de baixo risco.
3. **Resultado final:** `Math.max()` entre o risco apurado pelo questionário e o piso definido pelo CNAE (quando houver).

## Atualizando a lista de CNAEs

As listas `CNAE_ALTO_RISCO` e `CNAE_MEDIO_RISCO` em `script.js` foram geradas a partir da coluna **`CBMPE_nivel`** do CSV consolidado (não usar `Nivel_de_risco`, que traz valores ambíguos como "II ou III" para parte das linhas). Para atualizar:

1. Substitua o CSV na raiz do projeto por uma versão mais recente, mantendo as mesmas colunas (`;` como delimitador).
2. Filtre as linhas com `CBMPE_nivel = III` (alto risco) e `CBMPE_nivel = II` (médio risco) e gere os arrays de `CNAE_numerico` correspondentes — CNAEs de nível I não precisam ser listados, pois "baixo" é o piso padrão do código.
3. Um mesmo CNAE não deve constar em mais de uma lista.

## Fonte legal

Decreto Estadual 61.082/2026 (Pernambuco) — classificação de risco de incêndio para fins de licenciamento do Corpo de Bombeiros Militar de Pernambuco.
