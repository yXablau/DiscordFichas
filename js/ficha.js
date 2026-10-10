/* =========================================================
   FICHA - Atributos, vida, estatísticas e bônus de dano
========================================================= */

import { attributeInputs, bonusDMG, reflexos, tamanho } from './dom.js';
import { rolarAtributo } from './rolagens.js';

/* ---------- Bônus de dano ---------- */

export function initBonusDMG() {
    if (!bonusDMG || !reflexos || !tamanho) return;

    const total = (Number(reflexos.value) || 0) + (Number(tamanho.value) || 0);

    if (total <= 1) bonusDMG.textContent = '-3d4';
    else if (total <= 5) bonusDMG.textContent = '-2d4';
    else if (total <= 9) bonusDMG.textContent = '-1d4';
    else if (total <= 13) bonusDMG.textContent = '0';
    else if (total <= 17) bonusDMG.textContent = '+1d4';
    else bonusDMG.textContent = '+2d4';
}

/* ---------- Eventos dos atributos ---------- */

export function initAttributes() {
    attributeInputs.forEach(input => {
        const rollButton = input.closest('.attribute')?.querySelector('.attribute-roll');
        if (!rollButton) return;

        rollButton.addEventListener('click', () => {
            rolarAtributo(input.dataset.attr, parseInt(input.value, 10) || 0);
        });
    });
}

/* ---------- Inicialização ---------- */

export function initFicha() {
    reflexos?.addEventListener('input', initBonusDMG);
    tamanho?.addEventListener('input', initBonusDMG);

    initBonusDMG();
    initAttributes();
}
