"use client";

import { LockIcon } from "lucide-react";
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

	const handleLogin = () => {
		const queryString = searchParams.toString();

		if (queryString) {
			// Construct the /authorize URL with all the original parameters
			const authorizeUrl = `/authorize?${queryString}`;

			// Construct the final redirect URL
			const redirectUrl = `https://auth.aamirazad.com/login/alternative/email?redirect=${encodeURIComponent(authorizeUrl)}`;

			// Perform the redirect immediately
			window.location.href = redirectUrl;
		}
	};

	const handleSignup = () => {
		const signupUrl = `https://auth.aamirazad.com/signup?redirect=/community-sign-up-confirmed`;

		window.location.href = signupUrl;
	};

	return (
		<div className="min-h-screen bg-[#02030a] flex items-center justify-center px-4">
			<div className="w-full max-w-sm rounded-2xl bg-[#111111] px-6 py-8 shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
				<div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#222222]">
					<span className="text-xl font-semibold text-white">
						<LockIcon />
					</span>
				</div>

				<div className="text-center mb-8">
					<h1 className="text-2xl font-semibold text-white mb-2">
						Welcome to Aamir&apos;s Auth
					</h1>
					<p className="text-sm leading-snug text-slate-300">
						Choose an option below to continue.
					</p>
				</div>

				<div className="flex gap-3">
					<button
						type="button"
						onClick={handleSignup}
						className="flex-1 rounded-lg bg-[#2a2a2a] py-2.5 text-sm font-medium text-slate-100 transition hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-[#02030a]"
					>
						Sign up
					</button>

					<button
						type="button"
						onClick={handleLogin}
						className="flex-1 rounded-lg bg-slate-100 py-2.5 text-sm font-medium text-[#111111] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-[#02030a]"
					>
						Log in
					</button>
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
