import { ChannelType, PermissionsBitField } from 'discord.js'
import SubCommand from '../../templates/SubCommand.js'

export default new SubCommand({
    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true)
        let choices: string[] = []

        if (focusedOption.name === 'category') {
            const results = await database.ticketTemplate.findMany({
                select: { name: true }
            })
            choices = results.map((result) => result.name)
        }

        const filtered = choices.filter((choice) =>
            choice.startsWith(focusedOption.value)
        )
        await interaction.respond(
            filtered.map((choice) => ({ name: choice, value: choice }))
        )
    },
    async execute(interaction) {
        // Open a new ticket and handle the pre screening process
        const category = interaction.options.getString('category')

        if (!category) {
            await interaction.reply('Please provide a category')
            return
        }

        const ticketTemplate = await database.ticketTemplate.findFirst({
            where: { name: category }
        })

        if (!ticketTemplate) {
            await interaction.reply('Category not found')
            return
        }

        if (!interaction.guild) {
            await interaction.reply('Guild not found')
            return
        }

        // Create New Channel
        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1331251316298612837', // replace with actual category ID
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ]
        })

        // Create a ticket in the database
        let ticket = await database.ticket.create({
            data: {
                guildId: interaction.guild.id,
                guildMemberDiscordId: interaction.user.id,
                ticketTemplateId: ticketTemplate.id,
                channelId: channel.id, // replace with actual channel ID
                status: 'OPEN'
            }
        })

        await interaction.reply(
            `Ticket has been created. Please go to ${channel} to continue`
        )

        // Send a message to the channel
        await channel.send(
            `Ticket has been created by <@${interaction.user.id}>.`
        )

        client.currentTickets.set(channel.id, ticket)
    }
})
