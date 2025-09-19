// Centralized environment helpers for URLs used across server and client

type RuntimeEnv = "production" | "preview" | "development";

// YouTube Data API v3 key
export function getYouTubeAPIKey(): string | undefined {
	return process.env.YOUTUBE_API_KEY;
}

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
		return process.env.NEXT_PUBLIC_CLERK_PROD_SIGN_IN_URL || process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";
	}
	return process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";
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
