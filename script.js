// Regras de classificação: Decreto Estadual nº 52.005/2021 (atualizado pelo Decreto nº 61.082/2026).
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

    nextStep('step-eventos');
}

// Etapa de Eventos e Casas de Festas: basta UMA situação marcada para classificar direto, sem prosseguir.
// Isolada logo após o CNAE para descartar rápido o caso mais comum de Risco Alto (Art. 6º, XIV e XV)
// antes de perguntas sobre edificações fixas, que confundem quem está organizando um evento.
function checkEventos() {
    const checked = Array.from(document.querySelectorAll('#step-eventos .check-item__input:checked:not(.check-item__input--none)'));
    if (checked.length > 0) {
        const motivos = checked.map(c => c.dataset.reason).join('; ');
        showResult(3, `Classificado Risco III (Alto) por apresentar: ${motivos}.`);
        return;
    }
    nextStep('step-combustiveis-saude');
}

// Etapa de Combustíveis, Gás, Produtos Perigosos e Saúde: basta UMA situação marcada
// para classificar direto, sem prosseguir.
function checkCombustiveisSaude() {
    const checked = Array.from(document.querySelectorAll('#step-combustiveis-saude .check-item__input:checked:not(.check-item__input--none)'));
    const motivos = checked.map(c => c.dataset.reason);
    if (motivos.length > 0) {
        showResult(3, `Classificado Risco III (Alto) por apresentar: ${motivos.join('; ')} (Art. 6º).`);
        return;
    }
    nextStep('step-alto-risco');
}

// Bloco de Risco Alto: basta UMA situação marcada (ou o fluxo de área indicar Risco Alto)
// para classificar direto, sem prosseguir.
function checkAltoRisco() {
    const checked = Array.from(document.querySelectorAll('#step-alto-risco .check-item__input:checked:not(.check-item__input--none)'));
    const motivos = checked.map(c => c.dataset.reason);
    if (areaOutcome && areaOutcome.alto) motivos.unshift(areaOutcome.reason);
    if (motivos.length > 0) {
        showResult(3, `Classificado Risco III (Alto) por apresentar: ${motivos.join('; ')} (Art. 6º).`);
        return;
    }
    nextStep('step-baixo-bloco-a');
}

// --- FLUXO CONDICIONAL DE ÁREA (Etapa 4) ---
// Art. 6º, I (área > 930 m²) com a exceção do Art. 7º, §3º: unidade exclusivamente no térreo,
// com até 930 m², dentro de edificação maior, sem compartilhar sistemas preventivos, sem acesso
// às áreas comuns e com saída direta para a via pública, não é enquadrada pela área do prédio.
// A ordem importa: ao mudar uma resposta, todas as posteriores são apagadas.
const AREA_Q_ORDER = ['p1', 'area-imovel', 'p2', 'p3', 'p4a', 'p4b', 'p4c', 'area-predio'];

// null enquanto o fluxo não foi totalmente respondido; depois { alto, reason }.
let areaOutcome = null;
let excecaoTerreoAplicada = false;

function areaAnswer(q) {
    const input = document.querySelector(`#area-flow input[name="area-${q}"]:checked`);
    return input ? input.value : null;
}

