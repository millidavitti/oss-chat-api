import { transporter } from "@db/email/mailer";
import { magicLinkEmailTemplate } from "@db/email/templates/magic-link.template";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function sendMagicLink(email: string, token: string) {
	try {
		// console.log(
		// 	"---Magic Link---\n",
		// 	`${process.env.ORIGIN}/auth/sign-in/verification?token=${token}`,
		// );
		// return "sent";
		const response = await transporter.sendMail({
			from: process.env.EMAIL_FROM,
			to: email,
			subject: "Sign In Magic Link",
			html: magicLinkEmailTemplate(
				`${process.env.ORIGIN}/auth/sign-in/verification?token=${token}`,
			),
		});

		return response.accepted.length > 0 &&
			response.rejected.length === 0 &&
			response.response.startsWith("250")
			? "sent"
			: "not-sent";
	} catch (error) {
		generateErrorLog("send-magic-link", error);
	}
}
