// Regras de classificação: Decreto Estadual nº 52.005/2021 (atualizado pelo Decreto nº 61.082/2026).
//
// PRINCÍPIOS
// P1. Ordem das perguntas:
//   1º) CNAE (Anexo II) — Etapa 1.
//   2º) Situações que, sozinhas, já caracterizam Risco III, sem depender de contexto
//       (Art. 6º, caput c/c Anexo II; III; IV; V; VI; VIII; X; XI; XII) — Etapa 2.
//   3º) Hipóteses diretas de Risco I (Art. 5º, I, II, III, IV e VI) — Etapa 3. Como o
//       Art. 5º, caput, ressalva as atividades de alto risco, cada item traz no próprio texto
//       as ressalvas de contexto que o tornariam Risco III.
//   4º) Perguntas que dependem de contexto, uma a uma: evento temporário (Art. 6º, XIV e XV;
//       Art. 5º, VII, "m") — Etapa 4; área e pavimentos (Art. 6º, I e II, com a exceção do
//       Art. 7º, §3º) — Etapa 5; hospedagem (Art. 5º, VII, "e") — Etapa 6; e as condições
//       cumulativas do pequeno estabelecimento (Art. 5º, VII) — Etapa 7.
//   O que não se enquadra nos arts. 5º e 6º é Risco II (Art. 7º, caput).
// P2. O risco nunca diminui — ver o comentário acima de showResult().
//
// --- LISTAS DE CNAE ---
// Fonte das listas: Anexos I e II na versão consolidada pelo Decreto nº 61.082/2026 (coluna CBMPE_nivel),
// único decreto que alterou os Anexos.
// Códigos não listados aqui (nível I) usam o piso padrão 'baixo'.
const CNAE_ALTO_RISCO = [
    '0600001', // Extração de petróleo e gás natural
    '1910100', // Coquerias
    '1921700', // Fabricação de produtos do refino de petróleo
    '1922501', // Formulação de combustíveis
    '1922502', // Rerrefino de óleos lubrificantes
    '1922599', // Fabricação de outros produtos derivados do petróleo, exceto produtos do refino
    '1931400', // Fabricação de álcool
    '1932200', // Fabricação de biocombustíveis, exceto álcool
    '2014200', // Fabricação de gases industriais
    '2019301', // Elaboração de combustíveis nucleares
    '2021500', // Fabricação de produtos petroquímicos básicos
    '2071100', // Fabricação de tintas, vernizes, esmaltes e lacas
    '2072000', // Fabricação de tintas de impressão
    '2073800', // Fabricação de impermeabilizantes, solventes e produtos afins
    '2092401', // Fabricação de pólvoras, explosivos e detonantes
    '2092402', // Fabricação de artigos pirotécnicos
    '2092403', // Fabricação de fósforos de segurança
    '2093200', // Fabricação de aditivos de uso industrial
    '2550101', // Fabricação de equipamento bélico pesado, exceto veículos militares de combate
    '2550102', // Fabricação de armas de fogo, outras armas e munições
    '2599399', // Fabricação de outros produtos de metal não especificados anteriormente
    '2721000', // Fabricação de pilhas, baterias e acumuladores elétricos, exceto para veículos automotores
    '2722801', // Fabricação de baterias e acumuladores para veículos automotores
    '2722802', // Recondicionamento de baterias e acumuladores para veículos automotores
    '3511501', // Geração de energia elétrica
    '3512300', // Transmissão de energia elétrica
    '3514000', // Distribuição de energia elétrica
    '3520401', // Produção de gás; processamento de gás natural
    '3520402', // Distribuição de combustíveis gasosos por redes urbanas
    '4681801', // Comércio atacadista de álcool carburante, biodiesel, gasolina e demais derivados de petróleo, exceto lubrificantes, não realizado por TRR
    '4681802', // Comércio atacadista de combustíveis realizado por transportador retalhista (TRR)
    '4681804', // Comércio atacadista de combustíveis de origem mineral em bruto
    '4682600', // Comércio atacadista de gás liqüefeito de petróleo (GLP)
    '4731800', // Comércio varejista de combustíveis para veículos automotores
    '4784900', // Comércio varejista de gás liqüefeito de petróleo (GLP)
    '4789006', // Comércio varejista de fogos de artifício e artigos pirotécnicos
    '8230002', // Casas de festas e eventos
    '8610101', // Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências
    '9321200', // Parques de diversão e parques temáticos
    '9329801', // Discotecas, danceterias, salões de dança e similares
];

