/**
 * Vercel environment detection and utilities
 */

/**
 * Check if the current environment is Vercel
 */
export function isVercel(): boolean {
	return (
		process.env.VERCEL === "1" ||
		process.env.VERCEL_ENV === "production" ||
		process.env.VERCEL_ENV === "preview" ||
		process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
		process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
	)
}

/**
 * Check if the current environment is Vercel production
 */
export function isVercelProduction(): boolean {
	return (
		process.env.VERCEL_ENV === "production" ||
		process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
	)
}

/**
 * Check if the current environment is Vercel preview
 */
export function isVercelPreview(): boolean {
	return (
		process.env.VERCEL_ENV === "preview" ||
		process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
	)
}

/**
 * Check if the current environment is Vercel (production or preview)
 */
export function isVercelEnvironment(): boolean {
	return isVercelProduction() || isVercelPreview()
}

/**
 * Get the current Vercel environment name
 */
export function getVercelEnvironment(): string | null {
	return process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV || null
}

/**
 * Check if we should avoid server-side YouTube operations
 * This is true on Vercel due to IP blocking
 */
export function shouldAvoidServerSideYouTube(): boolean {
	return isVercelEnvironment()
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
	return {
		isVercel: isVercel(),
		isVercelProduction: isVercelProduction(),
		isVercelPreview: isVercelPreview(),
		shouldAvoidServerSideYouTube: shouldAvoidServerSideYouTube(),
		environment: getVercelEnvironment(),
	}
}