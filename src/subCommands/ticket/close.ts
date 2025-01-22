import { ChannelType, PermissionsBitField } from 'discord.js'
import SubCommand from '../../templates/SubCommand.js'

export default new SubCommand({
    async execute(interaction) {
        if (!interaction.guild) throw new Error('Guild not found')
        if (!interaction.channel) throw new Error('Channel not found')

        let ticket = await database.ticket.findFirst({
            where: { channelId: interaction.channel.id }
        })

        if (!ticket)
            throw new Error(
                'Ticket not found, please use this command in a ticket channel'
            )

        await database.ticket.update({
            where: ticket,
            data: { status: 'CLOSED' }
        })

        client.currentTickets.delete(ticket.channelId)

        await interaction.reply(
            'Ticket has been closed, deleting channel in 5 seconds'
        )

        setTimeout(async () => {
            if (!interaction.channel) throw new Error('Channel not found')
            await interaction.channel.delete()
        }, 5000)
    }
})
