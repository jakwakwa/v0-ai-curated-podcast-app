import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

function createPrismaClient() {
	const client = new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	})

	// Always return the plain client for this test, bypassing Accelerate.
	return client
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma


