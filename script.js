/* =========================================================
   ELEMENTOS DO DOM
========================================================= */


/* ---------- Abas de equipamentos ---------- */

const tabs =
    document.querySelectorAll('.tab');

const equipmentContents =
    document.querySelectorAll('.equipment-content');


/* ---------- Identidade ---------- */

const characterName =
    document.getElementById('characterName');

const race =
    document.getElementById('race');

const characterClass =
    document.getElementById('class');

const specialization =
    document.getElementById('specialization');

const backgroundField =
    document.getElementById('background');

const roots =
    document.getElementById('roots');

const curse =
    document.getElementById('curse');


/* ---------- Atributos ---------- */

const attributeInputs =
    document.querySelectorAll('.attr-input');

const attrInputs = {};


/* ---------- Vida / Estatísticas ---------- */

const bonusDMG =
    document.getElementById('damageBonus');

const durability =
    document.getElementById('durability');

const currentHP =
    document.getElementById('currentHP');

const maxHP =
    document.getElementById('maxHP');

const reflexos =
    document.getElementById('reflex');

const tamanho =
    document.getElementById('tam');


/* ---------- Perícias ---------- */

const addSkillButton =
    document.getElementById('addSkill');

const skillsBody =
    document.getElementById('skillsBody');


/* ---------- Habilidades ---------- */

const addAbilityButton =
    document.getElementById('addAbility');

const raceAbilities =
    document.getElementById('raceAbilities');


/* ---------- Importar / Exportar ---------- */

const exportSheetButton =
    document.getElementById('exportSheet');

const importSheetButton =
    document.getElementById('importSheet');

const importFileInput =
    document.getElementById('importFile');


/* ---------- Textareas ---------- */

const backgroundTextarea =
    document.querySelector(
        '.large-textarea:not(.notes)'
    );

const notesTextarea =
    document.querySelector(
        '.large-textarea.notes'
    );


/* ---------- Modelos das tabelas ---------- */

const equipmentRowTemplates = [];


/* =========================================================
   CONFIGURAÇÃO DAS REFERÊNCIAS
========================================================= */

attributeInputs.forEach(input => {

    if (input.dataset.attr) {
        attrInputs[input.dataset.attr] = input;
    }

});


/* =========================================================
   BÔNUS DE DANO
========================================================= */

function initBonusDMG() {

    if (!bonusDMG || !reflexos || !tamanho) {
        return;
    }

    const reflexo =
        Number(reflexos.value) || 0;

    const tam =
        Number(tamanho.value) || 0;

    const total =
        reflexo + tam;


    if (total <= 1) {

        bonusDMG.textContent = '-3d4';

    } else if (total <= 5) {

        bonusDMG.textContent = '-2d4';

    } else if (total <= 9) {

        bonusDMG.textContent = '-1d4';

    } else if (total <= 13) {

        bonusDMG.textContent = '0';

    } else if (total <= 17) {

        bonusDMG.textContent = '+1d4';

    } else {

        bonusDMG.textContent = '+2d4';

    }

}


/* =========================================================
   ABAS DE EQUIPAMENTOS
========================================================= */

function initEquipmentTabs() {

    tabs.forEach((tab, index) => {

        tab.addEventListener('click', () => {

            tabs.forEach(item => {
                item.classList.remove('active');
            });


            equipmentContents.forEach(content => {
                content.classList.remove('active');
            });


            tab.classList.add('active');

            equipmentContents[index]
                ?.classList.add('active');

        });

    });

}


/* =========================================================
   EQUIPAMENTOS
========================================================= */


/* ---------- Preparar modelos ---------- */

function prepararModelosEquipamentos() {

    equipmentRowTemplates.length = 0;


    equipmentContents.forEach(box => {

        const tbody =
            box.querySelector('tbody');

        const template =
            tbody?.querySelector('tr');


        equipmentRowTemplates.push(
            template
                ? template.cloneNode(true)
                : null
        );

    });

}


/* ---------- Limpar linha ---------- */

function limparLinhaEquipamento(row) {

    if (!row) {
        return;
    }


    row.querySelectorAll('input').forEach(input => {

        if (input.type === 'checkbox') {

            input.checked = false;

        } else {

            input.value = '';

        }

    });


    row.querySelectorAll('select').forEach(select => {

        select.selectedIndex = 0;

    });

}


