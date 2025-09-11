/**
 * Minimal paid-service usage tracker (in-memory, per instance).
 * Safe to no-op in serverless; used for observability only.
 */

const counters: Record<string, number> = Object.create(null);

export function incrementPaidServiceUsage(service: string): void {
	counters[service] = (counters[service] ?? 0) + 1;
	// Avoid logging secrets or excessive noise in production
}

export function getPaidServiceUsageSnapshot(): Record<string, number> {
	return { ...counters };
}

type PaidService = "listen-notes";

type Counters = Record<PaidService, number>;

interface UsageBucket {
	monthKey: string;
	counters: Counters;
}

declare global {
	// eslint-disable-next-line no-var
	var __paidServiceUsage: UsageBucket | undefined;
}

function getMonthKey(now: Date = new Date()): string {
	return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function _ensureBucket(): UsageBucket {
	const monthKey = getMonthKey();
	if (!global.__paidServiceUsage || global.__paidServiceUsage.monthKey !== monthKey) {
		global.__paidServiceUsage = { monthKey, counters: { "listen-notes": 0 } };
	}
	return global.__paidServiceUsage;
}
