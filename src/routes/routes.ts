import express from "express";
import auth from "./auth/auth.routes";
import api from "./api/api.routes";

const routes = express.Router();

routes.use("/api", api);
routes.use("/auth", auth);

export default routes;
