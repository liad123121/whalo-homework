import Bottleneck from "bottleneck";
import { Log, LogAttrs, LogLevel } from "../../models/logs";
import { logs_consumer } from "../connection";
import { logger } from "@liad123121/whalo-common";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 500,
  reservoir: 10,
  reservoirRefreshAmount: 10,
  reservoirRefreshInterval: 5000,
});

const consume_logs_events = async () => {
  await logs_consumer.run({
    autoCommit: false,
    eachBatch: async ({ batch, commitOffsetsIfNecessary, resolveOffset }) => {
      const logs: LogAttrs[] = batch.messages.map((msg) => {
        resolveOffset(msg.offset);
        return JSON.parse(msg.value!.toString());
      });

      try {
        const info = logs.filter((log) => log.level === LogLevel.INFO);
        const critical = logs.filter((log) => log.level === LogLevel.CRITICAL);

        if (critical.length > 0) {
          await limiter.schedule({ priority: LogLevel.CRITICAL }, () =>
            Log.insertMany(critical),
          );
        }

        if (info.length > 0) {
          await limiter.schedule({ priority: LogLevel.INFO }, () =>
            Log.insertMany(info),
          );
        }
        await commitOffsetsIfNecessary();

        logger.info(
          `Processed batch of ${logs.length} logs (INFO: ${info.length}, CRITICAL: ${critical.length}) and committed offsets.`,
        );
      } catch (error) {
        logger.error("Failed to write logs to MongoDB:", error);
      }
    },
  });
};

export { consume_logs_events };
