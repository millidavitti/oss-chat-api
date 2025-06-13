import { createChat } from "@model/chat/create-chat.model";
import { queue } from "../components/queue";
import { NextFunction, Request, Response } from "express";

export async function createChatController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		console.log(req.body);
		const userId = req.session.user?.id || req.session.ctx?.guest?.id;
		const chat = await createChat(userId, req.params.chatId);

		await queue.add("ai-response-queue", {
			prompt: req.body.prompt,
			chatId: req.params.chatId,
			model: req.body.model,
			guestId: req.session.ctx!.guest!.id || null,
			userId: req.session.user?.id || null,
		});

		if (req.session.user)
			res.status(200).json({ status: "authenticated", data: { chat } });
		else res.status(200).json({ status: "not-authenticated", data: { chat } });
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "create-chat",
				route: "/api/v1/chats/create-chat",
			}),
		);
	}
}