/* ---------- Adicionar equipamento ---------- */

function adicionarLinhaEquipamento(index) {

    const content =
        equipmentContents[index];

    const tbody =
        content?.querySelector('tbody');

    if (!tbody) {
        return null;
    }


    let row =
        equipmentRowTemplates[index]
            ?.cloneNode(true);


    /*
       Caso o modelo não tenha sido encontrado,
       tenta usar uma linha existente.
    */

    if (!row) {

        row =
            tbody.querySelector('tr')
                ?.cloneNode(true);

    }


    if (!row) {
        return null;
    }


    limparLinhaEquipamento(row);

    tbody.appendChild(row);

    return row;

}


/* ---------- Inicializar equipamentos ---------- */

function initEquipmentRows() {

    prepararModelosEquipamentos();


    equipmentContents.forEach((box, index) => {

        const tbody =
            box.querySelector('tbody');

        const addButton =
            box.querySelector('.add-button');


        if (!tbody || !addButton) {
            return;
        }


        /* ---------- Adicionar ---------- */

        addButton.addEventListener('click', () => {

            adicionarLinhaEquipamento(index);

        });


        /* ---------- Remover ---------- */

        tbody.addEventListener('click', event => {

            const deleteButton =
                event.target.closest(
                    '.delete-button'
                );


            if (!deleteButton) {
                return;
            }


            const row =
                deleteButton.closest('tr');


            if (!row) {
                return;
            }


            const nameInput =
                row.querySelector(
                    'input[type="text"]'
                );


            const nome =
                nameInput?.value.trim() ||
                'este equipamento';


            const confirmar =
                confirm(
                    `Tem certeza que deseja remover "${nome}"?`
                );


            if (confirmar) {
                row.remove();
            }

        });

    });

}


/* =========================================================
   PERÍCIAS
========================================================= */

function addSkill() {

    if (!skillsBody) {
        return;
    }


    const row =
        document.createElement('tr');


    row.innerHTML = `
        <td>
            <input
                type="text"
                class="skill-name"
                placeholder="Nome da perícia"
            >
        </td>

        <td>
            <input
                type="number"
                class="skill-value"
                value="0"
                min="0"
            >
        </td>

        <td>
            <input
                type="number"
                class="skill-bonus"
                value="0"
            >
        </td>

        <td>
            <input
                type="number"
                class="skill-total"
                value="0"
                readonly
                tabindex="-1"
            >
        </td>

        <td class="skill-actions">

            <button
                type="button"
                class="roll-button skill-roll"
                title="Rolar perícia"
            >
                🎲
            </button>

            <button
                type="button"
                class="delete-button skill-delete"
                title="Remover perícia"
            >
                ×
            </button>

        </td>
    `;


    skillsBody.appendChild(row);

    updateSkill(row);

}


/* =========================================================
   ATUALIZAR TOTAL DA PERÍCIA
========================================================= */

function updateSkill(row) {

    if (!row) {
        return;
    }


    const valueInput =
        row.querySelector('.skill-value');

    const bonusInput =
        row.querySelector('.skill-bonus');

    const totalInput =
        row.querySelector('.skill-total');


    const value =
        parseInt(
            valueInput?.value,
            10
        ) || 0;


    const bonus =
        parseInt(
            bonusInput?.value,
            10
        ) || 0;


    const total =
        value + bonus;


    if (totalInput) {
        totalInput.value = total;
    }

}


/* =========================================================
   INICIALIZAÇÃO DAS PERÍCIAS
========================================================= */

