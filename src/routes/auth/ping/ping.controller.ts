import { NextFunction, Request, Response } from "express";

export async function pingController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		res.status(200).json({
			user: req.session.user,
			jobNotifications: req.session.ctx?.jobNotifications || [],
			isAuthenticated: true,
		});
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "ping",
				route: "/auth/ping",
			}),
		);
	}
}
