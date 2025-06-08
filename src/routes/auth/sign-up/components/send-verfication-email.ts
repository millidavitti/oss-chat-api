import { transporter } from "@db/email/mailer";
import { emailVerificationTemplate } from "@db/email/templates/email-verification";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function sendVerificationEmail(email: string, token: string) {
	try {
		// console.log(
		// 	"---Verification Email---\n",
		// 	`${process.env.ORIGIN}/auth/sign-up/verify-email?token=${token}`,
		// );
		// return "sent";
		const response = await transporter.sendMail({
			from: process.env.EMAIL_FROM,
			to: email,
			subject: "Verify your email address",
			html: emailVerificationTemplate(
				`${process.env.ORIGIN}/auth/sign-up/verify-email?token=${token}`,
			),
		});

		return response.accepted.length > 0 &&
			response.rejected.length === 0 &&
			response.response.startsWith("250")
			? "sent"
			: "not-sent";
	} catch (error) {
		generateErrorLog("send-verification-email", error);
	}
}
