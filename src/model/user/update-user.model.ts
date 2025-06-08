import { db } from "@db/connect-db";
import { User, userSchema, ZodUser } from "@db/schema/user.schema";
import { eq } from "drizzle-orm";
import { generateErrorLog } from "src/helpers/generate-error-log";
import { getErrorMessage } from "src/helpers/get-error-message";

export async function updateUser(userId: string, update: Partial<User>) {
	try {
		const { data, success, error } = ZodUser.partial().safeParse(update);
		if (success) {
			const [result] = await db
				.update(userSchema)
				.set(data)
				.where(eq(userSchema.id, userId))
				.returning();
			return result;
		} else throw new Error(getErrorMessage(error));
	} catch (error) {
		generateErrorLog("update-user", error);
	}
}
