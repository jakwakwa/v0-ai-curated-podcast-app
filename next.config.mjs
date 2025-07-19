// @ts-nocheck

/** @type {import('next').NextConfig} */
const baseExperimental = {
	webpackBuildWorker: true,
	optimizePackageImports: ["lucide-react", "@tabler/icons-react", "@clerk/nextjs"],
	// Development-specific experimental features
	...(process.env.NODE_ENV === "development" && {
		largePageDataBytes: 128 * 1000, // 128KB
	}),
}

const nextConfig = {
	// Move these to top level (no longer experimental)
	skipMiddlewareUrlNormalize: true,
	skipTrailingSlashRedirect: true,

	experimental: {
		...baseExperimental,
	},

	// Webpack optimizations
	webpack: (config, { dev, isServer }) => {
		// Skip expensive operations in development
		if (dev) {
			config.devtool = false
			config.optimization = {
				...config.optimization,
				removeAvailableModules: false,
				removeEmptyChunks: false,
				splitChunks: false,
			}
		}

		// Resolve symlink issues with pnpm
		config.resolve.symlinks = false

		return config
	},

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},

	env: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
}

export default nextConfig
