import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

import { SlashClass } from "../../../structures/slash.js";
import { Guild } from "../../../database/modals/guild.js";

export default new SlashClass({
    data: {
        name: "application",
        description: "A system to have people apply for stuff in you're server",
        type: ApplicationCommandType.ChatInput,
        options: [{
            name: "setup",
            description: "upload custom questions to ask",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'name',
                type: ApplicationCommandOptionType.String,
                description: 'Select a name for this application',
                required: true
            }]
        },
        {
            name: "apply",
            description: "Set a channel to send response too",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "application",
                    description: "The application too apply for",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true

                },
            ],
        },
        {
            name: "remove",
            description: "Remove a application from being used anymore",
            type: ApplicationCommandOptionType.Subcommand
        }
        ]
    },
    opt: {
        userPermissions: ['Administrator'], // check over what permissions should be needed later
        botPermissions: ['ManageGuild'], // check over what permissions should be needed later
        category: "admin",
        cooldown: 3,
        visible: true,
        guildOnly: true,
    },

    // @ts-ignore
    auto: async (int) => {
        // const focused = int.options.getFocused() 

    },
    // @ts-ignore
    execute: async (client, int: ChatInputCommandInteraction<'cached'>) => {
        // @ts-ignore
        const application = int.options.getString('application');
        // @ts-ignore
        const name = int.options.getString('name');



        switch (int.options.getSubcommand()) {
            case 'setup':

                const SetupEmbed = new EmbedBuilder()
                    .setTitle("Application Setup")
                    .setDescription("This is the setup for a application system so users can apply\nfor staff or other things in your server.")
                    .setFooter({ text: `Run by: ${int.user.username}` })
                    .setTimestamp()

                const SetupButton = new ButtonBuilder()
                    .setCustomId('beginSetup')
                    .setLabel('Begin Setup')
                    .setStyle(ButtonStyle.Success)

                const respond = await int.reply({ embeds: [SetupEmbed], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(SetupButton)] })

                const collector = respond.createMessageComponentCollector({ componentType: ComponentType.Button })

                collector.on('collect', async (button) => {
                    if (button.member.id !== int.member.id) {
                        await button.reply({ content: 'This button is not for you', ephemeral: true })
                    } else {
                        if (button.customId === 'beginSetup') {
                            const ChannelEmbed = new EmbedBuilder()
                                .setTitle('Channel Selection')
                                .setDescription("Pick a channel to set for the application system")

                            const SelectChannel = new ChannelSelectMenuBuilder()
                                .setCustomId('channel')
                                .setPlaceholder('Select a channel')
                                .setChannelTypes(ChannelType.GuildText)
                                .setMaxValues(1)
                                .setMinValues(1)

                            const data = await button.update({ embeds: [ChannelEmbed], components: [new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(SelectChannel)] })
                            const Menu = await data.awaitMessageComponent({ filter: i => i.user.id === int.user.id, componentType: ComponentType.ChannelSelect })

                            const channel = Menu.values[0];

                            //-----------------------------------------------------
                            await Guild.findOneAndUpdate(
                                { id: int.guild.id, guildName: int.guild.name },
                                { $push: { applications: { name: name, channel: channel } } })
                                .then(async (doc) => await doc.save())
                            //-----------------------------------------------------


                            const QuestionEmbed = new EmbedBuilder()
                                .setTitle('Questions Setup')
                                .setDescription("Select the button that you need to do")

                            const AddButton = new ButtonBuilder()
                                .setCustomId('add-question')
                                .setLabel('Add')
                                .setStyle(ButtonStyle.Success);

                            const RemoveButton = new ButtonBuilder()
                                .setCustomId('remove-question')
                                .setLabel('Remove')
                                .setStyle(ButtonStyle.Danger);

                            const FinishedButton = new ButtonBuilder()
                                .setCustomId('finished-questions')
                                .setLabel('Finished')
                                .setStyle(ButtonStyle.Secondary);


                            const ButtonSelectMenu = await Menu.update({ embeds: [QuestionEmbed], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(AddButton, RemoveButton, FinishedButton)] })

                            const MenuCollector = ButtonSelectMenu.createMessageComponentCollector({ componentType: ComponentType.Button })

                            MenuCollector.on('collect', async (button) => {
                                if (button.member.id !== int.member.id) {
                                    await button.reply({ content: 'This button is not for you', ephemeral: true })
                                } else {
                                    if (button.customId === 'add-question') {

                                        const modal = new ModalBuilder()
                                            .setCustomId('questions-modal')
                                            .setTitle('My Modal');


                                        const questioninput = new TextInputBuilder()
                                            .setCustomId('question-response')
                                            .setLabel("What question do you wanna add")
                                            .setStyle(TextInputStyle.Short);

                                        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(questioninput));


                                        button.showModal(modal)

                                    } else if (button.customId === 'finished-questions') {
                                        MenuCollector.stop()
                                    }
                                    

                                }
                            })





                        }
                        collector.stop('correct user clicked')
                    }

                })






                break;

            case 'apply':

                break

            case 'remove':

                break

            default:
                break;
        }
    },
});
