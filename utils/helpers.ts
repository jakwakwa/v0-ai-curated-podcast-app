import * as dotenvx from "@dotenvx/dotenvx"

function getEnv(key: string): string | undefined {
	try {
		const value = dotenvx.get(key) as string | undefined
		if (typeof value === "string" && value.length > 0) return value
	} catch {}
	return process.env[key]
}

export { getEnv }
