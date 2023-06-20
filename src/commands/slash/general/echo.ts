import { ApplicationCommandType, MessageContextMenuCommandInteraction, hyperlink } from 'discord.js';
import { SlashClass } from '../../../structures/slash.js';

export default new SlashClass({
    data: {
        name: 'echo',
        type: ApplicationCommandType.Message,
    },
    opt: {
        userPermissions: ['SendMessages'],
        botPermissions: ['SendMessages'],
        category: 'Context',
        cooldown: 5,
        guildOnly: false,
    },
    execute: async (_client, int: MessageContextMenuCommandInteraction<'cached'>) => {

        // RE-VAMP THIS COMMAND TO BE BETTER AND NOT TAKE IN MENTIONS LIKE @EVERYONE AND MORE STUFF
        const message = await int.targetMessage.fetch();
        if (!message?.content) return int.reply({
            content: hyperlink('No content was found in this message!', message.url),
            ephemeral: true
        })
        else return int.reply({
            content: hyperlink(message.content, message.url)
        });
    }
});
