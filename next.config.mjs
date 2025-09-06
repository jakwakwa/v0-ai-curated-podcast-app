/** @type {import('next').NextConfig} */
const nextConfig = {
    // Suppress hydration warnings from browser extensions like Dark Reader
    reactStrictMode: true,
    images: {
        remotePatterns: [{
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
						{
							protocol: 'https',
							hostname: 'youtu.be',
							port: '',
							pathname: '/**',
						},
            {
                protocol: 'https',
                hostname: 'storage.cloud.google.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'graph.facebook.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'platform-lookaside.fbsbx.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pbs.twimg.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'abs.twimg.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.ctfassets.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    // Webpack configuration (for standard build mode)
    webpack: (config, {
        buildId,
        dev,
        isServer,
        defaultLoaders,
        webpack
    }) => {
        // Only run in webpack mode (not turbopack)
        // Preserve Next.js aliases while allowing custom ones
        config.resolve.alias = {
            ...config.resolve.alias,
            // Add any custom aliases here if needed
        };

        // Important: return the modified config
        return config;
    },
};

export default nextConfig;
