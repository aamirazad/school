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
			// Construct the /authorize URL with all the original parameters
			const authorizeUrl = `/authorize?${queryString}`;

			// Construct the final redirect URL
			const redirectUrl = `https://auth.aamirazad.com/login/alternative/email?redirect=${encodeURIComponent(authorizeUrl)}`;

			// Perform the redirect
			window.location.href = redirectUrl;
		}
	}, [searchParams]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
				<p className="text-slate-600 dark:text-slate-400">Redirecting...</p>
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
