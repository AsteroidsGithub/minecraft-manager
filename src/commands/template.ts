import {
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('template')
        .setDescription('Ticket templates')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('add')
                .setDescription('Add a ticket template')

                .addStringOption((option) =>
                    option
                        .setName('name')
                        .setDescription('The name of the template')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('description')
                        .setDescription('The description of the template')
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName('pre_screening')
                        .setDescription('Whether to use pre screening')
                        .setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('remove')
                .setDescription('Remove a ticket template')
                .addStringOption((option) =>
                    option
                        .setName('name')
                        .setDescription('The name of the template')
                        .setRequired(true)
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('list')
                .setDescription('List all ticket templates')
        ),
    hasSubCommands: true
})
