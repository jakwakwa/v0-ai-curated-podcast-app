// @ts-nocheck

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
    // Add these for faster builds
    optimizePackageImports: ['lucide-react', '@tabler/icons-react'],
  },
  // Skip static generation for faster builds during development
  ...(process.env.SKIP_BUILD_STATIC_GENERATION && {
    trailingSlash: true,
    output: 'export',
  }),
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
