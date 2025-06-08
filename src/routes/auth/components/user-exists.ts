import { db } from "@db/connect-db";
import { userSchema } from "@db/schema/user.schema";
import { eq } from "drizzle-orm";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function userExists(email: string) {
	try {
		const [user] = await db
			.select()
			.from(userSchema)
			.where(eq(userSchema.email, email));
		return user ? "user-exists" : null;
	} catch (error) {
		generateErrorLog("user-exists", error);
	}
}
