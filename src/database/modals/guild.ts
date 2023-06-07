import { Schema, model } from "mongoose";

export interface Guild {
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
  soundboard: [
    {
      name: string;
      url: string;
    }
  ];
}

export const Guild = model(
  "Guild",
  new Schema<Guild>({
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
    },
    soundboard: [
      {
        name: String,
        url: String,
      },
    ],
  })
);
