import { NextFunction, Request, Response } from "express";
import { queue } from "../components/queue";

export async function sendChatMessageController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		console.log(req.body);
		await queue.add("ai-response-queue", {
			prompt: req.body.prompt,
			chatId: req.params.chatId,
			model: req.body.model,
			userId: req.session.user?.id || req.session.ctx!.guest!.id,
		});

		res.status(200);
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "send-chat-message",
				route: "/api/v1/chats/send-chat-message",
			}),
		);
	}
}
