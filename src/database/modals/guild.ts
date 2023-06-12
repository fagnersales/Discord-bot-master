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
  applications: [
    app: {
      name: string, // the channel name
      channel: string,
      questions: [];
    }
  ]
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
        default: false,
      },
    },
    applications: [
      {
        name: { 
          type: String,
          default: "None"
        },
        channel: {
          type: String,
          default: "None"
        },
        questions: []
      }
    ]
  })
);
