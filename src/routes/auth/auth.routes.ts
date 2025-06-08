import express from "express";
import signUpRoutes from "./sign-up/sign-up.routes";
import verifyEmailRoutes from "./verify-email/verify-email.routes";
import signInRoutes from "./sign-in/sign-in.routes";
import signOutRoutes from "./sign-out/sign-out.routes";
import csrfTokenRoutes from "./csrf-token/csrf-token.routes";
import pingRoutes from "./ping/ping.routes";
import { authenticate } from "src/middlewares/authenticate";
import { googleController } from "./callback/google/google.controller";
import { validateCsrfToken } from "src/middlewares/validate-csrf-token";

const auth = express.Router();
auth.use("/sign-up", signUpRoutes);
auth.use("/verify-email", verifyEmailRoutes);
auth.use("/sign-in", signInRoutes);
auth.use("/sign-out", signOutRoutes);
auth.use("/csrf-token", csrfTokenRoutes);
auth.use("/ping", authenticate, pingRoutes);

const callback = express.Router();
auth.use("/callback", validateCsrfToken, callback);

callback.use("/google", googleController);
export default auth;
