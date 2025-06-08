import { db } from "@db/connect-db";
import { sessionSchema } from "@db/schema/auth/session.schema";
import { eq } from "drizzle-orm";
import session, { SessionData } from "express-session";
import { getErrorMessage } from "../../helpers/get-error-message";
import { generateErrorLog } from "src/helpers/generate-error-log";

export class MySessionStore extends session.Store {
	constructor() {
		super();
	}

	get(
		sid: string,
		callback: (err: any, session?: session.SessionData) => void,
	): void {
		// console.log("---Saved Session ID---\n", sid);
		db.select()
			.from(sessionSchema)
			.where(eq(sessionSchema.sessionId, sid))
			.then(([session]) => {
				if (session) callback(null, session.session as SessionData);
				else callback(null);
			})
			.catch((error) => {
				generateErrorLog("MySessionStore.get", error);
				if (callback) callback(new Error(getErrorMessage(error)));
			});
	}

	set(
		sid: string,
		session: session.SessionData,
		callback?: (err?: any) => void,
	): void {
		// console.log("---Set Session ID---\n", sid);
		// console.log("---Set Session---\n", session);

		db.insert(sessionSchema)
			.values({
				sessionId: sid,
				session: JSON.stringify(session),
			})
			.onConflictDoUpdate({
				target: [sessionSchema.sessionId],
				set: {
					session: (() => {
						session.cookie.maxAge = 86400000 * 3;
						return JSON.stringify(session);
					})(),
					userId: session.user?.id,
				},
			})
			.then(() => {
				if (callback) callback();
			})
			.catch((error) => {
				generateErrorLog("MySessionStore.set", error);
				if (callback) callback(new Error(getErrorMessage(error)));
			});
	}

	destroy(sid: string, callback?: (err?: any) => void): void {
		db.delete(sessionSchema)
			.where(eq(sessionSchema.sessionId, sid))
			.then(() => {
				if (callback) callback();
			})
			.catch((error) => {
				generateErrorLog("MySessionStore.destroy", error);

				if (callback) callback(new Error(getErrorMessage(error)));
			});
	}
}
