import { TextClass } from "../../../structures/text.js";

export default new TextClass({
    data: {
        name: 'ping',
        description: 'use the ping command',
        usage: 'ping',
        ownerOnly: false,
        category: 'general'
    },
   async run(_client, message, _args) {
        message.reply({ content: 'Ping command works!'})
    },
})