const CNAE_MEDIO_RISCO = [
    '1621800', // Fabricação de madeira laminada e de chapas de madeira compensada, prensada e aglomerada
    '2011800', // Fabricação de cloro e álcalis
    '2012600', // Fabricação de intermediários para fertilizantes
    '2013401', // Fabricação de adubos e fertilizantes organo-minerais
    '2013402', // Fabricação de adubos e fertilizantes, exceto organo-minerais
    '2019399', // Fabricação de outros produtos químicos inorgânicos não especificados anteriormente
    '2022300', // Fabricação de intermediários para plastificantes, resinas e fibras
    '2029100', // Fabricação de produtos químicos orgânicos não especificados anteriormente
    '2031200', // Fabricação de resinas termoplásticas
    '2032100', // Fabricação de resinas termofixas
    '2033900', // Fabricação de elastômeros
    '2040100', // Fabricação de fibras artificiais e sintéticas
    '2051700', // Fabricação de defensivos agrícolas
    '2052500', // Fabricação de desinfestantes domissanitários
    '2061400', // Fabricação de sabões e detergentes sintéticos
    '2062200', // Fabricação de produtos de limpeza e polimento
    '2063100', // Fabricação de cosméticos, produtos de perfumaria e de higiene pessoal
    '2091600', // Fabricação de adesivos e selantes
    '3299099', // Fabricação de produtos diversos não especificados anteriormente
    '3513100', // Comércio atacadista de energia elétrica
    '3812200', // Coleta de resíduos perigosos
    '3821100', // Tratamento e disposição de resíduos não-perigosos
    '3822000', // Tratamento e disposição de resíduos perigosos
    '4679601', // Comércio atacadista de tintas, vernizes e similares
    '4681803', // Comércio atacadista de combustíveis de origem vegetal, exceto álcool carburante
    '4681805', // Comércio atacadista de lubrificantes
    '4683400', // Comércio atacadista de defensivos agrícolas, adubos, fertilizantes e corretivos do solo
    '4684201', // Comércio atacadista de resinas e elastômeros
    '4684202', // Comércio atacadista de solventes
    '4684299', // Comércio atacadista de outros produtos químicos e petroquímicos não especificados anteriormente
    '8610102', // Atividades de atendimento em pronto-socorro e unidades hospitalares para atendimento a urgências
    '8640204', // Serviços de tomografia
    '8640205', // Serviços de diagnóstico por imagem com uso de radiação ionizante, exceto tomografia
    '8640206', // Serviços de ressonância magnética
    '8640210', // Serviços de quimioterapia
    '8640211', // Serviços de radioterapia
    '8640212', // Serviços de hemoterapia
    '8640213', // Serviços de litotripsia
    '8711501', // Clínicas e residências geriátricas
    '8711504', // Centros de apoio a pacientes com câncer e com AIDS
];

// Piso mínimo de risco definido pelo(s) CNAE(s) informado(s).
// level: 'baixo' | 'medio' (risco 'alto' nunca chega aqui, pois é resolvido direto em submitCnae)
let cnaeState = { floor: 1, matched: null, level: 'baixo' };

// Piso mínimo de risco do percurso: só o CNAE de Risco Médio (Art. 3º, II c/c Anexo II).
function getRiskFloor() {
    return cnaeState.floor;
}

// Histórico de etapas visitadas, para permitir "Voltar".
let stepHistory = [];

// Duração (ms) da animação de saída de uma etapa — deve casar com --dur-step-leave no CSS.
const STEP_LEAVE_MS = 160;

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function normalizeCnae(str) {
    return str.replace(/\D/g, '');
}

function submitCnae() {
    const raw = document.getElementById('cnae-input').value;
    const errorEl = document.getElementById('cnae-error');
    errorEl.textContent = '';

    const codes = raw
        .split(/[\s,;]+/)
        .map(normalizeCnae)
        .filter(c => c.length > 0);

    if (codes.length === 0) {
        errorEl.textContent = 'Informe pelo menos um CNAE.';
        document.getElementById('cnae-input').focus();
        return;
    }

    // Risco Alto tem prioridade máxima: classifica de imediato, sem passar pelas perguntas.
    const altoEncontrado = codes.find(c => CNAE_ALTO_RISCO.includes(c));
    if (altoEncontrado) {
        showResult(3, `CNAE ${altoEncontrado} classificado como Risco Alto (Art. 6º). Classificação direta, sem necessidade de responder às demais perguntas.`);
        return;
    }

    // Risco Médio define um piso mínimo, mas o fluxo de perguntas continua.
    const medioEncontrado = codes.find(c => CNAE_MEDIO_RISCO.includes(c));
    if (medioEncontrado) {
        cnaeState = { floor: 2, matched: medioEncontrado, level: 'medio' };
    } else {
        cnaeState = { floor: 1, matched: null, level: 'baixo' };
    }

    nextStep('step-alto-direto');
}

