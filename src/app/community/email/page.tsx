import { redirect } from "next/navigation";
import { getAuthParams } from "../actions";

export default async function CommunityEmail() {
	const queryString = await getAuthParams();

	if (!queryString) {
		redirect("https://community.aamirazad.com/login");
	}

	const authorizeUrl = `/authorize?${queryString}`;
	const redirectUrl = `https://auth.aamirazad.com/login/alternative/email?redirect=${encodeURIComponent(authorizeUrl)}`;

	redirect(redirectUrl);
}
