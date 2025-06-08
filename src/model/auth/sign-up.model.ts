import { z } from "zod";

export const ZodSignUpCredentials = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
});
export type SignUpCredentials = z.infer<typeof ZodSignUpCredentials>;
