"use client";

import { useEffect } from "react";
import LoadingSpinner from "@/components/loading-spinner";

export default function CommunityLoggedIn() {
	useEffect(() => {
		// Read the cookie
		const cookies = document.cookie.split("; ");
		const authParamsCookie = cookies.find((row) =>
			row.startsWith("community_auth_params="),
		);

		if (!authParamsCookie) {
			// No cookie found, redirect to login
			window.location.href = "/community/login";
			return;
		}

		// Extract and decode the query params
		const queryString = decodeURIComponent(authParamsCookie.split("=")[1]);

		// Clear the cookie
		document.cookie = "community_auth_params=; path=/; max-age=0; SameSite=Lax";

		// Redirect to authorize with the saved params
		window.location.href = `https://auth.aamirazad.com/authorize?${queryString}`;
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
				<p className="text-slate-600 dark:text-slate-400">Redirecting...</p>
			</div>
		</div>
	);
}
