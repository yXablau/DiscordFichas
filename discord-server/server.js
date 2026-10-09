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
app.use(express.static(path.join(__dirname, '..', 'public')));
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


// Rolar dado
app.post('/rolar', async (req, res) => {
    try {
        const {
            personagem,
            atributo,
            valor
        } = req.body;


        // ---------- Validação básica ----------

        if (!personagem || !atributo || valor === undefined) {
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


        const mensagem = [
            `╔══════════════════════╗`,
            ` 🎲 **${personagem}**`,
            `╚══════════════════════╝`,
            `⚔️ **${atributo}**`,
            `🎯 **Valor:** ${valorNumerico}`,
            `🎲 **Rolagem:** ${rolagem}`,
            `📜 **Total:** ${total}`
        ].join('\n');


        await canal.send(mensagem);


        // ---------- Resposta para a ficha ----------

        res.json({
            personagem,
            atributo,
            valor: valorNumerico,
            rolagem,
            total
        });

    } catch (erro) {
        console.error('Erro ao realizar rolagem:', erro);

        res.status(500).json({
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