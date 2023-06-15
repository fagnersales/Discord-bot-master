import { Schema, model, SchemaTypes } from "mongoose";

export interface GuildData {
  guildName: string;
  id: string;
  prefix: string;
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
    {
      name: string, // the channel name
      channel: string,
      questions?: [];
    }
  ]
}

export const Guild = model(
  "Guild",
  new Schema<GuildData>({
    guildName: SchemaTypes.String,
    id: SchemaTypes.String,
    prefix: SchemaTypes.String,
    discussion: {
      channel: {
        type: SchemaTypes.String,
        default: "None",
      },
      set: SchemaTypes.Boolean,
    },
    logging: {
      name: SchemaTypes.String,
      channel: SchemaTypes.String,
      active: {
        type: SchemaTypes.Boolean,
        default: false,
      },
    },
    applications: [
      {
        name: { 
          type: SchemaTypes.String,
          default: "None"
        },
        channel: {
          type: SchemaTypes.String,
          default: "None"
        },
        questions: SchemaTypes.Array
      }
    ]
  })
);
