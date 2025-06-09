import { createId } from "@paralleldrive/cuid2";
import { NextFunction, Request, Response } from "express";

export function authenticate(req: Request, _: Response, next: NextFunction) {
	if (req.session.user) next();
	else if (req.session.ctx?.guest) next();
	else {
		const guestId = createId();
		req.session.ctx = {
			guest: { id: guestId },
		};
		next();
	}
}
