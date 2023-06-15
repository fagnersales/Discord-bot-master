import { EventClass } from "../../structures/event.js";
import { Guild } from "../../database/modals/guild.js";
import chalk from 'chalk';
import "dotenv/config";
import { Config } from "../../../config.js";

export default new EventClass({
  name: "guildCreate",
  once: false,
  //@ts-ignore
  async execute(client, guild) {
    (await Guild.findOne({ guildName: guild.name, id: guild.id })) || 
    (await Guild.create({
            guildName: guild.name,
            id: guild.id,
            prefix: Config.prefix,
            discussion: {
              channel: 'None',
              set: false
            },
            logging: {
              name: 'None',
              channel: 'None',
              active: false
            },
            applications: []
        }));
        console.log(chalk.green(`Successfully`) + chalk.white(` Added ${guild.name} too the guilds database!`))
  },
});
