import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";
import { z } from "zod";
import { guestSchema } from "./guest.schema";

export const chatSchema = pgTable("chats", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").references(() => userSchema.id, {
		onDelete: "cascade",
	}),
	guestId: text("guest_id").references(() => guestSchema.id, {
		onDelete: "cascade",
	}),
	title: text().notNull().default("New Chat"),
	...timestamp,
});

export const ZodChat = z.object({
	id: z.string().cuid2(),
	userId: z.string().cuid2().nullable(),
	guestId: z.string().cuid2().nullable(),
	title: z.string(),
	createdAt: z.string().optional(),
	updateAt: z.string().optional(),
});

export type Chat = z.infer<typeof ZodChat>;