// Percorre a árvore de decisão e devolve as perguntas visíveis e o desfecho (se já houver).
function evaluateAreaFlow() {
    const a = {};
    AREA_Q_ORDER.forEach(q => { a[q] = areaAnswer(q); });

    const visible = ['p1'];
    const pending = () => ({ visible, outcome: null, excecao: false });
    const done = (alto, reason, excecao = false) => ({ visible, outcome: { alto, reason }, excecao });
    const regraGeral = () => {
        visible.push('area-predio');
        if (!a['area-predio']) return pending();
        return done(a['area-predio'] === 'sim', 'área total da edificação superior a 930 m²');
    };

    if (!a.p1) return pending();
    if (a.p1 === 'inteiro') {
        visible.push('area-imovel');
        if (!a['area-imovel']) return pending();
        return done(a['area-imovel'] === 'sim', 'área construída superior a 930 m²');
    }

    visible.push('p2');
    if (!a.p2) return pending();
    if (a.p2 === 'nao') return regraGeral();

    visible.push('p3');
    if (!a.p3) return pending();
    if (a.p3 === 'nao') return done(true, 'unidade no térreo com área própria superior a 930 m²');

    for (const q of ['p4a', 'p4b', 'p4c']) {
        visible.push(q);
        if (!a[q]) return pending();
        if (a[q] === 'nao') return regraGeral();
    }
    return done(false, null, true);
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

    const { visible, outcome, excecao } = evaluateAreaFlow();
    let revealed = null;
    flow.querySelectorAll('.area-q').forEach(fieldset => {
        const show = visible.includes(fieldset.dataset.q);
        if (show && fieldset.hidden) revealed = fieldset;
        fieldset.hidden = !show;
    });
    flow.querySelector('[data-q-group="p4"]').hidden = !visible.includes('p4a');

    areaOutcome = outcome;
    excecaoTerreoAplicada = excecao;

    if (outcome && outcome.alto) {
        setAreaStatus('Critério de área respondido: enquadra em Risco Alto.', 'alto');
    } else if (outcome && excecao) {
        setAreaStatus('Critério de área respondido: exceção do Art. 7º, §3º aplicável — a área do prédio não gera Risco Alto para a sua unidade.', 'ok');
    } else if (outcome) {
        setAreaStatus('Critério de área respondido: não gera Risco Alto.', 'ok');
    } else if (changedQ && revealed && !moveFocus) {
        setAreaStatus(`Nova pergunta: ${revealed.querySelector('legend').textContent}`);
    } else {
        setAreaStatus('');
    }

    if (changedQ && revealed && moveFocus) {
        revealed.setAttribute('tabindex', '-1');
        revealed.focus();
    }

    // Área em Risco Alto conta como uma situação marcada: desfaz "Nenhuma das alternativas anteriores".
    if (outcome && outcome.alto) {
        const none = document.querySelector('#step-alto-risco .check-item__input--none');
        if (none) none.checked = false;
    }
    if (groupUpdaters['step-alto-risco']) groupUpdaters['step-alto-risco']();
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

// Bloco A de Risco Baixo: hipóteses diretas de isenção — basta UMA marcada.
function checkBaixoBlocoA() {
    const checked = Array.from(document.querySelectorAll('#step-baixo-bloco-a .check-item__input:checked:not(.check-item__input--none)'));
    if (checked.length > 0) {
        const motivos = checked.map(c => c.dataset.reason).join('; ');
        showResult(1, `Classificado Risco I (Baixo) por apresentar: ${motivos} (Art. 5º).`);
        return;
    }
    nextStep('step-hospedagem');
}

// --- FLUXO CONDICIONAL DE HOSPEDAGEM (Etapa 6) ---
// Art. 5º, VII, "e": condição cumulativa do pequeno estabelecimento, mas só se aplica a
// hotéis, pousadas e pensões — para quem não é hospedagem, está automaticamente cumprida.
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

// Bloco B de Risco Baixo: pequeno estabelecimento físico — precisa atender a TODOS os critérios.
// Quem não atender a todos não é Risco Alto (já descartado) nem Risco Baixo, logo é Risco Médio por exclusão.
function checkBaixoBlocoB() {
    const inputs = document.querySelectorAll('#step-baixo-bloco-b .check-item__input:not(.check-item__input--none)');
    const todosMarcados = Array.from(inputs).every(input => input.checked);

    if (todosMarcados) {
        showResult(1, 'Classificado Risco I (Baixo): pequeno estabelecimento físico que atende a todos os critérios do Bloco B (Art. 5º, VII).');
    } else {
        showResult(2, 'Classificado Risco II (Médio) por exclusão: não se enquadra em nenhuma hipótese de isenção direta (Bloco A) nem atende a todos os critérios do pequeno estabelecimento físico (Bloco B).');
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
const EXCLUSIVE_CHECK_STEPS = ['step-eventos', 'step-combustiveis-saude', 'step-alto-risco', 'step-baixo-bloco-a', 'step-baixo-bloco-b'];

// Recalcula o estado do botão de cada grupo; usado também pelo fluxo de área da Etapa 4.
const groupUpdaters = {};

// Ativa, para uma etapa de checkboxes, a exclusão mútua da opção "Nenhuma das alternativas
// anteriores" (marcá-la desmarca as demais e vice-versa) e mantém o botão de avançar
// desabilitado até haver ao menos uma marcação — evita que o usuário avance sem ler as opções.
// Se a etapa tiver o fluxo de área, ele precisa estar totalmente respondido, e um desfecho
// de Risco Alto conta como uma situação marcada.
function setupExclusiveCheckGroup(stepId) {
    const stepEl = document.getElementById(stepId);
    if (!stepEl) return;

    const inputs = Array.from(stepEl.querySelectorAll('.check-item__input'));
    const noneInput = stepEl.querySelector('.check-item__input--none');
    const button = stepEl.querySelector('.actions .btn-primary');
    const hint = stepEl.querySelector('.selection-hint');
    const hasAreaFlow = Boolean(stepEl.querySelector('#area-flow'));

    function updateState() {
        const flowPending = hasAreaFlow && areaOutcome === null;
        const areaAlto = hasAreaFlow && areaOutcome !== null && areaOutcome.alto;
        const ready = !flowPending && (areaAlto || inputs.some(input => input.checked));
        if (button) button.disabled = !ready;
        if (hint) {
            hint.hidden = ready;
            hint.textContent = flowPending
                ? 'Responda às perguntas sobre a área do imóvel para continuar.'
                : 'Selecione ao menos uma opção acima para continuar.';
        }
        updateDebugLiveRisk();
    }

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input === noneInput) {
                if (input.checked && hasAreaFlow && areaOutcome && areaOutcome.alto) {
                    input.checked = false;
                    setAreaStatus('Sua resposta sobre a área já enquadra em Risco Alto. Para marcar "Nenhuma das alternativas anteriores", revise as perguntas sobre a área.', 'alto');
                } else if (input.checked) {
                    inputs.forEach(other => { if (other !== noneInput) other.checked = false; });
                }
            } else if (input.checked && noneInput) {
                noneInput.checked = false;
            }
            updateState();
        });
    });

    groupUpdaters[stepId] = updateState;
    updateState();
}

