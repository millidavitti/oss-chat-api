import { sql } from "drizzle-orm";
import { check } from "drizzle-orm/mysql-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { chatSchema } from "./chat.schema";
import { userSchema } from "./user.schema";
import { timestamps } from "src/helpers/timestamp";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

export const chatMessageSchema = pgTable(
	"chat_messages",
	{
		id: text()
			.primaryKey()
			.$default(() => createId()),
		chatId: text("chat_id")
			.references(() => chatSchema.id, { onDelete: "cascade" })
			.notNull(),
		userId: text("user_id")
			.references(() => userSchema.id, {
				onDelete: "cascade",
			})
			.notNull(),
		type: text().notNull(),
		content: text().notNull().default(""),
		status: text().notNull().default("pending"),
		...timestamps,
	},
	(table) => [
		check("chat_message_type", sql`${table.type} in ('user', 'ai')`),
		check(
			"chat_message_status",
			sql`${table.status} in ('pending', 'completed', 'error')`,
		),
	],
);

export const ZodChatMessage = z.object({
	id: z.string(),
	chatId: z.string(),
	userId: z.string(),
	type: z.enum(["user", "ai"]),
	content: z.string(),
	status: z.enum(["pending", "completed", "error"]),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type ChatMessage = z.infer<typeof ZodChatMessage>;
