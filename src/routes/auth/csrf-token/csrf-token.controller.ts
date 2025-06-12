import { NextFunction, Request, Response } from "express";
import { generateCsrfToken, hashedCsrfToken } from "@model/auth/csrf.model";

export function getCsrfTokenController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const rawToken = generateCsrfToken();
		const hashed = hashedCsrfToken(rawToken);

		req.session.ctx = {
			...(req.session.ctx || {}),
			csrf: { token: hashed }, // store hashed version
		};

		res.status(200).json({
			status: req.session.user ? "authenticated" : "not-authenticated",
			data: { token: rawToken }, // send raw version to client
		});
	} catch (error) {
		next({
			...(error instanceof Error ? error : { message: String(error) }),
			controller: "get-csrf-token",
			route: "/auth/csrf",
		});
	}
}
