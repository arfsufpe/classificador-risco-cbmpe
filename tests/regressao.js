// Regressão do simulador: abre o index.html local no Chromium headless (Playwright), percorre
// os cenários abaixo pela interface (digita, marca, clica em Continuar) e grava o desfecho de cada
// um em tests/saida-regressao.json. Imprime o sha256 do arquivo: mesmo hash = mesmo comportamento.
// Uso: ver tests/README.md.

const { chromium } = require('playwright');
const { createHash } = require('node:crypto');
const { writeFileSync } = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PAGINA = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;
const SAIDA = path.join(__dirname, 'saida-regressao.json');

// Um CNAE de cada nível dos Anexos (Decreto nº 61.082/2026).
const CNAE = {
    baixo: '4781400', // Comércio varejista de artigos do vestuário e acessórios
    medio: '2063100', // Fabricação de cosméticos, produtos de perfumaria e de higiene pessoal
    alto: '8610101',  // Atividades de atendimento hospitalar, exceto pronto-socorro
};
const PISOS = ['baixo', 'medio'];

// Etapas com fluxo de perguntas Sim/Não: prefixo do name dos radios e ordem das perguntas.
const FLUXOS = {
    eventos: { etapa: 'step-eventos', container: '#eventos-flow', prefixo: 'evt-' },
    area: { etapa: 'step-area', container: '#area-flow', prefixo: 'area-' },
    hospedagem: { etapa: 'step-hospedagem', container: '#hospedagem-flow', prefixo: 'hosp-' },
};

const registros = [];
let page;

// --- Interação com a página ---

async function abrir(cnaePrincipal, cnaeSecundarias) {
    await page.goto(PAGINA);
    await page.fill('#cnae-principal', cnaePrincipal);
    if (cnaeSecundarias) await page.fill('#cnae-secundarias', cnaeSecundarias);
    await continuar();
}

// Marca/desmarca como um clique do usuário (dispara o "change" que a página escuta).
async function clicarInput(seletor) {
    await page.locator(seletor).evaluate(el => el.click());
}

async function continuar() {
    await page.locator('.step.active .actions .btn-primary').click();
}

async function etapaAtiva() {
    return page.evaluate(() => {
        const r = document.getElementById('result');
        if (r.classList.contains('is-visible')) return 'result';
        const s = document.querySelector('.step.active');
        return s ? s.id : null;
    });
}

// Marca "Nenhuma das alternativas" e avança.
async function nenhuma() {
    await clicarInput('.step.active .check-item__input--none');
    await continuar();
}

async function responder(fluxo, q, valor) {
    const { container, prefixo } = FLUXOS[fluxo];
    await clicarInput(`${container} input[name="${prefixo}${q}"][value="${valor}"]`);
}

// Leva o percurso da Etapa 1 até a etapa pedida, pelo caminho "nada se aplica".
async function irPara(etapa, piso) {
    await abrir(CNAE[piso]);
    const ordem = ['step-alto-direto', 'step-alto-perigosos', 'step-baixo-bloco-a', 'step-eventos', 'step-area', 'step-hospedagem', 'step-baixo-bloco-b'];
    for (const atual of ordem) {
        if (atual === etapa) return;
        if (atual === 'step-eventos') { await responder('eventos', 'e1', 'nao'); await continuar(); }
        else if (atual === 'step-area') { await responder('area', 'p1', 'inteiro'); await responder('area', 'area-imovel', 'nao'); await responder('area', 'pav-imovel', 'nao'); await continuar(); }
        else if (atual === 'step-hospedagem') { await responder('hospedagem', 'h1', 'nao'); await continuar(); }
        else await nenhuma();
    }
}

// A partir da etapa ativa, termina o percurso com as respostas mais brandas (não acrescentam
// nenhum motivo): é o que distingue "esta etapa liberou" de "esta etapa classificou".
async function concluir() {
    for (let i = 0; i < 10; i++) {
        const etapa = await etapaAtiva();
        if (etapa === 'result' || etapa === null) return;
        if (etapa === 'step-eventos') { await responder('eventos', 'e1', 'nao'); await continuar(); }
        else if (etapa === 'step-area') { await responder('area', 'p1', 'inteiro'); await responder('area', 'area-imovel', 'nao'); await responder('area', 'pav-imovel', 'nao'); await continuar(); }
        else if (etapa === 'step-hospedagem') { await responder('hospedagem', 'h1', 'nao'); await continuar(); }
        else if (etapa === 'step-baixo-bloco-b') { await marcarTodosBlocoB(); await continuar(); }
        else await nenhuma();
    }
}