// ============================================================================
// DEBUG TEMPORÁRIO — remover esta função, suas chamadas (em activateStep e no
// updateState de setupExclusiveCheckGroup) e o HTML/CSS correspondentes antes
// de publicar. Mostra, no topo de cada etapa, a classificação que resultaria
// se o usuário parasse de responder agora e dissesse "não" a tudo o que ainda
// não foi respondido — só para facilitar teste manual do fluxo.
// ============================================================================
function updateDebugLiveRisk() {
    const step = document.querySelector('.step.active');
    const badge = step && step.querySelector('.debug-live-risk');
    if (!badge) return;

    const floor = cnaeState.floor;
    let risk;

    switch (step.id) {
        case 'step-eventos': {
            const any = document.querySelector('#step-eventos .check-item__input:checked:not(.check-item__input--none)');
            risk = any ? 3 : Math.max(2, floor);
            break;
        }
        case 'step-combustiveis-saude': {
            const any = document.querySelector('#step-combustiveis-saude .check-item__input:checked:not(.check-item__input--none)');
            risk = any ? 3 : Math.max(2, floor);
            break;
        }
        case 'step-alto-risco': {
            const any = document.querySelector('#step-alto-risco .check-item__input:checked:not(.check-item__input--none)') || (areaOutcome && areaOutcome.alto);
            risk = any ? 3 : Math.max(2, floor);
            break;
        }
        case 'step-baixo-bloco-a': {
            const any = document.querySelector('#step-baixo-bloco-a .check-item__input:checked:not(.check-item__input--none)');
            risk = any ? Math.max(1, floor) : Math.max(2, floor);
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
    setupHospedagemFlow();
    EXCLUSIVE_CHECK_STEPS.forEach(setupExclusiveCheckGroup);
});

function showResult(risk, reason) {
    // Aplica o piso mínimo definido pelo(s) CNAE(s) (etapa 1)
    const finalRisk = Math.max(risk, cnaeState.floor);
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

    if (excecaoTerreoAplicada && finalRisk === 2) {
        finalReason += ' Também respaldado pela exceção do Art. 7º, §3º (unidade autônoma no pavimento térreo, sem compartilhamento de sistemas preventivos, sem acesso às áreas comuns e com saída direta para a via pública).';
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
