import express from "express";
import { getCsrfTokenController } from "./csrf-token.controller";

const csrfTokenRoutes = express.Router();

// GET /csrf
csrfTokenRoutes.get("/", getCsrfTokenController);

export default csrfTokenRoutes;