// Identificador estável de um item de checkbox: data-teste ou, na falta dele, o id do input.
// Item sem nenhum dos dois interrompe a regressão, para nunca cair de volta na posição.
async function identificadores(seletor) {
    const ids = await page.locator(seletor).evaluateAll(els => els.map(e => e.dataset.teste || e.id || ''));
    const semId = ids.findIndex(id => !id);
    if (semId >= 0) throw new Error(`Item ${semId + 1} de "${seletor}" sem data-teste nem id.`);
    if (new Set(ids).size !== ids.length) throw new Error(`Identificadores repetidos em "${seletor}": ${ids.join(', ')}`);
    return ids;
}

async function marcarTodosBlocoB() {
    const n = await page.locator('#step-baixo-bloco-b .check-item__input:not(.check-item__input--none)').count();
    for (let i = 0; i < n; i++) await page.locator('#step-baixo-bloco-b .check-item__input:not(.check-item__input--none)').nth(i).evaluate(el => el.click());
}

async function resultado() {
    return page.evaluate(() => {
        const box = document.getElementById('result');
        if (!box.classList.contains('is-visible')) return { risco: null, motivos: null };
        return { risco: document.getElementById('res-title').innerText.trim(), motivos: document.getElementById('res-desc').innerText.trim() };
    });
}

async function registrarResultado(id) {
    const r = await resultado();
    const reg = { id, risco: r.risco, motivos: r.motivos };
    if (!r.risco) reg.parouEm = await etapaAtiva();
    registros.push(reg);
}

// Estado de um fluxo de perguntas (sem resultado final): perguntas visíveis, respostas,
// mensagem de status e se o botão Continuar está liberado.
async function estadoFluxo(fluxo) {
    const { container, prefixo } = FLUXOS[fluxo];
    return page.evaluate(({ container, prefixo }) => {
        const flow = document.querySelector(container);
        const visiveis = [...flow.querySelectorAll('.area-q')].filter(f => !f.hidden && !f.closest('[hidden]')).map(f => f.dataset.q);
        const respostas = {};
        flow.querySelectorAll('input[type=radio]:checked').forEach(i => { respostas[i.name.slice(prefixo.length)] = i.value; });
        const step = flow.closest('.step');
        return {
            visiveis,
            respostas,
            status: flow.querySelector('.area-flow__status').textContent,
            continuarLiberado: !step.querySelector('.actions .btn-primary').disabled,
        };
    }, { container, prefixo });
}

async function valores(fluxo, q) {
    const { container, prefixo } = FLUXOS[fluxo];
    return (await page.locator(`${container} input[name="${prefixo}${q}"]`).evaluateAll(els => els.map(e => e.value))).sort();
}

// --- Cenários ---

async function cenariosCnae() {
    for (const nivel of ['baixo', 'medio', 'alto']) {
        await abrir(CNAE[nivel]);
        await concluir();
        await registrarResultado(`cnae/principal-${nivel}`);
    }
    await abrir(CNAE.baixo, CNAE.alto);
    await concluir();
    await registrarResultado('cnae/secundaria-alto');
    await abrir(CNAE.baixo, CNAE.medio);
    await concluir();
    await registrarResultado('cnae/secundaria-medio');
    await abrir('9999999');
    await concluir();
    await registrarResultado('cnae/fora-dos-anexos');
}

// Etapas 2, 3 e 4: cada item marcado sozinho (inclui o item da loja em posto de combustíveis).
async function cenariosItens() {
    const etapas = [['etapa2', 'step-alto-direto'], ['etapa3', 'step-alto-perigosos'], ['etapa4', 'step-baixo-bloco-a']];
    for (const piso of PISOS) {
        for (const [nome, etapa] of etapas) {
            await irPara(etapa, piso);
            const sel = `#${etapa} .check-item__input:not(.check-item__input--none)`;
            const ids = await identificadores(sel);
            for (let i = 0; i < ids.length; i++) {
                if (i > 0) await irPara(etapa, piso);
                await page.locator(sel).nth(i).evaluate(el => el.click());
                await continuar();
                await concluir();
                await registrarResultado(`${nome}/${ids[i]}/cnae-${piso}`);
            }
        }
    }
}

