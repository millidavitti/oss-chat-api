import { BackoffOptions, Queue } from "bullmq";
import { redis } from "./redis";

export const queue = new Queue("ai-response-queue", {
	connection: redis,
	defaultJobOptions: {
		removeOnComplete: 500,
		removeOnFail: 2000,
		backoff: { type: "exponential", delay: 5_00 } as BackoffOptions,
	},
});
