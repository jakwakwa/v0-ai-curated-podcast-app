#!/usr/bin/env ts-node
// NOTE: Do NOT auto-load .env in this script. Provide environment variables via Warp workflows
// or by exporting them in your shell before running the script.

type TranscriptRequest = { url: string; kind?: string; lang?: string; allowPaid?: boolean };

async function run() {
	const argv = process.argv.slice(2);
	if (argv.length === 0) {
		console.log("Usage: pnpm -s tsx scripts/test-providers.ts <url>");
		console.log("Supply env via Warp or via 'export OPENAI_API_KEY=...'");
		process.exit(1);
	}

	const url = argv[0];
	const req: TranscriptRequest = { url, kind: "youtube" };

	// Load providers explicitly so we can test them one-by-one
	// Keep order matching orchestrator: gemini, client, captions, resolver, grok (opt), openai, podcast/listennotes
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const clients: Array<unknown> = [];
	try {
		clients.push(require("../lib/transcripts/providers/gemini").GeminiVideoProvider);
	} catch {}
	try {
		clients.push(require("../lib/transcripts/providers/youtube-client").YouTubeClientProvider);
	} catch {}
	try {
		clients.push(require("../lib/transcripts/providers/youtube").YouTubeCaptionsProvider);
	} catch {}
	try {
		clients.push(require("../lib/transcripts/providers/youtube-audio-extractor").YouTubeStreamResolverProvider);
	} catch {}
	try {
		if (process.env.ENABLE_GROK === "true") clients.push(require("../lib/transcripts/providers/grok-search").GrokSearchProvider);
	} catch {}
	try {
		clients.push(require("../lib/transcripts/providers/openai").OpenAITextFallbackProvider);
	} catch {}
	try {
		// removed podcast provider
	} catch {}
	try {
		clients.push(require("../lib/transcripts/providers/listen-notes").ListenNotesProvider);
	} catch {}

	console.log(`Testing providers for: ${url}\n`);

	const results: any[] = [];
	for (const pUnknown of clients) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const p: any = pUnknown;
		const name = p?.name || String(p);
		console.log(`--- Provider: ${name}`);
		let applicable = false;
		try {
			applicable = await (p.canHandle ? p.canHandle(req) : true);
			console.log(`canHandle: ${applicable}`);
		} catch (e) {
			console.error(`canHandle error: ${String(e)}`);
		}
		if (!applicable) {
			results.push({ provider: name, applicable: false });
			continue;
		}

		try {
			const res = await p.getTranscript(req);
			console.log(`result: success=${res?.success} provider=${res?.provider} error=${res?.error ?? ""}`);
			if (res?.success) {
				console.log(`transcript (preview):\n${String(res.transcript).substring(0, 1000)}\n`);
			} else {
				console.log(`meta: ${JSON.stringify(res?.meta ?? {})}`);
			}
			results.push({ provider: name, result: res });
		} catch (err) {
			console.error(`getTranscript error: ${String(err)}`);
			results.push({ provider: name, error: String(err) });
		}
	}

	console.log("\nSummary:");
	for (const r of results) console.log(JSON.stringify(r, null, 2));
}

run().catch(e => {
	console.error(e);
	process.exit(1);
});
