import { Router } from "express";
import { createChatController } from "./controllers/create-chat.controller";
import { sendChatMessageController } from "./controllers/send-chat-message.controller";
import { aiResponseController } from "./controllers/ai-response.controller";
import { getChatMessagesController } from "./controllers/get-chat-messages.controller";
const chatRoutes = Router();

chatRoutes.post("/create-chat/:chatId", createChatController);
chatRoutes.post("/send-chat-message/:chatId", sendChatMessageController);
chatRoutes.get("/ai-response/:chatId", aiResponseController);
chatRoutes.get("/get-chat-messages/:chatId", getChatMessagesController);

export default chatRoutes;
