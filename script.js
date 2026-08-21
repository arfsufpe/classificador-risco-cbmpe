// --- LISTAS DE CNAE ---
// Fonte: Decreto Estadual 61.082/2026 - CNAEs consolidados (coluna CBMPE_nivel).
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

    nextStep('step-1');
}

function nextStep(id) {
    // Remove a classe ativa de todos os passos
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    // Adiciona classe ativa ao próximo
    const next = document.getElementById(id);
    if(next) next.classList.add('active');
}

function showResult(risk, reason) {
    // Aplica o piso mínimo definido pelo(s) CNAE(s) (etapa 1)
    const finalRisk = Math.max(risk, cnaeState.floor);
    let finalReason = reason;

    if (cnaeState.floor === 2) {
        if (risk < 2) {
            finalReason = `CNAE ${cnaeState.matched} classificado como Risco Médio (piso mínimo aplicado, Art. 6º). ${reason}`;
        } else if (risk > 2) {
            finalReason = `${reason} (O CNAE ${cnaeState.matched} já indicava Risco Médio; o risco foi elevado a Alto com base nas respostas do questionário.)`;
        } else {
            finalReason = `${reason} Classificação também respaldada pelo CNAE ${cnaeState.matched} (Risco Médio).`;
        }
    }

    // Esconde todos os passos
    document.querySelectorAll('.step').forEach(el => el.style.display = 'none');

    const box = document.getElementById('result');
    const title = document.getElementById('res-title');
    const desc = document.getElementById('res-desc');
    const icon = document.getElementById('res-icon');

    box.style.display = 'block';

    // Limpa classes anteriores
    box.classList.remove('res-low', 'res-medium', 'res-high');

    if(finalRisk === 1) {
        box.classList.add('res-low');
        icon.innerText = "🛡️";
        title.innerText = "RISCO I (BAIXO)";
    }
    if(finalRisk === 2) {
        box.classList.add('res-medium');
        icon.innerText = "⚠️";
        title.innerText = "RISCO II (MÉDIO)";
    }
    if(finalRisk === 3) {
        box.classList.add('res-high');
        icon.innerText = "🚨";
        title.innerText = "RISCO III (ALTO)";
    }

    desc.innerHTML = `<strong>Motivo:</strong> ${finalReason}`;
}
