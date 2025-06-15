import { db } from "@db/connect-db";
import { userSchema } from "@db/schema/user.schema";
import {
	SignUpCredentials,
	ZodSignUpCredentials,
} from "@model/auth/sign-up.model";
import { eq, getTableColumns } from "drizzle-orm";
import { generateErrorLog } from "src/helpers/generate-error-log";
import { getErrorMessage } from "src/helpers/get-error-message";

export async function createUser(
	userId: string,
	signUpCredentials: SignUpCredentials,
) {
	try {
		const { success, error } =
			ZodSignUpCredentials.safeParse(signUpCredentials);
		if (success) {
			const { createdAt, updatedAt, ...rest } = getTableColumns(userSchema);
			const [result] = await db
				.update(userSchema)
				.set({ ...signUpCredentials, emailVerified: true })
				.where(eq(userSchema.id, userId))
				.returning({ ...rest });
			return result;
		} else throw new Error(getErrorMessage(error));
	} catch (error) {
		generateErrorLog("create-user", error);
	}
}
