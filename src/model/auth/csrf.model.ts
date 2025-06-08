import crypto from "crypto";

export function hashedCsrfToken(token: string) {
	return crypto
		.createHmac("sha256", process.env.AUTH_SECRET!)
		.update(token)
		.digest("hex");
}

export function generateCsrfToken() {
	return `${crypto.randomBytes(64).toString("hex")}-${Date.now().toString()}`;
}
