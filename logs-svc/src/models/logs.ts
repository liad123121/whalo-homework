import mongoose from "mongoose";

export enum LogLevel {
  CRITICAL = 0,
  INFO = 1,
}

export interface LogAttrs {
  playerId: string;
  logData: string;
  level: LogLevel;
}

interface LogDoc extends mongoose.Document {
  playerId: string;
  logData: string;
  level: LogLevel;
  id: string;
}

interface LogModel extends mongoose.Model<LogDoc> {
  build(attrs: LogAttrs): LogDoc;
}

const logSchema = new mongoose.Schema(
  {
    playerId: { type: String, required: true },
    logData: { type: String, required: true },
    level: { type: Number, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret as any).id = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
      },
    },
    timestamps: true,
  },
);

logSchema.statics.build = (attrs: LogAttrs) => {
  return new Log(attrs);
};

const Log = mongoose.model<LogDoc, LogModel>("Log", logSchema);

export { Log };
