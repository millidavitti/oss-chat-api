import { db } from "@db/connect-db";
import { chatMessageSchema } from "@db/schema/chat-message.schema";
import { and, asc, eq } from "drizzle-orm";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function getChatMessages(chatId: string) {
	try {
		return await db
			.select()
			.from(chatMessageSchema)
			.where(
				and(
					eq(chatMessageSchema.chatId, chatId),
					eq(chatMessageSchema.status, "completed"),
				),
			)
			.orderBy(asc(chatMessageSchema.createdAt));
	} catch (error) {
		generateErrorLog("get-chat-messages", error);
	}
}
