import { ZodSignUpCredentials } from "@model/auth/sign-up.model";
import { createId } from "@paralleldrive/cuid2";
import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "src/helpers/get-error-message";
import { sendVerificationEmail } from "./components/send-verfication-email";
import { userExists } from "../components/user-exists";

export async function signUpController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const {
			data: signUpCredentials,
			success,
			error,
		} = ZodSignUpCredentials.safeParse(req.body);

		if (success) {
			if ((await userExists(signUpCredentials.email)) === "user-exists") {
				res.status(200).json({ status: "user-exists" });
				return;
			}

			const token = createId();
			const status = await sendVerificationEmail(
				signUpCredentials.email,
				token,
			);
			if (status === "sent")
				req.session.ctx = {
					signUp: {
						emailVerification: {
							token,
							expires: Date.now() + 1000 * 60 * 60 * 0.25,
						},
						signUpCredentials,
					},
				};
			else {
				res.status(200).json({ status: "email-verification-failed" });
				return;
			}
		} else if (error) throw new Error(getErrorMessage(error));
		res.status(200).json({ status: "email-verification-sent" });
	} catch (error) {
		req.sessionStore.destroy(req.sessionID);
		next(
			Object.assign(error as any, {
				controller: "sign-up",
				route: "/auth/sign-up",
			}),
		);
	}
}
