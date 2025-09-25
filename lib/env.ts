// Centralized environment helpers for URLs used across server and client

type RuntimeEnv = "production" | "preview" | "development";

function getRuntimeEnv(): RuntimeEnv {
	const vercelEnv = process.env.VERCEL_ENV as RuntimeEnv | undefined;
	if (vercelEnv === "production" || vercelEnv === "preview" || vercelEnv === "development") {
		return vercelEnv;
	}
	return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function isProduction(): boolean {
	return getRuntimeEnv() === "production";
}

export function getAppUrl(): string {
	// Prod can optionally use a different public base URL to avoid breaking local/preview
	if (isProduction()) {
		return process.env.NEXT_PUBLIC_PRODAPP_URL || process.env.NEXT_PUBLIC_APP_URL || "";
	}
	return process.env.NEXT_PUBLIC_APP_URL || "";
}

export function getClerkSignInUrl(): string {
	if (isProduction()) {
		return process.env.NEXT_PUBLIC_CLERK_PROD_SIGN_UP_URL || process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up";
	}
	return process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-up";
}

export function getClerkSignUpUrl(): string {
	if (isProduction()) {
		return process.env.NEXT_PUBLIC_CLERK_PROD_SIGN_UP_URL || process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up";
	}
	return process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up";
}

export function getAccountPortalUrlWithRedirect(): string | null {
	const portalBase = process.env.NEXT_PUBLIC_CLERK_ACCOUNT_PORTAL_URL || null;
	const redirectOverride = process.env.NEXT_PUBLIC_CLERK_ACCOUNT_REDIRECT_URL || null;
	const appUrl = getAppUrl();
	try {
		const redirectTarget = redirectOverride || (appUrl ? new URL(appUrl).origin : "");
		if (!redirectTarget) return null;
		if (portalBase) {
			const base = portalBase.replace(/\/$/, "");
			return `${base}?redirect_url=${encodeURIComponent(redirectTarget)}`;
		}
		if (appUrl) {
			const parsed = new URL(appUrl);
			return `https://accounts.${parsed.hostname}/account?redirect_url=${encodeURIComponent(parsed.origin)}`;
		}
		return null;
	} catch {
		return null;
	}
}

/**
 * Returns the maximum allowed duration for user-supplied YouTube videos in seconds.
 * Reads from the `MAX_DURATION_SECONDS` environment variable (number of seconds).
 * Falls back to 90 minutes (5400 seconds) when not set or invalid.
 */
export function getMaxDurationSeconds(): number {
	const raw = process.env.MAX_DURATION_SECONDS;
	if (!raw) return 120 * 60;
	const parsed = Number(raw);
	if (Number.isFinite(parsed) && parsed > 0) return Math.floor(parsed);
	return 120 * 60;
}
