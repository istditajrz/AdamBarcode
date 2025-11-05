import { redirect } from "next/navigation";
import { type Response } from "./api.mts";

export function client_unwrap<T>(r: Response<T>): T {
	if (!r.result) {
		throw Error(r.error!.message);
	}
	return r.response!;
}

export function server_unwrap<T>(r: Response<T>): T {
	const enc = encodeURIComponent;
	if (!r.result) {
		redirect(
			"/error?" +
				[
					!!r.error?.code ? `code=${enc(r.error.code!)}` : "",
					!!r.error?.message
						? `message=${enc(r.error.message!)}`
						: "",
				].join("&"),
		);
	}
	return r.response!;
}

export function Ok<T>(response: T): Response<T> {
	return {
		result: true,
		response: response,
	};
}
