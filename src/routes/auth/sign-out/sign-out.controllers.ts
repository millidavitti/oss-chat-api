import { NextFunction, Request, Response } from "express";

export async function signOutController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		req.sessionStore.destroy(req.sessionID);
		res.status(200).json({ isAuthenticated: false });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "sign-out",
				route: "/auth/sign-out",
			}),
		);
	}
}
