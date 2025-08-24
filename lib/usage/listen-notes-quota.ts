const DEFAULT_MONTHLY_QUOTA = Number(process.env.LISTEN_NOTES_MONTHLY_QUOTA ?? 300)

interface UsageState {
	monthKey: string
	count: number
	limit: number
}

declare global {
	// eslint-disable-next-line no-var
	var __listenNotesUsage: UsageState | undefined
}

function getMonthKey(now: Date = new Date()): string {
	return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`
}

function getState(): UsageState {
	const monthKey = getMonthKey()
	const limit = DEFAULT_MONTHLY_QUOTA
	if (!global.__listenNotesUsage) {
		global.__listenNotesUsage = { monthKey, count: 0, limit }
		return global.__listenNotesUsage
	}
	// Reset counter on month change
	if (global.__listenNotesUsage.monthKey !== monthKey) {
		global.__listenNotesUsage = { monthKey, count: 0, limit }
	}
	// Keep limit in sync with env
	global.__listenNotesUsage.limit = limit
	return global.__listenNotesUsage
}

export function isListenNotesAllowed(): boolean {
	const state = getState()
	return state.count < state.limit
}

export function recordListenNotesCall(): { remaining: number; limit: number } {
	const state = getState()
	state.count += 1
	return { remaining: Math.max(0, state.limit - state.count), limit: state.limit }
}

export function getListenNotesUsage(): { monthKey: string; count: number; limit: number } {
	const state = getState()
	return { monthKey: state.monthKey, count: state.count, limit: state.limit }
}