"""Gera cnaes.js (lista pesquisável de CNAEs da Etapa 1) a partir do CSV consolidado.

Uso, na raiz do projeto:
    python tools/gerar_cnaes.py

O CSV foi extraído do PDF do decreto e traz ~100 descrições com palavras partidas pela
largura da coluna ("Beneficiament o", "Representante s"). FRAGMENTOS lista, revisados à mão,
os pares (fragmento, resto) que devem ser unidos; pares legítimos como "Transporte aéreo"
ficam de fora. Ao atualizar o CSV, rode o script e confira a lista "não corrigidos" impressa
no final: são candidatos a quebra que ainda não estão em FRAGMENTOS.
"""
import csv
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CSV = RAIZ / 'Classificacao de risco - CNAEs consolidados (Decreto 61.082-2026).csv'
SAIDA = RAIZ / 'cnaes.js'

FRAGMENTOS = {
    ('supermercado', 's'), ('aparelhament', 'o'), ('beneficiament', 'o'), ('beneficiament', 'os'),
    ('concessionári', 'as'), ('descontamina', 'ção'), ('desenvolvime', 'nto'), ('estacionament', 'o'),
    ('impermeabiliz', 'ação'), ('impermeabiliz', 'antes'), ('processament', 'o'), ('programadora', 's'),
    ('recondiciona', 'mento'), ('representante', 's'), ('telecomunica', 'ções'), ('telecomunicaç', 'ões'),
    ('acondicionam', 'ento'), ('balanceament', 'o'), ('biocombustívei', 's'), ('cinematográfic', 'a'),
    ('cinematográfic', 'os'), ('complementar', 'es'), ('complementaç', 'ão'), ('condicioname', 'nto'),
    ('confeccionada', 's'), ('convalescente', 's'), ('departamento', 's'), ('desdobrament', 'o'),
    ('domissanitário', 's'), ('eletrodoméstic', 'os'), ('eletroeletrônic', 'os'), ('eletroterapêuti', 'cos'),
    ('embelezament', 'o'), ('empacotament', 'o'), ('empreendime', 'ntos'), ('entreteniment', 'o'),
    ('estabelecimen', 'tos'), ('hortifrutigranjei', 'ros'), ('imunodeprimid', 'os'), ('microempreen', 'dedor'),
    ('monitorament', 'o'), ('permissionária', 's'), ('preponderante', 'mente'), ('previdenciário', 's'),
    ('sincronizadore', 's'), ('somatoconser', 'vação'), ('teleatendiment', 'o'), ('transformador', 'es'),
}

PALAVRA = re.compile(r'[\wÀ-ú]+$')


def juntar_fragmentos(texto):
    tokens = re.sub(r'\s+', ' ', texto.strip()).split(' ')
    saida = []
    for token in tokens:
        if saida:
            anterior = PALAVRA.search(saida[-1])
            resto = re.match(r'[\wÀ-ú]+', token)
            if anterior and resto and (anterior.group().lower(), resto.group()) in FRAGMENTOS:
                saida[-1] += token
                continue
        saida.append(token)
    # Travessão colado à palavra seguinte ("alimentícios -supermercados").
    return re.sub(r' -(?=[\wÀ-ú])', ' - ', ' '.join(saida))


def candidatos_restantes(descricao):
    tokens = descricao.split(' ')
    for a, b in zip(tokens, tokens[1:]):
        a2 = re.sub(r'[^\wÀ-ú]', '', a)
        if len(a2) >= 10 and re.fullmatch(r'(o|os|a|as|s|es|tos|nto|ntos|mento|ção|ções|ão|ões)', b):
            yield f'{a} {b}'


def main():
    with CSV.open(encoding='utf-8-sig', newline='') as f:
        linhas = list(csv.reader(f, delimiter=';'))
    cabecalho = linhas[1]
    i_cnae, i_num, i_ativ = cabecalho.index('CNAE'), cabecalho.index('CNAE_numerico'), cabecalho.index('Atividade')

    dados, restantes = [], set()
    for linha in linhas[2:]:
        descricao = juntar_fragmentos(linha[i_ativ])
        dados.append([linha[i_num].strip(), linha[i_cnae].strip(), descricao])
        restantes.update(candidatos_restantes(descricao))
    dados.sort(key=lambda d: d[0])

    corpo = ',\n'.join('    ' + json.dumps(d, ensure_ascii=False) for d in dados)
    SAIDA.write_text(
        '// Gerado por tools/gerar_cnaes.py a partir do CSV consolidado (Decreto nº 61.082/2026).\n'
        '// Não editar à mão: altere o CSV ou o script e gere de novo.\n'
        '// Cada item: [código só com dígitos, código formatado, descrição da atividade].\n'
        f'const CNAE_DADOS = [\n{corpo}\n];\n',
        encoding='utf-8', newline='\n')

    print(f'{len(dados)} CNAEs gravados em {SAIDA.name}')
    if restantes:
        print('Não corrigidos (conferir se são quebras de palavra):')
        for r in sorted(restantes):
            print('  ' + r)


if __name__ == '__main__':
    main()
