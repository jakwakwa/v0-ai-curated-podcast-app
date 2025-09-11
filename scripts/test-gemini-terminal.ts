#!/usr/bin/env ts-node
// Test Gemini transcription provider in terminal
// Usage: pnpm tsx scripts/test-gemini-terminal.ts [youtube-url]

import { GeminiVideoProvider } from "../lib/transcripts/providers/gemini";

async function testGeminiTerminal() {
	const argv = process.argv.slice(2);

	if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
		console.log("🧪 Gemini Video Transcription Terminal Test");
		console.log("Usage: pnpm tsx scripts/test-gemini-terminal.ts <youtube-url> [--save]");
		console.log("\nExample:");
		console.log("  pnpm tsx scripts/test-gemini-terminal.ts https://www.youtube.com/watch?v=dQw4w9WgXcQ");
		console.log("  pnpm tsx scripts/test-gemini-terminal.ts https://www.youtube.com/watch?v=dQw4w9WgXcQ --save");
		console.log("\nEnvironment Requirements:");
		console.log("  - GOOGLE_GENERATIVE_AI_API_KEY must be set");
		console.log("\nOptions:");
		console.log("  --save    Save the full transcript to a file");
		process.exit(0);
	}

	const url = argv[0];

	// Check environment
	if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
		console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set");
		console.log("Please set your GOOGLE_GENERATIVE_AI_API_KEY environment variable:");
		console.log("  export GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here");
		process.exit(1);
	}

	console.log("🧪 Testing Gemini Video Transcription");
	console.log("=".repeat(50));
	console.log(`🔗 URL: ${url}`);
	console.log(`🔑 API Key: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY.substring(0, 10)}...`);

	const request = { url, kind: "youtube" as const };

	try {
		console.log("\n📋 Checking if Gemini can handle this URL...");
		const canHandle = await GeminiVideoProvider.canHandle(request);
		console.log(`✅ Can handle: ${canHandle}`);

		if (!canHandle) {
			console.log("❌ Gemini cannot handle this URL type");
			process.exit(1);
		}

		console.log("\n🎯 Starting transcription...");
		const startTime = Date.now();

		const result = await GeminiVideoProvider.getTranscript(request);

		const endTime = Date.now();
		const duration = (endTime - startTime) / 1000;

		console.log(`⏱️  Duration: ${duration.toFixed(2)}s`);

		if (result.success) {
			console.log("✅ Transcription successful!");
			console.log(`📊 Transcript length: ${result.transcript?.length} characters`);
			console.log(`📄 Provider: ${result.provider}`);
			console.log("\n📝 Transcript preview (first 500 characters):");
			console.log("-".repeat(50));
			console.log(result.transcript?.substring(0, 500) + (result.transcript && result.transcript.length > 500 ? "..." : ""));
			console.log("-".repeat(50));

			// Optionally save full transcript
			if (argv.includes("--save")) {
				// biome-ignore lint/style/useNodejsImportProtocol: <ignire>
				const fs = await import("fs/promises");
				const filename = `gemini-transcript-${Date.now()}.txt`;
				await fs.writeFile(filename, result.transcript || "");
				console.log(`💾 Full transcript saved to: ${filename}`);
			}
		} else {
			console.log("❌ Transcription failed!");
			console.log(`💥 Error: ${result.error}`);
		}

		console.log("\n🏁 Test completed");
	} catch (error) {
		console.error("💥 Unexpected error during test:");
		console.error("Error type:", error?.constructor?.name);
		console.error("Error message:", error instanceof Error ? error.message : String(error));
		console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
		process.exit(1);
	}
}

testGeminiTerminal();
