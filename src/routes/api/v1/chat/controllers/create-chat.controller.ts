import { createChat } from "@model/chat/create-chat.model";
import { NextFunction, Request, Response } from "express";

export async function createChatController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		console.log(req.session.ctx?.guest, req.body);

		const chat = await createChat(req.session.ctx!.guest!.id, req.body.chatId);
		res.status(200).json({ status: "authenticated", chat });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "create-chat",
				route: "/api/v1/chats/create-chat",
			}),
		);
	}
}
