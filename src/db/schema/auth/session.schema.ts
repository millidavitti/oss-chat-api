import { json, pgTable, text } from "drizzle-orm/pg-core";
import { userSchema } from "../user.schema";

export const sessionSchema = pgTable("sessions", {
	sessionId: text("session_id").primaryKey(),
	userId: text("user_id").references(() => userSchema.id, {
		onDelete: "cascade",
	}),
	session: json("session").notNull(),
});
