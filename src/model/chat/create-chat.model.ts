import { db } from "@db/connect-db";
import { chatSchema } from "@db/schema/chat.schema";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function createChat(userId: string, chatId: string) {
	try {
		await db
			.insert(chatSchema)
			.values({ id: chatId, guestId: userId })
			.returning();
	} catch (error) {
		generateErrorLog("create-chat", error);
	}
}
