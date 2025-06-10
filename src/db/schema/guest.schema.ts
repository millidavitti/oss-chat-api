import { createId } from "@paralleldrive/cuid2";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const guestSchema = pgTable("guests", {
	id: text()
		.primaryKey()
		.$default(() => createId()),
});
