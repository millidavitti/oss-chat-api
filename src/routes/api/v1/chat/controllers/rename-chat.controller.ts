import { renameChat } from "@model/chat/rename-chat.model";
import { NextFunction, Request, Response } from "express";
export async function renameChatController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		console.log("Ln 9: ", req.body);
		const chats = await renameChat(req.params.chatId, req.body.title);

		res.status(200).json({ data: { chats } });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "rename-chat",
				route: "/api/v1/chats/rename-chat",
			}),
		);
	}
}
