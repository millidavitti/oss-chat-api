import { Router } from "express";
import { createChatController } from "./controllers/create-chat.controller";
const chatRoutes = Router();

chatRoutes.post("/create-chat", createChatController);

export default chatRoutes;
