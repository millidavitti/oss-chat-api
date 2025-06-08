import { db } from "@db/connect-db";
import { profileSchema } from "@db/schema/profile.schema";
import { eq } from "drizzle-orm";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function hasProfile(sub: string) {
	try {
		const [profile] = await db
			.select()
			.from(profileSchema)
			.where(eq(profileSchema.sub, sub));

		return profile ? "has-profile" : null;
	} catch (error) {
		generateErrorLog("has-profile", error);
	}
}
