import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';

import UserController from './UserController.js';

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

    userController;

    constructor(token, clientId) {
        this.token = token;
        this.clientId = clientId;
    }

    async start() {

        this.userController = new UserController();

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
                const sizes = interaction.options.getString('sizes').split(',');
                await this.userController.addUrl(userId, url, sizes);
                await interaction.reply('Added url: ' + url);
            } else if (interaction.commandName === LIST_URL_COMMAND) {
                const urls = await this.userController.getUrls(userId);
                await interaction.reply(urls);
            } else if (interaction.commandName == DELETE_URL_COMMAND) {
                const url = interaction.options.getString('url');
                await this.userController.deleteUrl(userId, url);
                await interaction.reply('Deleted url: ' + url);
            } else if (interaction.commandName == HELP_COMMAND) {
                await interaction.reply('Available commands: ' + [ADD_URL_COMMAND, LIST_URL_COMMAND, DELETE_URL_COMMAND, SCRAPE_COMMAND, HELP_COMMAND].join(', '));
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
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('sizes')
                        .setDescription('The sizes to add sparated by comma')
                        .setRequired(true)),
            new SlashCommandBuilder().setName(LIST_URL_COMMAND).setDescription('list regsitered urls'),
            new SlashCommandBuilder().setName(DELETE_URL_COMMAND).setDescription('delete a registered url')
                .addStringOption(option =>
                    option.setName('url')
                        .setDescription('The url to remove')
                        .setRequired(true)),
            //new SlashCommandBuilder().setName(SCRAPE_COMMAND).setDescription('Manually start a scrape for all registered urls'),
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
            embed.addFields({ name: 'Size:' + key, value: value ? 'Available' : 'Not available' });
        });

        if (product.getImage()) {
            embed.setImage(product.getImage());
        }

        return embed;
    }
}