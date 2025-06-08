import { Response } from "express";
import { getErrorMessage } from "./get-error-message";

export function handleSessionError(logLabel: string, res: Response) {
	return (error: unknown) => {
		if (error) {
			console.error(`---${logLabel}---\n`, error);
			res.status(500).json({ error: getErrorMessage(error) });
		}
	};
}
