/**
 * Minimal paid-service usage tracker (in-memory, per instance).
 * Safe to no-op in serverless; used for observability only.
 */

const counters: Record<string, number> = Object.create(null)

export function incrementPaidServiceUsage(service: string): void {
	counters[service] = (counters[service] ?? 0) + 1
	// Avoid logging secrets or excessive noise in production
}

export function getPaidServiceUsageSnapshot(): Record<string, number> {
	return { ...counters }
}

