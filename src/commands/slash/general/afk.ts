import {
  ActionRowBuilder,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { SlashClass } from "../../../structures/slash.js";
import { AFK } from "../../../database/modals/afk.js";
import { Colors, Emojis } from "../../../../config.js";

export default new SlashClass({
  data: {
    name: "afk",
    description: "Display yourself AFK if your not at you're device",
    type: ApplicationCommandType.ChatInput,
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    category: "slash",
    cooldown: 7,
    visible: true,
    guildOnly: false,
  },
  execute: async (_client, int: ChatInputCommandInteraction<'cached'>) => {
    const data = await AFK.findOne({ afk: true, id: int.user.id });
    if (data)
      return await int.reply({
        embeds: [
          new EmbedBuilder()
            .addFields([
              {
                name: `> ${Emojis.Cross} Operation Failed`,
                value: `**Details:** 
                        ${Emojis.Blank} Reason: You are already set afk
                        `,
              },
            ])
            .setColor(Colors.Error),
        ],
        ephemeral: true,
      });
    const modal = new ModalBuilder({
      customId: "afk_modal",
      title: "AFK Reason",
      components: [
        new ActionRowBuilder<TextInputBuilder>({
          components: [
            new TextInputBuilder({
              customId: "afk_reason",
              label: "Reason",
              required: true,
              style: TextInputStyle.Short,
              max_length: 30,
            }),
          ],
        }),
      ],
    });

    await int.showModal(modal);
  },
});
