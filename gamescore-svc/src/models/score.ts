import mongoose from "mongoose";

interface ScoreAttrs {
  playerId: string;
  score: number;
}

export interface ScoreDoc extends mongoose.Document {
  playerId: string;
  score: number;
  id: string;
}

interface ScoreModel extends mongoose.Model<ScoreDoc> {
  build(attrs: ScoreAttrs): ScoreDoc;
}

const scoreSchema = new mongoose.Schema(
  {
    playerId: { type: String, required: true },
    score: { type: Number, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret as any).id = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
      },
    },
  },
);

scoreSchema.statics.build = (attrs: ScoreAttrs) => {
  return new Score(attrs);
};

scoreSchema.index({ playerId: 1 });

const Score = mongoose.model<ScoreDoc, ScoreModel>("Score", scoreSchema);

export { Score };
