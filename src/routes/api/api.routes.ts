import express from "express";
import { authenticate } from "src/middlewares/authenticate";
import { validateCsrfToken } from "src/middlewares/validate-csrf-token";
import v1 from "./v1/v1.routes";

const api = express.Router();

api.use(authenticate, validateCsrfToken);
api.use("/v1", v1);

export default api;
