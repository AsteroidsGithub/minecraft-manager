import { GuildMember } from 'discord.js'
import Event from '../templates/Event.js'

export default new Event({
    name: 'foundNewMember',
    async execute(member: GuildMember): Promise<void> {
        // Executed when a new member is found that doesn't have a entry in the database

        // Create a new entry in the database
        await database.guildMember.create({
            data: {
                discordId: member.id,
                guildId: member.guild.id
            }
        })
    }
})
