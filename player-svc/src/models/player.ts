import mongoose from "mongoose";

interface PlayerAttrs {
  username: string;
  email: string;
}

export interface PlayerDoc extends mongoose.Document {
  username: string;
  email: string;
  playerId: mongoose.Types.ObjectId;
}

interface PlayerModel extends mongoose.Model<PlayerDoc> {
  build(attrs: PlayerAttrs): PlayerDoc;
}

const playerSchema = new mongoose.Schema<PlayerDoc, PlayerModel>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.playerId = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
      },
    },
  },
);

playerSchema.statics.build = (attrs: PlayerAttrs) => {
  return new Player(attrs);
};

playerSchema.index({ username: 1 }, { unique: true });
playerSchema.index({ email: 1 }, { unique: true });

const Player = mongoose.model<PlayerDoc, PlayerModel>("Player", playerSchema);

export { Player };
