import { Job, Worker } from "bullmq";
import { redis } from "./redis";
import { aiModels, Models } from "@model/chat/ai-models";
import { generateErrorLog } from "src/helpers/generate-error-log";
import { llm } from "./llm";
import { pub } from "./pub";
import { db } from "@db/connect-db";
import { chatMessageSchema } from "@db/schema/chat-message.schema";
import { eq, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
export let worker: null | Worker = null;

if (!worker)
	worker = new Worker(
		"ai-response-queue",
		async (job: Job<ChatJob>) => {
			const { chatId, model, userMessage, guestId, userId } = job.data;

			// Save user message to db
			await db.insert(chatMessageSchema).values({
				chatId,
				type: "user",
				content: userMessage,
				guestId,
				userId,
				status: "completed",
			});

			try {
				const stream = await llm(aiModels[model]).responses.create({
					input: userMessage,
					model,
					stream: true,
				});
				const chatMessageId = createId();
				for await (const event of stream) {
					if (event.type === "response.output_text.delta") {
						// Save response stream to db
						const [chatMessage] = await db
							.insert(chatMessageSchema)
							.values({
								id: chatMessageId,
								chatId,
								type: "ai",
								content: "",
								guestId,
								userId,
							})
							.onConflictDoUpdate({
								target: chatMessageSchema.id,
								set: {
									content: sql`${chatMessageSchema.content} || ${event.delta}`,
								},
							})
							.returning();

						// Stream response to client optimistically
						await pub.publish(
							chatId,
							JSON.stringify({
								chunk: event.delta,
								chatId,
								chatMessage,
								status: "completed",
							}),
						);
					} else if (event.type === "response.completed") {
						// Update ai response status
						await db
							.update(chatMessageSchema)
							.set({
								status: "compeleted",
							})
							.where(eq(chatMessageSchema.id, chatMessageId));

						// Notify the client on the status
						await pub.publish(
							chatId,
							JSON.stringify({ status: "completed", chatId }),
						);
					} else if (event.type === "response.failed") {
						await db
							.update(chatMessageSchema)
							.set({
								status: "error",
							})
							.where(eq(chatMessageSchema.id, chatMessageId));

						await pub.publish(
							chatId,
							JSON.stringify({ status: "error", chatId }),
						);
					}
				}
			} catch (error) {
				generateErrorLog("send-chat-message", error);
			}
		},
		{
			connection: redis,
			concurrency: 500,
		},
	);

export type ChatJob = {
	userMessage: string;
	chatId: string;
	model: Models;
	guestId: string | null;
	userId: string | null;
};
