/* =========================================================
   IMPORTAÇÃO / EXPORTAÇÃO DA FICHA
========================================================= */

import {
    equipmentContents,
    characterName, race, characterClass, specialization,
    backgroundField, roots, curse,
    attributeInputs,
    currentHP, maxHP, durability,
    skillsBody, raceAbilities,
    backgroundTextarea, notesTextarea,
    exportSheetButton, importSheetButton, importFileInput
} from './dom.js';

import { initBonusDMG } from './ficha.js';
import { addSkill, updateSkill, addAbility } from './pericias-habilidades.js';
import { preencherEquipamentos } from './equipamentos.js';

/* =========================================================
   EXPORTAR
========================================================= */

/* Lê as linhas de uma tabela de equipamentos e monta objetos
   usando a lista de campos (na ordem das colunas). */
function lerTabela(index, campos, linhaVazia) {
    const rows = equipmentContents[index]?.querySelectorAll('tbody tr') || [];
    const itens = [];

    rows.forEach(row => {
        const fields = row.querySelectorAll('input, select');
        const item = {};

        campos.forEach((campo, i) => {
            item[campo.nome] = fields[i]?.value || campo.padrao;
        });

        if (linhaVazia(Object.values(item))) return;

        itens.push(item);
    });

    return itens;
}

const vazio = valores => valores.every(v => v === '');
const vazioOuZero = valores => valores.every(v => v === '' || Number(v) === 0);

