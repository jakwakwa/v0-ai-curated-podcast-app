import prisma from "./prisma" // Node.js runtime
import { prismaEdge } from "./prisma-edge" // Edge runtime

/**
 * Get the appropriate Prisma client based on the runtime environment
 * Use this in API routes that don't explicitly set runtime
 */
export function getPrismaClient() {
	// Check if we're in an edge runtime environment
	// @ts-ignore - EdgeRuntime is a global in edge runtime
	if (typeof globalThis.EdgeRuntime !== "undefined") {
		return prismaEdge
	}

	// Default to Node.js runtime client
	return prisma
}

// Re-export both clients for explicit usage
export { prisma as prismaNode, prismaEdge }
