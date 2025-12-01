/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "xrgkyc5aexvkc7oh.public.blob.vercel-storage.com",
				port: "",
			},
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
