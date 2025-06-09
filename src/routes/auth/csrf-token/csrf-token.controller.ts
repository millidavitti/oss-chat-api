import { NextFunction, Request, Response } from "express";
import { generateCsrfToken, hashedCsrfToken } from "@model/auth/csrf.model";

export async function getCsrfTokenController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const token = generateCsrfToken();
		if (req.session.user) {
			req.session.ctx = {
				...req.session.ctx,
				csrf: {
					token,
				},
			};
			res.status(200).json({
				status: "authenticated",
				data: { token: hashedCsrfToken(token) },
			});
		} else {
			req.session.ctx = {
				csrf: {
					token,
				},
				...req.session.ctx,
			};
			res.status(200).json({
				status: "not-authenticated",
				data: { token: hashedCsrfToken(token) },
			});
		}
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "get-csrf-token",
				route: "/auth/csrf",
			}),
		);
	}
}
