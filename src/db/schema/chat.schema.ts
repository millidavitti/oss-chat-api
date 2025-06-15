import { pgTable, text } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";
import { z } from "zod";
import { timestamps } from "src/helpers/timestamp";

export const chatSchema = pgTable("chats", {
	id: text().primaryKey().notNull(),
	userId: text("user_id")
		.references(() => userSchema.id, {
			onDelete: "cascade",
		})
		.notNull(),
	title: text().notNull().default("New Chat"),
	...timestamps,
});

export const ZodChat = z.object({
	id: z.string().cuid2(),
	userId: z.string().cuid2(),
	title: z.string(),
	createdAt: z.string().optional(),
	updateAt: z.string().optional(),
});

export type Chat = z.infer<typeof ZodChat>;
