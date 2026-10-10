/* =========================================================
   PERÍCIAS E HABILIDADES
========================================================= */

import { addSkillButton, skillsBody, addAbilityButton, raceAbilities } from './dom.js';
import { rolarPericia } from './rolagens.js';

/* =========================================================
   PERÍCIAS
========================================================= */

export function addSkill() {
    if (!skillsBody) return;

    const row = document.createElement('tr');

    row.innerHTML = `
        <td>
            <input type="text" class="skill-name" placeholder="Nome da perícia">
        </td>
        <td>
            <input type="number" class="skill-value" value="0" min="0">
        </td>
        <td>
            <input type="number" class="skill-bonus" value="0">
        </td>
        <td>
            <input type="number" class="skill-total" value="0" readonly tabindex="-1">
        </td>
        <td class="skill-actions">
            <button type="button" class="roll-button skill-roll" title="Rolar perícia">🎲</button>
            <button type="button" class="delete-button skill-delete" title="Remover perícia">×</button>
        </td>
    `;

    skillsBody.appendChild(row);
    updateSkill(row);
}

export function updateSkill(row) {
    if (!row) return;

    const value = parseInt(row.querySelector('.skill-value')?.value, 10) || 0;
    const bonus = parseInt(row.querySelector('.skill-bonus')?.value, 10) || 0;
    const totalInput = row.querySelector('.skill-total');

    if (totalInput) totalInput.value = value + bonus;
}

function initSkills() {
    if (!skillsBody) return;

    addSkillButton?.addEventListener('click', addSkill);

    /* Alterações */
    skillsBody.addEventListener('input', event => {
        const row = event.target.closest('tr');
        if (row) updateSkill(row);
    });

    /* Botões */
    skillsBody.addEventListener('click', event => {
        const row = event.target.closest('tr');
        if (!row) return;

        /* Rolar */
        if (event.target.closest('.skill-roll')) {
            const nome = row.querySelector('.skill-name')?.value.trim() || 'Perícia';
            const total = parseInt(row.querySelector('.skill-total')?.value, 10) || 0;

            rolarPericia(nome, total);
            return;
        }

        /* Remover */
        if (event.target.closest('.skill-delete')) {
            const nome = row.querySelector('.skill-name')?.value.trim() || 'esta perícia';

            if (confirm(`Tem certeza que deseja remover "${nome}"?`)) {
                row.remove();
            }
        }
    });
}

/* =========================================================
   HABILIDADES
========================================================= */

export function addAbility() {
    if (!raceAbilities) return;

    const card = document.createElement('div');
    card.className = 'ability-card';

    card.innerHTML = `
        <div class="ability-header">
            <input type="text" placeholder="Nome da habilidade">
        </div>

        <textarea placeholder="Descrição da habilidade..."></textarea>

        <button type="button" class="delete-ability" title="Remover habilidade">×</button>
    `;

    raceAbilities.appendChild(card);
}

function initAbilities() {
    if (!raceAbilities) return;

    addAbilityButton?.addEventListener('click', addAbility);

    raceAbilities.addEventListener('click', event => {
        const deleteButton = event.target.closest('.delete-ability');
        if (!deleteButton) return;

        const card = deleteButton.closest('.ability-card');
        if (!card) return;

        const nome = card.querySelector('input')?.value.trim() || 'esta habilidade';

        if (confirm(`Tem certeza que deseja remover "${nome}"?`)) {
            card.remove();
        }
    });
}

/* ---------- Inicialização ---------- */

export function initPericiasHabilidades() {
    initSkills();
    initAbilities();
}
