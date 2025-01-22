import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Colors,
    Embed,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    User,
    type ChatInputCommandInteraction
} from 'discord.js'
import SubCommand from '../../templates/SubCommand.js'
import NoChannelError, { BadArgumentError } from '../../templates/Error.js'

export default new SubCommand({
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            if (!interaction.channel) throw new NoChannelError()

            // Get the user's input
            const name = interaction.options.getString('name')
            const description = interaction.options.getString('description')
            const preScreening = interaction.options.getBoolean('pre_screening')

            if (!name || !description || preScreening === undefined)
                throw new BadArgumentError()

            let ticketTemplatePreview = new EmbedBuilder()
                .setTitle('Ticket Template Preview')
                .addFields([
                    {
                        name: 'Name',
                        value: name
                    },
                    {
                        name: 'Description',
                        value: description
                    },
                    {
                        name: 'Pre-Screening',
                        value: preScreening ? 'Yes' : 'No'
                    }
                ])

            let questions: string[] = []

            // Add control buttons to the embed
            let messageButtons =
                new ActionRowBuilder<ButtonBuilder>().addComponents([
                    new ButtonBuilder()
                        .setCustomId('add_question')
                        .setLabel('Add Question')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('finish')
                        .setLabel('Finish')
                        .setStyle(ButtonStyle.Success)
                ])

            await interaction.reply({
                embeds: [ticketTemplatePreview],
                components: [messageButtons]
            })

            // Handle the user's response
            // const filter = (i: any) => i.user.id === interaction.user.id
            const buttonCollector =
                interaction.channel.createMessageComponentCollector({
                    time: 60000
                })

            buttonCollector.on('collect', async (i) => {
                if (i.customId === 'add_question') {
                    // Ask the user for a question and use a message collecter
                    // to get the user's response
                    let prompt = await i.reply({
                        content: 'Please provide a question.'
                    })

                    if (!interaction.channel) throw new NoChannelError()

                    const questionCollector =
                        interaction.channel.createMessageCollector({
                            max: 1,
                            time: 60000
                        })

                    questionCollector.on('collect', async (question) => {
                        // Add the question to the embed
                        ticketTemplatePreview.addFields({
                            name: 'Question',
                            value: question.content
                        })

                        questions.push(question.content)

                        await question.delete()
                        await prompt.delete()

                        interaction.editReply({
                            embeds: [ticketTemplatePreview],
                            components: [messageButtons]
                        })
                    })
                } else if (i.customId === 'finish') {
                    ticketTemplatePreview.setColor(Colors.Green)
                    await i.update({
                        content: 'Ticket template created!',
                        embeds: [ticketTemplatePreview],
                        components: []
                    })

                    await database.ticketTemplate.create({
                        data: {
                            name,
                            description,
                            guildId: interaction.guildId ?? '',
                            preScreeningQuestions: questions
                        }
                    })
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                await interaction.reply(error.message)
            } else {
                await interaction.reply('An unknown error occurred.')
            }
        }
    }
})
