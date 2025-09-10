/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
			remotePatterns: [
					{ protocol: 'https', hostname: 'images.unsplash.com' },
					{ protocol: 'https', hostname: 'youtu.be' },
					{ protocol: 'https', hostname: 'storage.cloud.google.com' },
					{ protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
					{ protocol: 'https', hostname: 'lh3.googleusercontent.com' },
					{ protocol: 'https', hostname: 'graph.facebook.com' },
					{ protocol: 'https', hostname: 'platform-lookaside.fbsbx.com' },
					{ protocol: 'https', hostname: 'pbs.twimg.com' },
					{ protocol: 'https', hostname: 'abs.twimg.com' },
					{ protocol: 'https', hostname: 'images.ctfassets.net' },
					{ protocol: 'https', hostname: '*.cloudinary.com' },
					{ protocol: 'https', hostname: 'res.cloudinary.com' },
					{ protocol: 'https', hostname: 'img.clerk.com' },
			],
	},
	webpack: (config) => {
			config.resolve.alias = {
					...config.resolve.alias,
			};
			return config;
	},
	async headers() {
			const clerkHostname = 'joint-weevil-31.clerk.accounts.dev';

			// Base CSP directives
			const csp = {
					'default-src': ["'self'"],
					'script-src': [
							"'self'",
							"'unsafe-eval'",      // Required for Next.js in development
							"'unsafe-inline'",    // Required for Clerk and other libraries
							`https://${clerkHostname}`,
							'https://challenges.cloudflare.com', // Clerk bot protection
							'https://vendors.paddle.com',       // Paddle scripts
							'https://checkout.paddle.com',      // Paddle checkout
							'https://va.vercel-scripts.com',    // Vercel Analytics
					],
					'style-src': [
							"'self'",
							"'unsafe-inline'", // Required for many UI libraries
							'https://fonts.googleapis.com',
					],
					'img-src': [
							"'self'",
							'data:',
							'images.unsplash.com',
							'youtu.be',
							'storage.cloud.google.com',
							'firebasestorage.googleapis.com',
							'lh3.googleusercontent.com',
							'graph.facebook.com',
							'platform-lookaside.fbsbx.com',
							'pbs.twimg.com',
							'abs.twimg.com',
							'images.ctfassets.net',
							'*.cloudinary.com',
							'res.cloudinary.com',
							'img.clerk.com',
					],
					'font-src': ["'self'", 'https://fonts.gstatic.com'],
					'media-src': [
							"'self'",
							'https://storage.googleapis.com',
							'https://storage.cloud.google.com',
					],
					'connect-src': [
							"'self'",
							`https://${clerkHostname}`,
							'https://api.paddle.com',
							'https://vitals.vercel-insights.com', // Vercel Analytics
							'https://storage.googleapis.com', // Google Cloud Storage
							'https://storage.cloud.google.com', // Google Cloud Storage
					],
					'worker-src': ["'self'", 'blob:'],
					'frame-src': [
							'https://challenges.cloudflare.com', // Clerk bot protection
							'https://sandbox-buy.paddle.com',    // Paddle checkout
					],
					'object-src': ["'none'"],
					'base-uri': ["'self'"],
					'form-action': ["'self'"],
					'frame-ancestors': ["'none'"],
					'upgrade-insecure-requests': [],
			};

			// Convert the CSP object to a string
			const cspHeader = Object.entries(csp)
					.map(([key, value]) => {
							if (value.length === 0) {
									return key;
							}
							return `${key} ${value.join(' ')}`;
					})
					.join('; ');

			return [
					{
							source: '/(.*)',
							headers: [
									{
											key: 'Content-Security-Policy',
											value: cspHeader,
									},
							],
					},
			];
	},
};

export default nextConfig;
