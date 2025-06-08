import { signInController } from "./controllers/sign-in.controller";
import express from "express";
import { verificationController } from "./controllers/verification.controller";

const signInRoutes = express.Router();

// GET /sign-in
signInRoutes.post("/", signInController);
signInRoutes.post("/:token", verificationController);

export default signInRoutes;
