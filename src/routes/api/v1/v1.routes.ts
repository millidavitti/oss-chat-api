import express from "express";
import userRoutes from "./users/users.routes";

const v1 = express.Router();

v1.use("/users", userRoutes);

export default v1;
