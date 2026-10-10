const API_BASE_URL =
    'https://discordfichas.xablau.blitz.cloud';

const btnWakeUp = document.getElementById('btnWakeUp');
const wakeUpStatus = document.getElementById('wakeUpStatus');

const MAX_TENTATIVAS = 4;
const TIMEOUT_MS = 12000;

function aguardar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function verificarApi() {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, TIMEOUT_MS);

    try {
        const resposta = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal
        });

        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();

        if (dados.status !== 'online') {
            throw new Error('Resposta de saúde inválida.');
        }

        return true;
    } finally {
        clearTimeout(timeout);
    }
}

async function acordarApi() {
    if (btnWakeUp.disabled) return;

    btnWakeUp.disabled = true;

    try {
        for (let tentativa = 1;
             tentativa <= MAX_TENTATIVAS;
             tentativa++) {

            wakeUpStatus.textContent =
                tentativa === 1
                    ? 'Conectando à API...'
                    : `Tentativa ${tentativa} de ${MAX_TENTATIVAS}...`;

            try {
                await verificarApi();

                wakeUpStatus.textContent = 'API pronta! ✅';
                return;
            } catch (erro) {
                console.warn(
                    `Tentativa ${tentativa} falhou:`,
                    erro
                );

                if (tentativa === MAX_TENTATIVAS) {
                    throw erro;
                }

                await aguardar(tentativa * 2000);
            }
        }
    } catch (erro) {
        console.error('Falha ao acordar a API:', erro);

        wakeUpStatus.textContent =
            'API indisponível. Tente novamente.';
    } finally {
        btnWakeUp.disabled = false;
    }
}

export function initWakeUp() {
    btnWakeUp?.addEventListener('click', acordarApi);
}
