import { z } from "zod";

export default function isTokenValid(token: string, expires: number) {
	const { success, error } = z.string().cuid2().safeParse(token);

	if (success) {
		if (Date.now() < expires) return true;
		else return false;
	} else if (error) throw new Error("invalid-verification-token");
}
