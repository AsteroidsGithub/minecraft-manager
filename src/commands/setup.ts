import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import ApplicationCommand from '../templates/ApplicationCommand.js'
import { GuildOptions } from '@prisma/client'

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Run the setup command to configure the bot'),
    async execute(interaction): Promise<void> {
        if (!interaction.guild) throw new Error('Guild not found')

        let guildOptions: GuildOptions = {
            id: interaction.guild.id,
            guildId: interaction.guild.id,
            ticketCategoryId: '',
            someDateField: new Date()

             

        }

        const ignoredKeys = ['id', 'guildId', 'Guild', 'createdAt', 'updatedAt']
        let questions = Object.keys(GuildOptions).filter(
            (key) => !ignoredKeys.includes(key)
        )

        console.log(questions)
        console.log(Object.keys(GuildOptions))

        const buildQuestionEmbed = (i: number, question: string) =>
            new EmbedBuilder()
                .setTitle(`Question ${i + 1}`)
                .setDescription(`Please provide a value for ${question}`)
                .setColor(Colors.Blue)

        questions.forEach(async (question, index) => {
            await interaction.reply({
                embeds: [buildQuestionEmbed(index, question)]
            })

            if (!interaction.channel) throw new Error('Channel not found')

            const filter = (i: any) => i.user.id === interaction.user.id
            const collector = interaction.channel.createMessageCollector({
                filter,
                time: 60000
            })

            collector.on('collect', async (message) => {
                if (question === 'someDateField') {
                    guildOptionsPartial[question as keyof GuildOptions] =
                        new Date(message.content) as any
                } else {
                    guildOptionsPartial[question as keyof GuildOptions] =
                        message.content as any
                }
                collector.stop()
            })

            collector.on('end', async () => {
                if (!guildOptionsPartial[question as keyof GuildOptions]) {
                    await interaction.reply({
                        content:
                            'You did not provide a value for this question',
                        ephemeral: true
                    })
                }
            })
        })

        await interaction.reply({
            content: 'Setup complete!',
            ephemeral: true
        })
    }
})