// Etapa 2 — situações que, sozinhas, já caracterizam Risco III sem depender de contexto
// (Art. 6º, caput c/c Anexo II; III; IV; V; VI; VIII; X; XI; XII). Basta UMA marcada.
// Cada data-reason já cita o inciso correspondente.
function checkAltoDireto() {
    const checked = Array.from(document.querySelectorAll('#step-alto-direto .check-item__input:checked:not(.check-item__input--none)'));
    if (checked.length > 0) {
        const motivos = checked.map(c => c.dataset.reason).join('; ');
        showResult(3, `Classificado Risco III (Alto) por apresentar: ${motivos}.`);
        return;
    }
    nextStep('step-baixo-bloco-a');
}

// Etapa 3 — hipóteses diretas de Risco I (Art. 5º, I, II, III, IV e VI): basta UMA marcada.
// O Art. 5º, caput, ressalva as atividades de alto risco; por isso cada item traz no próprio
// texto as ressalvas de contexto (área, pavimentos, evento temporário) que o tornariam Risco III.
// Domicílio fiscal (II) e ambulante (III) não têm ressalva de área/pavimentos: empresa sem
// estabelecimento não "possui nem está inserida em edificação" para fins do Art. 6º, I e II,
// e os pavimentos do prédio onde fica o endereço fiscal não a afetam.
function checkBaixoBlocoA() {
    const checked = Array.from(document.querySelectorAll('#step-baixo-bloco-a .check-item__input:checked:not(.check-item__input--none)'));
    if (checked.length > 0) {
        const motivos = checked.map(c => c.dataset.reason).join('; ');
        showResult(1, `Classificado Risco I (Baixo) por apresentar: ${motivos}.`);
        return;
    }
    nextStep('step-eventos');
}

// --- FLUXO CONDICIONAL DE EVENTOS (Etapa 4) ---
// Evento temporário? → controle de acesso (Art. 6º, XV) → porte (Art. 6º, XIV). Evento aberto de
// pequeno porte não é Risco III, mas também nunca é Risco I (Art. 5º, VII, "m"): termina aqui em
// Risco II (Art. 7º, caput). Público > 100 pessoas já foi tratado na Etapa 2 (Art. 6º, III).
// Mesma convenção do fluxo de hospedagem.
const EVT_Q_ORDER = ['e1', 'e2', 'e3'];

function evtAnswer(q) {
    const input = document.querySelector(`#eventos-flow input[name="evt-${q}"]:checked`);
    return input ? input.value : null;
}

// Devolve as perguntas visíveis e o desfecho: { visible, resolved, result (3 | 2 | null), reason }.
function evaluateEventosFlow() {
    const a = {};
    EVT_Q_ORDER.forEach(q => { a[q] = evtAnswer(q); });

    const visible = ['e1'];
    const pending = () => ({ visible, resolved: false, result: null, reason: null });
    const done = (result, reason) => ({ visible, resolved: true, result, reason });

    if (!a.e1) return pending();
    if (a.e1 === 'nao') return done(null, null);

    visible.push('e2');
    if (!a.e2) return pending();
    if (a.e2 === 'sim') return done(3, 'Classificado Risco III (Alto) por apresentar: evento temporário com controle/restrição de acesso de público, independentemente da área (Art. 6º, XV).');

    visible.push('e3');
    if (!a.e3) return pending();
    if (a.e3 === 'sim') return done(3, 'Classificado Risco III (Alto) por apresentar: evento temporário sem controle de acesso, com área construída, ocupada ou montada superior a 930 m² ou camarotes/arquibancadas para mais de 100 pessoas (Art. 6º, XIV).');
    return done(2, 'Classificado Risco II (Médio): evento temporário sem controle de acesso, com público de até 100 pessoas, área de até 930 m² e sem camarotes ou arquibancadas para mais de 100 pessoas. Não se enquadra no Art. 6º, III, XIV e XV, e evento temporário que reúne público não pode ser Risco I (Art. 5º, VII, "m"); classificado como Risco II por exclusão (Art. 7º, caput).');
}

function setEventosStatus(text, tone) {
    const status = document.querySelector('#eventos-flow .area-flow__status');
    if (!status) return;
    status.textContent = text;
    status.dataset.tone = tone || '';
}

