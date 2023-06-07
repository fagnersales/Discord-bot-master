import { ApplicationCommandType, ChatInputCommandInteraction, inlineCode } from 'discord.js';
import { SlashClass } from '../../../structures/slash.js';

export default new SlashClass({
    data: {
        name: 'ping',
        description: 'Pong! Test the bots ping',
        type: ApplicationCommandType.ChatInput,
    },
    opt: {
        userPermissions: ['SendMessages'],
        botPermissions: ['SendMessages'],
        category: 'General',
        cooldown: 5,
        ownerOnly: false,
        visible: true,
        guildOnly: false,
    },
    // @ts-ignore
    execute: async (client, int: ChatInputCommandInteraction<'cached'>) => {
        const msg = await int.reply({
            content: 'Pinging...',
            fetchReply: true
        }); 
        setTimeout(() => {
            const ping = msg.createdTimestamp - int.createdTimestamp;
            int.editReply({
                content: `Pong! Latency is ${inlineCode(`${ping}ms`)}. \nAPI Latency is ${inlineCode(`${int.client.ws.ping}ms`)}`
            });
        }, 3000);
    },
})