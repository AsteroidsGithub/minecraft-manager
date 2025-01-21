/* eslint-disable no-var */
import { Client, Collection } from 'discord.js'
import { PrismaClient } from '@prisma/client'
import ApplicationCommand from '../templates/ApplicationCommand'
import MessageCommand from '../templates/MessageCommand'

interface DiscordClient extends Client {
    commands: Collection<string, ApplicationCommand>
    msgCommands: Collection<string, MessageCommand>
}

declare global {
    var client: DiscordClient
    var database: PrismaClient

    type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
}

export {}
