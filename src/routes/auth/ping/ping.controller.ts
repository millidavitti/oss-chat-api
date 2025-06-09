import { NextFunction, Request, Response } from "express";

export async function pingController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		if (req.session.user)
			res.status(200).json({
				user: req.session.user,
				jobNotifications: req.session.ctx?.jobNotifications || [],
				isAuthenticated: true,
			});
		else
			res.status(200).json({
				guest: req.session.ctx?.guest,
				jobNotifications: req.session.ctx?.jobNotifications || [],
				isAuthenticated: false,
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
