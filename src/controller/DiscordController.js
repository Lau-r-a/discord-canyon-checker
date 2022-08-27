import { Client, GatewayIntentBits } from 'discord.js';

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
            if (message.content === '!ping') {
                message.channel.send('pong');
            }
        });

        return this;
    }
}