function renderEventosFlow(changedQ, moveFocus) {
    const flow = document.getElementById('eventos-flow');
    if (!flow) return;

    if (changedQ) {
        EVT_Q_ORDER.slice(EVT_Q_ORDER.indexOf(changedQ) + 1).forEach(q => {
            flow.querySelectorAll(`input[name="evt-${q}"]`).forEach(input => { input.checked = false; });
        });
    }

    const { visible, resolved, result } = evaluateEventosFlow();
    let revealed = null;
    flow.querySelectorAll('.area-q').forEach(fieldset => {
        const show = visible.includes(fieldset.dataset.q);
        if (show && fieldset.hidden) revealed = fieldset;
        fieldset.hidden = !show;
    });

    if (resolved && result === 3) {
        setEventosStatus('Pergunta respondida: enquadra em Risco Alto.', 'alto');
    } else if (resolved && result === 2) {
        setEventosStatus('Pergunta respondida: evento temporário de pequeno porte — classificação Risco II.');
    } else if (resolved) {
        setEventosStatus('Pergunta respondida: siga para a próxima etapa.', 'ok');
    } else if (changedQ && revealed && !moveFocus) {
        setEventosStatus(`Nova pergunta: ${revealed.querySelector('legend').textContent}`);
    } else {
        setEventosStatus('');
    }

    if (changedQ && revealed && moveFocus) {
        revealed.setAttribute('tabindex', '-1');
        revealed.focus();
    }

    const stepEl = document.getElementById('step-eventos');
    const button = stepEl.querySelector('.actions .btn-primary');
    const hint = stepEl.querySelector('.selection-hint');
    if (button) button.disabled = !resolved;
    if (hint) hint.hidden = resolved;
    updateDebugLiveRisk();
}

function setupEventosFlow() {
    const flow = document.getElementById('eventos-flow');
    if (!flow) return;

    let arrowNav = false;
    flow.addEventListener('keydown', e => { arrowNav = e.key.startsWith('Arrow'); });
    flow.addEventListener('change', e => {
        const q = (e.target.name || '').replace(/^evt-/, '');
        if (!EVT_Q_ORDER.includes(q)) return;
        renderEventosFlow(q, !arrowNav);
        arrowNav = false;
    });

    renderEventosFlow(null, false);
}

function checkEventos() {
    const r = evaluateEventosFlow();
    if (!r.resolved) return;
    if (r.result === null) {
        nextStep('step-area');
        return;
    }
    showResult(r.result, r.reason);
}

// --- FLUXO CONDICIONAL DE ÁREA E ANDARES (Etapa 5) ---
// Art. 6º, I (área > 930 m²) e II (mais de 3 pavimentos) são critérios da EDIFICAÇÃO que a
// atividade "possui ou em que está inserida". A exceção do Art. 7º, §3º (unidade exclusivamente
// no térreo, com até 930 m², sem compartilhar sistemas preventivos, sem acesso às áreas comuns
// e com saída direta para a via pública) só tem função quando a edificação principal acionaria
// o inciso I ou II; por isso o fluxo pergunta primeiro pelo prédio e só depois pela exceção.
// Cumprida a exceção, o resultado é Risco II FINAL ("serão classificadas como risco II"): a
// unidade não segue para as Etapas 6 e 7 (invariante P2).
// A ordem importa: ao mudar uma resposta, todas as posteriores são apagadas.
const AREA_Q_ORDER = ['p1', 'area-imovel', 'pav-imovel', 'area-predio', 'pav-predio', 'p2', 'p3', 'p4a', 'p4b', 'p4c'];
const AREA_EXCECAO_QS = ['p2', 'p3', 'p4a', 'p4b', 'p4c'];

function areaAnswer(q) {
    const input = document.querySelector(`#area-flow input[name="area-${q}"]:checked`);
    return input ? input.value : null;
}

// Percorre a árvore de decisão: { visible, resolved, result (3 | 2 | null), reason }.
function evaluateAreaFlow() {
    const a = {};
    AREA_Q_ORDER.forEach(q => { a[q] = areaAnswer(q); });

    const visible = ['p1'];
    const pending = () => ({ visible, resolved: false, result: null, reason: null });
    const done = (result, reason) => ({ visible, resolved: true, result, reason });

    if (!a.p1) return pending();

    if (a.p1 === 'inteiro') {
        visible.push('area-imovel');
        if (!a['area-imovel']) return pending();
        if (a['area-imovel'] === 'sim') return done(3, 'área construída superior a 930 m² (Art. 6º, I)');

        visible.push('pav-imovel');
        if (!a['pav-imovel']) return pending();
        if (a['pav-imovel'] === 'sim') return done(3, 'edificação com mais de 3 pavimentos (Art. 6º, II)');
        return done(null, null);
    }

    // Unidade dentro de prédio maior: só pergunta a exceção se o prédio acionar o Art. 6º, I ou II.
    let gatilho;
    visible.push('area-predio');
    if (!a['area-predio']) return pending();
    if (a['area-predio'] === 'sim') {
        gatilho = 'unidade inserida em edificação com área construída superior a 930 m² (Art. 6º, I)';
    } else {
        visible.push('pav-predio');
        if (!a['pav-predio']) return pending();
        if (a['pav-predio'] === 'nao') return done(null, null);
        gatilho = 'unidade inserida em edificação com mais de 3 pavimentos (Art. 6º, II)';
    }

    for (const q of AREA_EXCECAO_QS) {
        visible.push(q);
        if (!a[q]) return pending();
        if (a[q] === 'nao') return done(3, `${gatilho}, sem atender às condições da exceção do Art. 7º, §3º`);
    }
    return done(2, 'Classificado Risco II (Médio): unidade autônoma situada exclusivamente no pavimento térreo, com área de até 930 m², inserida em edificação principal que seria de Risco Alto pela área ou pela quantidade de andares, sem compartilhar sistemas preventivos, sem acesso às áreas comuns e com saída direta para a via pública (Art. 7º, §3º).');
}

