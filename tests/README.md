# Regressão do simulador

## Como rodar

Na pasta `tests/`. A primeira vez instala o Playwright e o Chromium:

```
npm install
npx playwright install chromium
```

A cada execução:

```
npm run regressao
```

O script abre o `index.html` local no Chromium headless, grava `tests/saida-regressao.json` e imprime o número de cenários e o sha256 desse arquivo. Leva cerca de 1 minuto e 20 segundos.

## O que cobre

Cada cenário é percorrido pela tela, como um usuário faria: digitar o CNAE, marcar as opções e clicar em Continuar. Para cada cenário, o JSON guarda o identificador, o risco final e os motivos exibidos. Nos estados intermediários dos fluxos de perguntas, guarda também as perguntas visíveis, as respostas, a mensagem de status e se o Continuar está liberado.

- **CNAE (Etapa 1):** baixo, médio e alto na atividade principal; alto e médio na secundária; código fora dos Anexos.
- **Etapas 2, 3 e 4:** cada item marcado sozinho (inclui a loja em posto de combustíveis), com CNAE baixo e médio.
- **Etapa 5 (eventos), Etapa 6 (área e andares) e Etapa 7 (hospedagem):** todos os caminhos de resposta e, em cada caminho, a troca de cada resposta já dada. Na Etapa 6, são os 31 caminhos e as 132 trocas. Os caminhos que liberam o Continuar são levados até o resultado final, com CNAE baixo e médio.
- **Etapa 8:** todos os itens marcados, cada item faltando e "Nenhuma", com CNAE baixo e médio.
- **showResult:** chamado direto com risco I, II e III, com cada piso de CNAE e com o piso de critério da loja em posto (hoje inativo).

Quando um cenário só termina numa etapa posterior, o script completa o percurso com as respostas que não acrescentam motivo. Por exemplo, um evento que libera o Continuar segue com "prédio inteiro, até 930 m², até 3 pavimentos", depois "não é hospedagem" e todos os itens da Etapa 8.

## Regra de uso

1. Antes de qualquer mudança, rode e anote o hash.
2. Depois da mudança, rode de novo.
3. **Hash igual:** nenhum cenário mudou.
4. **Hash diferente:** `git diff tests/saida-regressao.json` mostra exatamente quais cenários mudaram e como. Se a mudança for intencional, faça o commit do JSON junto com ela: ele vira a nova linha de base.

Os identificadores não dependem da posição na tela:

- Nos fluxos de perguntas, usam os `value` das respostas, em ordem alfabética.
- Nas Etapas 2, 3, 4 e 8, usam o atributo `data-teste` de cada checkbox (ou o `id`, como em `chk-loja-posto`).

Por isso, trocar só a ordem de opções ou itens na tela não altera o hash. Item novo nessas etapas precisa de um `data-teste` próprio. Sem ele, o script para e indica qual item está sem identificador.
