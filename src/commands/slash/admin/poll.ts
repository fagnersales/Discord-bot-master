import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    EmbedBuilder,
  } from "discord.js";
  import { SlashClass } from "../../../structures/slash.js";
  
  export default new SlashClass({
    data: {
      name: "poll",
      description: "Create a poll so users can vote",
      type: ApplicationCommandType.ChatInput,
      options: [{
        name: 'topic',
        description: 'set a topic to vote for',
        type: ApplicationCommandOptionType.String,
        min_length: 0,
        maxLength: 50,
      }],
    },
    opt: {
      userPermissions: ["MuteMembers"],
      botPermissions: ["MuteMembers"],
      category: "admin",
      cooldown: 3,
      guildOnly: false,
    },
    execute: async (_client, int: ChatInputCommandInteraction<'cached'>) => {

    },
  });
  