function setAreaStatus(text, tone) {
    const status = document.querySelector('#area-flow .area-flow__status');
    if (!status) return;
    status.textContent = text;
    status.dataset.tone = tone || '';
}

// changedQ: pergunta que acabou de ser respondida (null na carga inicial).
// moveFocus: false quando a resposta veio das setas do teclado — mover o foco ali
// impediria o usuário de alternar entre as opções do mesmo grupo.
function renderAreaFlow(changedQ, moveFocus) {
    const flow = document.getElementById('area-flow');
    if (!flow) return;

    if (changedQ) {
        AREA_Q_ORDER.slice(AREA_Q_ORDER.indexOf(changedQ) + 1).forEach(q => {
            flow.querySelectorAll(`input[name="area-${q}"]`).forEach(input => { input.checked = false; });
        });
    }

    const { visible, resolved, result } = evaluateAreaFlow();
    let revealed = null;
    flow.querySelectorAll('.area-q').forEach(fieldset => {
        const show = visible.includes(fieldset.dataset.q);
        if (show && fieldset.hidden) revealed = fieldset;
        fieldset.hidden = !show;
    });
    flow.querySelector('[data-q-group="excecao"]').hidden = !visible.includes('p2');

    if (resolved && result === 3) {
        setAreaStatus('Enquadra em Risco Alto.', 'alto');
    } else if (resolved && result === 2) {
        setAreaStatus('Exceção do Art. 7º, §3º aplicável: Risco II.', 'ok');
    } else if (resolved) {
        setAreaStatus('Área e andares não geram Risco Alto. Siga para a próxima etapa.', 'ok');
    } else if (changedQ && revealed && !moveFocus) {
        setAreaStatus(`Nova pergunta: ${revealed.querySelector('legend').textContent}`);
    } else {
        setAreaStatus('');
    }

    if (changedQ && revealed && moveFocus) {
        revealed.setAttribute('tabindex', '-1');
        revealed.focus();
    }

    const stepEl = document.getElementById('step-area');
    const button = stepEl.querySelector('.actions .btn-primary');
    const hint = stepEl.querySelector('.selection-hint');
    if (button) button.disabled = !resolved;
    if (hint) hint.hidden = resolved;
    updateDebugLiveRisk();
}

function setupAreaFlow() {
    const flow = document.getElementById('area-flow');
    if (!flow) return;

    let arrowNav = false;
    flow.addEventListener('keydown', e => { arrowNav = e.key.startsWith('Arrow'); });
    flow.addEventListener('change', e => {
        const q = (e.target.name || '').replace(/^area-/, '');
        if (!AREA_Q_ORDER.includes(q)) return;
        renderAreaFlow(q, !arrowNav);
        arrowNav = false;
    });

    renderAreaFlow(null, false);
}

function checkArea() {
    const { resolved, result, reason } = evaluateAreaFlow();
    if (!resolved) return;
    if (result === 3) {
        showResult(3, `Classificado Risco III (Alto) por apresentar: ${reason}.`);
        return;
    }
    if (result === 2) {
        showResult(2, reason);
        return;
    }
    nextStep('step-hospedagem');
}

// --- FLUXO CONDICIONAL DE HOSPEDAGEM (Etapa 6) ---
// Art. 5º, VII, "e": condição cumulativa do pequeno estabelecimento, mas só se aplica a
// hotéis, pousadas e pensões — para quem não é hospedagem, está automaticamente cumprida.
// Hospedagem com mais de 40 leitos já terminou em Risco III na Etapa 2 (Art. 6º, IV).
const HOSP_Q_ORDER = ['h1', 'h2'];

function hospAnswer(q) {
    const input = document.querySelector(`#hospedagem-flow input[name="hosp-${q}"]:checked`);
    return input ? input.value : null;
}

// Devolve as perguntas visíveis e se o fluxo já está resolvido.
function evaluateHospedagemFlow() {
    const h1 = hospAnswer('h1');
    const h2 = hospAnswer('h2');
    if (h1 !== 'sim') return { visible: ['h1'], resolved: h1 === 'nao', excedeLeitos: false };
    return { visible: ['h1', 'h2'], resolved: h2 !== null, excedeLeitos: h2 === 'nao' };
}

