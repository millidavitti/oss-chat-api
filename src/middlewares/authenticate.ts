import { NextFunction, Request, Response } from "express";

export function authenticate(req: Request, res: Response, next: NextFunction) {
	if (req.session.user) next();
	else res.status(401).json({ isAuthenticated: false });
}
