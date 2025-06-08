import express from "express";
import { signOutController } from "./sign-out.controllers";

const signOutRoutes = express.Router();

// GET /sign-out
signOutRoutes.get("/", signOutController);

export default signOutRoutes;
