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
        visible: true,
        guildOnly: false,
    },
    // @ts-ignore
    execute: async (client, int: MessageContextMenuCommandInteraction<'cached'>) => {
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
