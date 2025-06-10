import express from "express";
import cors from "cors";
import session from "express-session";
import { MySessionStore } from "@model/auth/session-store";
import { getEnvironmentValue } from "src/helpers/get-environment-value";
import routes from "@routes/routes";
import { handleControllerError } from "./middlewares/handle-controller-error";
import { worker } from "@routes/api/v1/chat/components/worker";

if (!worker?.isRunning()) worker?.run();
else console.log("Worker is running");

const app = express();
app.use(
	cors({
		origin: process.env.ORIGIN,
		credentials: true,
	}),
);
app.use(express.json());
app.use(
	session({
		secret: process.env.AUTH_SECRET!,
		resave: false,
		saveUninitialized: false,
		store: new MySessionStore(),
		cookie: {
			httpOnly: true,
			secure: getEnvironmentValue({ development: false, production: true }),
			maxAge: 1000 * 60 * 60,
			sameSite: "lax",
		},
	}),
);

app.use(routes);

app.use(handleControllerError);

export default app;
