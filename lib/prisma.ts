import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>

function createPrismaClient() {
	const client = new PrismaClient({
		// Serverless-specific optimizations for Vercel
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	})

	// Only add Accelerate extension during runtime, not during build
	// Disable during build to prevent connection attempts
	const isBuildProcess = process.env.NODE_ENV === "production" &&
		(process.env.VERCEL_BUILD || process.env.NEXT_PHASE === "phase-production-build")

	if (!isBuildProcess) {
		return client.$extends(withAccelerate())
	}

	return client
}

const globalForPrisma = global as unknown as {
	prisma: ExtendedPrismaClient
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma


