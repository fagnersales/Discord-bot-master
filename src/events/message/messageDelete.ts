import { EventClass } from "../../structures/event.js";
import { messagesCache } from "../../functions/messageCache.js";
import "dotenv/config";


export default new EventClass({
  name: "messageDelete",
  once: false,
  // @ts-ignore
  async execute(client, message) {
    if (message.author.bot) return;

  const messageCache = [...messagesCache].find(({ userMessageId }) => userMessageId === message.id);

  if (messageCache) {
    const clientMessage = await message.channel.messages.fetch(messageCache.replyMessageId).catch(() => null);

    clientMessage.delete().catch(() => null)
  }

  },
});
