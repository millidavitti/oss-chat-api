import { createId } from "@paralleldrive/cuid2";
import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "src/helpers/timestamp";
import { userSchema } from "./user.schema";

export const profileSchema = pgTable("profiles", {
	id: text()
		.primaryKey()
		.notNull()
		.$defaultFn(() => createId()),
	userId: text()
		.notNull()
		.references(() => userSchema.id, { onDelete: "cascade" }),
	platform: text("platform").notNull(),
	sub: text().unique().notNull(),
	name: text("name"),
	picture: text("picture"),
	givenName: text("given_name"),
	familyName: text("family_name"),
	...timestamps,
});