// Fluxos de perguntas (Etapas 5, 6 e 7): todos os caminhos e, em cada caminho, a troca de cada
// resposta já dada. Os valores são percorridos em ordem alfabética, então a ordem das opções na
// tela não altera os identificadores. Estado registrado com o CNAE de risco baixo; os caminhos
// que liberam o Continuar são levados até o resultado final com os dois pisos de CNAE.
async function explorarFluxo(fluxo, nome) {
    const { etapa } = FLUXOS[fluxo];
    const fmt = caminho => caminho.map(([q, v]) => `${q}=${v}`).join(',') || 'inicio';
    const caminhos = [];

    const visitar = async caminho => {
        await irPara(etapa, 'baixo');
        for (const [q, v] of caminho) await responder(fluxo, q, v);
        const estado = await estadoFluxo(fluxo);
        registros.push({ id: `${nome}/caminho/${fmt(caminho)}`, risco: null, motivos: null, estado });
        caminhos.push({ caminho, liberado: estado.continuarLiberado });
        if (estado.continuarLiberado) return;
        const proxima = estado.visiveis.find(q => !(q in estado.respostas));
        for (const v of await valores(fluxo, proxima)) await visitar([...caminho, [proxima, v]]);
    };
    await visitar([]);

    for (const { caminho } of caminhos) {
        for (const [q, v] of caminho) {
            for (const alt of await valores(fluxo, q)) {
                if (alt === v) continue;
                await irPara(etapa, 'baixo');
                for (const [q2, v2] of caminho) await responder(fluxo, q2, v2);
                await responder(fluxo, q, alt);
                registros.push({ id: `${nome}/troca/${fmt(caminho)}/${q}->${alt}`, risco: null, motivos: null, estado: await estadoFluxo(fluxo) });
            }
        }
    }

    for (const piso of PISOS) {
        for (const { caminho, liberado } of caminhos) {
            if (!liberado) continue;
            await irPara(etapa, piso);
            for (const [q, v] of caminho) await responder(fluxo, q, v);
            await continuar();
            await concluir();
            await registrarResultado(`${nome}/final/${fmt(caminho)}/cnae-${piso}`);
        }
    }
}

// Etapa 8: todos marcados, cada um faltando (os demais marcados) e "Nenhuma".
async function cenariosEtapa8() {
    for (const piso of PISOS) {
        const sel = '#step-baixo-bloco-b .check-item__input:not(.check-item__input--none)';
        await irPara('step-baixo-bloco-b', piso);
        const ids = await identificadores(sel);
        await marcarTodosBlocoB();
        await continuar();
        await registrarResultado(`etapa8/todos/cnae-${piso}`);
        for (let i = 0; i < ids.length; i++) {
            await irPara('step-baixo-bloco-b', piso);
            await marcarTodosBlocoB();
            await page.locator(sel).nth(i).evaluate(el => el.click());
            await continuar();
            await registrarResultado(`etapa8/falta-${ids[i]}/cnae-${piso}`);
        }
        await irPara('step-baixo-bloco-b', piso);
        await nenhuma();
        await registrarResultado(`etapa8/nenhuma/cnae-${piso}`);
    }
}

// showResult chamado direto em cada nível, com cada piso de CNAE e com o piso de critério
// (hoje inativo, ver RISCO_LOJA_EM_POSTO): cobre as quatro composições de texto do resultado.
async function cenariosShowResult() {
    for (const piso of PISOS) {
        for (const criterio of [1, 2]) {
            for (const risco of [1, 2, 3]) {
                await page.goto(PAGINA);
                await page.evaluate(({ codigo, piso, criterio, risco }) => {
                    cnaeState = piso === 'medio' ? { floor: 2, matched: codigo, level: 'medio' } : { floor: 1, matched: null, level: 'baixo' };
                    criterioState = criterio === 2 ? { floor: 2, reason: 'critério de teste' } : { floor: 1, reason: null };
                    showResult(risco, `Motivo de teste para risco ${risco}.`);
                }, { codigo: CNAE[piso], piso, criterio, risco });
                await registrarResultado(`showResult/risco-${risco}/cnae-${piso}/criterio-${criterio}`);
            }
        }
    }
}

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
    page = await context.newPage();
    page.setDefaultTimeout(5000);
    const erros = [];
    page.on('pageerror', e => erros.push(e.message));

    await cenariosCnae();
    await cenariosItens();
    await explorarFluxo('eventos', 'etapa5-eventos');
    await explorarFluxo('area', 'etapa6-area');
    await explorarFluxo('hospedagem', 'etapa7-hospedagem');
    await cenariosEtapa8();
    await cenariosShowResult();

    await browser.close();

    if (erros.length) {
        console.error('Erros de JavaScript na página:\n' + [...new Set(erros)].join('\n'));
        process.exitCode = 1;
    }

    const conteudo = JSON.stringify(registros, null, 2) + '\n';
    writeFileSync(SAIDA, conteudo);
    const hash = createHash('sha256').update(conteudo).digest('hex');
    const finais = registros.filter(r => r.risco).length;
    console.log(`${registros.length} cenários (${finais} com resultado final, ${registros.length - finais} de estado dos fluxos)`);
    console.log(`sha256 ${hash}  tests/saida-regressao.json`);
})().catch(e => { console.error(e); process.exit(1); });
