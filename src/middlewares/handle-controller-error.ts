import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

export function handleControllerError(
	err: any,
	req: Request,
	res: Response,
	_: NextFunction,
) {
	console.error(
		`🚨 ${chalk.red.bold("[Error][Controller]")}: ${chalk.blue.bold(
			err.controller,
		)} - ${chalk.green.bold(req.method)} ${chalk.yellow.bold(
			err.route,
		)} | ${chalk.cyan.bold("Message")}: ${chalk.bold(err.message)}`,
	);
	console.error(err.stack);

	res.status(err.status || 500).json({
		error: err.message || "Internal Server Error",
	});
}
