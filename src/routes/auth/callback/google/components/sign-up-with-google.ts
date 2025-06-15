import { db } from "@db/connect-db";
import { profileSchema } from "@db/schema/profile.schema";
import { userSchema } from "@db/schema/user.schema";
import { GoogleProfile } from "../google.controller";
import { eq } from "drizzle-orm";

export async function signUpWithGoogle(userId: string, profile: GoogleProfile) {
	const [user] = await db
		.update(userSchema)
		.set({
			email: profile.email,
			emailVerified: profile.email_verified,
			firstName: profile.given_name,
			lastName: profile.family_name,
			picture: profile.picture,
			id: userId,
		})
		.where(eq(userSchema.id, userId))
		.returning();

	await db.insert(profileSchema).values({
		userId: user.id,
		platform: "google",
		sub: profile.sub,
		name: profile.name,
		familyName: profile.family_name,
		givenName: profile.given_name,
		picture: profile.picture,
	});
	return user;
}
