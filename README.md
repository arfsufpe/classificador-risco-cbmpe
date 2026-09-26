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

### Princípios

- **P1 — Ordem das perguntas.** Primeiro o CNAE (Anexo II); depois as situações que, sozinhas, já caracterizam Risco III sem depender de contexto (Art. 6º, caput c/c Anexo II; III; IV; V; VI; VIII; X; XI; XII); em seguida as hipóteses diretas de Risco I (Art. 5º, I, II, III, IV e VI), cada uma com as ressalvas de contexto que a tornariam Risco III, já que o Art. 5º, caput, ressalva as atividades de alto risco; por fim, uma a uma, as perguntas que dependem de contexto: evento temporário, área e pavimentos, hospedagem e as condições cumulativas do pequeno estabelecimento. O que não se enquadra nos arts. 5º e 6º é Risco II (Art. 7º, caput).
- **P2 — O risco nunca diminui.** (a) Todo resultado de Risco II ou III encerra o questionário imediatamente; nenhuma etapa posterior é executada. (b) O piso do CNAE de Risco Médio (Art. 3º, II c/c Anexo II) é aplicado por `Math.max()` no resultado, que nunca fica abaixo dele. (c) Risco I só é atribuído depois de descartadas todas as situações diretas de Risco III. (d) Nenhum resultado pode ficar abaixo de um nível já apurado no mesmo percurso.

### Etapas

1. **Etapa 1 — CNAE:** o usuário informa o(s) código(s) CNAE da empresa.
   - Se algum CNAE constar em `CNAE_ALTO_RISCO` (Anexo II), o resultado é **Risco III** imediatamente.
   - Se algum CNAE constar em `CNAE_MEDIO_RISCO`, é aplicado um **piso mínimo de Risco II** (Art. 3º, II c/c Anexo II): o questionário continua, mas o resultado final nunca fica abaixo disso.
   - CNAEs fora das duas listas (nível I no decreto) não aplicam piso algum.
2. **Etapa 2 — Risco Alto (situações diretas):** casa de festas/discoteca de forma permanente (Art. 6º, caput c/c Anexo II), reunião de público com mais de 100 pessoas, inclusive em eventos (Art. 6º, III), hotel/pousada/pensão com mais de 40 leitos (IV), mais de 1.000 L de líquidos combustíveis ou inflamáveis (V), hospital ou pacientes com locomoção dificultada (VI), central de GLP acima de 190 kg ou revenda de GLP (VIII e X), outros gases combustíveis em recipientes (XI) e produtos perigosos (XII). Basta UMA marcada para o resultado ser **Risco III** imediatamente; a justificativa cita o inciso de cada item.
3. **Etapa 3 — Risco Baixo (hipóteses diretas):** atividade em residência unifamiliar com até 930 m² e até 3 pavimentos (Art. 5º, I), domicílio fiscal/atividade digital ou externa (II), ambulante isolado na via pública (III), tenda/barraca de até 200 m² (IV) e estrutura técnica desabitada de até 200 m² (VI). Os itens de residência e tenda excluem evento temporário, e os de residência e estrutura técnica excluem os casos que seriam Risco III pela área ou pelos pavimentos (Art. 6º, I e II). Basta UMA marcada para o resultado ser **Risco I**.
4. **Etapa 4 — Eventos temporários:** fluxo Sim/Não encadeado.
   - **Evento temporário?** Não → segue para a Etapa 5.
   - **Controle ou restrição de acesso de público?** Sim → **Risco III** (Art. 6º, XV).
   - **Área construída, ocupada ou montada > 930 m², ou camarotes/arquibancadas para mais de 100 pessoas?** Sim → **Risco III** (Art. 6º, XIV). Não → **Risco II**, pois evento temporário que reúne público nunca é Risco I (Art. 5º, VII, "m", c/c Art. 7º, caput). Eventos nunca passam para as Etapas 5 a 7.
