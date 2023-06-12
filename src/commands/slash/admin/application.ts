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
        // const application = int.options.getString('application')

        switch (int.options.getSubcommand()) {
            case 'setup':
                const setupEmbed = new EmbedBuilder()
                    .setTitle('Setup Embed')
                    .setDescription('Use this menu and buttons to setup stuff for your application system')
                    .addFields([{
                        name: "Information",
                        value: `Info here`
                    }])

                const beginButton = new ButtonBuilder()
                    .setCustomId('begin')
                    .setLabel('Begin Setup')
                    .setStyle(ButtonStyle.Success)

                const buttonRow = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(beginButton);

                const reply = await int.reply({ embeds: [setupEmbed], components: [buttonRow] })

                const button = await reply.awaitMessageComponent({ filter: i => i.user.id === int.user.id, componentType: ComponentType.Button })
                if (button.member.id !== int.member.id) {
                    int.reply({ content: "This interaction is not for you" })
                }

                if (button.customId === 'begin') {
                    const firstUpdate = new EmbedBuilder()
                    .setTitle('Channel Selection')
                    .setDescription("Pick a channel to set for the application system")

                    const channelSelect = new ChannelSelectMenuBuilder()
                    .setCustomId('channel')
                    .setPlaceholder('Select a channel')
                    .setChannelTypes(ChannelType.GuildText)
                    .setMaxValues(1)
                    .setMinValues(1)

                    const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
                    .addComponents(channelSelect)

                    const menu = await button.update({ components: [row], embeds: [firstUpdate] });

                   const data = await menu.awaitMessageComponent({ filter: i => i.user.id === int.user.id, componentType: ComponentType.ChannelSelect });

                    //@ts-ignore
                   const channel = data.values[0];

                   const doc = await Guild.findOneAndUpdate(
                        { id: int.guild.id, guildName: int.guild.name },
                        { applications: { channel: `${channel}`}} // and set it in here
                        )

                        doc.save();

                        // make a way to get a name for the "Application" to set into database either with modal or something else

                }

                break;







            case 'apply':
                console.log('apply')
                break;

            default:
                break;
        }


    },
});
