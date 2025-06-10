import { db } from "@db/connect-db";
import { chatMessageSchema } from "@db/schema/chat-message.schema";
import { sendChatMessage } from "@model/chat/send-chat-message.model";
import { NextFunction, Request, Response } from "express";

export async function sendChatMessageController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const aiResponse = await sendChatMessage(req.body.userMessage);

		if (req.session.user) res.status(200).json({ status: "authenticated" });
		else {
			const chatHistory = await db
				.insert(chatMessageSchema)
				.values([
					{
						chatId: req.params.chatId,
						type: "user",
						guestId: req.session.ctx?.guest?.id,
						content: req.body.userMessage,
						status: "completed",
					},
					{
						chatId: req.params.chatId,
						type: "ai",
						guestId: req.session.ctx?.guest?.id,
						content: aiResponse,
						status: "completed",
					},
				])
				.returning();

			res
				.status(200)
				.json({ status: "not-authenticated", data: { chatHistory } });
		}
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "send-chat-message",
				route: "/api/v1/chats/send-chat-message",
			}),
		);
	}
}
