import { hashedCsrfToken } from "@model/auth/csrf.model";
import { NextFunction, Request, Response } from "express";
import { timingSafeEqual } from "crypto";

export function validateCsrfToken(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (req.method === "GET") return next();

	const storedHash = req.session.ctx?.csrf?.token;
	const receivedRawToken = (req.headers["x-csrf-token"] || req.query.state) as
		| string
		| undefined;

	if (!storedHash || !receivedRawToken) {
		return res.status(403).json({ error: "csrf-token-missing" });
	}

	try {
		const hashedReceived = hashedCsrfToken(receivedRawToken);

		const storedBuf = Buffer.from(storedHash, "utf-8");
		const receivedBuf = Buffer.from(hashedReceived, "utf-8");

		if (
			storedBuf.length !== receivedBuf.length ||
			!timingSafeEqual(storedBuf, receivedBuf)
		) {
			return res.status(403).json({ error: "csrf-token-mismatch" });
		}

		res.on("finish", () => {
			if (req.session?.ctx?.csrf) delete req.session.ctx.csrf;
		});

		next();
	} catch (err) {
		return res.status(403).json({ error: "csrf-token-mismatch" });
	}
}
