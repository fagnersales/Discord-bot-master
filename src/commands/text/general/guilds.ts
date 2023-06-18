import { EmbedBuilder } from "discord.js";
import { TextClass } from "../../../structures/text.js";

export default new TextClass({
    data: {
        name: 'guilds',
        description: 'Check top guilds in the bot',
        usage: 'guilds',
        ownerOnly: false,
        category: 'general'
    },
    // @ts-ignore
   async run(client, message, args) {
        const guilds = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first(10);

        const description = guilds.map((guild, index) => {
            return `${index + 1}) ${guild.name} -> ${guild.memberCount} members`
        }).join('\n')

        message.reply({ embeds: [new EmbedBuilder()
            .setTitle('Top Guilds')
            .setDescription(description)
        ]})
    },
})