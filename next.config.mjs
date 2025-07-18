// @ts-nocheck

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		webpackBuildWorker: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
	// Handle Clerk environment variables during build
	env: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
	// Disable static generation for pages that require authentication
	async generateStaticParams() {
		return []
	},
}

export default nextConfig
