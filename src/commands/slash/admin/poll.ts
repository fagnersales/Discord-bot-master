import {
  ActionRowBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
  } from "discord.js";
  import { SlashClass } from "../../../structures/slash.js";
  import { Colors, Emojis } from "../../../../config.js";
  
  export default new SlashClass({
    data: {
      name: "poll",
      description: 'Create a poll so users can vote',
      type: ApplicationCommandType.ChatInput,
      options: [{
        name: 'topic',
        description: 'set a topic to vote for',
        type: ApplicationCommandOptionType.String,
        max_length: 50,
        required: true
      }, 
      {
        name: 'channel',
        description: 'pick a channel to send the poll too',
        type: ApplicationCommandOptionType.Channel
      }],
    },
    opt: {
      userPermissions: ['ManageMessages'],
      botPermissions: ['ManageMessages'],
      category: "admin",
      cooldown: 3,
      guildOnly: false,
    },
    execute: async (_client, int: ChatInputCommandInteraction<'cached'>) => {
        const topic = int.options.getString('topic');
        const channel = int.options.getChannel('channel');

        const embed = new EmbedBuilder()
        .setTitle(`${Emojis.Poll} Poll Began`)
        .setDescription(`> ${topic}`)
        .addFields([
          { name: 'upVotes', value: '> **No Votes**', inline: true },
          { name: 'downVotes', value: '> **No Votes**', inline: true },
          { name: 'Author', value: `> ${int.user.username}`}
        ])
        .setFooter({ text: 'Poll Started'})
        .setColor(Colors.Normal)

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('up')
          .setLabel('Up')
          .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
          .setCustomId('down')
          .setLabel('Down')
          .setStyle(ButtonStyle.Danger)
          )


         if (channel?.isTextBased()) {
         const sent = await channel.send({ embeds: [embed], components: [row] })
          await int.reply({ content: `Sent poll too <#${sent.id}>`, ephemeral: true })
        } else {
          await int.reply({ embeds: [embed], components: [row] })
        }

        

        

    },
  });
  