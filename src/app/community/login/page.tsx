"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import LoadingSpinner from "@/components/loading-spinner";

function CommunityLoginContent() {
	const searchParams = useSearchParams();

	useEffect(() => {
		// Get all current query parameters
		const queryString = searchParams.toString();

		if (queryString) {
			// Save query params to cookie for later use
			document.cookie = `community_auth_params=${encodeURIComponent(queryString)}; path=/; max-age=600; SameSite=Lax`;

			// Construct the /authorize URL with all the original parameters
			const authorizeUrl = `/authorize?${queryString}`;

			// Construct the final redirect URL
			const redirectUrl = `https://auth.aamirazad.com/login/alternative/email?redirect=${encodeURIComponent(authorizeUrl)}`;

			// Perform the redirect after 2 seconds
			setTimeout(() => {
				window.location.href = redirectUrl;
			}, 2000);
		}
	}, [searchParams]);

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="text-center max-w-md">
				<LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
				<p className="text-slate-600 dark:text-slate-400 mb-6">
					Redirecting...
				</p>
				<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
					<p className="text-yellow-800 dark:text-yellow-200 font-semibold text-sm">
						If the next screen says something about "Account Details" please
						click the reload button on your browser to complete the sign in
						process, sorry for the inconvenience.
					</p>
				</div>
			</div>
		</div>
	);
}

export default function CommunityLogin() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					<LoadingSpinner className="w-8 h-8" />
				</div>
			}
		>
			<CommunityLoginContent />
		</Suspense>
	);
}
