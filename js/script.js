/* =========================================================
   SCRIPT PRINCIPAL - Inicializa a aplicação e conecta os módulos
========================================================= */

import { initFicha } from './ficha.js';
import { initEquipamentos } from './equipamentos.js';
import { initPericiasHabilidades } from './pericias-habilidades.js';
import { initDamageRoll } from './rolagens.js';
import { initImportacaoExportacao } from './importacao-exportacao.js';
import { initWakeUp } from './api.js';

function init() {
    initFicha();                  // bônus de dano + atributos
    initDamageRoll();             // rolagem de dano das armas
    initEquipamentos();           // abas + linhas de equipamentos
    initPericiasHabilidades();    // perícias + habilidades
    initImportacaoExportacao();   // exportar / importar JSON
    initWakeUp();                 // "Acorda" API
}

/* Módulos já são adiados (defer) por padrão, mas mantemos a checagem por segurança. */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
