import { PrismaClient } from "@prisma/client"

import { withAccelerate } from "@prisma/extension-accelerate"

const prismaClientSingleton = () => {
	return new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	}).$extends(withAccelerate())
}

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Cache the client globally to prevent multiple instances in both dev and production
globalThis.prismaGlobal = prisma
