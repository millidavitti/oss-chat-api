import { getChats } from "@model/chat/get-chats.model";
import { NextFunction, Request, Response } from "express";
export async function getChatsController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const chats = await getChats(req.params.userId);

		res.status(200).json({ data: { chats } });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "get-chats",
				route: "/api/v1/chats/get-chats",
			}),
		);
	}
}
