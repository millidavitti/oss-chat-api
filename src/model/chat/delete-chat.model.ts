import { db } from "@db/connect-db";
import { chatSchema } from "@db/schema/chat.schema";
import { eq } from "drizzle-orm";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function deleteChat(chatId: string) {
	try {
		await db.delete(chatSchema).where(eq(chatSchema.id, chatId));
	} catch (error) {
		generateErrorLog("delete-chat", error);
	}
}
