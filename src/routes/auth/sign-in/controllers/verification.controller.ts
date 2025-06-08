import { NextFunction, Request, Response } from "express";
import isTokenValid from "src/helpers/is-token-valid";
import { userSchema } from "@db/schema/user.schema";
import { eq } from "drizzle-orm";
import { db } from "@db/connect-db";

export async function verificationController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { expires, token, signInCredentials } = req.session.ctx!.signIn!;
		if (isTokenValid(token === req.params.token ? token : "", expires)) {
			const [user] = await db
				.select()
				.from(userSchema)
				.where(eq(userSchema.email, signInCredentials.email));
			req.session.user = user;
			req.session.ctx = {};
			res
				.status(200)
				.json({ status: "authenticated", data: { userId: user.id } });
		} else res.status(200).json({ status: "not-authenticated" });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "verification",
				route: "/auth/sign-in",
			}),
		);
	}
}
