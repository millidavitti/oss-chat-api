import { db } from "@db/connect-db";
import { chatSchema } from "@db/schema/chat.schema";
import { eq } from "drizzle-orm";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function renameChat(chatId: string, title: string) {
	try {
		return (
			await db
				.update(chatSchema)
				.set({ title })
				.where(eq(chatSchema.id, chatId))
				.returning()
		)[0];
	} catch (error) {
		generateErrorLog("rename-chat", error);
	}
}
