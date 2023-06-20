import { Schema, model } from "mongoose";

export interface AfkData {
  guild: string;
  id: string;
  afk: boolean
  reason: string;
  mentions: number;
  time: string;
}

export const AFK = model("Afk", new Schema<AfkData>({
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