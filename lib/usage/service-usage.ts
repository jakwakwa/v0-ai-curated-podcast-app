type PaidService = "listen-notes" | "revai"

type Counters = Record<PaidService, number>

interface UsageBucket {
	monthKey: string
	counters: Counters
}

declare global {
	// eslint-disable-next-line no-var
	var __paidServiceUsage: UsageBucket | undefined
}

function getMonthKey(now: Date = new Date()): string {
	return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`
}

function ensureBucket(): UsageBucket {
	const monthKey = getMonthKey()
	if (!global.__paidServiceUsage || global.__paidServiceUsage.monthKey !== monthKey) {
		global.__paidServiceUsage = { monthKey, counters: { "listen-notes": 0, revai: 0 } }
	}
	return global.__paidServiceUsage
}

export function incrementPaidServiceUsage(service: PaidService): void {
	const bucket = ensureBucket()
	bucket.counters[service] += 1
}

export function getPaidServiceUsageSnapshot(): UsageBucket {
	return ensureBucket()
}