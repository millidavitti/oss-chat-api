import { db } from "@db/connect-db";
import { chatMessageSchema } from "@db/schema/chat-message.schema";
import { eq } from "drizzle-orm";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function getChatMessages(chatId: string) {
	try {
		return await db
			.select()
			.from(chatMessageSchema)
			.where(eq(chatMessageSchema.chatId, chatId));
	} catch (error) {
		generateErrorLog("get-chat-messages", error);
	}
}