function setHospedagemStatus(text, tone) {
    const status = document.querySelector('#hospedagem-flow .area-flow__status');
    if (!status) return;
    status.textContent = text;
    status.dataset.tone = tone || '';
}

// Mesma convenção de renderAreaFlow: limpa as respostas posteriores à alterada e só move
// o foco para a pergunta revelada quando a resposta não veio das setas do teclado.
function renderHospedagemFlow(changedQ, moveFocus) {
    const flow = document.getElementById('hospedagem-flow');
    if (!flow) return;

    if (changedQ) {
        HOSP_Q_ORDER.slice(HOSP_Q_ORDER.indexOf(changedQ) + 1).forEach(q => {
            flow.querySelectorAll(`input[name="hosp-${q}"]`).forEach(input => { input.checked = false; });
        });
    }

    const { visible, resolved, excedeLeitos } = evaluateHospedagemFlow();
    let revealed = null;
    flow.querySelectorAll('.area-q').forEach(fieldset => {
        const show = visible.includes(fieldset.dataset.q);
        if (show && fieldset.hidden) revealed = fieldset;
        fieldset.hidden = !show;
    });

    if (resolved && excedeLeitos) {
        setHospedagemStatus('Pergunta respondida: hospedagem com mais de 16 leitos não atende a este critério de Risco Baixo.');
    } else if (resolved) {
        setHospedagemStatus('Pergunta respondida: critério de hospedagem atendido.', 'ok');
    } else if (changedQ && revealed && !moveFocus) {
        setHospedagemStatus(`Nova pergunta: ${revealed.querySelector('legend').textContent}`);
    } else {
        setHospedagemStatus('');
    }

    if (changedQ && revealed && moveFocus) {
        revealed.setAttribute('tabindex', '-1');
        revealed.focus();
    }

    const stepEl = document.getElementById('step-hospedagem');
    const button = stepEl.querySelector('.actions .btn-primary');
    const hint = stepEl.querySelector('.selection-hint');
    if (button) button.disabled = !resolved;
    if (hint) hint.hidden = resolved;
    updateDebugLiveRisk();
}

function setupHospedagemFlow() {
    const flow = document.getElementById('hospedagem-flow');
    if (!flow) return;

    let arrowNav = false;
    flow.addEventListener('keydown', e => { arrowNav = e.key.startsWith('Arrow'); });
    flow.addEventListener('change', e => {
        const q = (e.target.name || '').replace(/^hosp-/, '');
        if (!HOSP_Q_ORDER.includes(q)) return;
        renderHospedagemFlow(q, !arrowNav);
        arrowNav = false;
    });

    renderHospedagemFlow(null, false);
}

function checkHospedagem() {
    const { resolved, excedeLeitos } = evaluateHospedagemFlow();
    if (!resolved) return;
    if (excedeLeitos) {
        showResult(2, 'Classificado Risco II (Médio) por exclusão: estabelecimento de hospedagem com mais de 16 leitos não atende à condição da alínea "e" do Art. 5º, VII, exigida cumulativamente para o Risco Baixo.');
        return;
    }
    nextStep('step-baixo-bloco-b');
}

// Onde cada condição cumulativa do Art. 5º, VII é verificada:
//   caput (edificação ≤ 200 m²) + "a" (térreo) → Etapa 7, item 1
//   "b" (saída direta) + "c" (sem aberturas)   → Etapa 7, item 2
//   "d" (reunião ≤ 100)                        → Etapa 2 (Art. 6º, III: > 100 = Risco III, inclusive eventos)
//   "e" (hospedagem ≤ 16 leitos)               → Etapa 6 (> 40 já é Risco III na Etapa 2)
//   "f" (não hospital)                         → Etapa 2 (Art. 6º, VI)
//   "h" (≤ 3 P13)                              → Etapa 7, item de GLP
//   "i" (sem outros gases inflamáveis)         → Etapa 2 (Art. 6º, XI)
//   "j" (≤ 150 L)                              → Etapa 7, item de inflamáveis
//   "k" (sem produtos perigosos)               → Etapa 2 (Art. 6º, XII)
//   "m" (não evento temporário)                → Etapa 4 (eventos nunca chegam à Etapa 7)
//   "g" e "l"                                  → revogadas
// Unidades com a exceção do Art. 7º, §3º terminam em Risco II na Etapa 5 e nunca chegam à
// Etapa 7 (invariante P2).
// Etapa 7 — pequeno estabelecimento físico: precisa atender a TODOS os critérios.
// Quem não atender a todos não é Risco Alto (já descartado) nem Risco Baixo, logo é Risco Médio por exclusão.
function checkBaixoBlocoB() {
    const inputs = document.querySelectorAll('#step-baixo-bloco-b .check-item__input:not(.check-item__input--none)');
    const todosMarcados = Array.from(inputs).every(input => input.checked);

    if (todosMarcados) {
        showResult(1, 'Classificado Risco I (Baixo): pequeno estabelecimento físico que atende a todas as condições cumulativas do Art. 5º, VII.');
    } else {
        showResult(2, 'Classificado Risco II (Médio) por exclusão: não se enquadra em nenhuma hipótese direta de Risco Baixo (Art. 5º, I, II, III, IV e VI) nem atende a todas as condições do pequeno estabelecimento (Art. 5º, VII); classificado como Risco II (Art. 7º, caput).');
    }
}

