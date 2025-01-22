import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket commands')
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('open')
                .setDescription('Opens a New Ticket')
                .addStringOption((option) =>
                    option
                        .setName('category')
                        .setDescription('What your ticket is about')
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        )

        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('close')
                .setDescription('Closes a Ticket')
        )
        .setDMPermission(false),
    hasSubCommands: true
})
