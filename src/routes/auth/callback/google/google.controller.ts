import { db } from "@db/connect-db";
import { userSchema } from "@db/schema/user.schema";
import { Request, Response } from "express";
import { createDecoder } from "fast-jwt";
import { hasProfile } from "../../components/has-profile";
import { signUpWithGoogle } from "./components/sign-up-with-google";
import { eq } from "drizzle-orm";
import { generateErrorLog } from "src/helpers/generate-error-log";

export async function googleController(req: Request, res: Response) {
	try {
		const oauthResponse = req.query as OuthResponse;
		const docResponse = await fetch(
			"https://accounts.google.com/.well-known/openid-configuration",
		);
		const doc = await docResponse.json();

		const tokenResponse = await fetch(doc.token_endpoint, {
			method: "post",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: encodeURI(
				`code=${oauthResponse.code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}&grant_type=authorization_code`,
			),
		});
		const decode = createDecoder();
		const profile = decode(
			(await tokenResponse.json()).id_token,
		) as GoogleProfile;

		const [user] = await db
			.select()
			.from(userSchema)
			.where(eq(userSchema.email, profile.email));

		if (await hasProfile(profile.sub)) {
			if (user) {
				req.session.user = user;
				res.redirect(
					302,
					`${process.env.ORIGIN!}/auth/oauth?status=authenticated`,
				);
			} else
				res.redirect(
					302,
					`${process.env.ORIGIN!}/auth/sign-in?status=not-authenticated`,
				);
		} else if (user) {
			if (user.linkOauthAccounts) {
				req.session.user = user;
				res.redirect(
					302,
					`${process.env.ORIGIN!}/auth/sign-in?status=authenticated`,
				);
			} else
				res.redirect(
					302,
					`${process.env.ORIGIN!}/auth/sign-in?status=not-linked`,
				);
		} else {
			const user = await signUpWithGoogle(req.session.ctx?.guest?.id!, profile);
			req.session.user = user;
			res.redirect(
				302,
				`${process.env.ORIGIN!}/auth/oauth?status=authenticated`,
			);
		}
	} catch (error) {
		generateErrorLog("google-controller", error, "slient");

		res.redirect(
			302,
			`${process.env.ORIGIN!}/auth/sign-in?status=not-authenticated`,
		);
	}
}

type OuthResponse = {
	state: string;
	code: string;
	scope: string;
	authuser: string;
	prompt: string;
};

export type GoogleProfile = {
	iss: string;
	azp: string;
	aud: string;
	sub: string;
	email: string;
	email_verified: boolean;
	at_hash: string;
	nonce: string;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
	iat: number;
	exp: number;
};
