require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const {
    Client,
    GatewayIntentBits
} = require('discord.js');

// ==================================================
// Configurações
// ==================================================

const PORT = process.env.PORT || 3000;

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

const corsOptions = {
    origin: [
        'https://yxablau.github.io',
        'https://discordfichas.xablau.blitz.cloud'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
};

// ==================================================
// Aplicação
// ==================================================

const app = express();

// ==================================================
// Discord
// ==================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// ==================================================
// Middlewares
// ==================================================
app.use(cors(corsOptions));
app.use(express.json());

// ==================================================
// Saude
// ==================================================
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'online'
    });
});

app.use(express.static(path.join(__dirname, '..', 'public')));

// ==================================================
// Funções auxiliares para rolagem de dano
// ==================================================

function rolarExpressao(expressao) {
    const texto = String(expressao).replace(/\s+/g, '');

    const formatoValido =
        /^[+-]?(?:\d+d\d+|\d+)(?:[+-](?:\d+d\d+|\d+))*$/i;

    if (!formatoValido.test(texto)) {
        throw new Error('Expressão de dano inválida.');
    }

    const termos = texto.match(/[+-]?(?:\d+d\d+|\d+)/gi);

    let total = 0;
    const resultados = [];

    for (const termo of termos) {
        const sinal = termo.startsWith('-') ? -1 : 1;
        const valor = termo.replace(/^[+-]/, '');

        const dados = valor.match(/^(\d+)d(\d+)$/i);

        if (dados) {
            const quantidade = Number(dados[1]);
            const faces = Number(dados[2]);

            if (
                !Number.isInteger(quantidade) ||
                !Number.isInteger(faces) ||
                quantidade < 1 ||
                quantidade > 100 ||
                faces < 2 ||
                faces > 1000
            ) {
                throw new Error(
                    'Quantidade de dados ou faces fora do limite permitido.'
                );
            }

            const rolagens = [];

            for (let i = 0; i < quantidade; i++) {
                rolagens.push(
                    Math.floor(Math.random() * faces) + 1
                );
            }

            const subtotal = rolagens.reduce(
                (soma, numero) => soma + numero,
                0
            );

            const resultado = sinal * subtotal;

            total += resultado;

            resultados.push({
                expressao: termo,
                rolagens,
                subtotal: resultado
            });
        } else {
            const numero = Number(valor);

            if (
                !Number.isSafeInteger(numero) ||
                numero > 10000
            ) {
                throw new Error('Modificador numérico inválido.');
            }

            const resultado = sinal * numero;

            total += resultado;

            resultados.push({
                expressao: termo,
                rolagens: [],
                subtotal: resultado
            });
        }
    }

    return {
        total,
        resultados
    };
}

function formatarResultados(resultados) {
    return resultados.map(item => {
        if (item.rolagens.length === 0) {
            return `${item.expressao} = ${item.subtotal}`;
        }

        return `${item.expressao} [${item.rolagens.join(', ')}] = ${item.subtotal}`;
    }).join('\n');
}

// ==================================================
// Eventos do Discord
// ==================================================

