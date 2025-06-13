import { Job, Worker } from "bullmq";
import { redis } from "./redis";
import { aiModels, Model } from "@model/chat/ai-models";
import { generateErrorLog } from "src/helpers/generate-error-log";
import { llm } from "./llm";
import { pub } from "./pub";
import { db } from "@db/connect-db";
import { ChatMessage, chatMessageSchema } from "@db/schema/chat-message.schema";
import { and, eq, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { chatSchema } from "@db/schema/chat.schema";
import { renameChat } from "@model/chat/rename-chat.model";
import { chatSubscription } from "./sub";
import { getErrorMessage } from "src/helpers/get-error-message";
export let worker: null | Worker = null;

if (!worker)
	worker = new Worker(
		"ai-response-queue",
		async (job: Job<ChatJob>) => {
			const { chatId, model, prompt, guestId, userId } = job.data;

			try {
				let buffer = "";
				const aiMessageId = createId();
				// Save user message to db
				const [userMessage] = await db
					.insert(chatMessageSchema)
					.values({
						chatId,
						type: "user",
						content: prompt,
						guestId,
						userId,
					})
					.returning();

				await db.insert(chatMessageSchema).values({
					id: aiMessageId,
					chatId,
					type: "ai",
					content: buffer,
					guestId,
					userId,
				});

				const stream = await llm(aiModels[model]).responses.create({
					input: prompt,
					model,
					stream: true,
				});

				for await (const event of stream) {
					if (event.type === "response.output_text.delta") {
						buffer += event.delta;

						if (buffer.length < 200) continue;

						const [aiMessage] = await db
							.update(chatMessageSchema)
							.set({
								content: sql`${chatMessageSchema.content} || ${buffer}`,
							})
							.where(eq(chatMessageSchema.id, aiMessageId))
							.returning();

						// Stream ai response to client optimistically
						await pub.publish(
							chatId,
							JSON.stringify({ aiMessage, userMessage, chatId }),
						);
						buffer = "";
					} else if (event.type === "response.completed") {
						// Update ai response status
						const [aiMessage] = await db
							.update(chatMessageSchema)
							.set({
								status: "completed",
								content: sql`${chatMessageSchema.content} || ${buffer}`,
							})
							.where(eq(chatMessageSchema.id, aiMessageId))
							.returning();

						await db
							.update(chatMessageSchema)
							.set({
								status: "completed",
							})
							.where(eq(chatMessageSchema.id, userMessage.id))
							.returning();

						// Notify the client on the status
						await pub.publish(
							chatId,
							JSON.stringify({ aiMessage, userMessage, chatId }),
						);
						await job.updateData({
							...job.data,
							aiMessage: aiMessage as ChatMessage,
							userMessage: userMessage as ChatMessage,
						});
					} else if (event.type === "response.failed") {
						const [aiMessage] = await db
							.update(chatMessageSchema)
							.set({
								status: "error",
							})
							.where(eq(chatMessageSchema.id, aiMessageId))
							.returning();
						await pub.publish(
							chatId,
							JSON.stringify({ aiMessage, userMessage, chatId }),
						);
					}
				}
			} catch (error) {
				const [, res] = chatSubscription.get(chatId)!;
				res.status(400).json({ error: getErrorMessage(error) });
				generateErrorLog("ai-response-queue-worker", error);
			}
		},
		{
			connection: redis,
			concurrency: 500,
		},
	);

worker.on("completed", async (job: Job<ChatJob>) => {
	const { chatId, model, prompt, aiMessage, userMessage } = job.data;
	const [chat] = await db
		.select({ title: chatSchema })
		.from(chatSchema)
		.where(and(eq(chatSchema.title, "New Chat"), eq(chatSchema.id, chatId)));

	if (!chat) return;
	const { output_text: title } = await llm(aiModels[model]).responses.create({
		instructions:
			"You are a chat title generator. You are going to be tasked with the generation of short and concise titles based off of the user's prompt",
		input: `Generate a concise chat title based on the user prompt. Keep it concise and simple.
  User Prompt:${prompt}`,
		model,
	});
	const renamedChat = await renameChat(chatId, title);

	await pub.publish(
		chatId,
		JSON.stringify({ chat: renamedChat, chatId, aiMessage, userMessage }),
	);
});

export type ChatJob = {
	prompt: string;
	chatId: string;
	model: Model;
	guestId: string | null;
	userId: string | null;
	aiMessage?: ChatMessage;
	userMessage?: ChatMessage;
};
