import { timestamp } from "drizzle-orm/pg-core";

// columns.helpers.ts
export const timestamps = {
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.$onUpdateFn(() => new Date())
		.notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
};
