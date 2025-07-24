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
	}).$extends(withAccelerate())

	// Handle connection cleanup for serverless environments
	if (process.env.NODE_ENV === "production") {
		// Graceful shutdown for serverless
		process.on("beforeExit", async () => {
			await client.$disconnect()
		})
	}

	return client
}

const globalForPrisma = global as unknown as {
	prisma: ExtendedPrismaClient
}

// Add debugging for Prisma Client initialization
if (process.env.DEBUG?.includes("prisma")) {
	console.log("🔍 Prisma Client initialization started")
	console.log("🔍 Environment:", process.env.NODE_ENV)
	console.log("🔍 DATABASE_URL available:", !!process.env.DATABASE_URL)
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Add debugging for successful initialization
if (process.env.DEBUG?.includes("prisma")) {
	console.log("✅ Prisma Client initialized successfully")
}


