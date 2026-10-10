/* =========================================================
   ROLAGENS - Atributos, perícias e dano (chamadas à API)
========================================================= */

import { characterName, bonusDMG, weaponsBody } from './dom.js';

const API_URL = 'https://discordfichas.xablau.blitz.cloud';

/* ---------- Rolagem genérica (atributo / perícia) ---------- */

async function enviarRolagem(nome, valor, rotuloErro) {
    try {
        const resposta = await fetch(`${API_URL}/rolar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                personagem: characterName?.value.trim() || 'Personagem',
                atributo: nome,
                valor
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || 'Erro ao realizar rolagem.');
        }

        console.log('Resultado da rolagem:', dados);

        /* O servidor já enviou a rolagem para o Discord.
           Sucesso/falha quem decide é o mestre. */

    } catch (erro) {
        console.error(rotuloErro, erro);
        alert('Não foi possível realizar a rolagem.\n\n' + erro.message);
    }
}

export function rolarAtributo(atributo, valor) {
    return enviarRolagem(atributo, valor, 'Erro na rolagem:');
}

export function rolarPericia(pericia, valor) {
    return enviarRolagem(pericia, valor, 'Erro na rolagem da perícia:');
}

/* ---------- Rolagem de dano ---------- */

export function initDamageRoll() {
    if (!weaponsBody) return;

    weaponsBody.addEventListener('click', async (event) => {
        const button = event.target.closest('.weapon-roll');
        if (!button) return;

        const row = button.closest('tr');
        if (!row) return;

        const nome = row.querySelector('.weapon-name')?.value.trim();
        const alcance = row.querySelector('.weapon-range')?.value.trim();
        const dano = row.querySelector('.weapon-damage')?.value.trim();
        const aplicaBonus = row.querySelector('.weapon-bonus')?.checked ?? false;
        const tipoDano = row.querySelector('.weapon-damage-type')?.value;

        if (!nome) {
            alert('Informe o nome da arma.');
            return;
        }

        if (!dano || !/^\d+d\d+(?:\s*[+-]\s*\d+)?$/i.test(dano)) {
            alert('Informe um dano válido, como 1d8 ou 2d6+3.');
            return;
        }

        const danoBonus = aplicaBonus ? bonusDMG?.textContent.trim() : null;

        const payload = {
            personagem: characterName?.value.trim() || 'Personagem',
            arma: nome,
            alcance,
            dano,
            danoBonus,
            tipoDano
        };

        try {
            button.disabled = true;

            const response = await fetch(`${API_URL}/rolar-dano`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || data.message || 'Falha ao rolar o dano.');
            }

            console.log('Resultado da rolagem de dano:', data);
        } catch (error) {
            console.error('Erro ao rolar dano:', error);
            alert(error.message || 'Não foi possível realizar a rolagem de dano.');
        } finally {
            button.disabled = false;
        }
    });
}
