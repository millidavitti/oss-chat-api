import express from "express";
import { pingController } from "./ping.controller";

const pingRoutes = express.Router();

// /ping
pingRoutes.get("/", pingController);

export default pingRoutes;
