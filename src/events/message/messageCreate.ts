import { EventClass } from "../../structures/event.js";
import "dotenv/config";
import { AFK } from "../../database/modals/afk.js";
import { EmbedBuilder } from "discord.js";
import { Colors, Emojis } from "../../../config.js";
// import { Guild } from "../../database/modals/guild.js";
import { Config } from "../../../config.js";
import { Guild } from "../../database/modals/guild.js";
// import axios from "axios";

export default new EventClass({
  name: "messageCreate",
  once: false,
  // @ts-ignore
  async execute(client, message) {
    if (message.author.bot) return;

    const authorData = await AFK.findOne({
      afk: true,
      id: message.author.id,
    });
    if (authorData) {
      message
        .reply({
          embeds: [
            new EmbedBuilder()
              .addFields([
                {
                  name: `> ${Emojis.Information} AFK System`,
                  value: `**Details:**
            ${Emojis.Blank} Message: Welcome back <@${authorData.id}>!
            ${Emojis.Blank} Mentions: \`${authorData.mentions}\`
            `,
                },
              ])
              .setColor("#2F3136"),
          ],
          flags: "SuppressNotifications",
        })
        .then((msg) => {
          setTimeout(async () => {
            if (msg.deletable) {
              await msg.delete().catch(() => {});
            }
          }, 7000);
        });

      await AFK.findOneAndUpdate(
        { id: message.author.id },
        { afk: false, mentions: 0 }
      );
      await AFK.findOneAndRemove({ id: message.author.id });
    }

    message.mentions.users
      .filter((u) => !u.bot && u.id !== message.author.id)
      .every(async (user) => {
        const data = await AFK.findOne({ afk: true, id: user.id });

        if (!data) return;
        message.reply({
          embeds: [
            new EmbedBuilder()
              .setFields([
                {
                  name: `> ${Emojis.Information} AFK System`,
                  value: `**Details:**
                    ${Emojis.Blank} User: <@${data.id}>
                    ${Emojis.Blank} Reason: ${data.reason}
                    ${Emojis.Blank} Since: ${`<t:${Math.floor(
                    Number(data.time) / 1000
                  )}:R>`}
                    `,
                },
              ])
              .setColor(Colors.Information),
          ],
        });

        await AFK.findOneAndUpdate({ id: user.id }, { $inc: { mentions: 1 } });
      });


    // message commands execution code
      const guild = await Guild.findOne({ guildName: message.guild.name, id: message.guild.id })
      if (!guild) return;

      const prefix = guild.prefix;

    if (!message.content.startsWith(prefix)) return;
    if (Config.globallyDisabled === true) {
     return message.reply({
        content:
          "All commands are globally disabled currently, Try again later!",
        flags: "SuppressNotifications",
      });
    } else {
      if (!message.content.startsWith(prefix)) return;

      const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

      const command = args.shift().toLowerCase();

      const commandFile = client.text.get(command);

      if (!commandFile) {
        return message.reply({
          content: "This command doesn't exist",
          flags: "SuppressNotifications",
        });
      }

      if (commandFile.data.ownerOnly && Config.ownerID !== message.author.id) {
        return message.reply({
          content: "Sorry, this command can only be used by the bot owner.",
          flags: "SuppressNotifications",
        });
      }

      try {
        commandFile.run(client, message, args);
      } catch (error) {
        console.log(error);
        return message.channel.send("Something went wrong!");
      }
    }

    // ending here


    // FIX THIS SYSTEM BECAUSE THIS CHATBOT API DOESNT WORK AND NEEDS MONEY CHANGE FOR ANOTHER ONE
    // const channel = await Guild.findOne({
    //   guildName: message.guild.name,
    //   id: message.guild.id,
    // });

    // if (!channel) return;

    // const { discussion: msg } = channel;

    // if (message.channel.id === msg.channel) {
    //   const client = axios.create({
    //     headers: {
    //       Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    //     },
    //   });

    //   const params = {
    //     prompt: message.content,
    //     model: "text-davinci-003",
    //     max_tokens: 2048,
    //     temperature: 0.5,
    //   };

    //   const response = await client.post(
    //     "https://api.openai.com/v1/chat/completions",
    //     params
    //   );
    //   message
    //     .reply({ content: `${response.data.choices[0].text}` })
    //     .catch(() => {});
  },
});
