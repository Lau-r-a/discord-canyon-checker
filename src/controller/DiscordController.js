import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';

export default class DiscordController {

    client; 
    token;

    constructor(token) {
        this.token = token;
    }

    async start() {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
        this.client.login(this.token);

        this.client.once('ready', () => {
            console.log('Discord Bot ready!');
        });

        this.client.on('message', async (message) => {
            console.log("received Message");
            if (message.content === '!ping') {
                message.channel.send('pong');
            }
        });

        return this;
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