5. **Etapa 5 — Área e andares:** fluxo Sim/Não encadeado para o Art. 6º, I (área > 930 m², podendo desconsiderar a área de residência unifamiliar com acesso independente direto para a via pública) e II (mais de 3 pavimentos, sem contar subsolo exclusivo de estacionamento sem abastecimento), com a exceção do **Art. 7º, §3º**.
   - **Prédio inteiro:** área > 930 m² → **Risco III** (I); senão, mais de 3 pavimentos → **Risco III** (II); senão, segue.
   - **Unidade dentro de prédio maior:** pergunta primeiro pelo prédio. Se o prédio não tem área > 930 m² nem mais de 3 pavimentos, a exceção nem é perguntada e o fluxo segue. Se aciona o inciso I ou II, pergunta as condições do §3º (somente térreo, área própria até 930 m², sistemas preventivos independentes, sem acesso às áreas comuns, saída direta para a via pública): qualquer "Não" → **Risco III**; todas "Sim" → **Risco II final** (Art. 7º, §3º), sem passar pelas Etapas 6 e 7.
6. **Etapa 6 — Hospedagem:** condição cumulativa do **Art. 5º, VII, "e"**, perguntada à parte por só valer para hotéis, pousadas e pensões (mais de 40 leitos já terminou em Risco III na Etapa 2). Se não é hospedagem, ou se tem no máximo 16 leitos, segue para a Etapa 7; com mais de 16 leitos, o resultado é **Risco II por exclusão**.
7. **Etapa 7 — Pequeno estabelecimento (Art. 5º, VII):** edificação com área total ≤ 200 m² e exclusivamente térrea — considerando o prédio inteiro, não só a unidade, se a empresa estiver dentro de prédio, galeria ou shopping —, saída direta e sem aberturas para vizinhos, limites de GLP e de inflamáveis. As demais alíneas do inciso VII já foram verificadas antes (reunião de público, hospital, gases e produtos perigosos na Etapa 2; evento temporário na Etapa 4; hospedagem na Etapa 6). Só é **Risco I** se **TODOS** os itens forem marcados; caso contrário, **Risco II por exclusão** (Art. 7º, caput).
8. **Resultado final:** `Math.max()` entre o risco apurado pelo questionário e o piso definido pelo CNAE (quando houver).

Nas etapas 2, 3 e 7, o botão de avançar só habilita depois de uma escolha explícita: ao menos um item marcado ou a opção **"Nenhuma das alternativas anteriores"**, que é exclusiva (marcá-la desmarca as demais, e vice-versa). Nas etapas 4, 5 e 6, o botão só habilita quando o fluxo de perguntas Sim/Não está totalmente respondido. Os textos de ajuda ("Como responder") ficam sempre visíveis, sem precisar de clique.

## Atualizando a lista de CNAEs

As listas `CNAE_ALTO_RISCO` e `CNAE_MEDIO_RISCO` em `script.js` foram geradas a partir da coluna **`CBMPE_nivel`** do CSV consolidado (não usar `Nivel_de_risco`, que traz valores ambíguos como "II ou III" para parte das linhas). Para atualizar:

1. Substitua o CSV na raiz do projeto por uma versão mais recente, mantendo as mesmas colunas (`;` como delimitador).
2. Filtre as linhas com `CBMPE_nivel = III` (alto risco) e `CBMPE_nivel = II` (médio risco) e gere os arrays de `CNAE_numerico` correspondentes — CNAEs de nível I não precisam ser listados, pois "baixo" é o piso padrão do código.
3. Um mesmo CNAE não deve constar em mais de uma lista.

## Fonte legal

Decreto Estadual nº 52.005/2021 (Pernambuco), que instituiu as regras e a lógica de classificação de risco de incêndio para fins de licenciamento do Corpo de Bombeiros Militar de Pernambuco. O Decreto nº 61.082/2026 alterou apenas as listas de CNAE dos Anexos I e II, e é dele a versão consolidada usada no CSV e em `script.js`.