function initSkills() {

    if (!skillsBody) {
        return;
    }


    /* ---------- Adicionar ---------- */

    addSkillButton?.addEventListener(
        'click',
        addSkill
    );


    /* ---------- Alterações ---------- */

    skillsBody.addEventListener(
        'input',
        event => {

            const row =
                event.target.closest('tr');


            if (!row) {
                return;
            }


            updateSkill(row);

        }
    );


    /* ---------- Botões ---------- */

    skillsBody.addEventListener(
        'click',
        event => {

            const row =
                event.target.closest('tr');


            if (!row) {
                return;
            }


            /* ---------- Rolar ---------- */

            const rollButton =
                event.target.closest(
                    '.skill-roll'
                );


            if (rollButton) {

                const nameInput =
                    row.querySelector(
                        '.skill-name'
                    );

                const totalInput =
                    row.querySelector(
                        '.skill-total'
                    );


                const nome =
                    nameInput?.value.trim() ||
                    'Perícia';


                const total =
                    parseInt(
                        totalInput?.value,
                        10
                    ) || 0;


                rolarPericia(
                    nome,
                    total
                );

                return;

            }


            /* ---------- Remover ---------- */

            const deleteButton =
                event.target.closest(
                    '.skill-delete'
                );


            if (deleteButton) {

                const nameInput =
                    row.querySelector(
                        '.skill-name'
                    );


                const nome =
                    nameInput?.value.trim() ||
                    'esta perícia';


                const confirmar =
                    confirm(
                        `Tem certeza que deseja remover "${nome}"?`
                    );


                if (confirmar) {
                    row.remove();
                }

            }

        }
    );

}


/* =========================================================
   HABILIDADES
========================================================= */

function addAbility() {

    if (!raceAbilities) {
        return;
    }


    const card =
        document.createElement('div');


    card.className =
        'ability-card';


    card.innerHTML = `
        <div class="ability-header">

            <input
                type="text"
                placeholder="Nome da habilidade"
            >

        </div>


        <textarea
            placeholder="Descrição da habilidade..."
        ></textarea>


        <button
            type="button"
            class="delete-ability"
            title="Remover habilidade"
        >
            ×
        </button>
    `;


    raceAbilities.appendChild(card);

}


/* =========================================================
   INICIALIZAÇÃO DAS HABILIDADES
========================================================= */

function initAbilities() {

    if (!raceAbilities) {
        return;
    }


    addAbilityButton?.addEventListener(
        'click',
        addAbility
    );


    raceAbilities.addEventListener(
        'click',
        event => {

            const deleteButton =
                event.target.closest(
                    '.delete-ability'
                );


            if (!deleteButton) {
                return;
            }


            const card =
                deleteButton.closest(
                    '.ability-card'
                );


            if (!card) {
                return;
            }


            const nameInput =
                card.querySelector('input');


            const nome =
                nameInput?.value.trim() ||
                'esta habilidade';


            const confirmar =
                confirm(
                    `Tem certeza que deseja remover "${nome}"?`
                );


            if (confirmar) {
                card.remove();
            }

        }
    );

}


/* =========================================================
   ROLAGEM DE ATRIBUTO
========================================================= */

async function rolarAtributo(
    atributo,
    valor
) {

    try {

        const resposta =
            await fetch(
                'http://localhost:3000/rolar',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        personagem:
                            characterName?.value.trim() ||
                            'Personagem',

                        atributo,

                        valor

                    })
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                'Erro ao realizar rolagem.'
            );

        }


        console.log(
            'Resultado da rolagem:',
            dados
        );


        /*
           O servidor já enviou a rolagem
           para o Discord.

           Aqui não decidimos sucesso/falha.
           O mestre decide.
        */


    } catch (erro) {

        console.error(
            'Erro na rolagem:',
            erro
        );


        alert(
            'Não foi possível realizar a rolagem.\n\n' +
            erro.message
        );

    }

}


/* =========================================================
   ROLAGEM DE PERÍCIA
========================================================= */

async function rolarPericia(
    pericia,
    valor
) {

    try {

        const resposta =
            await fetch(
                'http://localhost:3000/rolar',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        personagem:
                            characterName?.value.trim() ||
                            'Personagem',

                        atributo:
                            pericia,

                        valor

                    })
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                'Erro ao realizar rolagem.'
            );

        }


        console.log(
            'Resultado da rolagem:',
            dados
        );


    } catch (erro) {

        console.error(
            'Erro na rolagem da perícia:',
            erro
        );


        alert(
            'Não foi possível realizar a rolagem.\n\n' +
            erro.message
        );

    }

}


/* =========================================================
   EVENTOS DOS ATRIBUTOS
========================================================= */

