import { Job, Worker } from "bullmq";
import { redis } from "./redis";
import { aiModels, Model } from "@model/chat/ai-models";
import { generateErrorLog } from "src/helpers/generate-error-log";
import { llm } from "./llm";
import { pub } from "./pub";
import { db } from "@db/connect-db";
import { ChatMessage, chatMessageSchema } from "@db/schema/chat-message.schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { chatSchema } from "@db/schema/chat.schema";
import { renameChat } from "@model/chat/rename-chat.model";
import { chatSubscription } from "./sub";
import { getErrorMessage } from "src/helpers/get-error-message";
import { ResponseInput } from "openai/resources/responses/responses.mjs";
export let worker: null | Worker = null;

if (!worker)
	worker = new Worker(
		"ai-response-queue",
		async (job: Job<ChatJob>) => {
			const { chatId, model, prompt, userId } = job.data;

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
						userId,
					})
					.returning();

				await db.insert(chatMessageSchema).values({
					id: aiMessageId,
					chatId,
					type: "ai",
					content: buffer,
					userId,
				});

				const messages = (
					await db
						.select({
							content: chatMessageSchema.content,
							type: chatMessageSchema.type,
						})
						.from(chatMessageSchema)
						.where(eq(chatMessageSchema.chatId, chatId))
						.orderBy(desc(chatMessageSchema.createdAt))
						.limit(60)
				).map((message) => ({
					role: message.type === "ai" ? "assistant" : "user",
					content: message.content,
				}));
				console.log("Generating Response...");
				const stream = await llm(aiModels[model]).responses.create({
					instructions,
					input: [
						...messages,
						{ content: prompt, role: "user" },
					] as ResponseInput,
					model,
					stream: true,
				});
				console.log("Streaming Response...");

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
					} else if (
						event.type === "response.completed" ||
						event.type === "response.incomplete"
					) {
						// Update ai response status
						const [[aiMessage]] = await Promise.all([
							db
								.update(chatMessageSchema)
								.set({
									status: "completed",
									content: sql`${chatMessageSchema.content} || ${buffer}`,
								})
								.where(eq(chatMessageSchema.id, aiMessageId))
								.returning(),

							db
								.update(chatMessageSchema)
								.set({
									status: "completed",
								})
								.where(eq(chatMessageSchema.id, userMessage.id)),
						]);

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
				console.log("Done Streaming");
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
	userId: string;
	aiMessage?: ChatMessage;
	userMessage?: ChatMessage;
};

const instructions = `You are a conversational AI assistant designed to hold natural, coherent, and contextually relevant conversations with a user. The user may provide a history of the conversation. 

Your objectives:
- Maintain continuity and context from the conversation history.
- Reference prior user messages naturally when relevant.
- Avoid repeating yourself unless clarification is needed.
- Use concise, informative, and human-like responses.
- If a question has already been answered earlier in the conversation, refer to the prior response instead of repeating it verbatim.
- Do not hallucinate. If you don't have enough information from the history, ask a clarifying question.
- Be aware of the tone and emotional state of the user if detectable from history, and respond accordingly.
- When the context shifts, recognize the change and adapt your responses to the new topic without dragging in irrelevant history.

Each interaction is a sequence of user and assistant messages. Always assume the most recent user message is the one requiring your response, and previous messages are context.
`;
