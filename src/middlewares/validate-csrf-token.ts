import { hashedCsrfToken } from "@model/auth/csrf.model";
import { NextFunction, Request, Response } from "express";
import { timingSafeEqual } from "crypto";

export function validateCsrfToken(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (req.method === "GET") next();
	else {
		const token = req.session.ctx?.csrf?.token;
		const received = (req.query.state || req.headers["x-csrf-token"]) as
			| string
			| undefined;

		if (!token || !received) {
			res.status(403).json({ error: "csrf-token-missing" });
			return;
		}

		try {
			const tokenHash = Buffer.from(hashedCsrfToken(token), "utf-8");
			const receivedHash = Buffer.from(received, "utf-8");

			if (tokenHash.length !== receivedHash.length) {
				res.status(403).json({ error: "csrf-token-mismatch" });
				return;
			}

			if (!timingSafeEqual(tokenHash, receivedHash)) {
				res.status(403).json({ error: "csrf-token-mismatch" });
				return;
			}
		} catch (error) {
			res.status(403).json({ error: "csrf-token-mismatch" });
			return;
		}

		delete req.session.ctx?.csrf;
		next();
	}
}
