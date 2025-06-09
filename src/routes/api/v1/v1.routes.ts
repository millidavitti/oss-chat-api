import express from "express";
import userRoutes from "./users/users.routes";
import chatRoutes from "./chat/chat.routes";

const v1 = express.Router();

v1.use("/users", userRoutes);
v1.use("/chats", chatRoutes);

export default v1;
