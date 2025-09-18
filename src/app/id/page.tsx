"use client";

import { useState } from "react";

export default function IdPage() {
	const [loginId, setLoginId] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		await fetch("https://hasd.aamira.me/api/v4/users/login", {
			body: JSON.stringify({
				login_id: loginId,
				password: password,
				token: "",
				deviceId: "",
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
			<form
				onSubmit={handleSubmit}
				className="bg-white dark:bg-slate-800 p-6 rounded shadow w-full max-w-sm"
			>
				<div className="mb-4">
					<label className="block mb-2 text-sm font-medium" htmlFor="loginId">
						Login ID
					</label>
					<input
						id="loginId"
						type="text"
						value={loginId}
						onChange={(e) => setLoginId(e.target.value)}
						className="w-full p-2 border rounded"
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block mb-2 text-sm font-medium" htmlFor="password">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full p-2 border rounded"
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-indigo-600 text-white py-2 rounded"
					disabled={loading}
				>
					{loading ? "Loading..." : "Login"}
				</button>
			</form>
		</div>
	);
}
