#!/usr/bin/env node

/**
 * Test script for Vercel environment detection
 * Run with: node scripts/test-vercel-detection.mjs
 */

// Simulate different environments
const testEnvironments = [
	{ name: "Local Development", env: {} },
	{ name: "Vercel Preview", env: { VERCEL: "1", VERCEL_ENV: "preview" } },
	{ name: "Vercel Production", env: { VERCEL: "1", VERCEL_ENV: "production" } },
	{ name: "Custom Vercel", env: { NEXT_PUBLIC_VERCEL_ENV: "production" } },
]

// Simple environment detection (simplified version of the utility)
function isVercel(env) {
	return (
		env.VERCEL === "1" ||
		env.VERCEL_ENV === "production" ||
		env.VERCEL_ENV === "preview" ||
		env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
		env.NEXT_PUBLIC_VERCEL_ENV === "preview"
	)
}

function shouldAvoidServerSideYouTube(env) {
	return isVercel(env)
}

console.log("🧪 Testing Vercel Environment Detection\n")

testEnvironments.forEach(({ name, env }) => {
	// Set environment variables
	Object.entries(env).forEach(([key, value]) => {
		process.env[key] = value
	})

	// Test detection
	const isVercelEnv = isVercel(process.env)
	const shouldAvoid = shouldAvoidServerSideYouTube(process.env)

	console.log(`📋 ${name}:`)
	console.log(`   Environment Variables:`, env)
	console.log(`   Is Vercel: ${isVercelEnv ? "✅ Yes" : "❌ No"}`)
	console.log(`   Should Avoid Server-Side YouTube: ${shouldAvoid ? "✅ Yes" : "❌ No"}`)
	console.log(`   Recommendation: ${shouldAvoid ? "Use client-side extraction" : "Server-side may work"}`)
	console.log("")

	// Clean up
	Object.keys(env).forEach(key => {
		delete process.env[key]
	})
})

console.log("🎯 Summary:")
console.log("- Local development: Server-side YouTube operations may work")
console.log("- Vercel environments: Always use client-side extraction")
console.log("- This ensures reliable operation in production while maintaining development flexibility")