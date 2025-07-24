import { PrismaClient } from "@prisma/client/edge"

const globalForPrisma = globalThis as unknown as {
	prismaEdge: PrismaClient | undefined
}

// Edge runtime Prisma client
export const prismaEdge =
	globalForPrisma.prismaEdge ??
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
	})

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaEdge = prismaEdge

export default prismaEdge
