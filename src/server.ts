import http from "http";
import dotenv from "dotenv";
import app from "./app";
import chalk from "chalk";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const listen = async () => {
	server.listen(PORT, () =>
		console.log(`
${chalk.green.bold("🌐 Express App")}
${chalk.blue.bold("Listening on port:")} ${chalk.bold(PORT)}
${chalk.blue.bold("Test")}: ${chalk.bold("http://localhost:5000/auth/ping")}`),
	);
};

listen();
