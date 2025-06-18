import { NextFunction, Request, Response } from "express";
import { userExists } from "@routes/auth/components/user-exists";
import { ZodSignInCredentials } from "@model/auth/sign-in.model";
import { sendMagicLink } from "../components/send-magic-link";
import { createId } from "@paralleldrive/cuid2";

export async function signInController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const {
			data: signInCredentials,
			success,
			error,
		} = ZodSignInCredentials.safeParse(req.body);

		if (success) {
			const status = await userExists(signInCredentials.email);
			if (status === "user-exists") {
				const token = createId();
				const status = await sendMagicLink(signInCredentials.email, token);
				if (status === "sent") {
					req.session.ctx = {
						...req.session.ctx,
						signIn: {
							token,
							expires: Date.now() + 1000 * 60 * 60 * 0.25,
							signInCredentials,
						},
					};
					res.status(200).json({ status: "magic-link-sent" });
					return;
				} else if (status === "not-sent") {
					res.status(200).json({ status: "magic-link-not-sent" });
					return;
				}
			} else {
				res.status(200).json({ status: "user-does-not-exist" });
				return;
			}
		} else if (error) res.status(200).json({ status: "magic-link-not-sent" });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "sign-in",
				route: "/auth/sign-in",
			}),
		);
	}
}
