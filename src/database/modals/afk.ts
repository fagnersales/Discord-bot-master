import { Schema, model } from "mongoose";

export interface IAFKMember {
  guild: string;
  id: string;
  afk: boolean
  reason: string;
  mentions: number;
  time: string;
}

export const AFK = model("AFK", new Schema<IAFKMember>({
    guild: String,
    id: String,
    afk: Boolean,
    reason: {
        type: String,
        required: true
    },
    mentions: Number,
    time: String
  })
);