function initAttributes() {

    attributeInputs.forEach(input => {

        const rollButton =
            input
                .closest('.attribute')
                ?.querySelector(
                    '.attribute-roll'
                );


        if (!rollButton) {
            return;
        }


        rollButton.addEventListener(
            'click',
            () => {

                const atributo =
                    input.dataset.attr;


                const valor =
                    parseInt(
                        input.value,
                        10
                    ) || 0;


                rolarAtributo(
                    atributo,
                    valor
                );

            }
        );

    });

}


/* =========================================================
   EXPORTAR FICHA
========================================================= */

function exportSheet() {

    const ficha = {

        /* ---------- Versão ---------- */

        versao: 1,


        /* ---------- Personagem ---------- */

        personagem: {

            nome:
                characterName?.value || '',

            raca:
                race?.value || '',

            classe:
                characterClass?.value || '',

            especializacao:
                specialization?.value || '',

            passado:
                backgroundField?.value || '',

            raizes:
                roots?.value || '',

            maldicao:
                curse?.value || ''

        },


        /* ---------- Vida ---------- */

        vida: {

            atual:
                currentHP?.value || 0,

            maxima:
                maxHP?.value || 0,

            durabilidade:
                durability?.value || 0

        },


        /* ---------- Atributos ---------- */

        atributos: {},


        /* ---------- Perícias ---------- */

        pericias: [],


        /* ---------- Habilidades ---------- */

        habilidades: [],


        /* ---------- Equipamentos ---------- */

        equipamentos: {

            armas: [],

            projeteis: [],

            armaduras: [],

            escudos: [],

            itensGerais: ''

        },


        /* ---------- Background ---------- */

        background:
            backgroundTextarea?.value || '',


        /* ---------- Anotações ---------- */

        anotacoes:
            notesTextarea?.value || ''

    };


    /* =====================================================
       ATRIBUTOS
    ===================================================== */

    attributeInputs.forEach(input => {

        const atributo =
            input.dataset.attr;


        if (!atributo) {
            return;
        }


        ficha.atributos[atributo] =
            input.value;

    });


    /* =====================================================
       PERÍCIAS
    ===================================================== */

    skillsBody
        ?.querySelectorAll('tr')
        .forEach(row => {

            const nome =
                row
                    .querySelector(
                        '.skill-name'
                    )
                    ?.value || '';


            const comprado =
                row
                    .querySelector(
                        '.skill-value'
                    )
                    ?.value || 0;


            const bonus =
                row
                    .querySelector(
                        '.skill-bonus'
                    )
                    ?.value || 0;


            const total =
                row
                    .querySelector(
                        '.skill-total'
                    )
                    ?.value || 0;


            /*
               Não salva linhas completamente vazias.
            */

            if (
                !nome &&
                Number(comprado) === 0 &&
                Number(bonus) === 0
            ) {
                return;
            }


            ficha.pericias.push({

                nome,

                comprado,

                bonus,

                total

            });

        });


    /* =====================================================
       HABILIDADES
    ===================================================== */

    raceAbilities
        ?.querySelectorAll('.ability-card')
        .forEach(card => {

            const nome =
                card
                    .querySelector('input')
                    ?.value || '';


            const descricao =
                card
                    .querySelector('textarea')
                    ?.value || '';


            ficha.habilidades.push({

                nome,

                descricao

            });

        });


    /* =====================================================
       EQUIPAMENTOS
    ===================================================== */

    const equipmentTables =
        document.querySelectorAll(
            '.equipment-content'
        );


    /* ---------- Armas ---------- */

    const weaponRows =
        equipmentTables[0]
            ?.querySelectorAll(
                'tbody tr'
            ) || [];


    weaponRows.forEach(row => {

        const fields =
            row.querySelectorAll(
                'input, select'
            );


        const item = {

            nome:
                fields[0]?.value || '',

            alcance:
                fields[1]?.value || '',

            dano:
                fields[2]?.value || '',

            danoBonus:
                fields[3]?.value || '',

            tipoDano:
                fields[4]?.value || ''

        };


        /*
           Não salva linha completamente vazia.
        */

        if (
            Object.values(item)
                .every(value => value === '')
        ) {
            return;
        }


        ficha.equipamentos.armas.push(item);

    });


    /* ---------- Projéteis ---------- */

    const projectileRows =
        equipmentTables[1]
            ?.querySelectorAll(
                'tbody tr'
            ) || [];


    projectileRows.forEach(row => {

        const fields =
            row.querySelectorAll(
                'input, select'
            );


        const item = {

            nome:
                fields[0]?.value || '',

            quantidade:
                fields[1]?.value || 0,

            armaCompativel:
                fields[2]?.value || '',

            peso:
                fields[3]?.value || '',

            preco:
                fields[4]?.value || ''

        };


        if (
            Object.values(item)
                .every(value =>
                    value === '' ||
                    Number(value) === 0
                )
        ) {
            return;
        }


        ficha.equipamentos
            .projeteis
            .push(item);

    });


    /* ---------- Armaduras ---------- */

    const armorRows =
        equipmentTables[2]
            ?.querySelectorAll(
                'tbody tr'
            ) || [];


    armorRows.forEach(row => {

        const fields =
            row.querySelectorAll(
                'input, select'
            );


        const item = {

            nome:
                fields[0]?.value || '',

            tipo:
                fields[1]?.value || '',

            peso:
                fields[2]?.value || '',

            durabilidade:
                fields[3]?.value || '',

            preco:
                fields[4]?.value || ''

        };


        if (
            Object.values(item)
                .every(value => value === '')
        ) {
            return;
        }


        ficha.equipamentos
            .armaduras
            .push(item);

    });


    /* ---------- Escudos ---------- */

    const shieldRows =
        equipmentTables[3]
            ?.querySelectorAll(
                'tbody tr'
            ) || [];


    shieldRows.forEach(row => {

        const fields =
            row.querySelectorAll(
                'input, select'
            );


        const item = {

            nome:
                fields[0]?.value || '',

            durabilidade:
                fields[1]?.value || '',

            bonusAparar:
                fields[2]?.value || '',

            requisitoTamanho:
                fields[3]?.value || '',

            preco:
                fields[4]?.value || ''

        };


        if (
            Object.values(item)
                .every(value => value === '')
        ) {
            return;
        }


        ficha.equipamentos
            .escudos
            .push(item);

    });


    /* ---------- Itens gerais ---------- */

    ficha.equipamentos.itensGerais =
        equipmentTables[4]
            ?.querySelector(
                '.items-textarea'
            )
            ?.value || '';


    /* =====================================================
       CRIAR ARQUIVO
    ===================================================== */

    const json =
        JSON.stringify(
            ficha,
            null,
            4
        );


    const blob =
        new Blob(
            [json],
            {
                type: 'application/json'
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement('a');


    const nomePersonagem =
        ficha.personagem.nome.trim() ||
        'ficha';


    link.href = url;

    link.download =
        `${nomePersonagem}.json`;


    document.body.appendChild(link);

    link.click();

    link.remove();


    URL.revokeObjectURL(url);

}


/* =========================================================
   IMPORTAR FICHA
========================================================= */

async function importSheet(event) {

    const arquivo =
        event.target.files[0];


    if (!arquivo) {
        return;
    }


    try {

        const texto =
            await arquivo.text();


        const ficha =
            JSON.parse(texto);


        if (
            !ficha ||
            typeof ficha !== 'object'
        ) {

            throw new Error(
                'O arquivo não contém uma ficha válida.'
            );

        }


        preencherFicha(ficha);


        alert(
            'Ficha importada com sucesso!'
        );


    } catch (erro) {

        console.error(
            'Erro ao importar ficha:',
            erro
        );


        alert(
            'Não foi possível importar a ficha.\n\n' +
            erro.message
        );


    } finally {

        /*
           Permite importar novamente
           o mesmo arquivo.
        */

        event.target.value = '';

    }

}


/* =========================================================
   PREENCHER FICHA
========================================================= */

function preencherFicha(ficha) {

    if (
        !ficha ||
        typeof ficha !== 'object'
    ) {

        throw new Error(
            'Formato de ficha inválido.'
        );

    }


    /* =====================================================
       FUNÇÃO AUXILIAR
    ===================================================== */

    function setValue(
        element,
        value
    ) {

        if (!element) {
            return;
        }


        element.value =
            value ?? '';

    }


    /* =====================================================
       PERSONAGEM
    ===================================================== */

    const personagem =
        ficha.personagem || {};


    setValue(
        characterName,
        personagem.nome
    );


    setValue(
        race,
        personagem.raca
    );


    setValue(
        characterClass,
        personagem.classe
    );


    setValue(
        specialization,
        personagem.especializacao
    );


    setValue(
        backgroundField,
        personagem.passado
    );


    setValue(
        roots,
        personagem.raizes
    );


    setValue(
        curse,
        personagem.maldicao
    );


    /* =====================================================
       VIDA
    ===================================================== */

    const vida =
        ficha.vida || {};


    setValue(
        currentHP,
        vida.atual ?? 0
    );


    setValue(
        maxHP,
        vida.maxima ?? 0
    );


    setValue(
        durability,
        vida.durabilidade ?? 0
    );


    /* =====================================================
       ATRIBUTOS
    ===================================================== */

    const atributos =
        ficha.atributos || {};


    attributeInputs.forEach(input => {

        const atributo =
            input.dataset.attr;


        if (
            atributo &&
            Object.prototype.hasOwnProperty.call(
                atributos,
                atributo
            )
        ) {

            input.value =
                atributos[atributo];

        }

    });


    /* Atualizar bônus de dano */

    initBonusDMG();


    /* =====================================================
       PERÍCIAS
    ===================================================== */

    if (skillsBody) {

        skillsBody.innerHTML = '';


        const pericias =
            Array.isArray(ficha.pericias)
                ? ficha.pericias
                : [];


        pericias.forEach(pericia => {

            addSkill();


            const row =
                skillsBody.lastElementChild;


            if (!row) {
                return;
            }


            const nameInput =
                row.querySelector(
                    '.skill-name'
                );

            const valueInput =
                row.querySelector(
                    '.skill-value'
                );

            const bonusInput =
                row.querySelector(
                    '.skill-bonus'
                );


            if (nameInput) {

                nameInput.value =
                    pericia.nome ?? '';

            }


            if (valueInput) {

                valueInput.value =
                    pericia.comprado ?? 0;

            }


            if (bonusInput) {

                bonusInput.value =
                    pericia.bonus ?? 0;

            }


            updateSkill(row);

        });

    }


    /* =====================================================
       HABILIDADES
    ===================================================== */

    if (raceAbilities) {

        raceAbilities.innerHTML = '';


        const habilidades =
            Array.isArray(ficha.habilidades)
                ? ficha.habilidades
                : [];


        habilidades.forEach(habilidade => {

            addAbility();


            const card =
                raceAbilities.lastElementChild;


            if (!card) {
                return;
            }


            const nameInput =
                card.querySelector('input');

            const descriptionInput =
                card.querySelector('textarea');


            if (nameInput) {

                nameInput.value =
                    habilidade.nome ?? '';

            }


            if (descriptionInput) {

                descriptionInput.value =
                    habilidade.descricao ?? '';

            }

        });

    }


    /* =====================================================
       EQUIPAMENTOS
    ===================================================== */

    preencherEquipamentos(
        ficha.equipamentos || {}
    );


    /* =====================================================
       BACKGROUND
    ===================================================== */

    if (backgroundTextarea) {

        backgroundTextarea.value =
            ficha.background ?? '';

    }


    /* =====================================================
       ANOTAÇÕES
    ===================================================== */

    if (notesTextarea) {

        notesTextarea.value =
            ficha.anotacoes ?? '';

    }

}


/* =========================================================
   PREENCHER EQUIPAMENTOS
========================================================= */

function preencherEquipamentos(
    equipamentos
) {

    const tipos = [

        equipamentos.armas || [],

        equipamentos.projeteis || [],

        equipamentos.armaduras || [],

        equipamentos.escudos || []

    ];


    /* =====================================================
       TABELAS
    ===================================================== */

    tipos.forEach((itens, index) => {

        const content =
            equipmentContents[index];

        const tbody =
            content?.querySelector('tbody');


        if (!tbody) {
            return;
        }


        /*
           Remove todas as linhas atuais.
        */

        tbody.innerHTML = '';


        /*
           Recria cada equipamento usando
           o modelo original do HTML.
        */

        itens.forEach(item => {

            const template =
                equipmentRowTemplates[index];


            let row =
                template
                    ?.cloneNode(true);


            /*
               Segurança caso não exista modelo.
            */

            if (!row) {

                row =
                    document.createElement('tr');


                row.innerHTML = `
                    <td>
                        <input type="text">
                    </td>

                    <td>
                        <input type="text">
                    </td>

                    <td>
                        <input type="text">
                    </td>

                    <td>
                        <input type="text">
                    </td>

                    <td>
                        <input type="text">
                    </td>

                    <td>
                        <button
                            type="button"
                            class="delete-button"
                        >
                            ×
                        </button>
                    </td>
                `;

            }


            /*
               Limpa os valores antes
               de inserir os dados.
            */

            limparLinhaEquipamento(row);


            const fields =
                row.querySelectorAll(
                    'input, select'
                );


            /* ---------- Armas ---------- */

            if (index === 0) {

                if (fields[0]) {
                    fields[0].value =
                        item.nome ?? '';
                }

                if (fields[1]) {
                    fields[1].value =
                        item.alcance ?? '';
                }

                if (fields[2]) {
                    fields[2].value =
                        item.dano ?? '';
                }

                if (fields[3]) {
                    fields[3].value =
                        item.danoBonus ?? '';
                }

                if (fields[4]) {
                    fields[4].value =
                        item.tipoDano ?? '';
                }

            }


            /* ---------- Projéteis ---------- */

            if (index === 1) {

                if (fields[0]) {
                    fields[0].value =
                        item.nome ?? '';
                }

                if (fields[1]) {
                    fields[1].value =
                        item.quantidade ?? '';
                }

                if (fields[2]) {
                    fields[2].value =
                        item.armaCompativel ?? '';
                }

                if (fields[3]) {
                    fields[3].value =
                        item.peso ?? '';
                }

                if (fields[4]) {
                    fields[4].value =
                        item.preco ?? '';
                }

            }


            /* ---------- Armaduras ---------- */

            if (index === 2) {

                if (fields[0]) {
                    fields[0].value =
                        item.nome ?? '';
                }

                if (fields[1]) {
                    fields[1].value =
                        item.tipo ?? '';
                }

                if (fields[2]) {
                    fields[2].value =
                        item.peso ?? '';
                }

                if (fields[3]) {
                    fields[3].value =
                        item.durabilidade ?? '';
                }

                if (fields[4]) {
                    fields[4].value =
                        item.preco ?? '';
                }

            }


            /* ---------- Escudos ---------- */

            if (index === 3) {

                if (fields[0]) {
                    fields[0].value =
                        item.nome ?? '';
                }

                if (fields[1]) {
                    fields[1].value =
                        item.durabilidade ?? '';
                }

                if (fields[2]) {
                    fields[2].value =
                        item.bonusAparar ?? '';
                }

                if (fields[3]) {
                    fields[3].value =
                        item.requisitoTamanho ?? '';
                }

                if (fields[4]) {
                    fields[4].value =
                        item.preco ?? '';
                }

            }


            tbody.appendChild(row);

        });

    });


    /* =====================================================
       ITENS GERAIS
    ===================================================== */

    const itemsTextarea =
        equipmentContents[4]
            ?.querySelector(
                '.items-textarea'
            );


    if (itemsTextarea) {

        itemsTextarea.value =
            equipamentos.itensGerais ?? '';

    }

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function init() {

    /* ---------- Bônus de dano ---------- */

    reflexos?.addEventListener(
        'input',
        initBonusDMG
    );

    tamanho?.addEventListener(
        'input',
        initBonusDMG
    );


    initBonusDMG();


    /* ---------- Equipamentos ---------- */

    initEquipmentTabs();

    initEquipmentRows();


    /* ---------- Perícias ---------- */

    initSkills();


    /* ---------- Habilidades ---------- */

    initAbilities();


    /* ---------- Atributos ---------- */

    initAttributes();


    /* ---------- Exportar ---------- */

    exportSheetButton?.addEventListener(
        'click',
        exportSheet
    );


    /* ---------- Importar ---------- */

    importSheetButton?.addEventListener(
        'click',
        () => {

            importFileInput?.click();

        }
    );


    importFileInput?.addEventListener(
        'change',
        importSheet
    );

}


/* =========================================================
   INICIAR APLICAÇÃO
========================================================= */

if (
    document.readyState === 'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        init
    );

} else {

    init();

}