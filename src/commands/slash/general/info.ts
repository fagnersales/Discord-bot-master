import {
  ActivityType,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import { SlashClass } from "../../../structures/slash.js";
import { Badges, Colors, Emojis } from "../../../../config.js";
// import { Guild } from "../../../database/modals/guild.js";

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
    guildOnly: false,
  },
  execute: async (_client, int: ChatInputCommandInteraction<'cached'>) => {
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
            case "VerifiedBot":
              badges.push(Badges.VerifiedBot);
              break;
          }
        })
      );

      const userData = await fetch(
        `https://japi.rest/discord/v1/user/${user.id}`
      );
      const { data } = await userData.json();

      if (data.public_flags_array) {
        await Promise.all(
          data.public_flags_array.map(async (badge: String) => {
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


      const devices = member?.presence?.clientStatus || {};

      const device = () => {
        const entries = Object.entries(devices)
          .map((value) => {
            if (value[0] === 'desktop') {
              return `\n${Emojis.Blank}${value[0].charAt(0).toUpperCase() + 
                value[0].slice(1)}: ${Emojis.Check}`
            }

            if (value[0] === 'mobile') {
              return `\n${Emojis.Blank}${value[0].charAt(0).toUpperCase() + 
                value[0].slice(1)}: ${Emojis.Check}`
            }

            if (value[0] === 'web') {
              return `\n${Emojis.Blank}${value[0].charAt(0).toUpperCase() + 
                value[0].slice(1)}: ${Emojis.Check}`
            }
          }
          ).join(' ')

        return `${entries || Emojis.Cross}`
      }


      if (member) {
        if (user.bot) {

          const botEmbed = new EmbedBuilder()
            .setTitle('Bot Information')
            .setDescription(`Welcome to ${member.user.username}'s profile`)
            .addFields([{
              name: "General",
              value: "\nBadges:" +
                `${badges.join(" ") || Emojis.Cross}`
            }]);


          int.reply({ embeds: [botEmbed], ephemeral: true })

        } else {

          let bot: Boolean | String;
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


          // const guild = await Guild.findOne({ guildName: int.guild.name, id: int.guild.id })
          // const { prefix } = guild;


          const memberEmbed = new EmbedBuilder()
            .setDescription(`> ${Emojis.Information} **Member Information**`)
            .setThumbnail(member.displayAvatarURL({ extension: "png" }))
            .addFields([
              {
                name: "General:",
                value:
                  `\n${Emojis.Profile} Profile:` +
                  ` \`\`${member.user.username}\`\`
                  ${Emojis.Blank} ${Emojis.RightArrow} Badges: ${badges.join(" ") || Emojis.Cross}
                  ${Emojis.Blank} ${Emojis.RightArrow} ID: ${member.id}
                  ${Emojis.Blank} ${Emojis.RightArrow} Status: ${mode[member.presence?.status ?? "offline"]} ${status[member.presence?.status ?? "offline"]
                }` + 
                  "\nCreated:" +
                  ` <t:${Math.floor(user.createdAt.getTime() / 1000)}:D>` +
                  "\nNickname:" +
                  ` ${member.nickname ?? Emojis.Cross}` +
                  "\nStreaming:" +
                  ` ${member.presence?.activities?.filter(
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
                  ` ${bot}` +
                  "\nDevices:" +
                  ` ${device()}` +
                  "\nAvatar:" + 
                  ` [png](${member.displayAvatarURL({ extension: 'png'} )}) • [jpg](${member.displayAvatarURL({ extension: 'jpg'} )})`,
              },
              {
                name: "Roles:",
                value: `Work in Progress`,
              },
              {
                name: "Presence:",
                value: codeBlock(
                  "ini",
                  `${member.presence?.activities
                    .filter((item) => item.name != "Custom Status")
                    .map((activity) => `[${activity.name}]`)
                    .join("\n") || "No activities"
                  }`
                ),
              },
            ])
            .setColor(Colors.Normal)
            .setFooter({
              text: `${member.user.username} `,
              iconURL: member.user.avatarURL({ extension: "png" }),
            })
            .setTimestamp();

          int.reply({ embeds: [memberEmbed], ephemeral: false });

        }

      } else {
        // if user isn't a guild member and just a USER
        const embed = new EmbedBuilder()
          .setTitle('User Information')
          .setDescription(`Welcome to ${user.username}'s profile`)
          .setFields([{
            name: "General",
            value: "\nBadges:" +
              `${badges.join(" ") || " None"}`
          }]);

        int.reply({ embeds: [embed], ephemeral: true });
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
            ` ${int.guild.description ?? Emojis.Cross}` +
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
