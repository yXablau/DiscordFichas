require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const app = express();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});


// ---------- Configurações ----------
const PORT = process.env.PORT || 3000;


// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());


// ---------- Discord ----------
client.once('clientReady', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});


// ---------- API ----------
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        mensagem: 'Servidor da ficha RPG funcionando!'
    });
});


// ---------- Inicialização ----------
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);

// ---------- Rolar dado ----------
app.post('/rolar', async (req, res) => {
    try {
        const {
            personagem,
            atributo,
            valor
        } = req.body;

        // Validação básica
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

        // D10
        const rolagem = Math.floor(Math.random() * 10) + 1;
        const total = rolagem + valorNumerico;

        // Buscar canal
        const canal = await client.channels.fetch(
            process.env.DISCORD_CHANNEL_ID
        );

        // Mensagem para o Discord
        const mensagem = [
            `╔══════════════════════╗`,
            `      🎲 **ROLAGEM**`,
            `╚══════════════════════╝`,
            ``,
            `👤 **${personagem}**`,
            `⚔️ **${atributo}**`,
            ``,
            `🎯 **Valor:** ${valorNumerico}`,
            `🎲 **Rolagem:** ${rolagem}`,
            `📜 **Total:** ${total}`
        ].join('\n');

        await canal.send(mensagem);

        // Resposta para a ficha
        res.json({
            personagem,
            atributo,
            valor: valorNumerico,
            rolagem
        });

    } catch (erro) {
        console.error('Erro ao realizar rolagem:', erro);

        res.status(500).json({
            erro: 'Erro interno ao realizar a rolagem.'
        });
    }
});