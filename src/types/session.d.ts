// types/express-session.d.ts
import { SignInCredentials } from "@model/auth/sign-in.model";
import { SignUpCredentials } from "@model/auth/sign-up.model";
import { User } from "@model/user.model";
import { RunningJob } from "@routes/api/v1/study-sets/components/push-job-notification";
import { FileJob } from "@routes/api/v1/study-sets/components/queue-uploaded-files";
import "express-session";

declare module "express-session" {
	interface SessionData {
		user?: User;
		ctx: {
			signUp?: {
				emailVerification: {
					token: string;
					expires: number;
				};
				signUpCredentials: SignUpCredentials;
			};
			signIn?: {
				token: string;
				expires: number;
				signInCredentials: SignInCredentials;
			};
			csrf?: {
				token: string;
			};
			guest?: { id: string };
			jobNotifications?: RunningJob[];
		} & { [key: string]: any };
	}
}
