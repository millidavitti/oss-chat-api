import { llm } from "@routes/api/v1/chat/components/llm";
import { generateErrorLog } from "src/helpers/generate-error-log";
import { aiModels, Models } from "./ai-models";

export async function sendChatMessage(
	userMessage: string,
	model: Models = "gpt-4.1-mini",
) {
	try {
		const stream = await llm(aiModels[model]).responses.create({
			input: userMessage,
			model,
			stream: true,
		});
		for await (const event of stream) {
			console.log(event);
		}
		// return res.output_text;
	} catch (error) {
		generateErrorLog("send-chat-message", error);
	}
}
