import { inlineCode, Collection, bold, EmbedBuilder } from "discord.js";
import { EventClass } from "../../structures/event.js";
import { missingPerms } from "../../functions/util.js";
import { AFK } from "../../database/modals/afk.js";
import { Colors, Emojis, Config } from "../../../config.js";
import { Guild } from "../../database/modals/guild.js";

export default new EventClass({
  name: "interactionCreate",
  async execute(client, interaction) {
    if (interaction.isCommand()) {
      if (interaction.inCachedGuild()) {
        if (Config.globallyDisabled === true) {
          interaction.reply({
            content:
              "All commands are globally disabled currently, Try again later!",
          });
        } else {
          const command = interaction.client.slash.get(interaction.commandName);

          if (!command?.data) {
            console.error(
              `No command matching ${interaction.commandName} was found.`
            );
            return interaction.reply({
              content: `⚠️ There is no command matching ${inlineCode(
                interaction.commandName
              )}!`,
              ephemeral: true,
            });
          }

          if (command.opt.ownerOnly && Config.ownerID !== interaction.user.id) {
            return interaction.reply({
              content: "Sorry, this command can only be used by the bot owner.",
            });
          }

          if (command.opt?.guildOnly && interaction.channel.isDMBased()) {
            return interaction.reply({
              content: "This command can only be used in a guild.",
              ephemeral: true,
            });
          }

          if (command.opt?.userPermissions) {
            const missingUserPerms = missingPerms(
              interaction.member.permissionsIn(interaction.channel),
              command.opt?.userPermissions
            )
              ? missingPerms(
                interaction.member.permissionsIn(interaction.channel),
                command.opt?.userPermissions
              )
              : missingPerms(
                interaction.memberPermissions,
                command.opt?.userPermissions
              );

            if (missingUserPerms?.length) {
              return interaction.reply({
                content: `You need the following permission${missingUserPerms.length > 1 ? "s" : ""
                  }: ${missingUserPerms.map((x) => inlineCode(x)).join(", ")}`,
                ephemeral: true,
              });
            }
          }

          if (command.opt?.botPermissions) {
            const missingBotPerms = missingPerms(
              interaction.guild.members.me.permissionsIn(interaction.channel),
              command.opt?.botPermissions
            )
              ? missingPerms(
                interaction.guild.members.me.permissionsIn(
                  interaction.channel
                ),
                command.opt?.botPermissions
              )
              : missingPerms(
                interaction.guild.members.me.permissions,
                command.opt?.botPermissions
              );

            if (missingBotPerms?.length) {
              return interaction.reply({
                content: `I need the following permission${missingBotPerms.length > 1 ? "s" : ""
                  }: ${missingBotPerms.map((x) => inlineCode(x)).join(", ")}`,
                ephemeral: true,
              });
            }
          }

          if (command.opt?.cooldown) {
            if (
              !interaction.client.cooldown.has(
                `${command.data.name}-${interaction.guildId}`
              )
            ) {
              interaction.client.cooldown.set(
                `${command.data.name}-${interaction.guildId}`,
                new Collection()
              );
            }

            const now = Date.now();
            const timestamps = interaction.client.cooldown.get(
              `${command.data.name}-${interaction.guildId}`
            );
            const cooldownAmount = (command.opt.cooldown ?? 3) * 1000;

            if (timestamps.has(interaction.user.id)) {
              const expirationTime =
                timestamps.get(interaction.user.id) + cooldownAmount;

              if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                return interaction.reply({
                  content: `Please wait ${bold(
                    `${timeLeft.toFixed()} second(s)`
                  )} before reusing this command!`,
                  ephemeral: true,
                });
              }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(
              () => timestamps.delete(interaction.user.id),
              cooldownAmount
            );

            try {
              await command.execute(client, interaction);
            } catch (error) {
              console.error(error);
              if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              } else {
                await interaction.reply({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              }
            }
          } else {
            try {
              await command.execute(client, interaction);
            } catch (error) {
              console.error(error);
              if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              } else {
                await interaction.reply({
                  content: `There was an error while executing this command: \n${error.message} \nCheck the console for more info.`,
                  ephemeral: true,
                });
              }
            }
          }
        }
      }
    }

    if (interaction.isAutocomplete()) {
      const autocomplete = client.slash.get(interaction.commandName);

      try {
        await autocomplete.auto(interaction);
      } catch (error) {
        console.error(error);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'afk_modal') {
        const reason = interaction.fields.getTextInputValue("afk_reason");

        (await AFK.findOneAndUpdate(
          { id: interaction.user.id },
          { afk: true, time: Date.now(), reason }
        )) ||
          (await AFK.create({
            id: interaction.user.id,
            afk: true,
            time: Date.now(),
            reason,
            guild: interaction.guild.id,
            mentions: 0,
          }));

        interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .addFields([
                {
                  name: `> ${Emojis.Check} AFK Status Set`,
                  value: `**Details:** 
              ${Emojis.Blank} Reason: ${reason}
              ${Emojis.Blank} Time: <t:${Math.floor(
                    interaction.createdTimestamp / 1000
                  )}:t>
              `,
                },
              ])
              .setColor(Colors.Success),
          ],
        });

      }

      if (interaction.customId === 'questions-modal') {
        const question = interaction.fields.getTextInputValue('question-response')
        // await Guild.findOneAndUpdate(
        //       { id: interaction.guild.id, guildName: interaction.guild.name },
        //       { $push: { applications: { questions: `${question}` } } }
        //   ).then((doc) => doc.save())

        await Guild.updateOne(
          { id: interaction.guild.id, guildName: interaction.guild.name }, 
          { $push: { "applications.questions.$": question }}
          )

        // FIX THIS CODE SO IT ONLY PUTS EACH NEW QUESTION IN ARRAY AND DOESN'T CREATE ANOTHER OBJECT



        interaction.reply({ content: 'Question has been added!', ephemeral: true })
      }
    }

    if (interaction.isChannelSelectMenu()) {
      if (interaction.customId === "chatbotchannel") {
        let channel = "";
        interaction.values.forEach((value) => {
          channel += `${value}`;
        });

        const data = await Guild.findOneAndUpdate(
          { guildName: interaction.guild.name, id: interaction.guild.id },
          { discussion: { channel: channel, set: true } }
        );
        await data.save();

        const embed = new EmbedBuilder()
          .addFields([
            {
              name: `> ${Emojis.Check} Discussion Channel Set`,
              value: `**Details:** 
          ${Emojis.Blank} Channel: <#${channel}>
          ${Emojis.Blank} Admin: <@${interaction.user.id}>
          `,
            },
          ])
          .setColor(Colors.Success);

        await interaction.update({ embeds: [embed], components: [] });
      }
    }

  },
});
