import { pgTable, text, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "../../helpers/timestamp";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

export const userSchema = pgTable("users", {
	id: text().primaryKey().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text("email").unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	linkOauthAccounts: boolean("link_oauth_accounts").default(false).notNull(),
	picture: text("picture"),
	...timestamps,
});

export const ZodUser = z.object({
	id: z.string().cuid2().optional(),
	name: z.string(),
	email: z.string().email(),
	image: z.string().url().nullable().optional(),
});
export type User = z.infer<typeof ZodUser>;
