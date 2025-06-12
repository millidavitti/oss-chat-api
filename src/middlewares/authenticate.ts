import { db } from "@db/connect-db";
import { guestSchema } from "@db/schema/guest.schema";
import { createId } from "@paralleldrive/cuid2";
import { NextFunction, Request, Response } from "express";

export async function authenticate(
	req: Request,
	_: Response,
	next: NextFunction,
) {
	if (req.session.user) next();
	else if (req.session.ctx?.guest) next();
	else {
		const guestId = createId();
		req.session.ctx = {
			guest: { id: guestId },
		};
		try {
			await db.insert(guestSchema).values({ id: guestId });
			next();
		} catch (error) {
			next(error);
		}
	}
}
