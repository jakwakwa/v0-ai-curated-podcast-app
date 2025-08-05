import { PrismaClient } from "@prisma/client"

import { withAccelerate } from "@prisma/extension-accelerate"

const prismaClientSingleton = () => {
	const client = new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
	})
	
	return client.$extends(withAccelerate())
}

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
