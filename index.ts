import { GatewayIntentBits } from "discord.js";
import { DiscordApplication } from "./interfaces/discordApplication";
import "dotenv/config";

const clientId = process.env.CLIENT_ID;
const clientToken = process.env.CLIENT_TOKEN;

if (!clientId || !clientToken) {
    throw new Error("Missing Discord Bot Token or Client ID");
}

const Bot = new DiscordApplication({
    clientId,
    clientToken,
    clientOptions: {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.MessageContent,
        ],
    },
});

Bot.start();
