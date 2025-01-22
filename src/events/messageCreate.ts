import { ChannelType, Message } from 'discord.js'
import Event from '../templates/Event.js'

export default new Event({
    name: 'messageCreate',
    async execute(message: Message): Promise<void> {
        if (message.author.bot) return
        // if in dm return
        if (message.channel.type === ChannelType.DM) return

        if (message.author) {
            let member = await database.guildMember.findFirst({
                where: {
                    discordId: message.author.id
                }
            })

            if (member) return

            client.emit('foundNewMember', message.member)
        }
        if (client.currentTickets.has(message.channel.id)) {
            // Handle Ticket Messages separately
            const ticket = client.currentTickets.get(message.channel.id)
            client.emit('ticketMessageCreate', message, ticket)
            return
        }
    }
})
