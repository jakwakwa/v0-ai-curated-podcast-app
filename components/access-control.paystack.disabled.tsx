"use client"

export type Feature = "custom_curation_profiles" | "weekly_combo" | "free_bundle"

export const useAccessControl = () => {
	const checkAccess = (_feature: Feature): boolean => {
		// Disabled: assume free-only access
		return _feature === "free_bundle"
	}
	return { hasAccess: checkAccess }
}
