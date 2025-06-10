import { Request, Response } from "express";
import { Redis } from "ioredis";
export const chatSubscription = new Map<string, [Request, Response]>();

export const sub = new Redis({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
	maxRetriesPerRequest: null,
});

sub.on("message", (_, message) => {
	const { chatId } = JSON.parse(message);
	const [, res] = chatSubscription.get(chatId)!;
	if (res.writableEnded) return;
	res.write(`data: ${message}\n\n`, (error) => {
		if (error) console.log(error);
	});
});
