import { deleteChat } from "@model/chat/delete-chat.model";
import { NextFunction, Request, Response } from "express";

export async function deleteChatController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		await deleteChat(req.params.chatId);
		res.status(200).json({ status: "done" });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "delete-chat",
				route: "/api/v1/chats/delete-chat",
			}),
		);
	}
}
