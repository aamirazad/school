"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import LoadingSpinner from "@/components/loading-spinner";

function CommunityLoginContent() {
	const searchParams = useSearchParams();

	// Save query params to cookie immediately on mount
	useEffect(() => {
		const queryString = searchParams.toString();
		if (queryString) {
			document.cookie = `community_auth_params=${encodeURIComponent(queryString)}; path=/; max-age=600; SameSite=Lax`;
		}
	}, [searchParams]);

	const queryString = searchParams.toString();

	if (queryString) {
		// Construct the /authorize URL with all the original parameters
		const authorizeUrl = `/authorize?${queryString}`;

		// Construct the final redirect URL
		const redirectUrl = `https://auth.aamirazad.com/login/alternative/email?redirect=${encodeURIComponent(authorizeUrl)}`;

		// Perform the redirect immediately
		window.location.href = redirectUrl;
	}

	return (
		<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4"></div>
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
