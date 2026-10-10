/* =========================================================
   EQUIPAMENTOS - Abas, adicionar/remover e preencher tabelas
========================================================= */

import { tabs, equipmentContents } from './dom.js';

/* Modelos de linha de cada tabela */
const equipmentRowTemplates = [];

/* ---------- Abas ---------- */

function initEquipmentTabs() {
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            equipmentContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            equipmentContents[index]?.classList.add('active');
        });
    });
}

/* ---------- Modelos ---------- */

function prepararModelosEquipamentos() {
    equipmentRowTemplates.length = 0;

    equipmentContents.forEach(box => {
        const template = box.querySelector('tbody')?.querySelector('tr');
        equipmentRowTemplates.push(template ? template.cloneNode(true) : null);
    });
}

function limparLinhaEquipamento(row) {
    if (!row) return;

    row.querySelectorAll('input').forEach(input => {
        if (input.type === 'checkbox') input.checked = false;
        else input.value = '';
    });

    row.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
}

/* ---------- Adicionar ---------- */

function adicionarLinhaEquipamento(index) {
    const tbody = equipmentContents[index]?.querySelector('tbody');
    if (!tbody) return null;

    let row = equipmentRowTemplates[index]?.cloneNode(true);

    /* Caso o modelo não exista, tenta usar uma linha existente. */
    if (!row) row = tbody.querySelector('tr')?.cloneNode(true);
    if (!row) return null;

    limparLinhaEquipamento(row);
    tbody.appendChild(row);

    return row;
}

/* ---------- Linhas (adicionar / remover) ---------- */

function initEquipmentRows() {
    prepararModelosEquipamentos();

    equipmentContents.forEach((box, index) => {
        const tbody = box.querySelector('tbody');
        const addButton = box.querySelector('.add-button');

        if (!tbody || !addButton) return;

        addButton.addEventListener('click', () => adicionarLinhaEquipamento(index));

        tbody.addEventListener('click', event => {
            const deleteButton = event.target.closest('.delete-button');
            if (!deleteButton) return;

            const row = deleteButton.closest('tr');
            if (!row) return;

            const nome =
                row.querySelector('input[type="text"]')?.value.trim() ||
                'este equipamento';

            if (confirm(`Tem certeza que deseja remover "${nome}"?`)) {
                row.remove();
            }
        });
    });
}

/* ---------- Preencher (usado na importação) ---------- */

/* Ordem dos campos de cada tabela, na ordem das colunas */
const CAMPOS_EQUIPAMENTOS = [
    ['nome', 'alcance', 'dano', 'danoBonus', 'tipoDano'],                  // armas
    ['nome', 'quantidade', 'armaCompativel', 'peso', 'preco'],             // projéteis
    ['nome', 'tipo', 'peso', 'durabilidade', 'preco'],                     // armaduras
    ['nome', 'durabilidade', 'bonusAparar', 'requisitoTamanho', 'preco']   // escudos
];

export function preencherEquipamentos(equipamentos) {
    const tipos = [
        equipamentos.armas || [],
        equipamentos.projeteis || [],
        equipamentos.armaduras || [],
        equipamentos.escudos || []
    ];

    tipos.forEach((itens, index) => {
        const tbody = equipmentContents[index]?.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        itens.forEach(item => {
            let row = equipmentRowTemplates[index]?.cloneNode(true);

            /* Segurança caso não exista modelo. */
            if (!row) {
                row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="text"></td>
                    <td><input type="text"></td>
                    <td><input type="text"></td>
                    <td><input type="text"></td>
                    <td><input type="text"></td>
                    <td><button type="button" class="delete-button">×</button></td>
                `;
            }

            limparLinhaEquipamento(row);

            const fields = row.querySelectorAll('input, select');

            CAMPOS_EQUIPAMENTOS[index].forEach((campo, i) => {
                if (fields[i]) fields[i].value = item[campo] ?? '';
            });

            tbody.appendChild(row);
        });
    });

    /* Itens gerais */
    const itemsTextarea = equipmentContents[4]?.querySelector('.items-textarea');

    if (itemsTextarea) {
        itemsTextarea.value = equipamentos.itensGerais ?? '';
    }
}

/* ---------- Inicialização ---------- */

export function initEquipamentos() {
    initEquipmentTabs();
    initEquipmentRows();
}