export function exportSheet() {
    const ficha = {
        versao: 1,

        personagem: {
            nome: characterName?.value || '',
            raca: race?.value || '',
            classe: characterClass?.value || '',
            especializacao: specialization?.value || '',
            passado: backgroundField?.value || '',
            raizes: roots?.value || '',
            maldicao: curse?.value || ''
        },

        vida: {
            atual: currentHP?.value || 0,
            maxima: maxHP?.value || 0,
            durabilidade: durability?.value || 0
        },

        atributos: {},
        pericias: [],
        habilidades: [],

        equipamentos: {
            armas: [],
            projeteis: [],
            armaduras: [],
            escudos: [],
            itensGerais: ''
        },

        background: backgroundTextarea?.value || '',
        anotacoes: notesTextarea?.value || ''
    };

    /* ---------- Atributos ---------- */

    attributeInputs.forEach(input => {
        const atributo = input.dataset.attr;
        if (atributo) ficha.atributos[atributo] = input.value;
    });

    /* ---------- Perícias ---------- */

    skillsBody?.querySelectorAll('tr').forEach(row => {
        const nome = row.querySelector('.skill-name')?.value || '';
        const comprado = row.querySelector('.skill-value')?.value || 0;
        const bonus = row.querySelector('.skill-bonus')?.value || 0;
        const total = row.querySelector('.skill-total')?.value || 0;

        /* Não salva linhas completamente vazias. */
        if (!nome && Number(comprado) === 0 && Number(bonus) === 0) return;

        ficha.pericias.push({ nome, comprado, bonus, total });
    });

    /* ---------- Habilidades ---------- */

    raceAbilities?.querySelectorAll('.ability-card').forEach(card => {
        ficha.habilidades.push({
            nome: card.querySelector('input')?.value || '',
            descricao: card.querySelector('textarea')?.value || ''
        });
    });

    /* ---------- Equipamentos ---------- */

    ficha.equipamentos.armas = lerTabela(0, [
        { nome: 'nome', padrao: '' },
        { nome: 'alcance', padrao: '' },
        { nome: 'dano', padrao: '' },
        { nome: 'danoBonus', padrao: '' },
        { nome: 'tipoDano', padrao: '' }
    ], vazio);

    ficha.equipamentos.projeteis = lerTabela(1, [
        { nome: 'nome', padrao: '' },
        { nome: 'quantidade', padrao: 0 },
        { nome: 'armaCompativel', padrao: '' },
        { nome: 'peso', padrao: '' },
        { nome: 'preco', padrao: '' }
    ], vazioOuZero);

    ficha.equipamentos.armaduras = lerTabela(2, [
        { nome: 'nome', padrao: '' },
        { nome: 'tipo', padrao: '' },
        { nome: 'peso', padrao: '' },
        { nome: 'durabilidade', padrao: '' },
        { nome: 'preco', padrao: '' }
    ], vazio);

    ficha.equipamentos.escudos = lerTabela(3, [
        { nome: 'nome', padrao: '' },
        { nome: 'durabilidade', padrao: '' },
        { nome: 'bonusAparar', padrao: '' },
        { nome: 'requisitoTamanho', padrao: '' },
        { nome: 'preco', padrao: '' }
    ], vazio);

    ficha.equipamentos.itensGerais =
        equipmentContents[4]?.querySelector('.items-textarea')?.value || '';

    /* ---------- Criar arquivo ---------- */

    const json = JSON.stringify(ficha, null, 4);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${ficha.personagem.nome.trim() || 'ficha'}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

/* =========================================================
   IMPORTAR
========================================================= */

export async function importSheet(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    try {
        const ficha = JSON.parse(await arquivo.text());

        if (!ficha || typeof ficha !== 'object') {
            throw new Error('O arquivo não contém uma ficha válida.');
        }

        preencherFicha(ficha);
        alert('Ficha importada com sucesso!');

    } catch (erro) {
        console.error('Erro ao importar ficha:', erro);
        alert('Não foi possível importar a ficha.\n\n' + erro.message);

    } finally {
        /* Permite importar novamente o mesmo arquivo. */
        event.target.value = '';
    }
}

/* =========================================================
   PREENCHER FICHA
========================================================= */

function setValue(element, value) {
    if (element) element.value = value ?? '';
}

export function preencherFicha(ficha) {
    if (!ficha || typeof ficha !== 'object') {
        throw new Error('Formato de ficha inválido.');
    }

    /* ---------- Personagem ---------- */

    const personagem = ficha.personagem || {};

    setValue(characterName, personagem.nome);
    setValue(race, personagem.raca);
    setValue(characterClass, personagem.classe);
    setValue(specialization, personagem.especializacao);
    setValue(backgroundField, personagem.passado);
    setValue(roots, personagem.raizes);
    setValue(curse, personagem.maldicao);

    /* ---------- Vida ---------- */

    const vida = ficha.vida || {};

    setValue(currentHP, vida.atual ?? 0);
    setValue(maxHP, vida.maxima ?? 0);
    setValue(durability, vida.durabilidade ?? 0);

    /* ---------- Atributos ---------- */

    const atributos = ficha.atributos || {};

    attributeInputs.forEach(input => {
        const atributo = input.dataset.attr;

        if (atributo && Object.prototype.hasOwnProperty.call(atributos, atributo)) {
            input.value = atributos[atributo];
        }
    });

    initBonusDMG();

    /* ---------- Perícias ---------- */

    if (skillsBody) {
        skillsBody.innerHTML = '';

        const pericias = Array.isArray(ficha.pericias) ? ficha.pericias : [];

        pericias.forEach(pericia => {
            addSkill();

            const row = skillsBody.lastElementChild;
            if (!row) return;

            setValue(row.querySelector('.skill-name'), pericia.nome);
            setValue(row.querySelector('.skill-value'), pericia.comprado ?? 0);
            setValue(row.querySelector('.skill-bonus'), pericia.bonus ?? 0);

            updateSkill(row);
        });
    }

    /* ---------- Habilidades ---------- */

    if (raceAbilities) {
        raceAbilities.innerHTML = '';

        const habilidades = Array.isArray(ficha.habilidades) ? ficha.habilidades : [];

        habilidades.forEach(habilidade => {
            addAbility();

            const card = raceAbilities.lastElementChild;
            if (!card) return;

            setValue(card.querySelector('input'), habilidade.nome);
            setValue(card.querySelector('textarea'), habilidade.descricao);
        });
    }

    /* ---------- Equipamentos ---------- */

    preencherEquipamentos(ficha.equipamentos || {});

    /* ---------- Background e anotações ---------- */

    if (backgroundTextarea) backgroundTextarea.value = ficha.background ?? '';
    if (notesTextarea) notesTextarea.value = ficha.anotacoes ?? '';
}

/* ---------- Inicialização ---------- */

export function initImportacaoExportacao() {
    exportSheetButton?.addEventListener('click', exportSheet);
    importSheetButton?.addEventListener('click', () => importFileInput?.click());
    importFileInput?.addEventListener('change', importSheet);
}
