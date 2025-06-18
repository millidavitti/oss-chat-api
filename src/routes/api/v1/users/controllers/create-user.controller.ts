import { createUser } from "@model/user/create-user.model";
import { NextFunction, Request, Response } from "express";

export async function createUserController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const user = await createUser(req.session.ctx!.guest!.id, req.body);
		res.status(200).json({ success: true, user });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "create-user",
				route: "/api/v1/users/create-user",
			}),
		);
	}
}
