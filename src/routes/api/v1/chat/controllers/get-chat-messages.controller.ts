import { getChatMessages } from "@model/chat/get-chat-messages.model";
import { NextFunction, Request, Response } from "express";

export async function getChatMessagesController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const chatMessages = await getChatMessages(req.params.chatId);

		res.status(200).json({ data: { chatMessages } });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "get-chat-messages",
				route: "/api/v1/chats/get-chat-messages",
			}),
		);
	}
}
