import { EmbedBuilder } from "discord.js";
import { TextClass } from "../../../structures/text.js";

export default new TextClass({
    data: {
        name: 'device',
        description: 'check users devices',
        usage: 'device',
        ownerOnly: false,
        category: 'general'
    },
    // @ts-ignore
   async run(client, message, args) {
       const user = message.mentions.members.last() || message.member;
       const devices = user.presence?.clientStatus || {};

       const description = () => {
        const entries = Object.entries(devices)
        .map((value, index) => `${index + 1}) ${value[0][0].toUpperCase()}${value[0].slice(1)}`)
        .join('\n')

        return `Devices:\n${entries}`
       }

       const embed = new EmbedBuilder()
       .setTitle('devices of user')
       .setDescription(description())

      await message.reply({ embeds: [embed] });
    },
})