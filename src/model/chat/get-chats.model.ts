import { db } from "@db/connect-db";
import { chatSchema } from "@db/schema/chat.schema";
import { eq, desc } from "drizzle-orm";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function getChats(userId: string) {
	try {
		return await db
			.select()
			.from(chatSchema)
			.where(eq(chatSchema.userId, userId))
			.orderBy(desc(chatSchema.updatedAt), desc(chatSchema.createdAt));
	} catch (error) {
		generateErrorLog("get-chats", error);
	}
}
