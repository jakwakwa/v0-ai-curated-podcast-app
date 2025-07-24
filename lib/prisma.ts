import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>

function createPrismaClient() {
	const client = new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	})

	if (process.env.NODE_ENV !== "production") {
		return client
	} else {
		return client.$extends(withAccelerate())
	}
}

const globalForPrisma = global as unknown as {
	prisma: ExtendedPrismaClient
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma


