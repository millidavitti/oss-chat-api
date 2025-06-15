import { NextFunction, Request, Response } from "express";
import { sub, chatSubscription } from "../components/sub";

export async function aiResponseController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		res.setHeader("Content-Type", "text/event-stream");

		await sub.subscribe(req.params.chatId, (error, count) => {
			if (error) {
				next(
					Object.assign(error as any, {
						controller: "ai-response",
						route: "/api/v1/chats/ai-response",
					}),
				);
			} else {
				console.log(
					`Subscribed successfully! This client (${req.params.chatId}) is currently subscribed to ${count} channels.`,
				);
			}
		});

		chatSubscription.set(req.params.chatId, [req, res]);

		res.on("close", async () => {
			console.log("closed " + req.params.chatId);
			await sub.unsubscribe(req.params.chatId);
			chatSubscription.delete(req.params.chatId);
			res.end();
		});

		res.on("error", async () => {
			chatSubscription.delete(req.params.chatId);
			await sub.unsubscribe(req.params.chatId);
		});
	} catch (error) {
		next(
			Object.assign(error as any, {
				controller: "ai-response",
				route: "/api/v1/chats/ai-response",
			}),
		);
	}
}
