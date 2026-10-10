/* =========================================================
   DOM - Referências centralizadas aos elementos HTML
========================================================= */

/* ---------- Abas de equipamentos ---------- */
export const tabs = document.querySelectorAll('.tab');
export const equipmentContents = document.querySelectorAll('.equipment-content');

/* ---------- Identidade ---------- */
export const characterName = document.getElementById('characterName');
export const race = document.getElementById('race');
export const characterClass = document.getElementById('class');
export const specialization = document.getElementById('specialization');
export const backgroundField = document.getElementById('background');
export const roots = document.getElementById('roots');
export const curse = document.getElementById('curse');

/* ---------- Atributos ---------- */
export const attributeInputs = document.querySelectorAll('.attr-input');
export const attrInputs = {};

attributeInputs.forEach(input => {
    if (input.dataset.attr) {
        attrInputs[input.dataset.attr] = input;
    }
});

/* ---------- Vida / Estatísticas ---------- */
export const bonusDMG = document.getElementById('damageBonus');
export const durability = document.getElementById('durability');
export const currentHP = document.getElementById('currentHP');
export const maxHP = document.getElementById('maxHP');
export const reflexos = document.getElementById('reflex');
export const tamanho = document.getElementById('tam');

/* ---------- Perícias ---------- */
export const addSkillButton = document.getElementById('addSkill');
export const skillsBody = document.getElementById('skillsBody');

/* ---------- Habilidades ---------- */
export const addAbilityButton = document.getElementById('addAbility');
export const raceAbilities = document.getElementById('raceAbilities');

/* ---------- Importar / Exportar ---------- */
export const exportSheetButton = document.getElementById('exportSheet');
export const importSheetButton = document.getElementById('importSheet');
export const importFileInput = document.getElementById('importFile');

/* ---------- Textareas ---------- */
export const backgroundTextarea = document.querySelector('.large-textarea:not(.notes)');
export const notesTextarea = document.querySelector('.large-textarea.notes');

/* ---------- Tabela de armas ---------- */
/* (no script original esta variável era usada mas nunca declarada) */
export const weaponsBody =
    document.getElementById('weaponsBody') ??
    equipmentContents[0]?.querySelector('tbody') ??
    null;