client.once('clientReady', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

// ==================================================
// Rotas da API
// ==================================================

// Status do servidor

app.get('/', (req, res) => {
    res.json({
        status: 'online',
        mensagem: 'Servidor da ficha RPG funcionando!'
    });
});

// ==================================================
// Rolar dano de arma
// ==================================================

app.post('/rolar-dano', async (req, res) => {
    try {
        const {
            personagem,
            arma,
            alcance,
            dano,
            danoBonus,
            tipoDano
        } = req.body;

        // ---------- Validação básica ----------

        if (
            typeof personagem !== 'string' ||
            !personagem.trim() ||
            typeof arma !== 'string' ||
            !arma.trim() ||
            typeof dano !== 'string' ||
            !dano.trim() ||
            typeof tipoDano !== 'string' ||
            !tipoDano.trim()
        ) {
            return res.status(400).json({
                erro: 'personagem, arma, dano e tipoDano são obrigatórios.'
            });
        }

        // ---------- Rolagem do dano base ----------

        const resultadoBase = rolarExpressao(dano);

        // ---------- Rolagem do bônus opcional ----------

        let resultadoBonus = {
            total: 0,
            resultados: []
        };

        if (
            typeof danoBonus === 'string' &&
            danoBonus.trim() !== '' &&
            danoBonus.trim() !== '0'
        ) {
            resultadoBonus = rolarExpressao(danoBonus);
        }

        const total = resultadoBase.total + resultadoBonus.total;

        // ---------- Mensagem do Discord ----------

        const canal = await client.channels.fetch(
            DISCORD_CHANNEL_ID
        );

        if (!canal || !canal.isTextBased()) {
            throw new Error('Canal do Discord inválido ou indisponível.');
        }

        const mensagem = [
            '╔══════════════════════╗',
            `⚔️ **Rolagem de Dano: ${personagem.trim()}**`,
            '╚══════════════════════╝',
            `🗡️ **Arma:** ${arma.trim()}`,
            alcance ? `📏 **Alcance:** ${alcance}` : null,
            `💥 **Tipo de dano:** ${tipoDano}`,
            '',
            '**Dano base:**',
            formatarResultados(resultadoBase.resultados),
            resultadoBonus.resultados.length > 0
                ? [
                    '',
                    '**Bônus de dano:**',
                    formatarResultados(resultadoBonus.resultados)
                ].join('\n')
                : null,
            '',
            `🎯 **Dano total: ${total}**`
        ].filter(item => item !== null).join('\n');

        await canal.send(mensagem);

        // ---------- Resposta para a ficha ----------

        return res.json({
            personagem: personagem.trim(),
            arma: arma.trim(),
            alcance: alcance || null,
            tipoDano,
            danoBase: resultadoBase,
            danoBonus: resultadoBonus,
            total
        });

    } catch (erro) {
        console.error(
            'Erro ao realizar rolagem de dano:',
            erro
        );

        const errosDeValidacao = [
            'Expressão de dano inválida.',
            'Quantidade de dados ou faces fora do limite permitido.',
            'Modificador numérico inválido.'
        ];

        if (errosDeValidacao.includes(erro.message)) {
            return res.status(400).json({
                erro: erro.message
            });
        }

        return res.status(500).json({
            erro: 'Erro interno ao realizar a rolagem de dano.'
        });
    }
});

// ==================================================
// Rolar dado de atributo
// ==================================================

app.post('/rolar', async (req, res) => {
    try {
        const {
            personagem,
            atributo,
            valor
        } = req.body;

        // ---------- Validação básica ----------

        if (
            !personagem ||
            !atributo ||
            valor === undefined
        ) {
            return res.status(400).json({
                erro: 'personagem, atributo e valor são obrigatórios.'
            });
        }

        const valorNumerico = Number(valor);

        if (
            !Number.isInteger(valorNumerico) ||
            valorNumerico < 0 ||
            valorNumerico > 100
        ) {
            return res.status(400).json({
                erro: 'O valor do atributo deve estar entre 0 e 100.'
            });
        }

        // ---------- Rolagem ----------

        const rolagem = Math.floor(Math.random() * 10) + 1;
        const total = rolagem + valorNumerico;

        // ---------- Discord ----------

        const canal = await client.channels.fetch(
            DISCORD_CHANNEL_ID
        );

        if (!canal || !canal.isTextBased()) {
            throw new Error('Canal do Discord inválido ou indisponível.');
        }

        const mensagem = [
            '╔══════════════════════╗',
            `🎲 **${personagem}**`,
            '╚══════════════════════╝',
            `⚔️ **${atributo}**`,
            `🎯 **Valor:** ${valorNumerico}`,
            `🎲 **Rolagem:** ${rolagem}`,
            `📜 **Total:** ${total}`
        ].join('\n');

        await canal.send(mensagem);

        // ---------- Resposta para a ficha ----------

        return res.json({
            personagem,
            atributo,
            valor: valorNumerico,
            rolagem,
            total
        });

    } catch (erro) {
        console.error(
            'Erro ao realizar rolagem:',
            erro
        );

        return res.status(500).json({
            erro: 'Erro interno ao realizar a rolagem.'
        });
    }
});
// ==================================================
// Inicialização
// ==================================================

app.listen(PORT, () => {
    console.log(`API rodando na porta: ${PORT}`);
});

client.login(DISCORD_TOKEN);