// Atualiza a barra de progresso, o rótulo da etapa e a visibilidade do botão Voltar.
function updateProgressUI(stepEl) {
    const step = Number(stepEl.dataset.step || 1);
    const total = Number(stepEl.dataset.total || 7);
    const label = stepEl.dataset.label || `Etapa ${step} de ${total}`;

    const bar = document.getElementById('progress-bar');
    const track = document.getElementById('progress-track');
    const indicator = document.getElementById('step-indicator');
    const backBtn = document.getElementById('back-btn');

    const percent = Math.min(100, Math.round((step / total) * 100));
    if (bar) bar.style.transform = `scaleX(${percent / 100})`;
    if (track) track.setAttribute('aria-valuenow', String(percent));
    if (indicator) indicator.textContent = label;
    if (backBtn) backBtn.hidden = stepHistory.length === 0;
}

// Move o foco do teclado/leitor de tela para a nova etapa exibida.
function focusStep(stepEl) {
    if (!stepEl) return;
    stepEl.setAttribute('tabindex', '-1');
    stepEl.focus();
}

// Remove a classe ativa da(s) etapa(s) atual(is), disparando a animação de saída
// (a etapa some de fato só depois de --dur-step-leave, via CSS "step-leaving").
function fadeOutActiveSteps() {
    document.querySelectorAll('.step.active').forEach(el => {
        el.classList.remove('active');
        if (!prefersReducedMotion()) {
            el.classList.add('step-leaving');
            setTimeout(() => el.classList.remove('step-leaving'), STEP_LEAVE_MS);
        }
    });
}

function activateStep(id) {
    const target = document.getElementById(id);
    if (!target || target.classList.contains('active')) return;
    fadeOutActiveSteps();
    target.classList.add('active');
    updateProgressUI(target);
    focusStep(target);
    updateDebugLiveRisk();
}

function nextStep(id) {
    const current = document.querySelector('.step.active');
    if (current) stepHistory.push(current.id);
    activateStep(id);
}

function goBack() {
    const previousId = stepHistory.pop();
    if (!previousId) return;
    activateStep(previousId);
}

// Etapas cujo bloco de checkboxes tem a opção exclusiva "Nenhuma das alternativas anteriores".
const EXCLUSIVE_CHECK_STEPS = ['step-alto-direto', 'step-baixo-bloco-a', 'step-baixo-bloco-b'];

// Ativa, para uma etapa de checkboxes, a exclusão mútua da opção "Nenhuma das alternativas
// anteriores" (marcá-la desmarca as demais e vice-versa) e mantém o botão de avançar
// desabilitado até haver ao menos uma marcação — evita que o usuário avance sem ler as opções.
function setupExclusiveCheckGroup(stepId) {
    const stepEl = document.getElementById(stepId);
    if (!stepEl) return;

    const inputs = Array.from(stepEl.querySelectorAll('.check-item__input'));
    const noneInput = stepEl.querySelector('.check-item__input--none');
    const button = stepEl.querySelector('.actions .btn-primary');
    const hint = stepEl.querySelector('.selection-hint');

    function updateState() {
        const ready = inputs.some(input => input.checked);
        if (button) button.disabled = !ready;
        if (hint) hint.hidden = ready;
        updateDebugLiveRisk();
    }

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input === noneInput) {
                if (input.checked) inputs.forEach(other => { if (other !== noneInput) other.checked = false; });
            } else if (input.checked && noneInput) {
                noneInput.checked = false;
            }
            updateState();
        });
    });

    updateState();
}

