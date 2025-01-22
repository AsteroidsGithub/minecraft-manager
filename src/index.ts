/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import 'dotenv/config'

import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js'
import { readdirSync } from 'fs'
import { PrismaClient, Ticket } from '@prisma/client'
import type ApplicationCommand from './templates/ApplicationCommand.js'
import type Event from './templates/Event.js'
import type MessageCommand from './templates/MessageCommand.js'
import deployGlobalCommands from './deployGlobalCommands.js'
const { TOKEN } = process.env

// await deployGlobalCommands()

// Discord client object
global.client = Object.assign(
    new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent
        ],
        partials: [Partials.Channel]
    }),
    {
        commands: new Collection<string, ApplicationCommand>(),
        msgCommands: new Collection<string, MessageCommand>(),
        currentTickets: new Collection<string, Ticket>()
    }
)

global.database = new PrismaClient()

// Set each command in the commands folder as a command in the client.commands collection
const commandFiles: string[] = readdirSync('./commands').filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
)
for (const file of commandFiles) {
    const command: ApplicationCommand = (await import(`./commands/${file}`))
        .default as ApplicationCommand
    client.commands.set(command.data.name, command)
}

// Event handling
const eventFiles: string[] = readdirSync('./events').filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts')
)

for (const file of eventFiles) {
    const event: Event = (await import(`./events/${file}`)).default as Event
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

// Load any open tickets into the client.openTickets collection
const openTickets = await database.ticket.findMany({
    where: { status: 'OPEN' }
})

for (const ticket of openTickets) {
    client.currentTickets.set(ticket.channelId, ticket)
}

await client.login(TOKEN)
