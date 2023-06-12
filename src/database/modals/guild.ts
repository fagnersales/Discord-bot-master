import { Schema, model } from "mongoose";

export interface GuildData {
  guildName: string;
  id: string;
  discussion: {
    channel: string;
    set: boolean;
  };
  logging: {
    name: string;
    channel: string;
    active: boolean;
  };
}

export const Guild = model(
  "Guild",
  new Schema<GuildData>({
    guildName: String,
    id: String,
    discussion: {
      channel: {
        type: String,
        default: "None",
      },
      set: Boolean,
    },
    logging: {
      name: String,
      channel: String,
      active: {
        type: Boolean,
        default: "false",
      },
    }
  })
);
