import { NextFunction, Request, Response } from "express";
import isTokenValid from "../../../helpers/is-token-valid";
import { createUser } from "@model/user/create-user.model";

export async function verifyEmailController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const {
			emailVerification: { token, expires },
			signUpCredentials,
		} = req.session.ctx?.signUp!;
		const { verificationToken } = req.params;

		if (isTokenValid(token === verificationToken ? token : "", expires)) {
			const user = await createUser(signUpCredentials);
			if (user) {
				req.session.user = user;
				req.session.ctx = {};
				res.status(200).json({
					status: "account-creation-successful",
					data: { userId: user.id },
				});
				return;
			} else {
				res.status(200).json({ status: "account-creation-failed" });
				return;
			}
		} else res.status(200).json({ status: "email-verification-failed" });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "verify-email",
				route: "/auth/verify-email",
			}),
		);
	}
}
