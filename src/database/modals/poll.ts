import { Schema, SchemaTypes, model } from "mongoose";

export interface PollData {
 msg: string,
 upVotes: 0,
 downVotes: 0,
 upMembers: [],
 downMembers: [],
 guildId: string,
 ownerId: string
 
}

export const Poll = model("Poll", new Schema<PollData>({
   msg: SchemaTypes.String,
   upVotes: SchemaTypes.Number,
   downVotes: SchemaTypes.Number,
   upMembers: SchemaTypes.Array,
   downMembers: SchemaTypes.Array,
   guildId: SchemaTypes.String,
   ownerId: SchemaTypes.String
  })
);