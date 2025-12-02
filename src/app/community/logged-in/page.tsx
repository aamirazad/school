import { redirect } from "next/navigation";
import { clearAuthParams, getAuthParams } from "../actions";

export default async function CommunityLoggedIn() {
	const queryString = await getAuthParams();

	if (!queryString) {
		redirect("https://community.aamirazad.com/login");
	}

	await clearAuthParams();
	redirect(`https://auth.aamirazad.com/authorize?${queryString}`);
}
