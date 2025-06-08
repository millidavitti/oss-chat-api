import express from "express";
import { createUserController } from "./controllers/create-user.controller";
import { updateUserController } from "./controllers/update-user.controller";

const userRoutes = express.Router();

userRoutes.post("/create-user", createUserController);
userRoutes.post("/update-user/:userId", updateUserController);

export default userRoutes;
