"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("https://auth.aamirazad.com/api/users/me", {
			method: "GET",
			credentials: "include", // send cookies
			mode: "cors",
		})
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h1>API Response:</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
