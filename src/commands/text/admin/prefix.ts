import { Guild } from "../../../database/modals/guild.js";
import { TextClass } from "../../../structures/text.js";

export default new TextClass({
    data: {
        name: 'prefix',
        description: 'change the bot prefix',
        usage: 'prefix <prefix>',
        ownerOnly: false,
        category: 'admin'
    },
    // @ts-ignore
   async run(client, message, args) {
        
        const guild = await Guild.findOne({ guildName: message.guild.name, id: message.guild.id })
        if (!guild) return message.reply({ content: "Sorry a problem happened when trying to search this guild for information"})

        if (!args[0]) return message.reply({ content: "Please provide a new prefix for the bot"})

       await guild.updateOne({ prefix: args[0] })
        message.reply({ content: "You're prefix has been updated!"})

        
    },
})