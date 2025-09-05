import { PrismaClient } from "@prisma/client"

import { withAccelerate } from "@prisma/extension-accelerate"

const shouldUseAccelerate = (() => {
	const url = process.env.DATABASE_URL || ""
	return url.startsWith("prisma://") || url.startsWith("prisma+postgres://")
})()

const prismaClientSingleton = () => {
	const client = new PrismaClient()
	return shouldUseAccelerate ? client.$extends(withAccelerate()) : client
}

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
