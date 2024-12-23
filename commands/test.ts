import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommandConstructor } from "../interfaces/discordApplication";

const command: SlashCommandConstructor = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("A test command"),
    run: (client, interaction: ChatInputCommandInteraction) => {
        interaction.reply("Test command ran");
    },
};

export default command;
