import { z } from "zod";

export const ZodSignInCredentials = z.object({
	email: z.string().email(),
});
export type SignInCredentials = z.infer<typeof ZodSignInCredentials>;
