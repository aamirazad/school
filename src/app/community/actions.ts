"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "community_auth_params";

export async function saveAuthParams(queryString: string) {
	const cookieStore = await cookies();
	cookieStore.set(COOKIE_NAME, queryString, {
		path: "/",
		maxAge: 600,
		sameSite: "lax",
	});
}

export async function getAuthParams(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function clearAuthParams() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAME);
}
