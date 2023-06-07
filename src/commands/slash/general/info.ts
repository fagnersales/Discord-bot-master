import {
  ActivityType,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import { SlashClass } from "../../../structures/slash.js";
import { Badges, Colors, Emojis } from "../../../../config.js";

export default new SlashClass({
  data: {
    name: "info",
    description: "Find general information about a discord user",
    options: [
      {
        name: "user",
        description: "Information about a user",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "the user to search",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
      {
        name: "guild",
        description: "Information about a guild",
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    category: "General",
    cooldown: 5,
    visible: true,
    guildOnly: false,
  },
  // @ts-ignore

  execute: async (client, int: ChatInputCommandInteraction<'cached'>) => {
    const choice = int.options.getSubcommand();
    const user = int.options.getUser("user");
    const member = int.options.getMember("user");

    if (choice === "user") {
      let flags = user.flags.toArray();
      let badges = [];

      await Promise.all(
        flags.map((badge) => {
          switch (badge) {
            case "Staff":
              badges.push(Badges.Staff);
              break;
            case "Partner":
              badges.push(Badges.PartneredServer);
              break;
            case "CertifiedModerator":
              badges.push(Badges.ModeratorProgramsAlumni);
              break;
            case "Hypesquad":
              badges.push(Badges.HypeSquadEvents);
              break;
            case "HypeSquadOnlineHouse1":
              badges.push(Badges.HypeSquadBravery);
              break;
            case "HypeSquadOnlineHouse2":
              badges.push(Badges.HypeSquadBrilliance);
              break;
            case "HypeSquadOnlineHouse3":
              badges.push(Badges.HypeSquadBalance);
              break;
            case "BugHunterLevel1":
              badges.push(Badges.BugHunter1);
              break;
            case "BugHunterLevel2":
              badges.push(Badges.BugHunter2);
              break;
            case "ActiveDeveloper":
              badges.push(Badges.ActiveDeveloper);
              break;
            case "VerifiedDeveloper":
              badges.push(Badges.VerifiedDeveloper);
              break;
            case "PremiumEarlySupporter":
              badges.push(Badges.EarlySupporter);
              break;
            // case "VerifiedBot":
            //   badges.push(Badges.VerifiedBot);
            //   break;
          }
        })
      );

      const userData = await fetch(
        `https://japi.rest/discord/v1/user/${user.id}`
      );
      const { data } = await userData.json();

      if (data.public_flags_array) {
        await Promise.all(
          data.public_flags_array.map(async (badge) => {
            if (badge === "NITRO") badges.push(Badges.Nitro);
          })
        );
      }

      if (user.bot) {
        const botFetch = await fetch(
          `https://discord.com/api/v10/applications/${user.id}/rpc`
        );

        const json = await botFetch.json();

        const flagsBot = json.flags;

        const gateways = {
          APPLICATION_COMMAND_BADGE: 1 << 23,
          APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE: 1 << 6,
        };

        const arrayFlags = [];

        for (let i in gateways) {
          const bit = gateways[i];
          if ((flagsBot & bit) === bit) arrayFlags.push(i);
        }

        if (arrayFlags.includes("APPLICATION_COMMAND_BADGE")) {
          badges.push(Badges.SupportsCommands);
        }

        if (
          arrayFlags.includes("APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE")
        ) {
          badges.push(Badges.Automod);
        }
      }

      if (
        !user.discriminator ||
        user.discriminator === "0" ||
        user.tag === `${user.username}#0`
      ) {
        badges.push(Badges.Username);
      }

      if (member) {
        console.log("User searched was inside the guild");

        let bot;
        if (member.user.bot) {
          bot = Emojis.Check;
        } else {
          bot = Emojis.Cross;
        }

        let status = {
          online: "Online",
          idle: "Idle",
          dnd: "Do Not Disturb",
          offline: "Invisible",
        };

        let mode = {
          online: Emojis.Online,
          idle: Emojis.Idle,
          dnd: Emojis.Dnd,
          offline: Emojis.Offline,
        };

        const embed = new EmbedBuilder()
          .setTitle(`${member.user.username}'s Profile`)
          .setThumbnail(member.displayAvatarURL({ extension: "png" }))
          .addFields([
            {
              name: "General:",
              value:
                "\nUsername:" +
                ` \`\`${member.user.username}\`\`` +
                "\nNickname:" +
                ` \`\`${member.nickname ?? "None"}\`\`` +
                "\nBadges:" +
                ` ${badges.join(" ") || " ``None``"}` +
                "\nID:" +
                ` \`\`${member.id}\`\`` +
                "\nDiscriminator:" +
                ` \`\`#${member.user.discriminator}\`\`` +
                "\nStatus:" +
                ` ${mode[member.presence?.status ?? "offline"]} ${status[member.presence?.status ?? "offline"]
                }` +
                "\nStreaming:" +
                `${member.presence?.activities?.filter(
                  (item) => item.name === "YouTube" || item.name === "Twitch"
                ).length > 0
                  ? member.presence?.activities
                    .filter(
                      (item) =>
                        item.name === "YouTube" || item.name === "Twitch"
                    )
                    .map((activity) => {
                      if (activity.type === ActivityType.Streaming) {
                        return ` ${Emojis.Check}`;
                      }
                    })
                  : ` ${Emojis.Cross}`
                }` +
                "\nBot:" +
                ` ${bot}`,
            },
            {
              name: "Roles:",
              value: `ignore`,
            },
            {
              name: "Presence:",
              value: codeBlock(
                "fix",
                `${member.presence?.activities
                  .filter((item) => item.name != "Custom Status")
                  .map((activity) => `${activity.name}`)
                  .join("\n") || "No activities"
                }`
              ),
            },
          ])
          .setColor("#2F3136")
          .setFooter({
            text: `${member.user.tag} `,
            iconURL: member.user.avatarURL({ extension: "png" }),
          })
          .setTimestamp();

        int.reply({ embeds: [embed], ephemeral: true });
      } else {
        // other embed
        const embed = new EmbedBuilder()
          .setTitle(`${user.username}'s Profile`)
          .setDescription("Badges: " + `${badges.join(" ") || " ``None``"}`);
        console.log("User searched was not inside the guild");

        int.reply({ embeds: [embed] });
      }
    }

    if (choice === "guild") {
      const embed = new EmbedBuilder().setTitle("Guild information").setFields([
        {
          name: `> ${Emojis.Information} General`,
          value:
            "\nName:" +
            ` ${int.guild.name}` +
            "\nDescription:" +
            ` ${int.guild.description ?? 'None'}` +
            "\nOwner:" +
            ` ${int.guild.ownerId === int.member.id
              ? Emojis.Check
              : Emojis.Cross}` +
            "" +
            `` +
            "" +
            `` +
            "" +
            `` +
            "" +
            `` +
            "" +
            ``,
        },
        {
          name: `> ${Emojis.Information} Stats`,
          value:
            "\nMembers:" +
            ` ${int.guild.memberCount}` +  //code a way to put a start behind members too show it's eleagble to be partnered with that amount of members
            "" +
            `` +
            "" +
            `` +
            "" +
            ``
        },
        {
          name: `> ${Emojis.Information} Channels`,
          value: "nothing yet"
        }
      ]).setColor(Colors.Information)

      await int.reply({ embeds: [embed] });
    }
  },
});
