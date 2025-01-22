import { Message } from 'discord.js'
import Event from '../../templates/Event.js'
import { Ticket } from '@prisma/client'

export default new Event({
    name: 'ticketMessageCreate',
    async execute(message: Message, ticket: Ticket): Promise<void> {
        // Log the content of the message for the database
        await database.ticketMessage.create({
            data: {
                content: message.content,
                ticketId: ticket.id,
                authorName: message.author.displayName
            }
        })
    }
})
