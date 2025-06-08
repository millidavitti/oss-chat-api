declare module "cors" {
	import { IncomingHttpHeaders } from "http";

	type StaticOrigin =
		| boolean
		| string
		| RegExp
		| Array<boolean | string | RegExp>;

	type CustomOrigin = (
		requestOrigin: string | undefined,
		callback: (err: Error | null, origin?: StaticOrigin) => void,
	) => void;

	namespace cors {
		interface CorsRequest {
			method?: string | undefined;
			headers: IncomingHttpHeaders;
		}
		interface CorsOptions {
			origin?: StaticOrigin | CustomOrigin | undefined;
			methods?: string | string[] | undefined;
			allowedHeaders?: string | string[] | undefined;
			exposedHeaders?: string | string[] | undefined;
			credentials?: boolean | undefined;
			maxAge?: number | undefined;
			preflightContinue?: boolean | undefined;
			optionsSuccessStatus?: number | undefined;
		}
		type CorsOptionsDelegate<T extends CorsRequest = CorsRequest> = (
			req: T,
			callback: (err: Error | null, options?: CorsOptions) => void,
		) => void;
	}

	function cors<T extends cors.CorsRequest = cors.CorsRequest>(
		options?: cors.CorsOptions | cors.CorsOptionsDelegate<T>,
	): (
		req: T,
		res: {
			statusCode?: number | undefined;
			setHeader(key: string, value: string): any;
			end(): any;
		},
		next: (err?: any) => any,
	) => void;

	export = cors;
}
