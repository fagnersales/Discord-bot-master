import { TextClass } from "../../../structures/text.js";

export default new TextClass({
    data: {
        name: 'meme',
        description: 'get random memes',
        usage: 'meme',
        ownerOnly: false,
        category: 'fun'
    },
   async run(_client, message, _args) {
        message.reply({ content: 'Meme command works!'})
    },
})