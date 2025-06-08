import { updateUser } from "@model/user/update-user.model";
import { NextFunction, Request, Response } from "express";

export async function updateUserController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const update = await updateUser(req.params.userId, req.body);
		req.session.user = update;

		res.status(200).json({ data: { user: update } });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "update-user",
				route: "/api/v1/users/update-user",
			}),
		);
	}
}
