import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';

const ADD_URL_COMMAND = 'add_url';
const DELETE_URL_COMMAND = 'delete_url';
const LIST_URL_COMMAND = 'list_url';
const HELP_COMMAND = 'help';
const SCRAPE_COMMAND = 'scrape';

export default class DiscordController {

    client; 
    token;
    clientId;
    rest;

    constructor(token, clientId) {
        this.token = token;
        this.clientId = clientId;
    }

    async start() {

        this.client = new Client({ 
            partials: ["CHANNEL"],
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.client.login(this.token);

        this.client.once('ready', () => {
            console.log('Discord Bot ready!');
        });

        this.regsiterSlashCommands();
        this.registerCommandHandlers();

        return this;
    }

    registerCommandHandlers() {
        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const userId = interaction.user.id;
        
            if (interaction.commandName === ADD_URL_COMMAND) {
                const url = interaction.options.getString('url');
                //TODO: add url to db
                await interaction.reply('Added url: ' + url);
            } 
        });
    }

    regsiterSlashCommands() {
        const rest = new REST({ version: '10' }).setToken(this.token);

        const commands = [
            new SlashCommandBuilder().setName(ADD_URL_COMMAND).setDescription('Regsiter a bike url to scrape')
                .addStringOption(option =>
                    option.setName('url')
                        .setDescription('The url to add')
                        .setRequired(true)),
            new SlashCommandBuilder().setName(LIST_URL_COMMAND).setDescription('list regsitered urls'),
            new SlashCommandBuilder().setName(DELETE_URL_COMMAND).setDescription('delete a registered url'),
            new SlashCommandBuilder().setName(SCRAPE_COMMAND).setDescription('Manually start a scrape for all registered urls'),
            new SlashCommandBuilder().setName(HELP_COMMAND).setDescription('Show the help')
        ]
        .map(command => command.toJSON());

        rest.put(Routes.applicationCommands(this.clientId), { body: commands })
            .then(() => console.log('Successfully registered application commands.'))
            .catch(console.error);
    }

    async sendMessage(userId, message) {
        const user = await this.client.users.fetch(userId, false);
        user.send(message);
    }

    async sendProduct(userid, product) {
        const user = await this.client.users.fetch(userid, false);
        user.send({ embeds: [this.buildEmbedFromProduct(product)] });
    }

    buildEmbedFromProduct(product) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(product.getProductName())
            .setURL(product.getUrl())
            .setAuthor({ name: 'Canyon', iconURL: 'https://www.canyon.com/on/demandware.static/Sites-RoW-Site/-/default/dwa8f4f982/images/favicon-96x96.png', url: 'https://www.canyon.com/de-de/' })
            .setDescription('Preis: ' + product.getPrice())
            .setThumbnail('https://www.canyon.com/on/demandware.static/Sites-RoW-Site/-/default/dw6227e02b/images/favicon-196x196.png')
            .setTimestamp()
            .setFooter({ text: 'Canyon Bikes', iconURL: 'https://www.canyon.com/on/demandware.static/Sites-RoW-Site/-/default/dwa8f4f982/images/favicon-96x96.png' });

        product.getAvailabilityMap().forEach((value, key) => {
            embed.addFields({ name: key, value: value });
        });

        if (product.getImage()) {
            embed.setImage(product.getImage());
        }

        return embed;
    }
}