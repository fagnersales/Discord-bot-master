// FIX THIS COMMAND TO MAKE BOT LEAVE RIGHT AFTER SONG/AUDIO IS OVER

import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction
} from "discord.js";
import { SlashClass } from "../../../structures/slash.js";
import { Guild } from "../../../database/modals/guild.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
} from "@discordjs/voice";

export default new SlashClass({
  data: {
    name: "sound",
    description: "Play funny sound effects with longer times",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "upload",
        description: "upload a sound",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "audio",
            description: "upload a audio sound to save",
            type: ApplicationCommandOptionType.Attachment,
            required: true,
          },
        ],
      },
      {
        name: "delete",
        description: "Delete a sound",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "delete",
            description: "Delete a audio from the ones saved",
            type: ApplicationCommandOptionType.String,
            required: true,
            // use autocomplete here to list options of songs in database
          },
        ],
      },
      {
        name: "play",
        description: "play a sound",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "sound",
            description: "pick a sound to play",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
            //  return data in objects to list them as choices OR  !! (USE AUTOCOMPLETE SYSTEM INSTEAD) !!
          },
        ],
      },
    ],
  },
  opt: {
    userPermissions: ["Connect", "UseSoundboard"],
    botPermissions: ["UseSoundboard"],
    category: "fun",
    cooldown: 7,
    ownerOnly: false,
    visible: true,
    guildOnly: true,
  },
  auto: async (int) => {
    const focusedValue = int.options.getFocused();
    const guild = await Guild.findOne({ id: int.guildId, guildName: int.guild.name });
    console.log(guild)
    console.log(guild.soundboard)
    const choices = guild.soundboard;
    const filter = choices.filter((choice) =>
      choice.name.startsWith(focusedValue)
    );

    await int.respond(
      filter.map((data) => {
        let value: string;

        if (data.url.length >= 100) {
          value = data.url.replace(
            "https://cdn.discordapp.com/ephemeral-attachments/",
            ""
          );
        }

        return {
          name: data.name,
          value: value,
        };
      })
    );
  },
  // @ts-ignore
  execute: async (client, int: ChatInputCommandInteraction<'cached'>) => {
      
    const choice = int.options.getSubcommand();
    const data = int.options.getAttachment("audio");
    const audio = int.options.getString("sound");

    // ALSO CHECK IF SONG ALREADY EXISTS WITH SAME NAME
    // maybe make system to ask in buttons or menu to over-edit the current existing one

    switch (choice) {
      case "upload":
        if (
          data.contentType.startsWith("audio/") &&
          data.name.endsWith(".mp3")
        ) {
          if (Math.round(data.size / 1024 / 1024) > 4) {
            return int.reply({
              content: "You're file size is too big!",
            });
          } else {
            const guild = await Guild.findOne({ id: int.guild.id });

            if (data.name.length > 100) {
              int.reply({
                content: "File name is too long please lower it!",
              });
            } else {
              if (guild.soundboard.length > 10) {
                return int.reply({
                  content: `Too many audios are already set currently! [${guild.soundboard.length}]`,
                });
              } else {
                guild.collection.updateOne(
                  { id: int.guild.id },
                  { $push: { soundboard: { name: data.name, url: data.url } } }
                );

                int.reply({
                  content: "Audio has been added too this guild!",
                });
              }
            }
          }
        } else {
          return int.reply({
            content: "Content is not a MP3 file type!",
          });
        }

        break;

      case "Delete":
        break;

      case "play":
        if (!int.member.voice.channel) {
          return int.reply({
            content: "You need to be in a voice channel to run this command",
          });
        }

        // do a check to make sure there is atleast 1 song added to database for it to be able to show choices

        const { channelId, guild } = int.member.voice;
        const connection = joinVoiceChannel({
          adapterCreator: guild.voiceAdapterCreator,
          channelId: channelId,
          guildId: guild.id,
          selfDeaf: true,
        });

        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
          },
        });

        connection.subscribe(player);

        const resource = createAudioResource(
          `https://cdn.discordapp.com/ephemeral-attachments/${audio}`
        );

        player.play(resource);

        int.reply({
          content: "Playing the effect now",
          ephemeral: true,
        });

        break;
    }
  },
});