// ============================================================================
// DEBUG TEMPORÁRIO — remover esta função, suas chamadas (em activateStep, nos
// render*Flow e no updateState de setupExclusiveCheckGroup) e o HTML/CSS
// correspondentes antes de publicar. Mostra, no topo de cada etapa, a
// classificação que resultaria se o usuário parasse de responder agora e
// dissesse "não" a tudo o que ainda não foi respondido — só para facilitar
// teste manual do fluxo.
// ============================================================================
function updateDebugLiveRisk() {
    const step = document.querySelector('.step.active');
    const badge = step && step.querySelector('.debug-live-risk');
    if (!badge) return;

    const floor = getRiskFloor();
    let risk;

    switch (step.id) {
        case 'step-alto-direto': {
            const any = document.querySelector('#step-alto-direto .check-item__input:checked:not(.check-item__input--none)');
            risk = any ? 3 : Math.max(2, floor);
            break;
        }
        case 'step-baixo-bloco-a': {
            const any = document.querySelector('#step-baixo-bloco-a .check-item__input:checked:not(.check-item__input--none)');
            risk = any ? Math.max(1, floor) : Math.max(2, floor);
            break;
        }
        case 'step-eventos': {
            const { result } = evaluateEventosFlow();
            risk = result === 3 ? 3 : Math.max(2, floor);
            break;
        }
        case 'step-area': {
            const { result } = evaluateAreaFlow();
            risk = result === 3 ? 3 : Math.max(2, floor);
            break;
        }
        case 'step-hospedagem': {
            const { excedeLeitos } = evaluateHospedagemFlow();
            risk = excedeLeitos ? 2 : Math.max(2, floor);
            break;
        }
        case 'step-baixo-bloco-b': {
            const inputs = document.querySelectorAll('#step-baixo-bloco-b .check-item__input:not(.check-item__input--none)');
            const todosMarcados = Array.from(inputs).every(input => input.checked);
            risk = todosMarcados ? Math.max(1, floor) : Math.max(2, floor);
            break;
        }
        default:
            badge.textContent = '';
            badge.removeAttribute('data-risk');
            return;
    }

    const labels = { 1: 'RISCO I (BAIXO)', 2: 'RISCO II (MÉDIO)', 3: 'RISCO III (ALTO)' };
    badge.textContent = `🧪 Prévia (teste): ${labels[risk]} — supondo "não" ao que ainda não foi respondido`;
    badge.dataset.risk = String(risk);
}
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const initial = document.querySelector('.step.active');
    if (initial) updateProgressUI(initial);
    setupAreaFlow();
    setupEventosFlow();
    setupHospedagemFlow();
    EXCLUSIVE_CHECK_STEPS.forEach(setupExclusiveCheckGroup);
});

// INVARIANTE P2 — O RISCO NUNCA DIMINUI:
//   (a) todo resultado de Risco II ou III encerra o questionário aqui; nenhuma etapa
//       posterior é executada;
//   (b) o piso do CNAE de Risco Médio (Art. 3º, II c/c Anexo II) é aplicado por Math.max,
//       e nenhum resultado fica abaixo dele;
//   (c) Risco I só é atribuído (Etapas 3 e 7) depois de descartadas todas as situações
//       diretas de Risco III (Etapas 1 e 2) — e, na Etapa 7, também eventos e área/andares;
//   (d) como (a) encerra o percurso no primeiro nível II/III apurado, nenhuma chamada pode
//       vir com nível menor que um já apurado; o único nível "herdado" é o piso do CNAE.
function showResult(risk, reason) {
    // Aplica o piso mínimo definido pelo(s) CNAE(s) (etapa 1)
    const finalRisk = Math.max(risk, getRiskFloor());
    let finalReason = reason;

    if (cnaeState.floor === 2) {
        if (risk < 2) {
            finalReason = `CNAE ${cnaeState.matched} classificado como Risco Médio (piso mínimo aplicado, Art. 3º, II c/c Anexo II). ${reason}`;
        } else if (risk > 2) {
            finalReason = `${reason} (O CNAE ${cnaeState.matched} já indicava Risco Médio; o risco foi elevado a Alto com base nas respostas do questionário.)`;
        } else {
            finalReason = `${reason} Classificação também respaldada pelo CNAE ${cnaeState.matched} (Risco Médio, Art. 3º, II c/c Anexo II).`;
        }
    }

    // Esconde a etapa atual (com a mesma animação de saída das demais transições)
    fadeOutActiveSteps();

    const progressRow = document.getElementById('progress-row');
    if (progressRow) progressRow.hidden = true;

    const box = document.getElementById('result');
    const title = document.getElementById('res-title');
    const desc = document.getElementById('res-desc');

    box.classList.add('is-visible');

    // Limpa classes anteriores
    box.classList.remove('res-low', 'res-medium', 'res-high');

    if(finalRisk === 1) {
        box.classList.add('res-low');
        title.innerText = "RISCO I (BAIXO)";
    }
    if(finalRisk === 2) {
        box.classList.add('res-medium');
        title.innerText = "RISCO II (MÉDIO)";
    }
    if(finalRisk === 3) {
        box.classList.add('res-high');
        title.innerText = "RISCO III (ALTO)";
    }

    desc.innerText = finalReason;

    // Leva o foco para o resultado, para leitores de tela anunciarem a classificação.
    box.setAttribute('tabindex', '-1');
    box.focus();
}
